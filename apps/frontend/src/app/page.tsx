import Link from 'next/link';
import { site, waLink } from '@/lib/site';

export const metadata = {
  title: `${site.name} – La forza della preghiera, insieme`,
  description: `Preghiera, ascolto e fede cristiana su WhatsApp. ${site.trialDays} giorni gratis, poi ${site.priceMonthly} € al mese.`,
};

const GOLD = '#d9a62e';
const OLIVE = '#6b7a2f';
const BROWN = '#2b1a10';
const HERO = 'https://smotaogceaftkcympopm.supabase.co/storage/v1/object/public/public-assets/hero.jpg';

const steps = [
  { n: '1', t: 'Scrivici su WhatsApp', d: 'Un semplice "Ciao" al nostro numero. Nessuna app da installare.' },
  { n: '2', t: 'Registrati in un minuto', d: 'Ti chiediamo nome, parrocchia e il tuo consenso. Tutto dentro la chat.' },
  { n: '3', t: 'Prega e parla', d: 'Condividi una preghiera, un pensiero, una fatica: ti rispondiamo con rispetto e ascolto.' },
];
const features = [
  { i: '🕯️', t: 'Ascolto', d: 'Uno spazio sereno dove raccontare ciò che porti nel cuore, a qualunque ora.' },
  { i: '📿', t: 'Preghiera guidata', d: 'Rosario, Lodi, Vespri e momenti di preghiera accompagnati passo dopo passo.' },
  { i: '📖', t: 'Parola del giorno', d: 'Una riflessione sul Vangelo per iniziare o chiudere la giornata.' },
  { i: '🤝', t: 'Comunità', d: 'Affida le tue intenzioni di preghiera: nessuno prega da solo.' },
];
const faqs = [
  { q: 'Chi risponde?', a: 'Un assistente basato su intelligenza artificiale, ispirato alla tradizione cristiana. Non è un sacerdote e non sostituisce il confronto con una guida spirituale, né un aiuto medico o psicologico.' },
  { q: 'Come funzionano i 7 giorni gratis?', a: `Usi il servizio gratuitamente per ${site.trialDays} giorni. Prima della fine ti avvisiamo; solo dopo, se vuoi continuare, costa ${site.priceMonthly} € al mese (IVA inclusa).` },
  { q: 'Posso disdire?', a: 'Sì, quando vuoi e senza penali, scrivendoci in chat o via email. Disdicendo durante la prova non paghi nulla.' },
  { q: 'I miei dati sono al sicuro?', a: 'Preghiere e parrocchia sono dati sensibili: li trattiamo solo con il tuo consenso esplicito e puoi chiederne la cancellazione in ogni momento.' },
  { q: 'E se sto davvero male?', a: 'In caso di emergenza chiama il 112. Se rileviamo segnali di difficoltà, il nostro team può essere avvisato per valutare un intervento.' },
];

