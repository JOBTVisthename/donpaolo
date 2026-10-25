import axios from 'axios';
import pino from 'pino';
import { userService } from './user.service';
import { aiService } from './ai.service';
import { queueService, MessagePriority } from './queue.service';
import { notificationService } from './notification.service';
import { getSupabase } from '../config/database';

const logger = pino();

interface WhatsAppIncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

export class WhatsAppService {
  private apiUrl = 'https://graph.facebook.com/v18.0';
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  async handleIncomingMessage(message: WhatsAppIncomingMessage): Promise<void> {
    try {
      const phoneNumber = message.from;
      const messageText = message.text?.body || '';

      logger.info(`📨 Message from ${phoneNumber}: ${messageText}`);

      // Get or create user
      let user = await userService.getUserByPhoneNumber(phoneNumber);

      if (!user) {
        // New user - start onboarding
        logger.info(`🆕 New user: ${phoneNumber}`);
        await this.sendMessage(
          phoneNumber,
          'Benvenuto 🙏\nMi piacerebbe conoscerti meglio.\n\nCome preferisci essere chiamato?'
        );
        return;
      }

      // Process message
      const emotion = await aiService.detectEmotion(messageText);
      const hasRisk = await aiService.detectRisk(messageText);

      // Generate response
      const response = await aiService.generateResponse(messageText, []);

      // Invia la risposta tramite coda per gestire priorità e rate limit
      await queueService.enqueueMessage({
        type: 'text',
        phoneNumber,
        userId: user.id,
        messageType: 'chat_response',
        content: response,
        logContent: hasRisk ? `[RISK DETECTED] ${response}` : undefined
      }, hasRisk ? MessagePriority.CRITICAL : MessagePriority.HIGH);

      // Handle risk
      if (hasRisk) {
        logger.warn(`🚨 Risk detected for ${phoneNumber}`);
        
        // 1. Aggiorna il livello di rischio dell'utente nel DB
        await userService.updateRiskLevel(user.id, 'high');

        // 2. Crea record nella tabella alerts
        const supabase = getSupabase();
        await supabase.from('alerts').insert([{
          user_id: user.id,
          alert_type: 'RISK_DETECTION',
          severity: 'high',
          description: messageText,
          handled: false
        }]);

        // 3. Invia Notifica agli Amministratori
        const alertContent = `*Utente:* ${user.name || phoneNumber}\n*Tel:* ${phoneNumber}\n*Messaggio:* "${messageText}"\n\n_L'IA ha rilevato una possibile situazione di crisi. Intervenire se necessario._`;
        await notificationService.sendAdminAlert(alertContent);
      }
    } catch (error) {
      logger.error('Error handling incoming message:', error);
    }
  }

  async sendMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      logger.info(`✅ Message sent to ${phoneNumber}`);
    } catch (error) {
      logger.error(`❌ Error sending message to ${phoneNumber}:`, error);
      throw error;
    }
  }

  /**
   * Invia un messaggio utilizzando un template pre-approvato di WhatsApp.
   * Necessario per l'invio proattivo (non iniziato dall'utente).
   */
  async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    languageCode: string = 'it',
    parameters: any[] = []
  ): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components: [
              {
                type: 'body',
                parameters: parameters,
              },
            ],
          },
        },
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );
      logger.info(`✅ Template ${templateName} inviato a ${phoneNumber}`);
    } catch (error: any) {
      logger.error(`❌ Errore invio template a ${phoneNumber}:`, error.response?.data || error.message);
    }
  }

  /**
   * Invia un file audio tramite URL pubblico
   */
  async sendAudioMessage(phoneNumber: string, audioUrl: string): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'audio',
          audio: { link: audioUrl },
        },
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        }
      );
      logger.info(`✅ Audio inviato a ${phoneNumber}`);
    } catch (error: any) {
      logger.error(`❌ Errore invio audio a ${phoneNumber}:`, error.response?.data || error.message);
    }
  }
}

export const whatsappService = new WhatsAppService();
