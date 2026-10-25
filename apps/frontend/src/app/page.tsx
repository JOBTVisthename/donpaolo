import Link from 'next/link';
import { site, waLink } from '@/lib/site';

export const metadata = {
  title: `${site.name} – un compagno di preghiera su WhatsApp`,
  description: 'Scrivi su WhatsApp, registrati in un minuto e prega con un assistente che ti ascolta.',
};

const steps = [
  { n: '1', t: 'Scrivici su WhatsApp', d: 'Un semplice "Ciao" al nostro numero. Nessuna app da installare.' },
  { n: '2', t: 'Registrati in un minuto', d: 'Ti chiediamo il nome e il tuo consenso. Tutto dentro la chat.' },
  { n: '3', t: 'Prega e parla', d: 'Condividi una preghiera, un pensiero, una difficoltà: ti rispondiamo con rispetto.' },
];

const faqs = [
  { q: 'Chi risponde?', a: 'Un assistente basato su intelligenza artificiale, pensato per accompagnarti. Non è un sacerdote né sostituisce un confronto con una persona o un professionista.' },
  { q: 'È gratuito?', a: 'Puoi iniziare con un periodo di prova. Ti diremo in chiaro eventuali condizioni prima di qualsiasi costo.' },
  { q: 'I miei dati sono al sicuro?', a: 'Trattiamo i dati solo per il servizio, con il tuo consenso esplicito, e puoi chiederne la cancellazione in ogni momento.' },
  { q: 'E se sto male davvero?', a: 'In caso di emergenza chiama il 112. Se rileviamo segnali di difficoltà, il nostro team può essere avvisato.' },
];

export default function Home() {
  const link = waLink();
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-serif text-xl text-amber-800">{site.name}</span>
        <nav className="flex gap-4 text-sm text-stone-600">
          <Link href="/privacy">Privacy</Link>
          <Link href="/termini">Termini</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="font-serif text-4xl leading-tight text-amber-900 sm:text-5xl">
          Non sei solo nella preghiera
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-stone-600">
          Scrivi su WhatsApp, registrati in un minuto e parla con qualcuno che ti ascolta. Prega, condividi, ritrova un momento di pace.
        </p>
        <div className="mt-8">
          {link ? (
            <a href={link} className="inline-block rounded-full bg-green-600 px-8 py-3 font-medium text-white shadow hover:bg-green-700">
              Scrivici su WhatsApp
            </a>
          ) : (
            <span className="inline-block rounded-full bg-stone-300 px-8 py-3 font-medium text-stone-600">
              Presto disponibile
            </span>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 font-serif text-amber-800">{s.n}</div>
            <h3 className="font-serif text-lg text-amber-900">{s.t}</h3>
            <p className="mt-2 text-stone-600">{s.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-6 text-center font-serif text-2xl text-amber-900">Domande frequenti</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-xl border border-stone-200 bg-white p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-stone-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-white py-8 text-center text-sm text-stone-500">
        <p>{site.name} · un servizio di {site.owner} · {site.address} · P.IVA {site.vat}</p>
        <p className="mt-2 space-x-4">
          <Link href="/privacy">Privacy</Link>
          <Link href="/termini">Termini d&apos;uso</Link>
          <Link href="/eliminazione-dati">Eliminazione dati</Link>
        </p>
      </footer>
    </main>
  );
}
