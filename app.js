const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin');
const authenticateToken = require('./middleware/auth');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', adminRoutes);

app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to the protected dashboard!',
    user: req.user,
  });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('💥 Global Error:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running`);
});
