import { Router, Request, Response } from 'express';
import pino from 'pino';
import crypto from 'crypto';
import { WhatsAppMessage } from '../types';
import { whatsappService } from '../services/whatsapp.service';

const router = Router();
const logger = pino();

// WhatsApp Webhook Verification
router.get('/whatsapp', (req: Request, res: Response) => {
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  const challenge = req.query['hub.challenge'] as string;
  const mode = req.query['hub.mode'] as string;
  const token = req.query['hub.verify_token'] as string;

  if (mode === 'subscribe' && token === verifyToken) {
    logger.info('✅ WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    logger.warn('❌ Invalid webhook verification');
    res.status(403).send('Forbidden');
  }
});

// WhatsApp Webhook Handler
router.post('/whatsapp', async (req: Request, res: Response) => {
  try {
    const body = req.body as WhatsAppMessage;

    // Verify signature
    const signature = req.headers['x-hub-signature-256'] as string;
    const xHubSignatureVerified = verifySignature(req, signature);

    if (!xHubSignatureVerified) {
      logger.warn('❌ Invalid webhook signature');
      return res.status(403).send('Forbidden');
    }

    if (body.object !== 'whatsapp_business_account') {
      return res.status(404).send('Not found');
    }

    // Process messages
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value.messages) {
          for (const message of change.value.messages) {
            await whatsappService.handleIncomingMessage(message);
          }
        }
      }
    }

    res.status(200).send('ok');
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).send('Internal server error');
  }
});

function verifySignature(req: Request, signature: string): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  const raw = (req as any).rawBody as Buffer | undefined;
  if (!appSecret || !raw || !signature) return false;

  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(raw).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default router;
