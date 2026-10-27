'use client';

import { useEffect, useRef, useState } from 'react';

const SRC = 'https://smotaogceaftkcympopm.supabase.co/storage/v1/object/public/public-assets/chiesa.mp3.mp3';
const VOLUME = 0.25;
const KEY = 'musica';

export default function BackgroundMusic() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    try {
      if (localStorage.getItem(KEY) === 'off') return;
    } catch {}

    a.volume = 0;
    const events = ['pointerdown', 'keydown', 'touchend'];
    const remove = () => events.forEach((e) => window.removeEventListener(e, start));

    const fadeIn = () => {
      let v = 0;
      const t = setInterval(() => {
        v = Math.min(VOLUME, v + 0.02);
        a.volume = v;
        if (v >= VOLUME) clearInterval(t);
      }, 100);
    };

    async function start() {
      try {
        await a!.play();
        setPlaying(true);
        fadeIn();
        remove();
      } catch {
        /* il browser non ha ancora permesso l'audio: riproviamo al prossimo gesto */
      }
    }

    start();
    events.forEach((e) => window.addEventListener(e, start));
    return remove;
  }, []);

  async function toggle() {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      a.volume = VOLUME;
      try {
        await a.play();
        setPlaying(true);
        localStorage.setItem(KEY, 'on');
      } catch {}
    } else {
      a.pause();
      setPlaying(false);
      try {
        localStorage.setItem(KEY, 'off');
      } catch {}
    }
  }

  return (
    <>
      <audio ref={ref} src={SRC} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Spegni la musica' : 'Accendi la musica'}
        className="fixed bottom-4 right-4 z-50 rounded-full px-4 py-2 text-sm text-white shadow-lg backdrop-blur transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{ backgroundColor: 'rgba(43,26,16,0.9)' }}
      >
        {playing ? '🔊 Musica' : '🔇 Musica'}
      </button>
    </>
  );
}
