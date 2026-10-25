import { Router, Request, Response } from 'express';
import pino from 'pino';
import { userService } from '../services/user.service';
import { verifyJWT } from '../middleware/auth';

const router = Router();
const logger = pino();

// Get user profile
router.get('/:id', verifyJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserByPhoneNumber(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching user:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:id', verifyJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await userService.updateUserProfile(id, updates);
    res.json(updatedUser);
  } catch (error) {
    logger.error({ err: error }, 'Error updating user:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
