export const site = {
  name: 'Pregare Insieme',
  domain: 'pregare-insieme.it',
  url: 'https://pregare-insieme.it',
  owner: 'Integra Srl',
  address: 'VIA ... , CAP CITTA (PR)',
  vat: 'IT01234567890',
  email: 'privacy@pregare-insieme.it',
  // Numero WhatsApp in formato internazionale senza + (es. 393331234567). Vuoto = pulsante disattivato.
  whatsappNumber: '',
  updated: 'ottobre 2026',
};

export const waLink = () =>
  site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Ciao')}`
    : '';
