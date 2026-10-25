import { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { getSupabase } from '../config/database';

const logger = pino();

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  isAdmin?: boolean;
}

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'ceo@pregare-insieme.it')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function authenticate(req: AuthRequest): Promise<boolean> {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return false;

  const { data, error } = await getSupabase().auth.getUser(token);
  if (error || !data?.user) return false;

  req.userId = data.user.id;
  const email = (data.user.email || '').toLowerCase();
  req.userEmail = email;
  req.isAdmin = ADMIN_EMAILS.includes(email);
  return true;
}

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(await authenticate(req))) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next();
  } catch (error) {
    logger.error({ err: error }, 'JWT verification failed');
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const verifyAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!(await authenticate(req))) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    logger.error({ err: error }, 'Admin verification failed');
    res.status(401).json({ error: 'Invalid token' });
  }
};
