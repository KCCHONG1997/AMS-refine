const express = require('express');
const router = express.Router();
const { 
    Product, 
    Review, 
    Account, 
    Order, 
    CartItem, 
    Part, 
    WebsiteContent 
} = require('../models');

// Products CRUD
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Part, as: 'parts' }]
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Part, as: 'parts' }]
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const [updated] = await Product.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const product = await Product.findByPk(req.params.id);
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const deleted = await Product.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
});

// Reviews management
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [{
                model: Account,
                as: 'account',
                attributes: ['firstName', 'lastName', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new review (admin only)
router.post('/reviews', async (req, res) => {
    try {
        const { email, content, rating, isVisible = true } = req.body;
        
        // Validate required fields
        if (!email || !content || !rating) {
            return res.status(400).json({ error: 'Email, content, and rating are required' });
        }
        
        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        const review = await Review.create({
            email,
            content,
            rating,
            isVisible
        });
        
        // Fetch the created review with account information
        const createdReview = await Review.findByPk(review.id, {
            include: [{
                model: Account,
                as: 'account',
                attributes: ['firstName', 'lastName', 'email']
            }]
        });
        
        res.status(201).json(createdReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update review
router.put('/reviews/:id', async (req, res) => {
    try {
        const { content, rating, isVisible } = req.body;
        const reviewId = req.params.id;
        
        // Validate rating if provided
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        const [updated] = await Review.update({
            ...(content && { content }),
            ...(rating && { rating }),
            ...(isVisible !== undefined && { isVisible })
        }, {
            where: { id: reviewId }
        });
        
        if (updated) {
            const updatedReview = await Review.findByPk(reviewId, {
                include: [{
                    model: Account,
                    as: 'account',
                    attributes: ['firstName', 'lastName', 'email']
                }]
            });
            res.json(updatedReview);
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/reviews/summary', async (req, res) => {
    try {
        const reviews = await Review.findAll();
        const totalReviews = reviews.length;
        
        if (totalReviews === 0) {
            return res.json({
                aiAnalysis: "No reviews available for analysis.",
                statistics: {
                    averageRating: 0,
                    totalReviews: 0
                }
            });
        }
        
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
        const positiveReviews = reviews.filter(r => r.rating >= 4).length;
        const negativeReviews = reviews.filter(r => r.rating <= 2).length;
        const neutralReviews = reviews.filter(r => r.rating === 3).length;
        
        const positivePercentage = Math.round((positiveReviews / totalReviews) * 100);
        const negativePercentage = Math.round((negativeReviews / totalReviews) * 100);
        
        let aiAnalysis = '';
        
        if (averageRating >= 4.0) {
            aiAnalysis = `✅ GOOD: Customer reviews are overwhelmingly positive (${positivePercentage}% positive). Customers consistently praise product quality, fast shipping, and excellent customer service. This product is performing well in the market with strong customer satisfaction.`;
        } else if (averageRating >= 3.0) {
            aiAnalysis = `⚖️ MIXED: Customer sentiment is divided (${positivePercentage}% positive, ${negativePercentage}% negative). While some customers are satisfied, there are notable concerns that need attention. Product performance and customer experience could be improved.`;
        } else {
            aiAnalysis = `❌ BAD: Customer reviews are predominantly negative (${negativePercentage}% negative, only ${positivePercentage}% positive). Major issues require immediate attention to improve customer satisfaction and product quality.`;
        }
        
        res.json({
            aiAnalysis: aiAnalysis,
            statistics: {
                averageRating: averageRating.toFixed(1),
                totalReviews: totalReviews,
                positiveReviews,
                negativeReviews,
                neutralReviews
            }
        });
    } catch (error) {
        console.error('Error generating reviews summary:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/reviews/:id', async (req, res) => {
    try {
        const deleted = await Review.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ message: 'Review deleted successfully' });
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: error.message });
    }
});

// Accounts management
router.get('/accounts', async (req, res) => {
    try {
        let whereClause = {};
        if (req.query.role) {
            whereClause.role = req.query.role;
        }
        
        const accounts = await Account.findAll({
            where: whereClause,
            attributes: { exclude: ['password'] } // Don't send passwords
        });
        res.json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/accounts/:id', async (req, res) => {
    try {
        const deleted = await Account.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ error: 'Account not found' });
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: error.message });
    }
});

// Orders management
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Dashboard analytics
router.get('/analytics', async (req, res) => {
    try {
        const [productCount, reviewCount, accountCount, orderCount] = await Promise.all([
            Product.count(),
            Review.count(),
            Account.count(),
            Order.count()
        ]);
        
        const recentReviews = await Review.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });
        
        const recentOrders = await Order.findAll({
            limit: 5
        });
        
        res.json({
            counts: {
                products: productCount,
                reviews: reviewCount,
                accounts: accountCount,
                orders: orderCount
            },
            recent: {
                reviews: recentReviews,
                orders: recentOrders
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: error.message });
    }
});

// Website content management
router.get('/website-content', async (req, res) => {
    try {
        const content = await WebsiteContent.findAll();
        res.json(content);
    } catch (error) {
        console.error('Error fetching website content:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/website-content/:id', async (req, res) => {
    try {
        const [updated] = await WebsiteContent.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const content = await WebsiteContent.findByPk(req.params.id);
            res.json(content);
        } else {
            res.status(404).json({ error: 'Content not found' });
        }
    } catch (error) {
        console.error('Error updating website content:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
