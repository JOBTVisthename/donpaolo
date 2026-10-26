import { Router, Request, Response } from 'express';
import pino from 'pino';
import { aiService } from '../services/ai.service';
import { userService } from '../services/user.service';
import { conversationService } from '../services/conversation.service';
import { verifyAdmin } from '../middleware/auth';

const router = Router();
const logger = pino();

// Send message to AI and get response
router.post('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { userId, content, type = 'text' } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'Missing userId or content' });
    }

    // Get user
    const user = await userService.getUserByPhoneNumber(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Detect emotion and risk
    const emotion = await aiService.detectEmotion(content);
    const hasRisk = await aiService.detectRisk(content);

    // Get conversation history
    const history = await conversationService.getConversationHistory(user.id, 10);

    // Generate AI response
    const aiResponse = await aiService.generateResponse(content, history);

    // Save conversation
    await conversationService.saveConversation({
      user_id: user.id,
      message_type: type,
      user_message: content,
      ai_response: aiResponse,
      emotion_detected: emotion,
      has_risk_indicator: hasRisk,
    });

    // If risk detected, create alert
    if (hasRisk) {
      logger.warn(`🚨 Risk detected for user ${user.id}`);
      // TODO: Create alert in database
    }

    res.json({
      success: true,
      response: aiResponse,
      emotion,
      hasRisk,
    });
  } catch (error) {
    logger.error({ err: error }, 'Error processing message:');
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
