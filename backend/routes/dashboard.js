const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

const db = require('../models');

// 🔹 Top Customers
router.get('/top-customers', async (req, res) => {
  try {
    const [rows] = await db.sequelize.query(`
      SELECT CONCAT(firstName, ' ', lastName) AS name, COUNT(*) AS totalOrders
      FROM Orders
      GROUP BY firstName, lastName
      ORDER BY totalOrders DESC
      LIMIT 5;
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Top Customers Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Top Bike Part Categories Enquired
router.get('/top-categories', async (req, res) => {
  try {
    const [rows] = await db.sequelize.query(`
      SELECT part_category AS category, COUNT(*) AS enquiries
      FROM enquiries
      WHERE part_category IS NOT NULL
      GROUP BY part_category
      ORDER BY enquiries DESC
      LIMIT 3;
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Top Categories Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Top Bike Models Enquired
router.get('/top-models', async (req, res) => {
  try {
    const [rows] = await db.sequelize.query(`
      SELECT bike_model AS model, COUNT(*) AS enquiries
      FROM enquiries
      WHERE bike_model IS NOT NULL
      GROUP BY bike_model
      ORDER BY enquiries DESC
      LIMIT 3;
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Top Models Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Top 10 Parts Required
router.get('/top-parts', async (req, res) => {
  try {
    const [rows] = await db.sequelize.query(`
      SELECT part_name, SUM(quantity) AS totalSold
      FROM order_items
      WHERE part_name IS NOT NULL
      GROUP BY part_name
      ORDER BY totalSold DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Top Parts Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🧠 AI Insights via Gemini (text-bison-001)
router.get('/insights/summary', async (req, res) => {
  try {
    // 1. Fetch Data from DB
    const [customers, categories, models, parts] = await Promise.all([
      db.sequelize.query(`
        SELECT CONCAT(firstName, ' ', lastName) AS name, COUNT(*) AS totalOrders
        FROM Orders
        GROUP BY firstName, lastName
        ORDER BY totalOrders DESC
        LIMIT 5;
      `).then(([rows]) => rows),

      db.sequelize.query(`
        SELECT part_category AS category, COUNT(*) AS enquiries
        FROM enquiries
        WHERE part_category IS NOT NULL
        GROUP BY part_category
        ORDER BY enquiries DESC
        LIMIT 3;
      `).then(([rows]) => rows),

      db.sequelize.query(`
        SELECT bike_model AS model, COUNT(*) AS enquiries
        FROM enquiries
        WHERE bike_model IS NOT NULL
        GROUP BY bike_model
        ORDER BY enquiries DESC
        LIMIT 3;
      `).then(([rows]) => rows),

      db.sequelize.query(`
        SELECT part_name, SUM(quantity) AS totalSold
        FROM order_items
        WHERE part_name IS NOT NULL
        GROUP BY part_name
        ORDER BY totalSold DESC
        LIMIT 10;
      `).then(([rows]) => rows)
    ]);

    // 2. Prepare Prompt
    const prompt = `
Generate short admin-friendly summaries for each section below.

Top Customers: ${JSON.stringify(customers, null, 2)}
Top Bike Part Categories Enquired: ${JSON.stringify(categories, null, 2)}
Top Bike Models Enquired: ${JSON.stringify(models, null, 2)}
Top 10 Parts Required: ${JSON.stringify(parts, null, 2)}

Return the result in this format:
{
  "customers": "...",
  "parts": "...",
  "models": "...",
  "required": "..."
}`.trim();

    // 3. Call Gemini API
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          maxOutputTokens: 512
        })
      }
    );

    const geminiData = await geminiRes.json();
    const rawOutput = geminiData?.candidates?.[0]?.output;

    if (!rawOutput) {
      return res.status(500).json({ error: '❌ No output returned from Gemini', raw: geminiData });
    }

    // 4. Attempt to parse JSON
    let parsed;
    try {
      parsed = JSON.parse(rawOutput);
    } catch (e) {
      return res.status(500).json({ error: '❌ Gemini response not JSON parseable', raw: rawOutput });
    }

    res.json(parsed);
  } catch (err) {
    console.error("❌ Gemini AI error:", err);
    res.status(500).json({ error: "Gemini AI failed", details: err.message });
  }
});

module.exports = router;
