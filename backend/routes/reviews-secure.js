const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  const Review = sequelize.models.Review;

  // POST /api/reviews - Create a new review
  router.post('/', async (req, res) => {
    console.log('Review POST body:', req.body); // Debug log
    try {
      const { rating, content, email } = req.body;
      if (!rating || !content || !email) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      const review = await Review.create({ rating, content, email });
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/reviews/:id - Only allow if email matches or admin
  router.delete('/:id', async (req, res) => {
    try {
      const { email, role } = req.body;
      const review = await Review.findByPk(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      if (role !== 'admin' && review.email !== email) return res.status(403).json({ error: 'Not authorized' });
      await review.destroy();
      res.json({ message: 'Review deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/reviews/:id - Only allow if email matches or admin
  router.put('/:id', async (req, res) => {
    try {
      const { rating, content, email, role } = req.body;
      const review = await Review.findByPk(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
      if (role !== 'admin' && review.email !== email) return res.status(403).json({ error: 'Not authorized' });
      review.rating = rating;
      review.content = content;
      await review.save();
      res.json({ message: 'Review updated', review });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // (Optional) GET /api/reviews - List all reviews
  router.get('/', async (req, res) => {
    try {
      const reviews = await Review.findAll();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
