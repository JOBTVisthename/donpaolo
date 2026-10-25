import { Router, Request, Response } from 'express';
import pino from 'pino';
import { prayerService } from '../services/prayer.service';
import { verifyJWT } from '../middleware/auth';

const router = Router();
const logger = pino();

// Start guided rosary
router.post('/rosario/start', verifyJWT, async (req: Request, res: Response) => {
  try {
    const { userId, mystery, intention } = req.body;

    const prayer = await prayerService.createPrayer(userId, {
      prayer_type: 'rosario',
      mystery,
      prayer_intention: intention,
    });

    res.json({
      success: true,
      prayer,
      guidance: 'Let\'s pray together. Take a moment to center yourself...',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error starting rosary:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete prayer
router.put('/:id/complete', verifyJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { duration_minutes } = req.body;

    const prayer = await prayerService.completePrayer(id, duration_minutes);

    res.json({
      success: true,
      prayer,
      message: 'Thank you for praying. May God\'s peace be with you. 🙏',
    });
  } catch (error) {
    logger.error({ err: error }, 'Error completing prayer:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
