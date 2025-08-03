const express = require('express');
const bcrypt = require('bcrypt');
const yup = require('yup');
const router = express.Router();
// Temporarily commenting out database imports
// const { Account } = require('../models');

// Mock data
const mockAccounts = [
  { id: 1, email: 'admin@ams.com', role: 'admin' },
  { id: 2, email: 'user@test.com', role: 'customer' }
];

// Validation schema
const accountSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  role: yup.string().oneOf(['admin', 'customer']).default('customer'),
});

// GET all accounts (optional ?role=admin)
router.get('/', (req, res) => {
  try {
    let accounts = mockAccounts;
    if (req.query.role) {
      accounts = mockAccounts.filter(acc => acc.role === req.query.role);
    }
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET one account by ID
router.get('/:id', async (req, res) => {
  const account = await Account.findByPk(req.params.id);
  if (!account) return res.status(404).json({ message: 'Not found' });
  res.json(account);
});

// CREATE new account
router.post('/', async (req, res) => {
  try {
    await accountSchema.validate(req.body);
    const existing = await Account.findOne({ where: { email: req.body.email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const account = await Account.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
});

// UPDATE account by ID
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const [updated] = await Account.update(updateData, {
      where: { id: req.params.id },
    });

    updated
      ? res.json({ message: 'Account updated' })
      : res.status(404).json({ message: 'Account not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE account
router.delete('/:id', async (req, res) => {
  const deleted = await Account.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: 'Account deleted' })
    : res.status(404).json({ message: 'Account not found' });
});

module.exports = router;
