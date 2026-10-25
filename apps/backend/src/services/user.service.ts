import { getSupabase } from '../config/database';
import { User } from '../types';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const logger = pino();

export class UserService {
  private supabase = getSupabase();

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data as User;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(
    phoneNumber: string,
    name: string,
    province: string
  ): Promise<User> {
    try {
      const userId = uuidv4();

      const { data, error } = await this.supabase
        .from('users')
        .insert([
          {
            id: userId,
            phone_number: phoneNumber,
            name,
            province,
            status: 'active',
            risk_level: 'none',
            privacy_accepted: false,
            whatsapp_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      logger.info(`✅ User created: ${phoneNumber}`);
      return data as User;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`✅ User updated: ${userId}`);
      return data as User;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async updateRiskLevel(
    userId: string,
    riskLevel: 'none' | 'low' | 'medium' | 'high'
  ): Promise<void> {
    try {
      await this.updateUserProfile(userId, { risk_level: riskLevel });
      logger.info(`Risk level updated for user ${userId}: ${riskLevel}`);
    } catch (error) {
      logger.error('Error updating risk level:', error);
      throw error;
    }
  }

  /**
   * Recupera tutti gli utenti che compiono gli anni nel giorno corrente
   */
  async getUsersWithBirthdayToday(): Promise<User[]> {
    try {
      // Recuperiamo tutti gli utenti che hanno una data di nascita impostata
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .not('birth_date', 'is', null);

      if (error) throw error;

      const todayStr = new Date().toISOString().slice(5, 10); // Formato "MM-DD"

      // Filtriamo lato codice per semplicità (per evitare RPC complesse su Postgres)
      return (data || []).filter((user: any) => {
        return user.birth_date && user.birth_date.slice(5, 10) === todayStr;
      }) as User[];
    } catch (error) {
      logger.error('Error fetching users with birthday:', error);
      return [];
    }
  }

  /**
   * Recupera tutti gli utenti attivi con privacy accettata e abbonamento valido
   */
  async getActiveSubscribers(): Promise<User[]> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('status', 'active')
        .eq('privacy_accepted', true)
        .in('subscription_status', ['trial', 'active']);

      if (error) throw error;
      return data as User[];
    } catch (error) {
      logger.error('Error fetching active subscribers:', error);
      return [];
    }
  }

  /**
   * Recupera gli utenti con filtri avanzati per la Dashboard CEO
   */
  async getDashboardUsers(filters: { risk_level?: string; search?: string; province?: string }): Promise<User[]> {
    try {
      let query = this.supabase.from('users').select('*');

      if (filters.risk_level && filters.risk_level !== 'all') {
        query = query.eq('risk_level', filters.risk_level);
      }
      if (filters.province) {
        query = query.ilike('province', `%${filters.province}%`);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,phone_number.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });
      if (error) throw error;
      return data as User[];
    } catch (error) {
      logger.error('Error fetching dashboard users:', error);
      return [];
    }
  }

  /**
   * Calcola le statistiche aggregate per i widget della dashboard
   */
  async getGlobalStats() {
    const { count: total } = await this.supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: activeToday } = await this.supabase.from('conversations').select('user_id', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]);
    const { count: alerts } = await this.supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('handled', false);

    return {
      totalUsers: total || 0,
      activeToday: activeToday || 0,
      pendingAlerts: alerts || 0
    };
  }
}

export const userService = new UserService();
