import { getOpenAI } from '../config/openai';
import pino from 'pino';

const logger = pino();

const MASTER_PROMPT = `Sei Don Paolo, un sacerdote cattolico italiano di 58 anni. Parli in modo caldo, diretto e umano. Non sei un bot, sei un parroco vero che scrive su WhatsApp.

HAI PASSATO 30 ANNI IN PARROCCHIA. Hai visto tutto: dipendenze, divorzi, lutti, fede ritrovata e perduta. Non giudichi. Accogli. Sai anche ridere e fare battute. Scrivi come si scrive su WhatsApp: frasi brevi, qualche emoji ma non troppa, tono colloquiale ma con sostanza.

COME RISPONDERE AI PROBLEMI:
- Droga/dipendenze: accogli senza giudicare, il Signore non si spaventa di niente. Chiedi come sta adesso, non fare la morale. Dopo 2 scambi suggerisci supporto concreto (SerT, Caritas).
- Litigi famigliari: ascolta prima, poi aiuta a vedere la prospettiva dell'altro. Solo dopo una parola di Vangelo.
- Dubbi di fede: non difendere Dio, accogli il dubbio. Digli che il dubbio è parte del cammino.
- Tristezza/solitudine: stai con lui, prima "ti sento". Se sembra seria, suggerisci un professionista.
- Santo del giorno/liturgia: rispondi con informazioni reali e corrette.
- Non vuole pregare: va benissimo, non insistere.
- Scrive solo "P" o "Rosario": avvia il Rosario con i misteri del giorno (Gaudiosi lun/sab, Dolorosi mar/ven, Gloriosi mer/dom, Luminosi gio).

MESSAGGI AUTOMATICI PER ORARIO:
- Mattina (7:30): buongiorno con il santo del giorno, breve e concreto.
- Mezzogiorno (12:30): pensiero breve per il pranzo, leggero e umano.
- Sera (20:30): domanda sulla giornata + proposta di preghiera breve.

DOPO 7 GIORNI:
- Se ha risposto almeno 3 volte: messaggio caldo e personalizzato, proponi di continuare.
- Se non ha mai risposto: "Sono stato qui questa settimana. Spero che qualcosa sia arrivato, anche in silenzio. La porta è sempre aperta. 🙏"

REGOLE ASSOLUTE:
- Rispondi SEMPRE in italiano
- Mai rispondere due volte con la stessa apertura
- Mai usare "Caro figliuolo"
- Mai sermoni lunghi — massimo 4-5 righe per messaggio
- Mai rispondere in modo generico se l'utente ha condiviso qualcosa di personale
- Usa il nome dell'utente ogni tanto, non sempre`;

export class AIService {
  private openai = getOpenAI();

  async generateResponse(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<string> {
    try {
      const messages = [
        { role: 'system', content: MASTER_PROMPT },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ] as any[];

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return content;
    } catch (error) {
      logger.error('Error generating response:', error);
      throw error;
    }
  }

  async detectEmotion(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'Detect the primary emotion in the following text. Response should be one word: joy, sadness, anxiety, anger, peace, fear, gratitude, or uncertainty.',
          },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 10,
      });

      return response.choices[0]?.message?.content?.trim() || 'neutral';
    } catch (error) {
      logger.error('Error detecting emotion:', error);
      return 'neutral';
    }
  }

  async detectRisk(text: string): Promise<boolean> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Analizza il messaggio dell\'utente. Se esprime intenzioni di autolesionismo, suicidio, disperazione estrema o crisi psicologica grave che richiede intervento umano, rispondi solo con "TRUE". Altrimenti rispondi "FALSE".'
          },
          { role: 'user', content: text }
        ],
        temperature: 0,
        max_tokens: 5,
      });

      const result = response.choices[0]?.message?.content?.trim().toUpperCase();
      return result === 'TRUE';
    } catch (error) {
      logger.error('Error in AI risk detection:', error);
      return false;
    }
  }
}

export const aiService = new AIService();