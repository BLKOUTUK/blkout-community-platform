import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CompassDropPageProps {
  onNavigate?: (tab: string) => void;
}

const DROP_SLUG = 'compass-journal';
// Asset convention (drop in when ready):
//   public/videos/drops/compass-journal.mp4 — looping muted hero, 10–15s
const HERO_VIDEO: string | undefined = undefined;
// Hero still — accio-specs internal, optimised.
const HERO_POSTER: string | undefined = '/images/drops/compass-journal-hero.jpg';
// Inside-the-journal gallery — accio-specs + journal-package spreads.
const GALLERY: string[] = [
  '/images/drops/compass-journal-spread-1.jpg',
  '/images/drops/compass-journal-spread-2.jpg',
  '/images/drops/compass-journal-spread-3.jpg',
  '/images/drops/compass-journal-spread-4.jpg',
  '/images/drops/compass-journal-spread-5.jpg',
  '/images/drops/compass-journal-spread-6.jpg',
];

export default function CompassDropPage({ onNavigate }: CompassDropPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = (tab: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(tab);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const params = new URLSearchParams(window.location.search);
    const { error: insertError } = await supabase
      .from('drop_interest')
      .insert({
        drop_slug: DROP_SLUG,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        quantity_intent: quantity,
        motivation_text: motivation.trim() || null,
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
      });

    if (insertError) {
      const isDuplicate = insertError.code === '23505' || /duplicate/i.test(insertError.message);
      setError(
        isDuplicate
          ? "You're already on the list — we'll write when the print run triggers."
          : "Couldn't save your reservation right now. Try again, or email rob@blkoutuk.com.",
      );
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const placeholderStyle = {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(212,175,55,0.04) 0, rgba(212,175,55,0.04) 8px, transparent 8px, transparent 16px)',
    backgroundColor: '#0A0A0A',
  };

  return (
    <main className="bg-liberation-black-power min-h-screen px-6 md:px-12 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Top crumb */}
        <div className="pt-6 flex justify-between items-center text-liberation-neutral-500 text-xs tracking-[0.2em] uppercase font-bold">
          <a href="/shop" onClick={go('shop')} className="inline-flex items-center gap-3" aria-label="BLKOUT Shop">
            <img src="/images/blkout-logo-white.png" alt="BLKOUT" className="h-10 w-auto block" />
            <span className="text-liberation-sovereignty-gold text-[0.7rem] tracking-[0.25em]">
              ← back to /shop
            </span>
          </a>
          <span>Drop 01 · Print run pending</span>
        </div>

        {/* HERO */}
        <header className="pt-16 pb-12 md:pt-20 md:pb-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            BLKOUT Drops · Drop 01
          </span>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-5xl sm:text-6xl md:text-8xl mt-6 mb-0">
            Ivor's Compass.<br />
            <span className="text-liberation-gold-divine">In print.</span>
          </h1>
          <p className="font-disrupt italic text-xl md:text-2xl leading-snug text-liberation-neutral-300 max-w-[42ch] mt-6 mb-0">
            The graphic novel and workshop record — bound, printed, brought home.
          </p>
          <hr className="h-1.5 bg-liberation-sovereignty-gold border-0 mt-10 w-24" />
        </header>

        {/* Hero — video > poster > placeholder */}
        <section className="mb-16">
          {HERO_VIDEO ? (
            <video
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={HERO_POSTER}
              aria-label="Ivor's Compass print journal promo"
            >
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
          ) : HERO_POSTER ? (
            <img src={HERO_POSTER} alt="Ivor's Compass print journal" className="w-full h-auto block" />
          ) : (
            <div
              className="border border-dashed border-liberation-neutral-800 min-h-[24rem] md:min-h-[32rem] grid place-items-center text-liberation-neutral-700 text-sm tracking-[0.2em] uppercase"
              style={placeholderStyle}
            >
              [hero · ivor-compass folder]
            </div>
          )}
        </section>

        {/* Editorial body */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6 lg:gap-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
            Who he was
          </span>
          <div className="space-y-6 max-w-[55ch] text-liberation-neutral-300 text-lg leading-relaxed">
            <p className="m-0">
              A Black queer man at the heart of the British civil service. The 1940s and 50s. He met the Empire Windrush at Tilbury — and the men who arrived with it. He ran West African student welfare. He hosted the parties where the first generations of Black queer London learned each other.
            </p>
            <p className="m-0">
              His name was Ivor Cummings. <em className="font-disrupt italic">You weren't taught about him.</em> That was the point.
            </p>
            <p className="m-0">
              <span className="font-disrupt italic text-white">Ivor's Compass</span> is the graphic novel we made to put him back. Seven directions through one man's life — <em className="font-disrupt italic">home, night, fire, threshold, shadow, silence, return.</em> Workshop panels, prompts, the names that came up across four sessions in Croydon.
            </p>
            <p className="m-0">
              The journal binds it. The version you can hold. The version you can hand to someone.
            </p>
          </div>
        </section>

        {/* Inside the journal — gallery */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6 lg:gap-16 mb-8">
            <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
              Inside the journal
            </span>
            <p className="font-disrupt italic text-xl text-liberation-neutral-300 max-w-[55ch] m-0">
              A taste of the spreads — the panels, the workshop record, the way it carries through the seven directions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {GALLERY.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Compass journal spread ${i + 1}`}
                className="w-full h-auto block border border-liberation-neutral-800"
                loading="lazy"
              />
            ))}
          </div>
        </section>

        {/* Pull quote */}
        <section
          className="my-20 py-16 text-center"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgb(10,10,10) 50%, transparent 100%)',
          }}
        >
          <p className="font-disrupt italic text-2xl md:text-3xl lg:text-4xl leading-snug text-white max-w-[34ch] mx-auto m-0">
            Seven directions. <span className="not-italic font-display font-black uppercase tracking-tight text-liberation-gold-divine">One man's life.</span> A way back to ourselves.
          </p>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-liberation-neutral-500 mt-8 mb-0">
            Compass · workshop record · 2026
          </p>
        </section>

        {/* Reserve form */}
        <section
          id="reserve"
          className="mb-20 border-t-8 border-liberation-sovereignty-gold pt-12"
        >
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            Reserve your copy
          </span>

          {submitted ? (
            <div className="mt-6">
              <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl m-0 mb-4">
                You're on the list.
              </h2>
              <p className="font-disrupt italic text-lg text-liberation-neutral-300 max-w-[50ch] m-0">
                We'll write when the print run triggers — payment then, delivery soon after.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl m-0 mt-4 mb-4">
                Tell us you're in.
              </h2>
              <p className="font-disrupt italic text-lg text-liberation-neutral-300 max-w-[55ch] mb-10">
                No payment yet. The card gets charged when the run triggers — and only then. Don't hit threshold? Nothing happens to your card.
              </p>

              <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-name" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-email" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="c-qty" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    How many copies?
                  </label>
                  <select
                    id="c-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 10].map((n) => (
                      <option key={n} value={n} className="bg-liberation-black-power">
                        {n} {n === 1 ? 'copy' : 'copies'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="c-note" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Anything you want to tell us?{' '}
                    <span className="normal-case tracking-normal text-liberation-neutral-700 font-normal">— optional</span>
                  </label>
                  <textarea
                    id="c-note"
                    rows={3}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Why this matters to you. Who you'd give a copy to."
                    className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold resize-y"
                  />
                </div>

                {error && (
                  <p className="md:col-span-2 m-0 text-base text-liberation-error">{error}</p>
                )}

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !email.trim()}
                    className="bg-liberation-gold-divine text-liberation-black-power border-0 rounded-none px-8 py-5 font-display font-black text-sm tracking-[0.15em] uppercase cursor-pointer transition-colors hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Reserving…' : 'Reserve my copy →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        {/* Related — single inline line, not over-built cards */}
        <section className="mb-20 border-t border-liberation-neutral-800 pt-8">
          <p className="font-disrupt italic text-base text-liberation-neutral-500 m-0">
            Read all 19 panels online, free, at{' '}
            <a
              href="https://compass.blkoutuk.com/novel"
              target="_blank"
              rel="noopener"
              className="not-italic font-display font-bold uppercase tracking-[0.15em] text-sm text-liberation-sovereignty-gold hover:text-liberation-gold-divine"
            >
              compass.blkoutuk.com →
            </a>
          </p>
        </section>

        {/* FOOT */}
        <footer className="border-t border-liberation-neutral-800 py-8 text-liberation-neutral-500 text-sm flex justify-between flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-4">
            <img src="/images/blkout-logo-white.png" alt="BLKOUT" className="h-8 w-auto opacity-60" />
            BLKOUT CBS · Black queer men in the UK building infrastructure we own.
          </span>
          <span className="font-mono">blkoutuk.com</span>
        </footer>
      </div>
    </main>
  );
}
