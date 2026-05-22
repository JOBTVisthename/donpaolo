-- apps/backend/src/db/migrations/002_add_fields.sql
-- Aggiornamento schema per Don Paolo

-- Data di nascita utenti
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Status abbonamento
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'trial';
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMP;

-- Tabella messaggi automatici (log completo)
CREATE TABLE IF NOT EXISTS automated_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(50),
  content TEXT,
  sent_at TIMESTAMP DEFAULT now(),
  delivered BOOLEAN DEFAULT false,
  error TEXT
);

-- Tabella broadcast massivi
CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR(100),
  message_type VARCHAR(20),
  content TEXT,
  audio_url TEXT,
  target_filter JSONB,
  total_recipients INT DEFAULT 0,
  delivered INT DEFAULT 0,
  failed INT DEFAULT 0,
  privacy_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabella configurazione API (salvata su DB)
CREATE TABLE IF NOT EXISTS api_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  label VARCHAR(200),
  category VARCHAR(50),
  is_secret BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT now()
);

-- Inserisci chiavi vuote di default
INSERT INTO api_config (key, label, category, is_secret) VALUES
  ('OPENAI_API_KEY', 'OpenAI API Key', 'AI', true),
  ('ELEVENLABS_API_KEY', 'ElevenLabs API Key', 'Audio', true),
  ('ELEVENLABS_VOICE_ID', 'ElevenLabs Voice ID (Don Paolo)', 'Audio', false),
  ('WHATSAPP_PHONE_NUMBER_ID', 'WhatsApp Phone Number ID', 'WhatsApp', false),
  ('WHATSAPP_BUSINESS_ACCOUNT_ID', 'WhatsApp Business Account ID', 'WhatsApp', false),
  ('WHATSAPP_ACCESS_TOKEN', 'WhatsApp Access Token', 'WhatsApp', true),
  ('WHATSAPP_WEBHOOK_VERIFY_TOKEN', 'WhatsApp Webhook Verify Token', 'WhatsApp', true),
  ('STRIPE_SECRET_KEY', 'Stripe Secret Key', 'Pagamenti', true),
  ('STRIPE_PRICE_ID', 'Stripe Price ID (€2.90/mese)', 'Pagamenti', false),
  ('STRIPE_WEBHOOK_SECRET', 'Stripe Webhook Secret', 'Pagamenti', true)
ON CONFLICT (key) DO NOTHING;

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_users_birth_date ON users(birth_date);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_automated_messages_user_id ON automated_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_broadcasts_created_at ON broadcasts(created_at);