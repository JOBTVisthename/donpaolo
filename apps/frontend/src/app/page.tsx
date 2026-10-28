import Image from 'next/image';
import Link from 'next/link';
import { Fraunces, Figtree } from 'next/font/google';
import { site, waLink } from '@/lib/site';
import Footer from '@/components/Footer';
import BackgroundMusic from '@/components/BackgroundMusic';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', style: ['normal', 'italic'], display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const revalidate = 3600;
export const metadata = {
  title: `${site.name} – La forza della preghiera, insieme`,
  description: `Preghiera, ascolto e fede cristiana su WhatsApp. ${site.trialDays} giorni gratis, poi ${site.priceMonthly} € al mese.`,
};

const GOLD = '#d9a62e', OLIVE = '#6b7a2f', BROWN = '#2b1a10', CREAM = '#fffaf0';
const HERO = 'https://smotaogceaftkcympopm.supabase.co/storage/v1/object/public/public-assets/hero.jpg';
const D = 'font-[family-name:var(--font-display)]';

// Santo o festa del giorno (principali memorie del calendario romano). Aggiungi altre voci quando vuoi.
const SANTI: Record<string, string> = {
  '01-01': 'Maria Santissima Madre di Dio', '01-17': "Sant'Antonio abate", '01-24': 'San Francesco di Sales', '01-28': "San Tommaso d'Aquino",
  '02-02': 'Presentazione del Signore', '02-10': 'Santa Scolastica', '03-19': 'San Giuseppe', '03-25': 'Annunciazione del Signore',
  '04-23': 'San Giorgio', '04-25': 'San Marco evangelista', '04-29': 'Santa Caterina da Siena', '05-01': 'San Giuseppe lavoratore',
  '05-14': 'San Mattia apostolo', '05-31': 'Visitazione della Beata Vergine Maria', '06-13': "Sant'Antonio di Padova",
  '06-24': 'Natività di San Giovanni Battista', '06-29': 'Santi Pietro e Paolo', '07-11': 'San Benedetto', '07-22': 'Santa Maria Maddalena',
  '07-25': 'San Giacomo apostolo', '07-26': 'Santi Gioacchino e Anna', '08-06': 'Trasfigurazione del Signore', '08-10': 'San Lorenzo',
  '08-14': 'San Massimiliano Kolbe', '08-15': 'Assunzione della Beata Vergine Maria', '08-28': "Sant'Agostino", '09-08': 'Natività della Beata Vergine Maria',
  '09-14': 'Esaltazione della Santa Croce', '09-21': 'San Matteo apostolo', '09-29': 'Santi Arcangeli Michele, Gabriele e Raffaele', '09-30': 'San Girolamo',
  '10-01': 'Santa Teresa di Gesù Bambino', '10-04': "San Francesco d'Assisi", '10-07': 'Beata Vergine del Rosario', '10-15': "Santa Teresa d'Avila",
  '10-18': 'San Luca evangelista', '10-28': 'Santi Simone e Giuda, apostoli', '11-01': 'Tutti i Santi', '11-02': 'Commemorazione dei fedeli defunti',
  '11-11': 'San Martino di Tours', '11-21': 'Presentazione della Beata Vergine Maria', '11-30': "Sant'Andrea apostolo", '12-06': 'San Nicola',
  '12-08': 'Immacolata Concezione', '12-13': 'Santa Lucia', '12-25': 'Natale del Signore', '12-26': 'Santo Stefano', '12-27': 'San Giovanni apostolo',
};

type News = { title: string; link: string };
async function getNews(): Promise<News[]> {
  try {
    const r = await fetch('https://www.vaticannews.va/it.rss.xml', { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000) });
    if (!r.ok) return [];
    const xml = await r.text();
    return xml
      .split('<item>')
      .slice(1, 5)
      .map((i) => ({
        title: (i.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] || '').trim(),
        link: (i.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '').trim(),
      }))
      .filter((n) => n.title && n.link);
  } catch {
    return [];
  }
}

