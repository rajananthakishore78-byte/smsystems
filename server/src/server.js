import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import route handlers
import productRoutes from './routes/products.js';
import offerRoutes from './routes/offers.js';
import categoryRoutes from './routes/categories.js';
import inquiryRoutes from './routes/inquiries.js';
import settingRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import { checkDatabase, initDatabase } from './database/store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client application
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local development & deployment previews
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', async (req, res) => {
  const database = await checkDatabase();
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CCTV Showroom API',
    database
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// In production, serve the React client build if available
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('CCTV Showroom API is operational. Run Vite dev server for client.');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const startServer = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 CCTV Showroom Server is running on http://localhost:${PORT}`);
    console.log(`🔌 Ready for API requests & PostgreSQL / Cloudinary / Firebase integration`);
  });
};

startServer();
