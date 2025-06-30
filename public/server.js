const express = require('express');
const app = express();
const path = require('path');

let userData = {};

app.use(express.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
  userData = req.body;
  res.sendStatus(200);
});

app.get('/data', (req, res) => {
  res.json(userData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));