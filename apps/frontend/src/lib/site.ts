export const site = {
  name: 'Pregare Insieme',
  domain: 'pregare-insieme.it',
  url: 'https://pregare-insieme.it',
  owner: 'Verdemente Srl',
  phone: '',
  dpoName: '',
  dpoEmail: 'dpo@pregare-insieme.it',
  priceMonthly: '2,90',
  trialDays: 7,
  address: 'Via Filippo Argelati 10, 20143 Milano (MI)',
  vat: '10226680964',
  email: 'privacy@pregare-insieme.it',
  // Numero WhatsApp in formato internazionale senza + (es. 393331234567). Vuoto = pulsante disattivato.
  whatsappNumber: '',
  updated: 'ottobre 2026',
};

export const waLink = () =>
  site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Ciao')}`
    : '';
