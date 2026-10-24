import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MissionOpening.css';

gsap.registerPlugin(ScrollTrigger);

// Homepage opening, "Sign o' the Times" (Rob, 24 Oct 2026; replaces option D+). The stage pins
// and the scroll is the beat: the mission statement (COMMS.md, approved 16 Sep 2026, verbatim)
// plays one phrase per screen, each word acting out what it says, then settles as plain text.
// The full statement is always real text in the page (sr-only paragraph + the final beat), so
// search engines and screen readers read it whole. Reduced motion shows the plain final state.
// Prototype: blkout/projects/homepage-statement/prototypes/statement-motion.html

const STATEMENT = [
  "BLKOUT is the Black Queer Men's Liberation Collective.",
  'We host gatherings, build space for dialogue, and create community-owned technology for the health, wealth and happiness of Black gay, bi and trans men across the UK.',
  'Through local chapters, cooperative membership, creative events, shared learning, and digital media, we turn connection into individual well-being and collective power — owned by and accountable to the people we serve.',
];

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// Split an element's own text into letter spans.
function split(el: HTMLElement) {
  if (el.dataset.split) return el.querySelectorAll<HTMLElement>('.ch');
  const text = el.textContent || '';
  el.textContent = '';
  for (const c of text) {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c === ' ' ? ' ' : c;
    el.appendChild(s);
  }
  el.dataset.split = '1';
  return el.querySelectorAll<HTMLElement>('.ch');
}

const toggleOn = (el: HTMLElement) => ({ onStart: () => el.classList.add('on'), onReverseComplete: () => el.classList.remove('on') });

