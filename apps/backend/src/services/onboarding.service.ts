import { userService } from './user.service';

type Send = (text: string) => Promise<void>;

const YES = /^\s*(s[iì]|ok|accetto|va bene|certo|yes)\b/i;

export class OnboardingService {
  async handle(phoneNumber: string, text: string, user: any, send: Send): Promise<void> {
    const t = (text || '').trim();

    // Numero sconosciuto: creo l'utente e chiedo il nome
    if (!user) {
      const created = await userService.createUser(phoneNumber, '', '');
      await userService.updateUserProfile(created.id, { onboarding_step: 1, onboarding_completed: false } as any);
      await send('Benvenuto 🙏\nMi piacerebbe conoscerti meglio.\n\nCome preferisci essere chiamato?');
      return;
    }

    if (!t) {
      await send('Per continuare scrivimi un messaggio di testo 🙏');
      return;
    }

    const step = user.onboarding_step ?? 0;

    switch (step) {
      case 0:
        await userService.updateUserProfile(user.id, { onboarding_step: 1 } as any);
        await send('Benvenuto 🙏\nMi piacerebbe conoscerti meglio.\n\nCome preferisci essere chiamato?');
        return;

      case 1:
        if (t.length > 60) { await send('Il nome è un po\' lungo, puoi scriverlo più breve?'); return; }
        await userService.updateUserProfile(user.id, { name: t, onboarding_step: 2 } as any);
        await send(`Piacere, ${t} 🙏\nQual è il tuo cognome?`);
        return;

      case 2:
        if (t.length > 60) { await send('Puoi scrivere solo il cognome?'); return; }
        await userService.updateUserProfile(user.id, { cognome: t, onboarding_step: 3 } as any);
        await send('Grazie.\nPer accompagnarti ho bisogno del tuo consenso al trattamento dei dati personali (GDPR). Li uso solo per il servizio. Le conversazioni sono salvate e possono essere lette dal nostro team per assisterti e per la tua sicurezza. Puoi chiederne la cancellazione in ogni momento.\n\nRispondi *SÌ* per accettare.');
        return;

      case 3:
        if (!YES.test(t)) {
          await send('Senza il tuo consenso non posso continuare. Se vuoi procedere rispondi *SÌ* 🙏');
          return;
        }
        await userService.updateUserProfile(user.id, {
          privacy_accepted: true,
          privacy_accepted_at: new Date().toISOString(),
          onboarding_step: 4,
        } as any);
        await send('Grazie 🙏\nA quale parrocchia sei legato? (scrivi il nome, oppure "nessuna")');
        return;

      case 4:
        await userService.updateUserProfile(user.id, {
          parrocchia: t.slice(0, 120),
          onboarding_step: 5,
          onboarding_completed: true,
        } as any);
        await send(`Perfetto ${user.name || ''}, ora ci conosciamo 🙏\nSono qui per ascoltarti: scrivimi quando vuoi.`);
        return;

      default:
        await userService.updateUserProfile(user.id, { onboarding_completed: true } as any);
        await send('Ci siamo, scrivimi pure quando vuoi 🙏');
        return;
    }
  }
}

export const onboardingService = new OnboardingService();
