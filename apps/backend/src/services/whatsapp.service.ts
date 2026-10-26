import { processIncoming } from './incoming.service';
import axios from 'axios';
import { onboardingService } from './onboarding.service';
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
  private apiUrl = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || 'v21.0'}`;
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  async handleIncomingMessage(message: WhatsAppIncomingMessage): Promise<void> {
    await processIncoming(message, (to, t) => this.sendMessage(to, t));
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
      logger.error({ status: (error as any)?.response?.status, meta: (error as any)?.response?.data?.error }, `❌ Error sending message to ${phoneNumber}`);
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
