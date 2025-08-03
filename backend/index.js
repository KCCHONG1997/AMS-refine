const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Import routes
const tempRouter = require('./temp-routes');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/Product');
const partRoutes = require('./routes/Part');
const path = require('path');

// Test database connection on startup
const { sequelize } = require('./models');

// Routes
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.json({ message: 'Welcome to the AMS API' });
});

// Database health check
app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ status: 'healthy', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
    }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/parts', partRoutes);

// Public reviews endpoint (only visible reviews) - MUST come before temp-routes
const { Review, Account } = require('./models');
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { isVisible: true }, // Only show visible reviews
            include: [{
                model: Account,
                as: 'account',
                attributes: ['firstName', 'lastName', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching public reviews:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use('/api', tempRouter); // Keep temporary routes as fallback

// Website content endpoints for frontend
app.get('/api/website-content', async (req, res) => {
    try {
        // Return default content structure expected by AdminHome
        const defaultContent = {
            title: 'Where Quality Parts Meet Outstanding Service.',
            description: 'Your trusted partner for quality automotive parts and accessories.',
            featuredText: 'Welcome to AMS',
            aboutText: 'AMS has been serving customers with top-quality automotive parts for years. We pride ourselves on offering a wide range of parts for multiple brands while providing excellent customer service.'
        };
        res.json(defaultContent);
    } catch (error) {
        console.error('Error fetching website content:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/website-content', async (req, res) => {
    try {
        // For now, just return success - in a real app you'd save to database
        console.log('Website content update received:', req.body);
        res.json({ message: 'Content updated successfully', data: req.body });
    } catch (error) {
        console.error('Error updating website content:', error);
        res.status(500).json({ error: error.message });
    }
});


// IMPORTANT: 404 handler must be BEFORE app.listen()
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const port = 3002;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});