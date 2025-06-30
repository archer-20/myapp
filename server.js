const express = require('express');
const path = require('path');
const app = express();

// Store user input temporarily in memory
let userData = {};

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the "public" folder (like index.html, 2page13.html, etc.)
app.use(express.static('public'));

// Handle POST request from 2page13.html
app.post('/submit', (req, res) => {
  userData = req.body;
  res.sendStatus(200);
});

// Handle GET request from 4page16.html
app.get('/data', (req, res) => {
  res.json(userData);
});

// ✅ Serve index.html when user visits "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
