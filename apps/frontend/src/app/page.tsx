import Image from 'next/image';
import Link from 'next/link';
import { Fraunces, Figtree } from 'next/font/google';
import { site, waLink } from '@/lib/site';
import Footer from '@/components/Footer';
import BackgroundMusic from '@/components/BackgroundMusic';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', style: ['normal', 'italic'], display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  title: `${site.name} – La forza della preghiera, insieme`,
  description: `Preghiera, ascolto e fede cristiana su WhatsApp. ${site.trialDays} giorni gratis, poi ${site.priceMonthly} € al mese.`,
};

const GOLD = '#d9a62e';
const OLIVE = '#6b7a2f';
const BROWN = '#2b1a10';
const NIGHT = '#1a0f08';
const CREAM = '#fffaf0';
const HERO = 'https://smotaogceaftkcympopm.supabase.co/storage/v1/object/public/public-assets/hero.jpg';

const D = 'font-[family-name:var(--font-display)]';

const steps = [
  { t: 'Scrivici su WhatsApp', d: 'Un semplice "Ciao" al nostro numero. Nessuna app da installare.' },
  { t: 'Registrati in un minuto', d: 'Ti chiediamo nome, parrocchia e il tuo consenso. Tutto dentro la chat.' },
  { t: 'Prega e parla', d: 'Condividi una preghiera, un pensiero, una fatica: ti rispondiamo con rispetto e ascolto.' },
];
const features = [
  { t: 'Ascolto', d: 'Uno spazio sereno dove raccontare ciò che porti nel cuore, a qualunque ora.' },
  { t: 'Preghiera guidata', d: 'Rosario, Lodi, Vespri e momenti di preghiera accompagnati passo dopo passo.' },
  { t: 'Parola del giorno', d: 'Una riflessione sul Vangelo per iniziare o chiudere la giornata.' },
  { t: 'Comunità', d: 'Affida le tue intenzioni di preghiera: nessuno prega da solo.' },
];
const faqs = [
  { q: 'Chi risponde?', a: 'Un assistente basato su intelligenza artificiale, ispirato alla tradizione cristiana. Non è un sacerdote e non sostituisce il confronto con una guida spirituale, né un aiuto medico o psicologico.' },
  { q: `Come funzionano i ${site.trialDays} giorni gratis?`, a: `Usi il servizio gratuitamente per ${site.trialDays} giorni. Prima della fine ti avvisiamo; solo dopo, se vuoi continuare, costa ${site.priceMonthly} € al mese (IVA inclusa).` },
  { q: 'Posso disdire?', a: 'Sì, quando vuoi e senza penali, scrivendoci in chat o via email. Disdicendo durante la prova non paghi nulla.' },
  { q: 'I miei dati sono al sicuro?', a: 'Preghiere e parrocchia sono dati sensibili: li trattiamo solo con il tuo consenso esplicito e puoi chiederne la cancellazione in ogni momento.' },
  { q: 'E se sto davvero male?', a: 'In caso di emergenza chiama il 112. Se rileviamo segnali di difficoltà, il nostro team può essere avvisato per valutare un intervento.' },
];

function Cta({ big = false }: { big?: boolean }) {
  const link = waLink();
  const size = big ? 'px-9 py-4 text-lg' : 'px-8 py-3.5';
  return link ? (
    <a
      href={link}
      style={{ backgroundColor: GOLD, color: BROWN }}
      className={`inline-block rounded-full font-semibold shadow-lg transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${size}`}
    >
      Inizia gratis su WhatsApp
    </a>
  ) : (
    <span className={`inline-block rounded-full bg-stone-300 font-medium text-stone-600 ${size}`}>Presto disponibile</span>
  );
}

