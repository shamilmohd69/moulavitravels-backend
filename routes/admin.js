const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db');
const Login = require('../models/login');

dotenv.config();
db();

const JWT_SECRET = process.env.JWT_SECRET;

// Default route    
router.get('/', (req, res) => {
  res.send('Admin Home Page');
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const existingCount = await Login.countDocuments();

    // Create default admin only once if no users exist
    if (existingCount === 0) {
      const defaultUser = new Login({ username: "admin", password: "admin" });
      await defaultUser.save();
      console.log("🔐 Default admin created.");
    }

    const { username, password } = req.body;

    // Check for matching user
    const user = await Login.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    console.log("✅ Login successful for:", username);
    return res.status(200).json({ message: "Login successful", token });

  } catch (err) {
    console.error("❌ Error in /login route:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post('/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ message: 'Token valid', user: decoded });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});


module.exports = router;
 