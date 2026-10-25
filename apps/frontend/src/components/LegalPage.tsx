import Link from 'next/link';
import { site } from '@/lib/site';

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-lg text-amber-800">{site.name}</Link>
          <nav className="flex gap-4 text-sm text-stone-600">
            <Link href="/privacy">Privacy</Link>
            <Link href="/termini">Termini</Link>
            <Link href="/cookie">Cookie</Link>
            <Link href="/eliminazione-dati">Elimina dati</Link>
          </nav>
        </div>
      </header>
      <article className="mx-auto max-w-3xl space-y-4 px-6 py-10 leading-relaxed [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-amber-900 [&_ul]:list-disc [&_ul]:pl-6">
        <h1 className="font-serif text-3xl text-amber-900">{title}</h1>
        <p className="text-sm text-stone-500">Ultimo aggiornamento: {site.updated}</p>
        {children}
      </article>
    </main>
  );
}