export default function Home() {
  const link = waLink();
  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen font-[family-name:var(--font-body)] text-stone-800`}
      style={{ backgroundColor: CREAM }}
    >
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) {
          .rise { animation: rise .9s cubic-bezier(.2,.7,.2,1) both; }
          .rise-2 { animation-delay: .15s; }
          .rise-3 { animation-delay: .3s; }
        }
      `}</style>

      <section className="relative" style={{ backgroundColor: CREAM }}>
        <Image
          src={HERO}
          alt="Mani in preghiera al tramonto davanti a una piccola chiesa di campagna"
          width={0}
          height={0}
          priority
          quality={85}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-40" style={{ background: 'linear-gradient(to bottom, transparent, ' + CREAM + ')' }} />
      </section>

      <section className="relative z-10 px-6 pb-4 pt-2 text-center">
        <h1 className="sr-only">La forza della preghiera, insieme</h1>
        <p className="rise mx-auto max-w-xl text-xl leading-relaxed text-stone-700">
          Scrivi su WhatsApp, registrati in un minuto e prega con qualcuno che ti ascolta. Come i discepoli di Emmaus, camminiamo insieme a te.
        </p>
        <div className="rise rise-2 mt-8"><Cta big /></div>
        <p className="rise rise-3 mt-4 text-sm text-stone-600">{site.trialDays} giorni gratis, poi {site.priceMonthly} € al mese. Disdici quando vuoi.</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <blockquote className={`${D} text-3xl font-light italic leading-snug sm:text-4xl`} style={{ color: BROWN }}>
          «Dove sono due o tre riuniti nel mio nome, io sono in mezzo a loro.»
          <footer className="mt-4 font-[family-name:var(--font-body)] text-sm not-italic text-stone-500">Matteo 18,20</footer>
        </blockquote>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.t} className="border-t pt-5" style={{ borderColor: GOLD }}>
              <h3 className={`${D} text-2xl`} style={{ color: BROWN }}>{f.t}</h3>
              <p className="mt-2 max-w-md text-lg leading-relaxed text-stone-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="come-funziona" className="px-6 pb-20 md:pb-28" style={{ scrollMarginTop: '1rem' }}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${D} text-4xl font-light`} style={{ color: BROWN }}>Come funziona</h2>
          <ol className="relative mt-10 space-y-10 pl-14">
            <span aria-hidden className="absolute bottom-2 left-[19px] top-2 w-px" style={{ backgroundColor: GOLD, opacity: 0.6 }} />
            {steps.map((s, i) => (
              <li key={s.t} className="relative">
                <span
                  className={`${D} absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full text-lg`}
                  style={{ backgroundColor: i === steps.length - 1 ? OLIVE : GOLD, color: i === steps.length - 1 ? '#fff' : BROWN }}
                >
                  {i + 1}
                </span>
                <h3 className={`${D} text-2xl`} style={{ color: BROWN }}>{s.t}</h3>
                <p className="mt-1 max-w-lg text-lg leading-relaxed text-stone-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="prezzo" className="px-6 py-20 md:py-28" style={{ backgroundColor: BROWN }}>
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className={`${D} text-4xl font-light leading-tight text-white sm:text-5xl`}>
              Provalo per {site.trialDays} giorni, senza pagare nulla
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
              Nessun addebito durante la prova. Dopo, il servizio si rinnova ogni mese finché non disdici.
            </p>
          </div>
          <div className="rounded-3xl p-8 sm:p-10" style={{ backgroundColor: CREAM }}>
            <p className={`${D} text-6xl`} style={{ color: BROWN }}>
              {site.priceMonthly} €<span className="font-[family-name:var(--font-body)] text-lg text-stone-500"> al mese</span>
            </p>
            <p className="mt-1 text-sm text-stone-500">IVA inclusa, rinnovo mensile</p>
            <ul className="mt-6 space-y-3 text-lg text-stone-700">
              {['Ascolto e preghiera quando vuoi', 'Rosario e preghiere guidate', 'Parola del giorno', 'Disdici in ogni momento, senza penali'].map((x) => (
                <li key={x} className="flex gap-3">
                  <span aria-hidden style={{ color: OLIVE }}>✓</span>
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {link ? (
                <a href={link} style={{ backgroundColor: OLIVE }} className="block rounded-full px-8 py-3.5 text-center font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  Inizia gratis su WhatsApp
                </a>
              ) : (
                <span className="block rounded-full bg-stone-200 px-8 py-3.5 text-center font-medium text-stone-600">Presto disponibile</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <h2 className={`${D} text-4xl font-light`} style={{ color: BROWN }}>Domande frequenti</h2>
        <div className="mt-8 border-t" style={{ borderColor: '#e7dcc0' }}>
          {faqs.map((f) => (
            <details key={f.q} className="border-b py-5 [&[open]_.plus]:rotate-45" style={{ borderColor: '#e7dcc0' }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden" style={{ color: BROWN }}>
                {f.q}
                <span aria-hidden className="plus text-2xl font-light transition-transform" style={{ color: OLIVE }}>+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-stone-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contatti" className="py-14" style={{ backgroundColor: '#f6e9c6' }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          <div>
            <h3 className={`${D} text-xl`} style={{ color: BROWN }}>Contatti</h3>
            <p className="mt-2 text-stone-700">Email: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
            {site.phone && <p className="text-stone-700">Telefono: {site.phone}</p>}
            {site.whatsappNumber && <p className="text-stone-700">WhatsApp: +{site.whatsappNumber}</p>}
          </div>
          <div>
            <h3 className={`${D} text-xl`} style={{ color: BROWN }}>Protezione dei dati</h3>
            <p className="mt-2 text-stone-700">Titolare: {site.owner}</p>
            <p className="text-stone-700">DPO{site.dpoName ? `: ${site.dpoName}` : ''}: <a className="underline" href={`mailto:${site.dpoEmail}`}>{site.dpoEmail}</a></p>
            <p className="text-stone-700"><Link className="underline" href="/eliminazione-dati">Cancella i tuoi dati</Link></p>
          </div>
          <div>
            <h3 className={`${D} text-xl`} style={{ color: BROWN }}>Documenti</h3>
            <ul className="mt-2 space-y-1 text-stone-700">
              <li><Link className="underline" href="/privacy">Informativa privacy</Link></li>
              <li><Link className="underline" href="/cookie">Cookie</Link></li>
              <li><Link className="underline" href="/termini">Condizioni d&apos;uso</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
      <BackgroundMusic />
    </main>
  );
}