const prayers = [
  { when: 'Mattino', name: 'Lodi mattutine', time: 'ore 7', icon: '🌅', what: 'Per aprire la giornata con gratitudine: salmo, intenzioni e un pensiero dal Vangelo.' },
  { when: 'Mezzogiorno', name: 'Angelus', time: 'ore 12', icon: '☀️', what: 'Una pausa breve nel cuore del giorno, per ricordare l’Annunciazione e affidare ciò che porti.' },
  { when: 'Pomeriggio', name: 'Coroncina della Divina Misericordia', time: 'ore 15', icon: '🕊️', what: 'L’ora della Misericordia: una preghiera semplice per chi è stanco o in difficoltà.' },
  { when: 'Sera', name: 'Vespri e Compieta', time: 'ore 19-21', icon: '🌙', what: 'Per ringraziare e riposare: le intenzioni della giornata e la preghiera della buonanotte.' },
];
const steps = [
  { t: 'Scrivici su WhatsApp', d: 'Un semplice "Ciao" al nostro numero. Nessuna app da installare.' },
  { t: 'Registrati in un minuto', d: 'Ti chiediamo nome, parrocchia e il tuo consenso. Tutto dentro la chat.' },
  { t: 'Prega e parla', d: 'Condividi una preghiera, un pensiero, una fatica: ti rispondiamo con rispetto e ascolto.' },
];
const faqs = [
  { q: 'Chi risponde?', a: 'Un assistente basato su intelligenza artificiale, ispirato alla tradizione cristiana. Non è un sacerdote e non sostituisce il confronto con una guida spirituale, né un aiuto medico o psicologico.' },
  { q: `Come funzionano i ${site.trialDays} giorni gratis?`, a: `Usi il servizio gratuitamente per ${site.trialDays} giorni. Prima della fine ti avvisiamo; solo dopo, se vuoi continuare, costa ${site.priceMonthly} € al mese (IVA inclusa).` },
  { q: 'Posso disdire?', a: 'Sì, quando vuoi e senza penali, scrivendoci in chat o via email. Disdicendo durante la prova non paghi nulla.' },
  { q: 'I miei dati sono al sicuro?', a: 'Preghiere e parrocchia sono dati sensibili: li trattiamo solo con il tuo consenso esplicito e puoi chiederne la cancellazione in ogni momento.' },
  { q: 'E se sto davvero male?', a: 'In caso di emergenza chiama il 112. Se rileviamo segnali di difficoltà, il nostro team può essere avvisato per valutare un intervento.' },
];

function Cta({ label = 'Inizia gratis su WhatsApp', dark = false }: { label?: string; dark?: boolean }) {
  const link = waLink();
  const base = 'inline-block rounded-full px-8 py-3.5 font-semibold shadow-md transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4';
  if (!link) return <span className={`${base} bg-stone-300 text-stone-600 shadow-none`}>Presto disponibile</span>;
  return (
    <a href={link} className={base} style={dark ? { backgroundColor: OLIVE, color: '#fff' } : { backgroundColor: GOLD, color: BROWN }}>
      {label}
    </a>
  );
}

