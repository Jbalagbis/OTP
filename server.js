const express = require('express');
const cors = require('cors');
const sendOTPEmail = require('./mailer');
const {
  addUser,
  setOtpVerified,
  isOtpVerified,
  isRegistered,
  verifyUser,
} = require('./users');

const app = express();
app.use(cors());
app.use(express.json());

const otpStore = {}; 
const PORT = 5000;

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] !== parseInt(otp)) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  setOtpVerified(email);
  delete otpStore[email];
  res.status(200).json({ message: 'OTP verified' });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!isOtpVerified(email)) return res.status(400).json({ message: 'OTP not verified' });
  if (isRegistered(email)) return res.status(400).json({ message: 'User already registered' });

  addUser(email, password);
  res.status(200).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!isRegistered(email)) return res.status(400).json({ message: 'User not registered' });

  if (verifyUser(email, password)) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
