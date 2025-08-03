// routes/orders.js
const express = require('express');
const router = express.Router();
const { Order } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, contactNumber, email } = req.body;
    const newOrder = await Order.create({ firstName, lastName, contactNumber, email });
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['orderId', 'DESC']] });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
