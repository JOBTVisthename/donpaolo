# Don Paolo — Assistente Spirituale Cristiano AI

Don Paolo è un assistente spirituale basato su AI che accompagna i fedeli su WhatsApp con messaggi quotidiani, preghiere guidate e ascolto empatico.

## Funzionalità Principali
- **Onboarding Guidato:** Raccolta dati sensibile e rispettosa della privacy.
- **Messaggi Quotidiani:** Santo del giorno, Vangelo e riflessioni (07:30, 12:00, 20:30).
- **Dashboard CEO:** Monitoraggio degli utenti per provincia e parrocchia con rilevamento rischio emotivo.
- **Broadcast:** Invio di messaggi e audio massivi alla comunità.
- **Configurazione Dinamica:** Gestione chiavi API (OpenAI, ElevenLabs, WhatsApp, Stripe) direttamente da interfaccia.

## Setup Rapido
1. Clona il repository.
2. Configura il file `.env` con le credenziali Supabase.
3. Esegui le migrazioni SQL fornite nella cartella `db/migrations`.
4. Avvia con `docker-compose up`.
5. Accedi a `/admin/settings` per inserire le chiavi API e clicca su **Lancia Don Paolo in Live**.

## Tecnologia
- **Backend:** Node.js, Express, node-cron.
- **Frontend:** Next.js 14, Tailwind CSS, Recharts.
- **Database:** Supabase (PostgreSQL).
- **AI & Voice:** OpenAI GPT-4o, ElevenLabs.
- **WhatsApp:** Meta WhatsApp Business API.

---
Creato per supportare la missione pastorale digitale.