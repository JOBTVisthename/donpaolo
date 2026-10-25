import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';

import { initializeSupabase } from './config/database';
import messageRoutes from './api/messages';
import webhookRoutes from './api/webhooks';
import userRoutes from './api/users';
import prayerRoutes from './api/prayers';
import adminRoutes from './api/admin';
import { errorHandler } from './middleware/error-handler';

dotenv.config({ path: '.env.local' });

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
const supabase = initializeSupabase();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/prayers', prayerRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🙏 Emmaus AI Backend running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
