-- Inizializzazione Database Don Paolo

-- Estensione per UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabella Utenti
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  province VARCHAR(100),
  parrocchia VARCHAR(200),
  parroco VARCHAR(100),
  birth_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  subscription_status VARCHAR(20) DEFAULT 'trial',
  stripe_customer_id VARCHAR(100),
  subscription_id VARCHAR(100),
  risk_level VARCHAR(20) DEFAULT 'none',
  onboarding_step INT DEFAULT 0,
  privacy_accepted BOOLEAN DEFAULT false,
  privacy_accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tabella Conversazioni
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_message TEXT,
  ai_response TEXT,
  emotion_detected VARCHAR(50),
  has_risk_indicator BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Tabella Messaggi Automatici (Log)
CREATE TABLE IF NOT EXISTS automated_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(50),
  content TEXT,
  sent_at TIMESTAMP DEFAULT now(),
  delivered BOOLEAN DEFAULT false,
  error TEXT
);

-- Tabella Broadcast
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

-- Tabella Configurazione API
CREATE TABLE IF NOT EXISTS api_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  label VARCHAR(200),
  category VARCHAR(50),
  is_secret BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT now()
);

-- Inserimento Chiavi di Default
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

-- Indici
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_risk ON users(risk_level);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);