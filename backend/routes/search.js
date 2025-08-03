// routes/search.js
const express = require('express');
const router = express.Router();
const { Product, Part } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;

// routes/search.js
router.get('/unified-search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // 1. First search for matching products with ALL their parts
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', `%${q.toLowerCase()}%`),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), 'LIKE', `%${q.toLowerCase()}%`)
        ]
      },
      include: [{
        model: Part,
        as: 'parts',
        required: false
      }],
    });

    // 2. Format product results
    const formattedProducts = products.map(product => {
      const plainProduct = product.get({ plain: true });
      return {
        type: 'product',
        id: plainProduct.id,
        title: plainProduct.title,
        description: plainProduct.description,
        price: plainProduct.price,
        parts: plainProduct.parts || []
      };
    });

    // 3. Search for standalone parts that match
    const parts = await Part.findAll({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('partName')), 'LIKE', `%${q.toLowerCase()}%`),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('partNumber')), 'LIKE', `%${q.toLowerCase()}%`)
        ],
        productId: { 
          [Op.notIn]: products.map(p => p.id)
        }
      },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    // 4. Format part results
    const formattedParts = parts.map(part => {
      const plainPart = part.get({ plain: true });
      return {
        type: 'part',
        ...plainPart,
        product: plainPart.product || null
      };
    });

    const response = {
      count: formattedProducts.length + formattedParts.length,
      results: [...formattedProducts, ...formattedParts]
    };

    res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      details: error.message 
    });
  }
});

module.exports = router;