import LegalPage from '@/components/LegalPage';
import { site } from '@/lib/site';

export const metadata = { title: `Informativa sulla privacy – ${site.name}` };

export default function Privacy() {
  return (
    <LegalPage title="Informativa sulla privacy">
      <p>Ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR), ti spieghiamo come trattiamo i tuoi dati quando usi {site.name} tramite WhatsApp.</p>

      <h2>Titolare del trattamento</h2>
      <p>{site.owner}, {site.address}, P.IVA {site.vat}. Contatto privacy: {site.email}.</p>

      <h2>Quali dati trattiamo</h2>
      <ul>
        <li>Numero di telefono WhatsApp, nome e cognome, parrocchia indicata.</li>
        <li>Contenuto dei messaggi che ci scrivi, comprese preghiere e confidenze.</li>
        <li>Dati tecnici di servizio (data e ora dei messaggi, stato dell&apos;abbonamento).</li>
      </ul>
      <p><strong>Dati particolari (art. 9 GDPR).</strong> Le preghiere, la parrocchia e i messaggi possono rivelare convinzioni religiose e, talvolta, informazioni sulla salute. Li trattiamo solo con il tuo consenso esplicito, che ti chiediamo nella chat prima di proseguire.</p>

      <h2>Finalità e base giuridica</h2>
      <ul>
        <li>Fornirti il servizio di compagnia e preghiera: consenso esplicito (art. 6.1.a e 9.2.a GDPR).</li>
        <li>Sicurezza delle persone: se i messaggi indicano una possibile situazione di crisi, il sistema può segnalarlo al nostro team perché valuti se intervenire. Base: consenso e interesse vitale (art. 6.1.d).</li>
        <li>Obblighi di legge e amministrativi (es. fatturazione, se previsto): art. 6.1.c e 6.1.b.</li>
      </ul>

      <h2>Come funziona l&apos;assistente</h2>
      <p>Le risposte sono generate da un sistema di intelligenza artificiale. Non c&apos;è una decisione automatizzata con effetti giuridici su di te. Non è un sacerdote né un professionista sanitario.</p>

      <h2>Destinatari e fornitori</h2>
      <p>Usiamo fornitori che trattano i dati per nostro conto: Meta Platforms (WhatsApp Business), Supabase (database), OpenAI (generazione delle risposte), ElevenLabs (messaggi vocali, se attivi), Upstash (code di messaggi) e il provider di hosting. Alcuni hanno sede fuori dallo Spazio Economico Europeo (es. USA): i trasferimenti avvengono con garanzie adeguate, come le Clausole contrattuali standard o decisioni di adeguatezza.</p>

      <h2>Conservazione</h2>
      <p>Conserviamo i dati finché il servizio è attivo e, dopo la cancellazione dell&apos;account o la revoca del consenso, li eliminiamo entro 30 giorni, salvo obblighi di legge.</p>

      <h2>I tuoi diritti</h2>
      <p>Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, e revocare il consenso in qualsiasi momento (la revoca non pregiudica il trattamento già fatto). Scrivi a {site.email} oppure vedi la pagina <a className="text-amber-800 underline" href="/eliminazione-dati">Eliminazione dei dati</a>. Hai anche diritto di reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).</p>

      <h2>Minori</h2>
      <p>Il servizio è destinato a persone che hanno compiuto 18 anni.</p>
    </LegalPage>
  );
}
