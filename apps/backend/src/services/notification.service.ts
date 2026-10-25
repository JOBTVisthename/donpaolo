import axios from 'axios';
import pino from 'pino';

const logger = pino();

/**
 * NotificationService gestisce l'invio di notifiche push/email agli amministratori
 * per eventi critici rilevati dal sistema.
 */
export class NotificationService {
  private telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  private telegramChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  async sendAdminAlert(message: string): Promise<void> {
    logger.info(`📢 Invio allerta amministratore: ${message}`);

    // Implementazione Telegram
    if (this.telegramBotToken && this.telegramChatId) {
      try {
        await axios.post(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
          chat_id: this.telegramChatId,
          text: `🚨 *DON PAOLO AI - ALLERTA CRITICA*\n\n${message}`,
          parse_mode: 'Markdown',
        });
        logger.info('✅ Notifica Telegram inviata con successo');
      } catch (error) {
        logger.error('❌ Errore durante l\'invio della notifica Telegram:', error);
      }
    }

    // Qui è possibile estendere il sistema con Email (es. tramite Nodemailer o SendGrid)
  }
}

export const notificationService = new NotificationService();