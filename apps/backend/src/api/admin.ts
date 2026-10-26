import { Router, Request, Response } from 'express';
import pino from 'pino';
import { verifyAdmin } from '../middleware/auth';
import { getSupabase } from '../config/database';
import { userService } from '../services/user.service';

const router = Router();
const logger = pino();
const fail = (res: Response, err: unknown, what: string) => {
  logger.error({ err }, what);
  res.status(500).json({ error: 'Internal server error' });
};

router.get('/dashboard', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const s = await userService.getGlobalStats();
    res.json({ ...s, activeUsers: s.totalUsers, alertsPending: s.pendingAlerts });
  } catch (e) { fail(res, e, 'dashboard'); }
});

router.get('/users', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userService.getDashboardUsers({
      risk_level: req.query.risk as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.json({ users });
  } catch (e) { fail(res, e, 'users'); }
});

router.get('/users/:id/conversations', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await getSupabase()
      .from('conversations')
      .select('id,user_message,ai_response,emotion_detected,has_risk_indicator,created_at')
      .eq('user_id', req.params.id)
      .order('created_at', { ascending: true })
      .limit(500);
    if (error) throw error;
    res.json({ conversations: data });
  } catch (e) { fail(res, e, 'conversations'); }
});

router.get('/alerts', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const onlyOpen = req.query.all !== '1';
    let q = getSupabase().from('alerts').select('*, users(name,cognome,phone_number)').order('created_at', { ascending: false }).limit(200);
    if (onlyOpen) q = q.eq('handled', false);
    const { data, error } = await q;
    if (error) throw error;
    res.json({ alerts: data });
  } catch (e) { fail(res, e, 'alerts'); }
});

router.post('/alerts/:id/handle', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { error } = await getSupabase().from('alerts').update({ handled: true }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) { fail(res, e, 'alert handle'); }
});

export default router;