function Cta({ big = false }: { big?: boolean }) {
  const link = waLink();
  const cls = big ? 'px-10 py-4 text-lg' : 'px-8 py-3';
  return link ? (
    <a href={link} style={{ backgroundColor: OLIVE }} className={`inline-block rounded-full font-medium text-white shadow-lg transition hover:opacity-90 ${cls}`}>Inizia gratis su WhatsApp</a>
  ) : (
    <span className={`inline-block rounded-full bg-stone-300 font-medium text-stone-600 ${cls}`}>Presto disponibile</span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen text-stone-800" style={{ backgroundColor: '#fffaf0' }}>
      <section className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="Mani in preghiera al tramonto davanti a una piccola chiesa di campagna" className="h-[70vh] min-h-[420px] w-full object-cover object-center" />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(to bottom, transparent, #fffaf0)' }} />
      </section>

      <section className="relative z-10 -mt-24 px-6 pb-16 text-center">
        <h1 className="mx-auto max-w-2xl font-serif text-3xl italic leading-tight sm:text-5xl" style={{ color: BROWN }}>La forza della preghiera, insieme</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-stone-700">Scrivi su WhatsApp, registrati in un minuto e prega con qualcuno che ti ascolta. Come i discepoli di Emmaus, camminiamo insieme a te.</p>
        <div className="mt-8"><Cta big /></div>
        <p className="mt-4 text-sm text-stone-600">{site.trialDays} giorni gratis · poi {site.priceMonthly} € al mese · disdici quando vuoi</p>
        <blockquote className="mx-auto mt-10 max-w-md border-l-4 pl-4 text-left font-serif italic" style={{ borderColor: GOLD, color: BROWN }}>
          «Dove sono due o tre riuniti nel mio nome, io sono in mezzo a loro.»
          <footer className="mt-1 text-sm not-italic text-stone-500">Matteo 18,20</footer>
        </blockquote>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.t} className="rounded-2xl border bg-white/80 p-6 shadow-sm" style={{ borderColor: '#f0e2b8' }}>
            <div className="text-3xl">{f.i}</div>
            <h3 className="mt-3 font-serif text-lg italic" style={{ color: BROWN }}>{f.t}</h3>
            <p className="mt-2 text-stone-600">{f.d}</p>
          </div>
        ))}
      </section>

      <section id="come-funziona" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-8 text-center font-serif text-3xl italic" style={{ color: BROWN }}>Come funziona</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border bg-white p-6" style={{ borderColor: '#e7e0cc' }}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full font-serif text-white" style={{ backgroundColor: GOLD }}>{s.n}</div>
              <h3 className="font-serif text-lg italic" style={{ color: BROWN }}>{s.t}</h3>
              <p className="mt-2 text-stone-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="prezzo" className="mx-auto max-w-md px-6 pb-16">
        <div className="rounded-3xl border-2 bg-white p-8 text-center shadow-md" style={{ borderColor: GOLD }}>
          <p className="text-sm uppercase tracking-wide" style={{ color: OLIVE }}>{site.trialDays} giorni di prova gratuita</p>
          <p className="mt-3 font-serif text-5xl" style={{ color: BROWN }}>{site.priceMonthly} €<span className="text-lg text-stone-500"> / mese</span></p>
          <p className="mt-1 text-sm text-stone-500">IVA inclusa · rinnovo mensile</p>
          <ul className="mt-6 space-y-2 text-left text-stone-700">
            <li>✓ Ascolto e preghiera quando vuoi</li>
            <li>✓ Rosario e preghiere guidate</li>
            <li>✓ Parola del giorno</li>
            <li>✓ Disdici in ogni momento, senza penali</li>
          </ul>
          <div className="mt-6"><Cta /></div>
          <p className="mt-4 text-xs text-stone-500">Nessun addebito durante i primi {site.trialDays} giorni. Dopo la prova il servizio si rinnova a {site.priceMonthly} € al mese finché non disdici.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-6 text-center font-serif text-3xl italic" style={{ color: BROWN }}>Domande frequenti</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-xl border bg-white p-4" style={{ borderColor: '#e7e0cc' }}>
              <summary className="cursor-pointer font-medium" style={{ color: BROWN }}>{f.q}</summary>
              <p className="mt-2 text-stone-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contatti" className="py-14" style={{ backgroundColor: '#f6e9c6' }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg italic" style={{ color: BROWN }}>Contatti</h3>
            <p className="mt-2 text-stone-700">Email: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
            {site.phone && <p className="text-stone-700">Telefono: {site.phone}</p>}
            {site.whatsappNumber && <p className="text-stone-700">WhatsApp: +{site.whatsappNumber}</p>}
          </div>
          <div>
            <h3 className="font-serif text-lg italic" style={{ color: BROWN }}>Protezione dei dati</h3>
            <p className="mt-2 text-stone-700">Titolare: {site.owner}</p>
            <p className="text-stone-700">DPO{site.dpoName ? `: ${site.dpoName}` : ''}: <a className="underline" href={`mailto:${site.dpoEmail}`}>{site.dpoEmail}</a></p>
            <p className="text-stone-700"><Link className="underline" href="/eliminazione-dati">Cancella i tuoi dati</Link></p>
          </div>
          <div>
            <h3 className="font-serif text-lg italic" style={{ color: BROWN }}>Documenti</h3>
            <ul className="mt-2 space-y-1 text-stone-700">
              <li><Link className="underline" href="/privacy">Informativa privacy</Link></li>
              <li><Link className="underline" href="/cookie">Cookie</Link></li>
              <li><Link className="underline" href="/termini">Condizioni d&apos;uso</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-stone-500">
        <p>{site.name} · un servizio di {site.owner} · {site.address} · P.IVA {site.vat}</p>
        <p className="mt-2"><Link href="/admin/login">Area riservata</Link></p>
      </footer>
    </main>
  );
}
