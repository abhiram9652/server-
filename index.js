import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import translationRoutes from './routes/translation.js';
import historyRoutes from './routes/history.js';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://language-translation-zeta.vercel.app'
  ],
  credentials: true
}));

// =====================
// ROUTES
// =====================

// Basic status route
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Health check (without DB)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    server: 'running',
    timestamp: new Date().toISOString()
  });
});

// Application routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/history', historyRoutes);

// =====================
// DATABASE & SERVER SETUP
// =====================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      family: 4
    });
    console.log('MongoDB connected');

    // Add DB health check after connection is established
    app.get('/db-health', async (req, res) => {
      try {
        await mongoose.connection.db.admin().ping();
        res.json({ status: 'OK', db: 'connected' });
      } catch (err) {
        res.status(500).json({ status: 'DB_ERROR', error: err.message });
      }
    });

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    
    // Added '0.0.0.0' for Railway compatibility
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();
