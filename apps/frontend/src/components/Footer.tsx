import Link from 'next/link';
import { site, processor } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-10 text-sm text-stone-600">
      <div className="mx-auto max-w-5xl space-y-3 px-6 text-center">
        <p className="font-medium text-stone-800">{site.name} · {site.domain}</p>
        <p>
          Titolare del trattamento: {site.owner} · {site.address} · P.IVA {site.vat}
          {site.companyNumber ? ` · ${site.companyNumber}` : ''}
        </p>
        <p>Canale WhatsApp fornito da {processor.name} · {processor.address} · P.IVA {processor.vat}</p>
        <p>
          Contatti: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>
          {site.phone ? ` · Tel. ${site.phone}` : ''}
          {' · '}DPO{site.dpoName ? ` ${site.dpoName}` : ''}: <a className="underline" href={`mailto:${site.dpoEmail}`}>{site.dpoEmail}</a>
        </p>
        <p className="space-x-4">
          <Link className="underline" href="/privacy">Informativa privacy</Link>
          <Link className="underline" href="/cookie">Cookie</Link>
          <Link className="underline" href="/termini">Condizioni d&apos;uso</Link>
          <Link className="underline" href="/eliminazione-dati">Cancella i tuoi dati</Link>
        </p>
        <p className="text-xs text-stone-400">
          Servizio di compagnia e preghiera basato su intelligenza artificiale. Non sostituisce un sacerdote né un aiuto medico o psicologico. Emergenze: 112.
          {' · '}<Link href="/admin/login">Area riservata</Link>
        </p>
      </div>
    </footer>
  );
}
