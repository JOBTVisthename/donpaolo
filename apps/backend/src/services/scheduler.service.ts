import cron from 'node-cron';
import pino from 'pino';
import { userService } from './user.service';
import { aiService } from './ai.service';
import { getSupabase } from '../config/database';
import { elevenLabsService } from './elevenlabs.service';
import { storageService } from './storage.service';
import { queueService, MessagePriority } from './queue.service';

const logger = pino();

/**
 * SchedulerService gestisce tutte le attività pianificate (Cron Jobs)
 * per l'invio proattivo di messaggi su WhatsApp.
 */
export class SchedulerService {
  private supabase = getSupabase();

  /**
   * Inizializza tutti i job programmati
   */
  public init(): void {
    logger.info('⏳ Inizializzazione Scheduler Service...');

    // 1. Auguri di Compleanno - Ogni giorno alle 08:30
    cron.schedule('30 8 * * *', async () => {
      logger.info('🎂 Esecuzione job auguri di compleanno');
      await this.handleBirthdays();
    });

    // 2. Devozionale Mattutino (Vangelo e Riflessione) - Ogni giorno alle 07:30
    cron.schedule('30 7 * * *', async () => {
      logger.info('🌅 Esecuzione job Devozionale Mattutino');
      await this.handleMorningDevotional();
    });

    // 3. Angelus - Ogni giorno alle 12:00
    cron.schedule('0 12 * * *', async () => {
      logger.info('🔔 Esecuzione job Angelus');
      await this.handleAngelus().catch(err => logger.error('❌ Errore job Angelus:', err));
    });

    // 4. Compieta/Preghiera della Sera - Ogni giorno alle 20:30
    cron.schedule('30 20 * * *', async () => {
      logger.info('🌙 Esecuzione job Preghiera della Sera');
      await this.handleEveningPrayer().catch(err => logger.error('❌ Errore job Preghiera Sera:', err));
    });
  }

  /**
   * Gestisce l'invio degli auguri personalizzati tramite AI
   */
  private async handleBirthdays(): Promise<void> {
    try {
      const users = await userService.getUsersWithBirthdayToday();
      
      for (const user of users) {
        const prompt = `Oggi è il compleanno di ${user.name}. Scrivi un messaggio di auguri da parte di Don Paolo. 
        Il tono deve essere caloroso, paterno e spirituale. Includi una brevissima preghiera di benedizione 
        o un riferimento al dono della vita. Non superare le 100 parole.`;

        const greeting = await aiService.generateResponse(prompt);
        await queueService.enqueueMessage({
          type: 'text',
          phoneNumber: user.phone_number,
          userId: user.id,
          messageType: 'birthday_greeting',
          content: greeting
        }, MessagePriority.LOW);
        
        logger.info(`✅ Auguri messi in coda per ${user.name} (${user.phone_number})`);
      }
    } catch (error) {
      logger.error('❌ Errore durante l\'invio degli auguri:', error);
    }
  }

  private async handleAngelus(): Promise<void> {
    const users = await userService.getActiveSubscribers();
    for (const user of users) {
      await queueService.enqueueMessage({
        type: 'text',
        phoneNumber: user.phone_number,
        userId: user.id,
        messageType: 'angelus',
        content: "🔔 È mezzogiorno. Recitiamo insieme l'Angelus: 'L'Angelo del Signore portò l'annuncio a Maria...' 🙏"
      }, MessagePriority.MEDIUM);
    }
  }

  private async handleEveningPrayer(): Promise<void> {
    const users = await userService.getActiveSubscribers();
    for (const user of users) {
      await queueService.enqueueMessage({
        type: 'text',
        phoneNumber: user.phone_number,
        userId: user.id,
        messageType: 'evening_prayer',
        content: "🌙 Prima di riposare, affidiamo la nostra giornata al Signore. Ti auguro una notte di pace. Benedicamus Domino."
      }, MessagePriority.MEDIUM);
    }
  }

  /**
   * Gestisce l'invio massivo del Vangelo del mattino tramite Template WhatsApp
   */
  private async handleMorningDevotional(): Promise<void> {
    try {
      // 1. Recupera la liturgia del giorno dal database
      const todayIso = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const { data: liturgy, error: liturgyError } = await this.supabase
        .from('daily_liturgy')
        .select('saint_name, gospel_text')
        .eq('date', todayIso)
        .single();

      if (liturgyError || !liturgy) {
        logger.warn(`⚠️ Liturgia non trovata per la data ${todayIso}. Invio annullato.`);
        return;
      }

      // 2. Recupera gli utenti attivi
      const users = await userService.getActiveSubscribers();
      if (users.length === 0) return;

      // 3. Genera riflessione audio (una sola volta per tutti)
      logger.info('🎙️ Generazione riflessione audio...');
      const reflectionText = await aiService.generateResponse(
        `Scrivi una breve riflessione spirituale (max 60 parole) basata su questo Vangelo: ${liturgy.gospel_text}. 
        Il tono deve essere quello di Don Paolo: calmo, incoraggiante e paterno.`
      );

      const audioBuffer = await elevenLabsService.generateSpeech(reflectionText);
      const audioUrl = await storageService.uploadAudio(
        `riflessione-${todayIso}.mp3`,
        audioBuffer
      );

      logger.info(`📤 Invio devozionale a ${users.length} utenti...`);
      
      for (const user of users) {
        await queueService.enqueueMessage({
          type: 'template',
          phoneNumber: user.phone_number,
          userId: user.id,
          messageType: 'morning_devotional_text',
          templateName: 'vangelo_mattino',
          parameters: [
            { type: 'text', text: user.name || 'Caro fedele' },
            { type: 'text', text: liturgy.saint_name },
            { type: 'text', text: liturgy.gospel_text }
          ],
          logContent: `Vangelo del giorno con ${liturgy.saint_name}`
        }, MessagePriority.MEDIUM);

        await queueService.enqueueMessage({
          type: 'audio',
          phoneNumber: user.phone_number,
          userId: user.id,
          messageType: 'morning_devotional_audio',
          audioUrl: audioUrl
        }, MessagePriority.MEDIUM);
      }
    } catch (error) {
      logger.error('❌ Errore durante l\'invio del devozionale:', error);
    }
  }
}

export const schedulerService = new SchedulerService();