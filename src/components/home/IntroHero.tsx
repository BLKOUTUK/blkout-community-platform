import { useEffect, useState } from 'react';

// Homepage intro (Rob, 12 Nov 2026; replaces the VideoHero). The film is a self-contained page in
// public/intro-film/ (source: blkout/projects/platform-intro/), so it runs exactly as approved:
// plays once per visitor (localStorage, inside the frame), Skip / Replay, reduced motion goes
// straight to the resting frame, which is a working gateway (links open with target=_top).
// Landscape viewports get the 16:9 cut, portrait ones the 9:16 cut; neither is taller than the screen.
// ?intro=rest or ?intro=play on the homepage URL is passed through, for checking either state.

const PORTRAIT = '(max-aspect-ratio: 1/1)';

export default function IntroHero() {
  const [portrait, setPortrait] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(PORTRAIT).matches);

  useEffect(() => {
    const mq = window.matchMedia?.(PORTRAIT);
    if (!mq) return;
    const onChange = () => setPortrait(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const mode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('intro') : null;
  const query = mode === 'rest' ? '?rest' : mode === 'play' ? '?play' : '';
  const src = `/intro-film/${portrait ? 'vertical' : 'landscape'}.html${query}`;

  return (
    <section aria-label="BLKOUT: the intro, and nine ways in" className="bg-[#0a0a14]">
      <div
        className="mx-auto"
        style={portrait
          ? { aspectRatio: '9 / 16', width: 'min(100%, calc(100svh * 9 / 16))' }
          : { aspectRatio: '16 / 9', width: 'min(100%, calc(100svh * 16 / 9))' }}
      >
        <iframe
          key={src}
          src={src}
          title="BLKOUT intro: nine ways in to the Black Queer Men's Liberation Collective"
          className="block w-full h-full border-0"
          scrolling="no"
        />
      </div>
    </section>
  );
}
