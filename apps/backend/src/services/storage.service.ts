import { getSupabase } from '../config/database';
import pino from 'pino';

const logger = pino();

export class StorageService {
  private supabase = getSupabase();
  private bucketName = 'meditations';

  async uploadAudio(fileName: string, buffer: Buffer): Promise<string> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, buffer, { contentType: 'audio/mpeg', upsert: true });

      if (error) throw error;

      const { data } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      logger.error('Error uploading audio to Supabase Storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();