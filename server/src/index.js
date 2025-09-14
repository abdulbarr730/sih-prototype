const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
const rawOrigins = process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || '';
const allowedOrigins = rawOrigins.split(',').map((s) => s.trim()).filter(Boolean);
const allowAll = (process.env.ALLOW_ALL_ORIGINS || 'true').toLowerCase() === 'true';
app.use(cors({
  origin: (origin, callback) => {
    if (allowAll) return callback(null, true);
    if (!origin) return callback(null, true); // non-browser or same-origin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // dev-friendly: allow Vite ports and LAN address printed by Vite
    if (origin.startsWith('http://localhost:517') || /http:\/\/10\.[0-9]+\.[0-9]+\.[0-9]+:517[0-9]/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS: origin not allowed: ' + origin));
  },
}));
app.use(morgan('dev'));
app.use(express.json());

// Ensure uploads dir exists and serve static files
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/mock', require('./routes/mock'));

// Start server after DB connects
connectDB()
  .then(() => {
    // start background jobs
    try { require('./jobs/scraper').start(); } catch (e) { /* ignore for prototype */ }
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });

