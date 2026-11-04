import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import pino from 'pino';
import { verifyAdmin } from '../middleware/auth';
import { getSupabase } from '../config/database';
import { getOpenAI } from '../config/openai';

const router = Router();
const logger = pino();
const BUCKET = 'social';
const fail = (res: Response, err: unknown, what: string) => {
  logger.error({ err }, what);
  res.status(500).json({ error: 'Internal server error' });
};

const RULES = `Scrivi post social in italiano per "Pregare Insieme", un servizio di preghiera e ascolto su WhatsApp basato su intelligenza artificiale.
Regole: sei un'IA e non una persona né un sacerdote, quindi non scrivere in prima persona come parroco e non inventare esperienze personali.
Tono sereno e accogliente. Se citi il Vangelo, usa al massimo una breve frase con il riferimento, senza testi lunghi. Niente promesse di guarigioni, miracoli o risultati.
Se l'immagine mostra volti o luoghi, descrivi solo ciò che si vede. Chiudi con un invito a scriverci su WhatsApp (link in bio su Instagram).
Rispondi SOLO con un JSON: {"instagram":"testo con 3-5 hashtag finali","facebook":"testo un po' più lungo, senza hashtag"}.`;

router.get('/posts', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('social_posts').select('*')
      .order('scheduled_for', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false }).limit(300);
    if (error) throw error;
    res.json({ posts: data });
  } catch (e) { fail(res, e, 'social list'); }
});

router.post('/upload', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { dataBase64 } = req.body || {};
    if (typeof dataBase64 !== 'string') return res.status(400).json({ error: 'Immagine mancante' });
    const buf = Buffer.from(dataBase64, 'base64');
    if (!buf.length || buf.length > 3 * 1024 * 1024) return res.status(400).json({ error: 'Immagine non valida o troppo grande' });
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.jpg`;
    const { error } = await getSupabase().storage.from(BUCKET).upload(path, buf, { contentType: 'image/jpeg' });
    if (error) throw error;
    const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(path);
    res.json({ url: data.publicUrl });
  } catch (e) { fail(res, e, 'social upload'); }
});

router.post('/generate', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { imageUrl, note, scheduledFor } = req.body || {};
    if (typeof imageUrl !== 'string' || !imageUrl.startsWith('https://')) return res.status(400).json({ error: 'imageUrl non valido' });
    const when = scheduledFor ? new Date(scheduledFor) : new Date();
    const day = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', dateStyle: 'full' }).format(when);
    const userText = `Data di pubblicazione: ${day}.\nNota dell'amministratore: ${String(note || '').slice(0, 500) || 'nessuna'}.\nScrivi i due testi per questa immagine.`;
    const client = (await getOpenAI()) as any;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const call = (withImage: boolean) =>
      client.chat.completions.create({
        model, temperature: 0.8, response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: RULES },
          { role: 'user', content: withImage ? [{ type: 'text', text: userText }, { type: 'image_url', image_url: { url: imageUrl } }] : userText },
        ],
      });
    let r: any;
    try { r = await call(true); } catch { r = await call(false); }
    const j = JSON.parse(r.choices[0].message.content || '{}');
    const rows = (['instagram', 'facebook'] as const)
      .filter((p) => typeof j[p] === 'string' && j[p].trim())
      .map((p) => ({ platform: p, image_url: imageUrl, caption: j[p].trim(), status: 'draft', scheduled_for: scheduledFor || null }));
    if (!rows.length) return res.status(502).json({ error: 'Nessun testo generato' });
    const { data, error } = await getSupabase().from('social_posts').insert(rows).select();
    if (error) throw error;
    res.json({ posts: data });
  } catch (e) { fail(res, e, 'social generate'); }
});

router.patch('/posts/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { caption, scheduled_for, status } = req.body || {};
    const upd: Record<string, unknown> = {};
    if (typeof caption === 'string') upd.caption = caption.slice(0, 2200);
    if (scheduled_for !== undefined) upd.scheduled_for = scheduled_for || null;
    if (status === 'draft' || status === 'approved') upd.status = status;
    if (!Object.keys(upd).length) return res.status(400).json({ error: 'Nulla da aggiornare' });
    const { data, error } = await getSupabase().from('social_posts').update(upd).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ post: data });
  } catch (e) { fail(res, e, 'social update'); }
});

router.delete('/posts/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { error } = await getSupabase().from('social_posts').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) { fail(res, e, 'social delete'); }
});

export default router;