export default async function Home() {
  const news = await getNews();
  const now = new Date();
  const key = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', month: '2-digit', day: '2-digit' }).format(now).slice(-5);
  const santo = SANTI[key];
  const dataOggi = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long' }).format(now);

  return (
    <main className={`${display.variable} ${body.variable} min-h-screen font-[family-name:var(--font-body)] text-stone-800`} style={{ backgroundColor: CREAM }}>
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: no-preference) { .rise { animation: rise .8s cubic-bezier(.2,.7,.2,1) both; } .rise-2 { animation-delay: .15s; } }
      `}</style>

      <section className="relative">
        <Image src={HERO} alt="Mani in preghiera al tramonto davanti a una piccola chiesa di campagna" width={0} height={0} priority quality={85} sizes="100vw" style={{ width: '100%', height: 'auto' }} />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-40" style={{ background: `linear-gradient(to bottom, transparent, ${CREAM})` }} />
      </section>

      <section className="px-6 pb-14 pt-2 text-center">
        <h1 className="sr-only">La forza della preghiera, insieme</h1>
        <p className="rise mx-auto max-w-xl text-xl leading-relaxed text-stone-700">Scrivi su WhatsApp e prega con qualcuno che ti ascolta. Come i discepoli di Emmaus, camminiamo insieme a te.</p>
        <div className="rise rise-2 mt-7"><Cta /></div>
        <p className="mt-3 text-sm text-stone-600">{site.trialDays} giorni gratis, poi {site.priceMonthly} € al mese. Disdici quando vuoi.</p>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl" style={{ backgroundColor: BROWN }}>
          <div className="grid md:grid-cols-5">
            <div className="p-8 md:col-span-2 md:p-10">
              <p className="text-sm capitalize text-white/60">{dataOggi}</p>
              <p className={`${D} mt-3 text-sm italic`} style={{ color: GOLD }}>Il santo del giorno</p>
              <h2 className={`${D} mt-1 text-3xl font-light leading-snug text-white`}>{santo || 'Oggi preghiamo con tutti i santi'}</h2>
              <blockquote className={`${D} mt-6 border-l-2 pl-4 text-lg italic text-white/80`} style={{ borderColor: GOLD }}>
                «Dove sono due o tre riuniti nel mio nome, io sono in mezzo a loro.»
                <footer className="mt-1 font-[family-name:var(--font-body)] text-sm not-italic text-white/50">Matteo 18,20</footer>
              </blockquote>
            </div>
            <div className="bg-white/5 p-8 md:col-span-3 md:p-10">
              <p className="text-sm text-white/60">Dalla Chiesa, oggi</p>
              {news.length ? (
                <ul className="mt-3 divide-y divide-white/10">
                  {news.map((n) => (
                    <li key={n.link}>
                      <a href={n.link} target="_blank" rel="noopener noreferrer" className="block py-3 text-lg leading-snug text-white transition hover:text-[#d9a62e]">{n.title}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-white/70">Le notizie della Chiesa tornano tra poco.</p>
              )}
              <p className="mt-3 text-xs text-white/40">Titoli da Vatican News, con link alla fonte.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="preghiere" className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className={`${D} text-4xl font-light`} style={{ color: BROWN }}>Gli appuntamenti della giornata</h2>
        <p className="mt-2 max-w-xl text-lg text-stone-600">Tocca una preghiera per scoprire come ti accompagniamo.</p>
        <div className="mt-8 grid items-start gap-4 sm:grid-cols-2">
          {prayers.map((p) => (
            <details key={p.name} className="group rounded-2xl border bg-white p-5 [&[open]]:shadow-md" style={{ borderColor: '#ecdcae' }}>
              <summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
                <span className="text-3xl" aria-hidden>{p.icon}</span>
                <span className="flex-1">
                  <span className="block text-xs text-stone-500">{p.when}, {p.time}</span>
                  <span className={`${D} block text-xl`} style={{ color: BROWN }}>{p.name}</span>
                </span>
                <span aria-hidden className="text-2xl font-light transition-transform group-open:rotate-45" style={{ color: OLIVE }}>+</span>
              </summary>
              <div className="mt-4 border-t pt-4" style={{ borderColor: '#f0e2b8' }}>
                <p className="leading-relaxed text-stone-700">{p.what}</p>
                <p className="mt-2 leading-relaxed text-stone-700">Su WhatsApp ti scriviamo all’ora che scegli, preghiamo con te passo dopo passo e puoi aggiungere le tue intenzioni. Provi {site.trialDays} giorni gratis.</p>
                <div className="mt-4"><Cta label="Registrati e prova subito" dark /></div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section id="come-funziona" className="px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className={`${D} text-4xl font-light`} style={{ color: BROWN }}>Come funziona</h2>
          <ol className="relative mt-10 space-y-9 pl-14">
            <span aria-hidden className="absolute bottom-2 left-[19px] top-2 w-px" style={{ backgroundColor: GOLD, opacity: 0.6 }} />
            {steps.map((s, i) => (
              <li key={s.t} className="relative">
                <span className={`${D} absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full text-lg`} style={{ backgroundColor: i === 2 ? OLIVE : GOLD, color: i === 2 ? '#fff' : BROWN }}>{i + 1}</span>
                <h3 className={`${D} text-2xl`} style={{ color: BROWN }}>{s.t}</h3>
                <p className="mt-1 max-w-lg text-lg leading-relaxed text-stone-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="prezzo" className="px-6 py-20" style={{ backgroundColor: BROWN }}>
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className={`${D} text-4xl font-light leading-tight text-white sm:text-5xl`}>Provalo per {site.trialDays} giorni, senza pagare nulla</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">Nessun addebito durante la prova. Dopo, il servizio si rinnova ogni mese finché non disdici.</p>
          </div>
          <div className="rounded-3xl p-8 sm:p-10" style={{ backgroundColor: CREAM }}>
            <p className={`${D} text-6xl`} style={{ color: BROWN }}>{site.priceMonthly} €<span className="font-[family-name:var(--font-body)] text-lg text-stone-500"> al mese</span></p>
            <p className="mt-1 text-sm text-stone-500">IVA inclusa, rinnovo mensile</p>
            <ul className="mt-6 space-y-3 text-lg text-stone-700">
              {['Ascolto e preghiera quando vuoi', 'Rosario e preghiere guidate', 'Parola del giorno', 'Disdici in ogni momento, senza penali'].map((x) => (
                <li key={x} className="flex gap-3"><span aria-hidden style={{ color: OLIVE }}>✓</span>{x}</li>
              ))}
            </ul>
            <div className="mt-8"><Cta dark /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className={`${D} text-4xl font-light`} style={{ color: BROWN }}>Domande frequenti</h2>
        <div className="mt-8 border-t" style={{ borderColor: '#e7dcc0' }}>
          {faqs.map((f) => (
            <details key={f.q} className="border-b py-5 [&[open]_.plus]:rotate-45" style={{ borderColor: '#e7dcc0' }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden" style={{ color: BROWN }}>
                {f.q}<span aria-hidden className="plus text-2xl font-light transition-transform" style={{ color: OLIVE }}>+</span>
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
