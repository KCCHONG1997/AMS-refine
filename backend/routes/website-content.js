// backend/routes/websiteContent.js
const express = require('express');
const router = express.Router();
const { WebsiteContent } = require('../models');

// GET endpoint
router.get('/', async (req, res) => {
  try {
    const content = await WebsiteContent.findByPk(1); // Will always exist due to initializeDefaultContent()
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT endpoint
router.put('/', async (req, res) => {
  try {
    const [updated] = await WebsiteContent.update(req.body, { where: { id: 1 } });
    res.json({ success: updated > 0 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/website-content
router.post('/', async (req, res) => {
  try {
    const { page, title, subtitle, description, featuredText, aboutText } = req.body;

    const existing = await WebsiteContent.findOne({ where: { page } });
    if (existing) {
      return res.status(400).json({ error: 'Content for this page already exists.' });
    }

    const newContent = await WebsiteContent.create({ page, title, subtitle, description, featuredText, aboutText });
    res.status(201).json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

module.exports = router;