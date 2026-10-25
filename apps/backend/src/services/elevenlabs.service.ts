import axios from 'axios';
import pino from 'pino';

const logger = pino();

export class ElevenLabsService {
  private apiKey = process.env.ELEVENLABS_API_KEY;
  private voiceId = process.env.ELEVENLABS_VOICE_ID; // ID della voce "Don Paolo"
  private apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech';

  async generateSpeech(text: string): Promise<Buffer> {
    try {
      if (!this.apiKey || !this.voiceId) {
        throw new Error('ElevenLabs API Key or Voice ID missing');
      }

      const response = await axios.post(
        `${this.apiUrl}/${this.voiceId}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: { 'xi-api-key': this.apiKey, 'Content-Type': 'application/json' },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      logger.error({ err: error }, 'Error generating speech with ElevenLabs:');
      throw error;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();