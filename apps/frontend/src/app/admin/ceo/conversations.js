// apps/backend/src/routes/conversations.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET /api/conversations - Tutte le conversazioni con filtri
router.get('/', async (req, res) => {
  try {
    const { province, parrocchia, risk, search } = req.query;
    
    let query = supabase
      .from('users')
      .select('*, conversations(user_message, ai_response, created_at, emotion_detected)');

    if (province && province !== 'all') query = query.eq('province', province);
    if (parrocchia && parrocchia !== 'all') query = query.eq('parrocchia', parrocchia);
    if (risk && risk !== 'all') query = query.eq('risk_level', risk);
    if (search) query = query.or(`name.ilike.%${search}%,phone_number.ilike.%${search}%`);

    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/:userId - Storico completo di un utente
router.get('/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id - Per segnare come gestito o aggiornare dati
router.patch('/users/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('users').update(req.body).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;