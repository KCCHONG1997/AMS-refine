const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Account } = require('../models');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Find user by email
        const user = await Account.findOne({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Don't send password in response
        const { password: _, ...userWithoutPassword } = user.toJSON();
        
        res.json({
            message: 'Login successful',
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Check if user already exists
        const existingUser = await Account.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Determine role (admin if email ends with @ams.com, otherwise customer)
        const role = email.endsWith('@ams.com') ? 'admin' : 'customer';
        
        // Create new account
        const newAccount = await Account.create({
            email,
            password: hashedPassword,
            firstName: firstName || '',
            lastName: lastName || '',
            role
        });
        
        // Don't send password in response
        const { password: _, ...userWithoutPassword } = newAccount.toJSON();
        
        res.status(201).json({
            message: 'Account created successfully',
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get current user info (if you implement sessions/JWT later)
router.get('/me', async (req, res) => {
    // This would require authentication middleware
    // For now, just return a placeholder
    res.json({ message: 'Authentication required' });
});

module.exports = router;
