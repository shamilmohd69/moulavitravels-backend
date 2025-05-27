const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db');
const Login = require('../models/login');
const Hero = require('../models/hero');

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

router.post('/hero', async (req, res) => {
  try {
    const { title, desc } = req.body;

    const currentCount = await Hero.countDocuments();
    if (currentCount >= 3) {
      return res.status(400).json({ error: "Limit reached. Only 3 hero items are allowed." });
    }

    const newHero = new Hero({ title, desc });
    await newHero.save();

    return res.status(201).json({ message: "Hero item added successfully", hero: newHero });
  } catch (err) {
    console.error("❌ Error adding hero item:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get('/hero', async (req, res) => {
  try {
    const heroes = await Hero.find();
    return res.status(200).json(heroes);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching hero items" });
  }
});

// Edit hero - PUT /hero/:id
router.put('/hero/:id', async (req, res) => {
  try {
    const heroId = req.params.id;
    const { title, desc } = req.body;

    // Find and update hero item
    const updatedHero = await Hero.findByIdAndUpdate(
      heroId,
      { title, desc },
      { new: true, runValidators: true }
    );

    if (!updatedHero) {
      return res.status(404).json({ error: "Hero item not found" });
    }

    return res.status(200).json({ message: "Hero item updated successfully", hero: updatedHero });
  } catch (err) {
    console.error("❌ Error updating hero item:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// Delete hero - DELETE /hero/:id
router.delete('/hero/:id', async (req, res) => {
  try {
    const heroId = req.params.id;

    const deletedHero = await Hero.findByIdAndDelete(heroId);

    if (!deletedHero) {
      return res.status(404).json({ error: "Hero item not found" });
    }

    return res.status(200).json({ message: "Hero item deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting hero item:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
 