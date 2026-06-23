import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for container deployment simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', reportRoutes); // Covers /api/analyze, /api/reports, /api/reports/:id/export, etc.

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Express REST API', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.send('AI Organizational Analytics Backend is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.'
  });
});

// Initialize DB and start listening
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed. Exiting server...', error);
    process.exit(1);
  }
};

startServer();