// Each effect returns a timeline in which the word "becomes" what it means.
const FX: Record<string, (el: HTMLElement) => gsap.core.Timeline> = {
  stamp(el) {
    const ch = split(el);
    return gsap.timeline().fromTo(ch, { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, stagger: 0.1, ease: 'power4.in' });
  },
  words(el) {
    const w = el.querySelectorAll('.wd');
    return gsap.timeline().fromTo(w, { y: 50, opacity: 0, scale: 1.3 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, stagger: 0.22, ease: 'power3.out' });
  },
  liberation(el) {
    const ch = split(el);
    const bars = document.createElement('span'); bars.className = 'bars'; el.appendChild(bars);
    return gsap.timeline()
      .fromTo(ch, { letterSpacing: '-0.12em', opacity: 0.55, scale: 0.92 }, { letterSpacing: '0em', opacity: 1, scale: 1, duration: 0.3 })
      .to(bars, { yPercent: -140, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.25)
      .to(ch, { x: () => rnd(-14, 14), y: () => rnd(-40, -8), rotation: () => rnd(-12, 12), duration: 0.45, stagger: 0.03, ease: 'power3.out' }, 0.4);
  },
  collective(el) {
    const ch = split(el);
    return gsap.timeline().fromTo(ch, { x: (i) => (i - ch.length / 2) * 22, opacity: 0.3 }, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' });
  },
  parting(el) {
    const w = el.querySelectorAll('.wd');
    return gsap.timeline().fromTo(w, { x: 0 }, { x: (i) => (i ? 26 : -26), duration: 0.6, ease: 'power2.out' });
  },
  gatherings(el) {
    const ch = split(el);
    return gsap.timeline().fromTo(ch, { x: () => rnd(-120, 120), y: () => rnd(-80, 80), opacity: 0.15, rotation: () => rnd(-40, 40) }, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 1, ease: 'power3.out', stagger: 0.02 });
  },
  bricks(el) {
    const ch = split(el);
    return gsap.timeline().fromTo(ch, { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.12, ease: 'bounce.out' });
  },
  space(el) {
    return gsap.timeline().fromTo(el, { letterSpacing: '0em' }, { letterSpacing: '0.45em', duration: 1, ease: 'power1.inOut' });
  },
  dialogue(el) {
    const ch = split(el);
    return gsap.timeline().fromTo(ch, { y: (i) => (i % 2 ? 28 : -28), opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' });
  },
  technology(el) {
    const ch = split(el);
    const cur = document.createElement('span'); cur.className = 'cursor'; cur.textContent = ' '; el.appendChild(cur);
    gsap.set(ch, { opacity: 0 });
    return gsap.timeline().to(ch, { opacity: 1, duration: 0.01, stagger: 0.04, ease: 'none' });
  },
  health(el) {
    return gsap.timeline(toggleOn(el)).fromTo(el, { opacity: 0.4 }, { opacity: 1, duration: 0.5 });
  },
  wealth(el) {
    const ch = split(el);
    return gsap.timeline(toggleOn(el)).fromTo(ch, { y: (i) => 60 + i * 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'bounce.out' });
  },
  happiness(el) {
    // A smile: flat, then turning up at both ends.
    const ch = split(el); const mid = (ch.length - 1) / 2;
    return gsap.timeline().fromTo(ch, { y: 0, rotation: 0 }, {
      y: (i) => { const u = (i - mid) / mid; return -0.32 * u * u * parseFloat(getComputedStyle(el).fontSize); },
      rotation: (i) => -((i - mid) / mid) * 14,
      duration: 1, ease: 'power2.inOut',
    });
  },
  identity(el) {
    const w = el.querySelectorAll('.wd'); const rule = el.querySelector('.rule');
    return gsap.timeline()
      .fromTo(w, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.16, ease: 'power2.out' })
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=.1');
  },
  across(el) {
    // Bleeds off both edges on purpose.
    return gsap.timeline().fromTo(el, { letterSpacing: '0em' }, {
      letterSpacing: () => { const n = (el.textContent || '').length; const w = el.getBoundingClientRect().width; return Math.max(0, (window.innerWidth * 1.35 - w) / n) + 'px'; },
      duration: 1, ease: 'power2.inOut',
    });
  },
  list(el) {
    const items = el.querySelectorAll('.item');
    return gsap.timeline().fromTo(items, { opacity: 0, x: (i) => (i % 2 ? 40 : -40), skewX: -12 }, { opacity: 1, x: 0, skewX: 0, duration: 0.35, stagger: 0.18, ease: 'power3.out' });
  },
  turn(el) {
    return gsap.timeline().fromTo(el, { rotationX: 0 }, { rotationX: 360, duration: 1, ease: 'power2.inOut', transformPerspective: 400 });
  },
  connection(el) {
    const ch = split(el);
    const link = document.createElement('span'); link.className = 'link'; el.appendChild(link);
    return gsap.timeline()
      .fromTo(ch, { x: (i) => (i - ch.length / 2) * 10 }, { x: 0, duration: 0.6, ease: 'power2.out' })
      .fromTo(link, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.3);
  },
  individuals(el) {
    const ch = split(el);
    const weights = [200, 900, 400, 700, 300, 800, 500, 600, 250, 850];
    return gsap.timeline().fromTo(ch, { x: 0, fontVariationSettings: '"wght" 600' }, {
      x: (i) => (i - (ch.length - 1) / 2) * 7, fontVariationSettings: (i: number) => '"wght" ' + weights[i % 10], duration: 0.8, ease: 'power2.out',
    });
  },
  power(el) {
    // A battery charging in five clear bars; each bar steps the words up a notch.
    const bat = document.createElement('span'); bat.className = 'battery';
    for (let k = 0; k < 5; k++) { const b = document.createElement('span'); b.className = 'bar'; bat.appendChild(b); }
    el.appendChild(bat);
    const tl = gsap.timeline();
    tl.set(el, { opacity: 0.3, fontVariationSettings: '"wght" 200' }, 0);
    bat.querySelectorAll('.bar').forEach((b, k) => {
      const at = 0.1 + k * 0.17;
      tl.set(b, { opacity: 1 }, at).set(el, { opacity: 0.3 + (k + 1) * 0.14, fontVariationSettings: '"wght" ' + (200 + (k + 1) * 140) }, at);
    });
    tl.set(el, { color: '#FFD700' }, 0.1 + 4 * 0.17).to({}, { duration: 0.1 });
    return tl;
  },
  dash(el) {
    return gsap.timeline().fromTo(el, { scaleX: 0 }, { scaleX: 3, duration: 0.7, ease: 'power3.out' });
  },
  owned(el) {
    const seal = document.createElement('span'); seal.className = 'seal'; el.appendChild(seal);
    return gsap.timeline().fromTo(el, { opacity: 0.5 }, { opacity: 1, duration: 0.4 }).fromTo(seal, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power4.out' }, 0.2);
  },
  lift(el) {
    return gsap.timeline().fromTo(el, { y: 40, opacity: 0 }, { y: -10, opacity: 1, duration: 0.6, ease: 'power2.out' });
  },
};

function scrollToFindOutMore(e: React.MouseEvent) {
  const target = document.getElementById('find-out-more');
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export default function MissionOpening() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const stage = root.querySelector<HTMLElement>('.stage');
    if (!stage) return;
    root.classList.add('so-live');
    const beats = [...root.querySelectorAll<HTMLElement>('.beat')];

    // Shrink any phrase that would spill off the screen (except the ones that bleed on purpose).
    const fit = () => beats.forEach((b) => {
      const box = b.firstElementChild as HTMLElement | null;
      if (!box || box.querySelector('.bleed')) return;
      box.style.fontSize = '';
      let guard = 0;
      while (box.scrollWidth > window.innerWidth * 0.94 && guard++ < 30) {
        box.style.fontSize = parseFloat(getComputedStyle(box).fontSize) * 0.94 + 'px';
      }
    });

    const ctx = gsap.context(() => {
      fit();
      const master = gsap.timeline({ defaults: { ease: 'none' } });
      let t = 0;
      beats.forEach((b, i) => {
        const last = i === beats.length - 1;
        if (last) t += 0.6; // a breath before the plain statement
        master.set(b, { opacity: 1 }, t);
        master.fromTo(b.firstElementChild, { scale: i % 2 ? 1.12 : 0.88, y: i % 3 === 0 ? 30 : 0, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, t);
        b.querySelectorAll<HTMLElement>('[data-fx]').forEach((el) => {
          const make = FX[el.dataset.fx || ''];
          if (make) master.add(make(el).duration(0.6), t + 0.15);
        });
        if (!last) master.to(b.firstElementChild, { opacity: 0, duration: 0.08 }, t + 0.92).set(b, { opacity: 0 }, t + 1);
        t += 1;
      });
      master.to(root.querySelector('.progress'), { width: '100%', duration: t }, 0);
      ScrollTrigger.create({
        trigger: stage, start: 'top top', end: () => '+=' + window.innerHeight * t * 1.6,
        pin: true, scrub: 0.8, animation: master, invalidateOnRefresh: true,
      });
    }, root);

    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(() => { fit(); ScrollTrigger.refresh(); });
    return () => { window.removeEventListener('resize', onResize); ctx.revert(); root.classList.remove('so-live'); };
  }, []);

  return (
    <section ref={rootRef} className="so" aria-label="What BLKOUT is">
      <p className="so-sr">{STATEMENT.join(' ')}</p>
      <div className="stage">
        <div className="beat" aria-hidden="true"><div className="b-heavy b-huge"><span className="w" data-fx="stamp">BLKOUT</span><br /><span className="b-small" style={{ fontSize: '.3em', textTransform: 'none' }}>is</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy"><span data-fx="words"><span className="wd b-serif-word">the</span> <span className="wd">Black</span> <span className="wd">Queer</span> <span className="wd b-gold">Men's</span></span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy b-huge"><span className="w fx-liberation" data-fx="liberation">Liberation</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy"><span className="w fx-bold" data-fx="collective">Collective.</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-serif"><span data-fx="parting"><span className="wd">We</span> <span className="wd">host</span></span><br /><span className="w fx-sans-heavy" data-fx="gatherings">gatherings,</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy"><span className="w" data-fx="bricks">build</span> <span className="w" data-fx="space">space</span><br /><span className="b-light">for</span> <span className="w fx-dialogue" data-fx="dialogue">dialogue,</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-mono"><span style={{ fontWeight: 400 }}>and create</span><br /><span className="w fx-technology" data-fx="technology">community-owned technology</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-serif">for the <span className="w fx-health" data-fx="health" style={{ fontSize: '1.6em' }}>health,</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy b-huge"><span className="w fx-wealth" data-fx="wealth">wealth</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-serif">and<br /><span className="w fx-happiness" data-fx="happiness" style={{ fontSize: '1.5em' }}>happiness</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy b-identity"><span data-fx="identity"><span className="wd b-light">of</span> <span className="wd">Black</span> <span className="wd">gay,</span> <span className="wd">bi</span> <span className="wd">and</span> <span className="wd">trans</span> <span className="wd">men</span><span className="rule" /></span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy b-huge" style={{ fontSize: 'clamp(40px,12vw,150px)' }}><span className="w fx-across bleed" data-fx="across">across the UK.</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-list b-heavy">Through<span className="w fx-list" data-fx="list"><span className="item">local chapters,</span><span className="item b-gold">cooperative membership,</span><span className="item b-serif-word">creative events,</span><span className="item b-mono-word">shared learning,</span><span className="item">and digital media,</span></span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-serif">we <span className="w fx-sans-heavy" data-fx="turn">turn</span><br /><span className="w fx-connection" data-fx="connection">connection</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-small b-mid">into <span className="w" data-fx="individuals" style={{ fontWeight: 600 }}>individual</span><br /><span className="b-serif-word">well-being</span></div></div>
        <div className="beat" aria-hidden="true"><div className="b-heavy">and <span className="w fx-power" data-fx="power">collective power</span><span className="dash" data-fx="dash" /></div></div>
        <div className="beat" aria-hidden="true"><div className="b-serif"><span className="w fx-owned" data-fx="owned">owned by and accountable to</span><br /><span className="w fx-sans-heavy" data-fx="lift">the people we serve.</span></div></div>
        <div className="beat beat-final">
          <div className="b-final">
            {STATEMENT.map((s) => <p key={s} aria-hidden="true">{s}</p>)}
            <a className="so-cta" href="#find-out-more" onClick={scrollToFindOutMore}>Find out more</a>
          </div>
        </div>
        <div className="progress" aria-hidden="true" />
      </div>
    </section>
  );
}
