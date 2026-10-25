export const site = {
  name: 'Pregare Insieme',
  domain: 'pregare-insieme.it',
  url: 'https://pregare-insieme.it',
  owner: 'Integra Srl',
  phone: '',
  dpoName: '',
  dpoEmail: 'dpo@pregare-insieme.it',
  priceMonthly: '2,90',
  trialDays: 7,
  address: 'INDIRIZZO REALE',
  vat: 'PIVA REALE',
  email: 'privacy@pregare-insieme.it',
  // Numero WhatsApp in formato internazionale senza + (es. 393331234567). Vuoto = pulsante disattivato.
  whatsappNumber: '',
  updated: 'ottobre 2026',
};

export const waLink = () =>
  site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Ciao')}`
    : '';
