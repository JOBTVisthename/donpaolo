import { getSupabase } from '../config/database';
import { Prayer } from '../types';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const logger = pino();

export class PrayerService {
  private supabase = getSupabase();

  async createPrayer(
    userId: string,
    prayer: Partial<Prayer>
  ): Promise<Prayer> {
    try {
      const { data, error } = await this.supabase
        .from('prayers')
        .insert([
          {
            id: uuidv4(),
            user_id: userId,
            ...prayer,
            completed: false,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      logger.info(`✅ Prayer created for user ${userId}`);
      return data as Prayer;
    } catch (error) {
      logger.error({ err: error }, 'Error creating prayer:');
      throw error;
    }
  }

  async completePrayer(
    prayerId: string,
    duration_minutes?: number
  ): Promise<Prayer> {
    try {
      const { data, error } = await this.supabase
        .from('prayers')
        .update({
          completed: true,
          duration_minutes,
          completed_at: new Date().toISOString(),
        })
        .eq('id', prayerId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`✅ Prayer completed: ${prayerId}`);
      return data as Prayer;
    } catch (error) {
      logger.error({ err: error }, 'Error completing prayer:');
      throw error;
    }
  }
}

export const prayerService = new PrayerService();
