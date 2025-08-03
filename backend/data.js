const express = require('express');
const router = express.Router();
const db = require('../models'); // Import Sequelize models
const bcrypt = require('bcrypt');

// POST /api/data
router.post("/", async (req, res) => {
    try {
        const data = await db.Data.create(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/data
router.get("/", async (req, res) => {
    try {
        const dataList = await db.Data.findAll();
        res.json(dataList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user already exists
    const existing = await db.Account.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash and store password
    const hashed = await bcrypt.hash(password, 10);
    await db.Account.create({ email, password: hashed });

    res.json({ message: 'Account created successfully' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.Account.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    res.json({ message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('[BACKEND] Forgot password email received:', email);

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Simulate finding user
  const user = await db.Account.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: 'Email not found.' });
  }

  return res.status(200).json({ message: `Reset link sent to ${email}` });
});







module.exports = router;
