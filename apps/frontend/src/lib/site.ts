export const site = {
  name: 'Pregare Insieme',
  domain: 'pregare-insieme.it',
  url: 'https://pregare-insieme.it',
  owner: 'Integra Srl',
  companyNumber: 'PEC integra.mi@pec.it',
  phone: '',
  dpoName: '',
  dpoEmail: 'dpo@pregare-insieme.it',
  priceMonthly: '2,90',
  trialDays: 7,
  address: 'Ripa di Porta Ticinese 39, 20143 Milano (MI)',
  vat: '12495920964',
  email: 'privacy@pregare-insieme.it',
  // Numero WhatsApp in formato internazionale senza + (es. 393331234567). Vuoto = pulsante disattivato.
  whatsappNumber: '393331234567',
  updated: 'ottobre 2026',
};

export const processor = {
  name: 'Integra Srl',
  address: 'Ripa di Porta Ticinese 39, 20143 Milano (MI)',
  vat: '12495920964',
  pec: 'integra.mi@pec.it',
};

export const waLink = () =>
  site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent('Ciao')}`
    : '';
