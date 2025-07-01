const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static('public'));

let userData = {};              // for vehicle/RC form
const otpStore = {};            // for email OTP memory store

// ---------- Vehicle Form Submission Routes ----------
app.post('/submit', (req, res) => {
  userData = req.body;
  res.sendStatus(200);
});

app.get('/data', (req, res) => {
  res.json(userData);
});

// ---------- Email OTP Sending ----------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'achintasat@gmail.com',
    pass: 'wfhb frbf ueql vzlj' // Replace this with Gmail App Password
  }
});

app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min validity

  const mailOptions = {
    from: 'achintasat@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).send('Failed to send OTP');
    res.status(200).send('OTP sent');
  });
});

// ---------- OTP Verification ----------
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record) return res.status(400).send('OTP not found');
  if (Date.now() > record.expires) return res.status(400).send('OTP expired');
  if (record.otp !== otp) return res.status(400).send('Incorrect OTP');

  delete otpStore[email];
  res.status(200).send('OTP verified');
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
