import LegalPage from '@/components/LegalPage';
import { site } from '@/lib/site';

export const metadata = { title: `Cookie – ${site.name}` };

export default function Cookie() {
  return (
    <LegalPage title="Informativa sui cookie">
      <p>Questo sito ({site.domain}) usa solo cookie e strumenti <strong>tecnici</strong>, necessari al suo funzionamento. Non usiamo cookie di profilazione né di marketing, e non traccia i visitatori con strumenti di terze parti.</p>

      <h2>Cosa significa</h2>
      <ul>
        <li>Non serve il tuo consenso per i cookie tecnici (art. 122 Codice Privacy).</li>
        <li>Nessun dato di navigazione viene ceduto a terzi a fini pubblicitari.</li>
        <li>L&apos;area riservata agli amministratori usa un cookie di sessione per mantenere l&apos;accesso.</li>
      </ul>

      <h2>Se cambieranno le cose</h2>
      <p>Se in futuro useremo strumenti di analisi o pubblicità, aggiorneremo questa pagina e ti chiederemo il consenso con un apposito banner prima di attivarli.</p>

      <h2>Contatti</h2>
      <p>Per qualsiasi domanda scrivi a {site.email}. Responsabile della protezione dei dati: {site.dpoEmail}. Vedi anche l&apos;<a className="text-amber-800 underline" href="/privacy">informativa privacy</a>.</p>
    </LegalPage>
  );
}
