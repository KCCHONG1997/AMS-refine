const express = require('express');
const router = express.Router();
const db = require('../models');

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  const { email, partId, quantity = 1 } = req.body;

  try {
    if (!email || !partId) {
      return res.status(400).json({ error: 'Missing required fields (email and partId)' });
    }

    // First verify the account exists
    const account = await db.Account.findOne({ where: { email } });
    if (!account) {
      return res.status(404).json({ error: 'Account not found. Please register first.' });
    }

    // Verify the part exists
    const part = await db.Part.findOne({ where: { id: partId } });
    if (!part) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already exists in cart
    const [cartItem, created] = await db.CartItem.findOrCreate({
      where: { email, partId },
      defaults: { quantity }
    });

    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    res.status(200).json({ success: true, cartItem });
  } catch (err) {
    console.error('Error adding to cart:', err);

    // More specific error handling
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: 'Invalid reference. Either account or product does not exist.'
      });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/cart/:email - Get cart items by email
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const items = await db.CartItem.findAll({
      where: { email },
      include: [{
        model: db.Part,
        as: 'part',  // This is required because the association uses an alias
        attributes: ['id', 'partName', 'partNumber', 'price']
      }]
    });

    res.json(items);
  } catch (err) {
    console.error('Error fetching cart:', err);
    console.error('Available models:', Object.keys(db));
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// ✅ DELETE with email and partId
router.delete('/:email/:partId', async (req, res) => {
  const { email, partId } = req.params;
  try {
    await db.CartItem.destroy({ where: { email, partId } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/cart/:email - Remove all cart items for a user
router.delete('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    await db.CartItem.destroy({ where: { email } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ PUT to update quantity
router.put('/:email/:partId', async (req, res) => {
  const { email, partId } = req.params;
  const { quantity, discount } = req.body;


  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  try {
    const item = await db.CartItem.findOne({ where: { email, partId } });
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    item.quantity = quantity;
    if (discount !== undefined) item.discount = discount;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;