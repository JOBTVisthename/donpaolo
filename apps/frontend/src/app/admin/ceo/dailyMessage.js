// apps/backend/src/jobs/dailyMessage.js
const { createClient } = require('@supabase/supabase-js');
const saintsData = require('../data/saints.json');
// const whatsapp = require('../whatsapp/client'); 

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getActiveUsers() {
  const { data } = await supabase.from('users').select('*').eq('privacy_accepted', true).eq('status', 'active');
  return data || [];
}

async function sendMorning() {
  console.log('[DonPaolo] Invio messaggio del mattino...');
  const users = await getActiveUsers();
  const today = new Date();
  const dateKey = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  const saint = saintsData.find(s => s.day === dateKey) || saintsData[0];

  for (const user of users) {
    const text = `🌅 Buongiorno ${user.name}!\n\n✝️ Santo di oggi: ${saint.name}\n${saint.life}\n\n📖 Vangelo del giorno:\n${saint.gospel}\n\n💬 Detto cristiano:\n"${saint.quote}"\n\n🙏 Riflessione:\n${saint.reflection}\n\nDon Paolo è qui se vuoi parlare 🙏`;
    // await whatsapp.sendMessage(user.phone_number, text);
    await logMessage(user.id, 'morning_devotional', text);
  }
}

async function sendAngelus() {
  console.log('[DonPaolo] Invio Angelus...');
  const users = await getActiveUsers();
  for (const user of users) {
    const text = `🙏 L'Angelus del Signore\n\nL'Angelo del Signore portò l'annuncio a Maria\ned Ella concepì per opera dello Spirito Santo.\nAve Maria...\nBuona giornata ${user.name} 🕊️`;
    // await whatsapp.sendMessage(user.phone_number, text);
    await logMessage(user.id, 'angelus', text);
  }
}

async function sendNight() {
  console.log('[DonPaolo] Invio messaggio della sera...');
  const users = await getActiveUsers();
  for (const user of users) {
    const text = `🌙 Buonasera ${user.name},\n\nPrima di concludere questa giornata, fermati un momento.\n\n"Nelle tue mani, Signore, affido il mio spirito." (Sal 31,6)\n\nBuona notte e buon riposo 🙏`;
    // await whatsapp.sendMessage(user.phone_number, text);
    await logMessage(user.id, 'night_reflection', text);
  }
}

async function logMessage(userId, type, content) {
  await supabase.from('automated_messages').insert({
    user_id: userId,
    message_type: type,
    content: content,
    delivered: true
  });
}

module.exports = { sendMorning, sendAngelus, sendNight };