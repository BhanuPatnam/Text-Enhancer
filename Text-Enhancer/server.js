// server.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const enhanceRoute = require('./routes/enhance');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Simple CORS headers to allow frontend on a different port
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Health route for root path
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Meaning Preserving Enhancer API' });
});

// Use the enhance route
app.use('/enhance', enhanceRoute);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
