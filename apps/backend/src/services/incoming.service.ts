import pino from 'pino';
import { userService } from './user.service';
import { aiService } from './ai.service';
import { conversationService } from './conversation.service';
import { onboardingService } from './onboarding.service';
import { notificationService } from './notification.service';
import { queueService, MessagePriority } from './queue.service';
import { detectKeywordRisk, CRISIS_NOTE } from './risk.service';
import { getSupabase } from '../config/database';

const logger = pino();
const seen = new Set<string>();

export interface IncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

async function raiseRisk(user: any, phoneNumber: string, text: string): Promise<void> {
  try { await userService.updateRiskLevel(user.id, 'high'); }
  catch (e) { logger.error({ err: e }, 'updateRiskLevel failed'); }
  try {
    const { error } = await getSupabase().from('alerts').insert([{
      user_id: user.id, alert_type: 'RISK_DETECTION', severity: 'high',
      description: text, handled: false,
    }]);
    if (error) throw error;
  } catch (e) { logger.error({ err: e }, 'alert insert failed'); }
  try {
    await notificationService.sendAdminAlert(
      `*Utente:* ${user.name || phoneNumber}\n*Tel:* ${phoneNumber}\n*Messaggio:* "${text}"\n\n_Possibile situazione di crisi. Intervenire se necessario._`
    );
  } catch (e) { logger.error({ err: e }, 'admin notification failed'); }
}

export async function processIncoming(
  message: IncomingMessage,
  send: (to: string, text: string) => Promise<void>
): Promise<void> {
  try {
    if (seen.has(message.id)) return;
    seen.add(message.id);
    if (seen.size > 5000) {
      const first = seen.values().next().value;
      if (first) seen.delete(first);
    }

    const phoneNumber = message.from;
    const isText = message.type === 'text';
    const text = isText ? (message.text?.body || '') : '';
    logger.info(`📨 Message from ${phoneNumber}`);

    const user: any = await userService.getUserByPhoneNumber(phoneNumber);
    const keywordRisk = detectKeywordRisk(text);

    if (!user || !user.onboarding_completed) {
      await onboardingService.handle(phoneNumber, text, user, (t) => send(phoneNumber, t));
      if (user && keywordRisk) await raiseRisk(user, phoneNumber, text);
      return;
    }

    if (!isText || !text.trim()) {
      await send(phoneNumber, 'Per ora posso leggere solo messaggi di testo 🙏 Scrivimi pure.');
      return;
    }

    let emotion: any = null;
    let aiRisk = false;
    try { emotion = await aiService.detectEmotion(text); } catch (e) { logger.error({ err: e }, 'detectEmotion failed'); }
    try { aiRisk = await aiService.detectRisk(text); } catch (e) { logger.error({ err: e }, 'detectRisk failed'); }
    const hasRisk = keywordRisk || aiRisk;

    let history: any[] = [];
    try { history = await conversationService.getConversationHistory(user.id, 10); }
    catch (e) { logger.error({ err: e }, 'history failed'); }

    let response = '';
    try { response = await aiService.generateResponse(text, history); }
    catch (e) {
      logger.error({ err: e }, 'generateResponse failed');
      response = 'Ti ascolto, ma in questo momento faccio fatica a risponderti. Riprova tra poco 🙏';
    }
    if (hasRisk) response += CRISIS_NOTE;

    try {
      await conversationService.saveConversation({
        user_id: user.id,
        user_message: text,
        ai_response: response,
        emotion_detected: typeof emotion === 'string' ? emotion : null,
        has_risk_indicator: hasRisk,
      } as any);
    } catch (e) { logger.error({ err: e }, 'saveConversation failed'); }

    if (hasRisk) {
      logger.warn(`🚨 Risk detected for ${phoneNumber}`);
      await raiseRisk(user, phoneNumber, text);
    }

    try {
      await queueService.enqueueMessage({
        type: 'text', phoneNumber, userId: user.id, messageType: 'chat_response',
        content: response, logContent: hasRisk ? `[RISK DETECTED] ${response}` : undefined,
      }, hasRisk ? MessagePriority.CRITICAL : MessagePriority.HIGH);
    } catch (e) {
      logger.error({ err: e }, 'enqueue failed, invio diretto');
      try { await send(phoneNumber, response); } catch (e2) { logger.error({ err: e2 }, 'invio diretto fallito'); }
    }
  } catch (error) {
    logger.error({ err: error }, 'Error handling incoming message');
  }
}
