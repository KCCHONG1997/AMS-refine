const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Data storage
let tutorialList = [];

// Routes
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.json({ message: 'Welcome to the learning space.' });
});

app.get('/api/data', (req, res) => {
    console.log('GET /api/data accessed');
    res.json(tutorialList);
});

app.post('/api/data', (req, res) => {
    console.log('POST /api/data accessed');
    console.log('Body:', req.body);
    tutorialList.push(req.body);
    res.json({ message: 'Data added', data: req.body });
});

// IMPORTANT: 404 handler must be BEFORE app.listen()
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const port = 3001;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});