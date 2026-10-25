import LegalPage from '@/components/LegalPage';
import { site } from '@/lib/site';

export const metadata = { title: `Eliminazione dei dati – ${site.name}` };

export default function Eliminazione() {
  return (
    <LegalPage title="Eliminazione dei dati">
      <p>Puoi chiedere in ogni momento la cancellazione dei tuoi dati e dell&apos;account su {site.name}.</p>

      <h2>Come fare</h2>
      <ul>
        <li>Scrivi a <strong>{site.email}</strong> dal tuo indirizzo email, indicando il numero WhatsApp con cui sei registrato.</li>
        <li>Nell&apos;oggetto scrivi: &quot;Richiesta di cancellazione dati&quot;.</li>
      </ul>

      <h2>Cosa succede</h2>
      <ul>
        <li>Verifichiamo che la richiesta arrivi da te.</li>
        <li>Entro 30 giorni eliminiamo profilo, conversazioni e preghiere dai nostri sistemi.</li>
        <li>Ti confermiamo l&apos;avvenuta cancellazione.</li>
        <li>Alcuni dati possono restare solo se la legge lo impone (es. fatturazione), per il tempo necessario.</li>
      </ul>

      <p>I messaggi presenti sul tuo telefono restano sul tuo telefono: puoi cancellare la chat da WhatsApp in qualsiasi momento.</p>
    </LegalPage>
  );
}
