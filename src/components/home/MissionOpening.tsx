import { useEffect, useRef } from 'react';
import './MissionOpening.css';

// The mission statement (COMMS.md, approved 16 Sep 2026) is always real text in the page, so search
// engines and screen readers read it whole; the scroll only changes classes. Reduced motion shows
// the finished state (CSS).
const BEATS: { words: string[]; small?: boolean }[] = [
  { words: ['Black.', 'Queer.', "Men's.", 'Liberation.', 'Collective.'] },
  { words: ['Gatherings.', 'Dialogue.', 'Technology.', 'Health.', 'Wealth.', 'Happiness.'] },
  { words: ['Local chapters.', 'Cooperative membership.', 'Creative events.', 'Shared learning.', 'Digital media.'], small: true },
  { words: ['Collective power.', 'Accountable.'] },
];

export default function MissionOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current, track = trackRef.current;
    if (!section || !track) return;
    const beats = section.querySelectorAll<HTMLElement>('.mo-beat');
    const sents = section.querySelectorAll<HTMLElement>('.mo-s');
    const last = beats.length - 1;
    const STEPS = beats.length * 2 + 2; // beats (words, then sentence) + one colour + zoom

    // Steps 0..7: beat words, then its part of the statement; 8: all one colour; 9: zoom out to the CTA.
    const onScroll = () => {
      const r = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (total * 0.92)));
      const step = Math.min(STEPS - 1, Math.floor(p * STEPS));
      const beat = Math.min(last, Math.floor(step / 2));
      const sentenceShown = step % 2 === 1 || step > last * 2 + 1;
      beats.forEach((b, i) => {
        b.classList.toggle('mo-on', i === beat);
        b.classList.toggle('mo-dim', i === beat && sentenceShown);
        b.classList.toggle('mo-gone', i !== beat);
      });
      const lastSentence = sentenceShown ? beat : beat - 1;
      sents.forEach((s, j) => {
        s.classList.toggle('mo-on', j <= lastSentence);
        s.classList.toggle('mo-past', j < lastSentence && step <= last * 2 + 1);
      });
      section.classList.toggle('mo-one', step >= STEPS - 2);
      section.classList.toggle('mo-zoom', step >= STEPS - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} aria-label="What BLKOUT is">
      <div ref={trackRef} className="mo-track">
        <div className="mo-sticky">
          <div className="mo-stage">
            <div className="mo-beats" aria-hidden="true">
              {BEATS.map((b, i) => (
                <div key={i} className={`mo-beat${b.small ? ' mo-sm' : ''}`}>
                  {b.words.map((w, j) => (
                    <span key={w} style={{ transitionDelay: `${j * 0.16}s` }}>{w}</span>
                  ))}
                </div>
              ))}
            </div>
            <div className="mo-finale">
              <p className="mo-statement">
                <span className="mo-s">BLKOUT is the <span className="mo-k">Black Queer Men's Liberation Collective</span>.</span>{' '}
                <span className="mo-s">We host <span className="mo-k">gatherings</span>, build space for <span className="mo-k">dialogue</span>, and create community-owned <span className="mo-k">technology</span> for the <span className="mo-k">health</span>, <span className="mo-k">wealth</span> and <span className="mo-k">happiness</span> of Black gay, bi and trans men across the UK.</span>{' '}
                <span className="mo-s">Through <span className="mo-k">local chapters</span>, <span className="mo-k">cooperative membership</span>, <span className="mo-k">creative events</span>, <span className="mo-k">shared learning</span>, and <span className="mo-k">digital media</span>, we turn connection into individual well-being and</span>{' '}
                <span className="mo-s"><span className="mo-k">collective power</span> — owned by and <span className="mo-k">accountable</span> to the people we serve.</span>
              </p>
              <a
                className="mo-cta"
                href="#find-out-more"
                onClick={(e) => {
                  const target = document.getElementById('find-out-more');
                  if (!target) return;
                  e.preventDefault();
                  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
                  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                }}
              >
                Find out more
              </a>
            </div>
            <p className="mo-hint" aria-hidden="true">Keep scrolling ↓</p>
          </div>
        </div>
      </div>
    </section>
  );
}
