import { Queue, Worker, Job } from 'bullmq';
import pino from 'pino';
import { whatsappService } from './whatsapp.service';
import { getSupabase } from '../config/database';

const redisConnection = {
  host: 'champion-chamois-113768.upstash.io',
  port: 6379,
  password: process.env.redis-cli --tls -u redis://default:gQAAAAAAAbxoAAIgcDFlMTU1MjA0N2RmNjg0YzRlODdlNWU2ZDFjMTYxNTlkZg@champion-chamois-113768.upstash.io:6379   ,
  tls: {}
};
const redisConnection = { host: 'localhost', port: 6379 };

export enum MessagePriority {
  CRITICAL = 1,   // Alert di rischio, emergenze
  HIGH = 5,       // Risposte dirette alle chat degli utenti
  MEDIUM = 10,    // Messaggi pianificati (Vangelo, Angelus)
  LOW = 20        // Auguri di compleanno, messaggi non urgenti
}

export interface MessageJobData {
  type: 'text' | 'template' | 'audio';
  phoneNumber: string;
  userId: string;
  messageType: string;
  content?: string;
  templateName?: string;
  parameters?: any[];
  audioUrl?: string;
  logContent?: string;
}

export class QueueService {
  private queue: Queue;
  private worker: Worker;
  private supabase = getSupabase();

  constructor() {
    this.queue = new Queue('whatsapp-messages', { connection: redisConnection });
    
    // Worker con Rate Limiting per rispettare le policy di Meta
    this.worker = new Worker('whatsapp-messages', async (job: Job<MessageJobData>) => {
      await this.processMessage(job.data);
    }, { 
      connection: redisConnection,
      limiter: {
        max: 40, // Massimo 40 messaggi al secondo (regolabile in base al tier WhatsApp Business)
        duration: 1000
      }
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`❌ Job ${job?.id} fallito per l'utente ${job?.data.userId}: ${err.message}`);
    });
  }

  async enqueueMessage(data: MessageJobData, priority: MessagePriority = MessagePriority.MEDIUM) {
    await this.queue.add('send-message', data, {
      attempts: 3,
      priority,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true
    });
  }

  private async processMessage(data: MessageJobData) {
    switch (data.type) {
      case 'text':
        await whatsappService.sendMessage(data.phoneNumber, data.content!);
        break;
      case 'template':
        await whatsappService.sendTemplateMessage(data.phoneNumber, data.templateName!, 'it', data.parameters);
        break;
      case 'audio':
        await whatsappService.sendAudioMessage(data.phoneNumber, data.audioUrl!);
        break;
    }

    // Salvataggio log nel database dopo l'invio confermato
    await this.supabase.from('automated_messages').insert([{
      user_id: data.userId,
      message_type: data.messageType,
      content: data.logContent || data.content || data.templateName || 'audio_message',
      sent_at: new Date().toISOString(),
      delivered: true
    }]);
  }
}

export const queueService = new QueueService();