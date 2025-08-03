const express = require('express');
const router = express.Router();
const { Part, Product } = require('../models');

// Create a new part linked to a product
router.post('/', async (req, res) => {
  try {
    const { productId, partName, partNumber, price, quantity } = req.body;

    // Validate product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create the part
    const newPart = await Part.create({ productId, partName, partNumber, price, quantity});

    res.status(201).json(newPart);
  } catch (error) {
    console.error('Error creating part:', error);
    res.status(500).json({ error: 'Failed to create part' });
  }
});

// Get all parts for a given product
router.get('/by-number/:partNumber', async (req, res) => {
  try {
    const { partNumber } = req.params;

    const part = await Part.findOne({ where: { partNumber } });

    if (!part) {
      return res.status(404).json({ error: 'Part not found' });
    }

    res.json(part);
  } catch (error) {
    console.error('Error fetching part by number:', error);
    res.status(500).json({ error: 'Failed to fetch part by number' });
  }
});

// Optional: Get all parts (for admin or debug)
router.get('/', async (req, res) => {
  try {
    const parts = await Part.findAll();
    res.json(parts);
  } catch (error) {
    console.error('Error fetching all parts:', error);
    res.status(500).json({ error: 'Failed to fetch parts' });
  }
});

// Optional: Delete a part by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const part = await Part.findByPk(id);
    if (!part) {
      return res.status(404).json({ error: 'Part not found' });
    }

    await part.destroy();
    res.json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Error deleting part:', error);
    res.status(500).json({ error: 'Failed to delete part' });
  }
});

module.exports = router;
