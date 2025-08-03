const express = require('express');
const router = express.Router();

// Mock data for now - you can connect to your database later
const mockReviews = [
  { id: 1, rating: 5, content: 'Great product!' },
  { id: 2, rating: 4, content: 'Good quality, fast delivery' },
  { id: 3, rating: 3, content: 'Average product, could be better' }
];

// GET all reviews
router.get('/', (req, res) => {
  res.json(mockReviews);
});

// Updated GET /api/reviews/summary endpoint
router.get('/summary', async (req, res) => {
  try {
    const reviews = await Review.findAll();
    const reviewTexts = reviews.map(r => `${r.rating} stars: ${r.content}`).join('\n\n');
    
    if (!reviewTexts) return res.json({ summary: 'No reviews yet.' });

    // GenAI Analysis
    let aiSummary = '';
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
          Analyze these product reviews and provide a detailed 3-4 sentence summary that:
          1. Identifies overall sentiment (percentage positive/negative/neutral)
          2. Extracts specific praised features
          3. Lists common complaints
          4. Notes any surprising feedback
          
          Write in natural, conversational tone for display to customers.
          
          Reviews:
          ${reviewTexts}
        `;
        
        const result = await model.generateContent(prompt);
        aiSummary = (await result.response).text();
      } catch (error) {
        console.error('GenAI error:', error);
      }
    }

    res.json({
      // This is the GenAI-generated analysis
      aiAnalysis: aiSummary || 'Could not generate advanced analysis',
      
      // Keep basic stats as secondary data
      statistics: {
        averageRating: (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1),
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;
