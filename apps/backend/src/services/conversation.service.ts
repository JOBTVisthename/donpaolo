import { getSupabase } from '../config/database';
import { Conversation } from '../types';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const logger = pino();

export class ConversationService {
  private supabase = getSupabase();

  async saveConversation(conversation: Partial<Conversation>): Promise<Conversation> {
    try {
      const { data, error } = await this.supabase
        .from('conversations')
        .insert([
          {
            id: uuidv4(),
            ...conversation,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data as Conversation;
    } catch (error) {
      logger.error({ err: error }, 'Error saving conversation:');
      throw error;
    }
  }

  async getConversationHistory(
    userId: string,
    limit: number = 10
  ): Promise<Array<{ role: string; content: string }>> {
    try {
      const { data, error } = await this.supabase
        .from('conversations')
        .select('user_message, ai_response')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).reverse().flatMap((conv: any) => [
        { role: 'user', content: conv.user_message },
        { role: 'assistant', content: conv.ai_response },
      ]);
    } catch (error) {
      logger.error({ err: error }, 'Error fetching conversation history:');
      return [];
    }
  }
}

export const conversationService = new ConversationService();
