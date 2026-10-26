const PATTERNS: RegExp[] = [
  /farla finita/, /togliermi la vita/, /togliere la vita/, /porre fine alla mia vita/,
  /mettere fine ai miei giorni/, /uccidermi/, /ammazzarmi/, /suicid/, /autolesion/,
  /non voglio (piu )?vivere/, /non ha (piu )?senso vivere/, /voglio morire/, /vorrei morire/,
  /vorrei sparire/, /meglio (se )?(morto|morta)/, /meglio se non ci fossi/,
  /farmi (del )?male/, /tagliarmi/, /buttarmi (dal|giu)/, /non ce la faccio piu/,
  /voglio (uccidere|ammazzare)/,
];

const normalize = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’`´]/g, "'");

export function detectKeywordRisk(text: string): boolean {
  const n = normalize(text || '');
  return PATTERNS.some((p) => p.test(n));
}

export const CRISIS_NOTE =
  '\n\nSe stai pensando di farti del male o sei in pericolo, chiama subito il 112. ' +
  'Puoi anche parlare con una persona al Telefono Amico: 02 2327 2327. Non sei solo/a 🙏';
