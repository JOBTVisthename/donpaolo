import LegalPage from '@/components/LegalPage';
import { site } from '@/lib/site';

export const metadata = { title: `Condizioni d'uso – ${site.name}` };

export default function Termini() {
  return (
    <LegalPage title="Condizioni d'uso">
      <p>Usando {site.name} accetti queste condizioni. Il servizio è offerto da {site.owner}, {site.address}, P.IVA {site.vat}.</p>

      <h2>Il servizio</h2>
      <p>{site.name} permette di scrivere su WhatsApp a un assistente basato su intelligenza artificiale, per pregare, condividere pensieri e ricevere compagnia spirituale.</p>

      <h2>Cosa non è</h2>
      <ul>
        <li>Non è un sacerdote, un direttore spirituale, né un servizio medico, psicologico o di emergenza.</li>
        <li>Le risposte possono contenere errori. Non sostituiscono il consiglio di un professionista.</li>
        <li>In caso di pericolo o emergenza chiama il 112.</li>
      </ul>

      <h2>Requisiti e uso corretto</h2>
      <ul>
        <li>Devi avere almeno 18 anni e usare un numero WhatsApp tuo.</li>
        <li>Non usare il servizio per contenuti illeciti, offensivi o per molestare altre persone.</li>
        <li>Possiamo sospendere l&apos;accesso in caso di uso scorretto.</li>
      </ul>

      <h2>Segnalazioni di sicurezza</h2>
      <p>Se i messaggi indicano un possibile rischio per te, il nostro team può essere avvisato per valutare un intervento, come spiegato nell&apos;<a className="text-amber-800 underline" href="/privacy">informativa privacy</a>.</p>

      <h2>Costi</h2>
      <p>Eventuali condizioni economiche ti verranno comunicate in modo chiaro prima di qualsiasi addebito.</p>

      <h2>Responsabilità</h2>
      <p>Il servizio è fornito &quot;così com&apos;è&quot;. Nei limiti consentiti dalla legge non rispondiamo di danni derivanti dall&apos;affidamento alle risposte dell&apos;assistente.</p>

      <h2>Modifiche e contatti</h2>
      <p>Possiamo aggiornare queste condizioni, indicando la data in cima alla pagina. Per domande: {site.email}. Legge applicabile: italiana.</p>
    </LegalPage>
  );
}
