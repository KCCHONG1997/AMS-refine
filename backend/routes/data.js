const express = require('express');
const router = express.Router();
const { Product, Account, Review } = require('../models');
const bcrypt = require('bcrypt');
const yup = require('yup');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Safe JSON parse helper
function safeJsonParse(str, fallback = []) {
  try {
    if (typeof str === 'string' && str.trim() !== '') {
      return JSON.parse(str);
    }
  } catch (e) {
    console.error('Failed to parse JSON:', str, e);
  }
  return fallback;
}

// Add a new product with image upload
router.post('/products', upload.single('image'), async (req, res) => {
  let { title, description, destination, hotspots, lines, textBoxes, price } = req.body;
  console.log('Received product POST:', { title, description, destination, hotspots, lines, textBoxes, price });

  if (price === '' || price === 'null' || price === null || typeof price === 'undefined') price = null;
  if (!title || title.trim() === '') {
    return res.status(400).json({ errors: 'Title is required.' });
  }
  if (price === null || price === '' || isNaN(Number(price))) {
    return res.status(400).json({ errors: 'Price is required and must be a valid number.' });
  }

  let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  console.log('About to parse hotspots:', hotspots);
  let hotspotsParsed = safeJsonParse(hotspots, []);
  console.log('Parsed hotspots:', hotspotsParsed);

  console.log('About to parse lines:', lines);
  let linesParsed = safeJsonParse(lines, []);
  console.log('Parsed lines:', linesParsed);

  console.log('About to parse textBoxes:', textBoxes);
  let textBoxesParsed = safeJsonParse(textBoxes, []);
  console.log('Parsed textBoxes:', textBoxesParsed);

  try {
    let result = await Product.create({
      title,
      description,
      destination,
      hotspots: hotspotsParsed,
      lines: linesParsed,
      textBoxes: textBoxesParsed,
      image: imagePath,
      price
    });
    res.json({ message: 'Product added', product: result });
  } catch (err) {
    console.error('Product creation error:', err);
    if (err.errors) {
      res.status(400).json({ errors: err.errors.map(e => e.message) });
    } else {
      res.status(500).json({ errors: err.message });
    }
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });
    const existing = await Account.findOne({ where: { email } });
    if (existing)
      return res.status(409).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    let role = email.endsWith('@ams.com') ? 'admin' : 'customer';
    await Account.create({ email, password: hashed, role });
    res.json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Incorrect password' });
    res.json({ message: 'Login successful', role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Forgot password with email sending
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const user = await Account.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Email not found.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = new Date(expiry);
    await user.save();

    const resetLink = `http://localhost:3000/account/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `AMS Support <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset Your Password - AMS',
      html: `
        <p>Hi ${user.email},</p>
        <p>You requested to reset your password. Click the link below to do so:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link is valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>– AMS Support Team</p>
      `
    });

    res.status(200).json({ message: `Reset link sent to ${email}` });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required.' });
    }

    const account = await Account.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!account) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    account.password = hashedPassword;
    account.resetToken = null;
    account.resetTokenExpiry = null;
    await account.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
