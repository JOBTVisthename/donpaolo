import { Router, Request, Response } from 'express';
import pino from 'pino';
import { verifyAdmin } from '../middleware/auth';

const router = Router();
const logger = pino();

// Dashboard statistics
router.get('/dashboard', verifyAdmin, async (req: Request, res: Response) => {
  try {
    // TODO: Get dashboard data from database
    res.json({
      activeUsers: 0,
      alertsPending: 0,
      prayersToday: 0,
      averageEmotion: 'neutral',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching dashboard data:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get alerts
router.get('/alerts', verifyAdmin, async (req: Request, res: Response) => {
  try {
    // TODO: Get alerts from database
    res.json({
      alerts: [],
    });
  } catch (error) {
    logger.error({ err: error }, 'Error fetching alerts:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
