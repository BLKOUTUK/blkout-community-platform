import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface GbpParisInterestPageProps {
  onNavigate?: (tab: string) => void;
}

const EVENT_SLUG = 'gbp-paris-2026';

type InterestLevel = 'definitely' | 'if-organised' | 'keep-informed';

const INTEREST_OPTIONS: { value: InterestLevel; title: string; body: string }[] = [
  {
    value: 'definitely',
    title: 'Going anyway',
    body: "I'm planning to be there — happy to meet up with the BLKOUT crowd in Paris.",
  },
  {
    value: 'if-organised',
    title: 'If we organised a group',
    body: "I'd seriously consider it if BLKOUT pulled together a group — shared travel, accommodation, the company.",
  },
  {
    value: 'keep-informed',
    title: 'Keep me informed',
    body: "Not sure yet. Send me what you find out.",
  },
];

export default function GbpParisInterestPage({ onNavigate }: GbpParisInterestPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interestLevel, setInterestLevel] = useState<InterestLevel | ''>('');
  const [couldHelp, setCouldHelp] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('liberation');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !interestLevel) return;
    setSubmitting(true);
    setError(null);

    const params = new URLSearchParams(window.location.search);
    const { error: insertError } = await supabase
      .from('event_interest')
      .insert({
        event_slug: EVENT_SLUG,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        interest_level: interestLevel,
        could_help_organise: couldHelp,
        notes: notes.trim() || null,
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
      });

    if (insertError) {
      const isDuplicate =
        insertError.code === '23505' || /duplicate/i.test(insertError.message);
      setError(
        isDuplicate
          ? "You're already on the list — we'll be in touch as plans firm up."
          : "Couldn't save right now. Try again, or email rob@blkoutuk.com.",
      );
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="bg-liberation-black-power min-h-screen px-6 md:px-12 text-white">
      <div className="max-w-4xl mx-auto">

        <div className="pt-6 flex justify-between items-center text-liberation-neutral-500 text-xs tracking-[0.2em] uppercase font-bold">
          <a
            href="/"
            onClick={goHome}
            className="inline-flex items-center gap-3"
            aria-label="BLKOUT"
          >
            <img
              src="/Branding and logos/blkoutlogo_wht_transparent.png"
              alt="BLKOUT"
              className="h-10 w-auto block"
            />
          </a>
          <span>Travel · Canvas</span>
        </div>

        <header className="pt-16 pb-12 md:pt-20 md:pb-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            Global Black Pride · 2026
          </span>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-5xl sm:text-6xl md:text-7xl mt-6 mb-0">
            Paris.<br />
            <span className="text-liberation-gold-divine">9–13 September.</span>
          </h1>
          <p className="font-disrupt italic text-xl md:text-2xl leading-snug text-liberation-neutral-300 max-w-[44ch] mt-6 mb-0">
            Should we organise a BLKOUT group?
          </p>
          <hr className="h-1.5 bg-liberation-sovereignty-gold border-0 mt-10 w-24" />
        </header>

        <section className="mb-16 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6 lg:gap-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
            What this is
          </span>
          <div className="space-y-6 max-w-[55ch] text-liberation-neutral-300 text-lg leading-relaxed">
            <p className="m-0">
              Global Black Pride lands in Paris this September — five days of programming,
              5,000+ Black LGBTQI+ people from across the diaspora,{' '}
              <em className="font-disrupt italic">"a global platform to celebrate
              all Black LGBTQI+ diversity"</em>.
            </p>
            <p className="m-0">
              We're sounding out whether there's appetite for a BLKOUT group to travel
              together. Shared travel, shared accommodation, shared company.{' '}
              <em className="font-disrupt italic">Eurostar to Gare du Nord and a
              walk to the venue. Cheaper, kinder, more fun.</em>
            </p>
            <p className="m-0">
              Tell us where you sit. No commitment yet — this is a canvas. If enough
              people are in, we'll work the rest out together.
            </p>
          </div>
        </section>

        <section
          id="form"
          className="mb-20 border-t-8 border-liberation-sovereignty-gold pt-12"
        >
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            Tell us where you sit
          </span>

          {submitted ? (
            <div className="mt-6">
              <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl m-0 mb-4">
                Logged.
              </h2>
              <p className="font-disrupt italic text-lg text-liberation-neutral-300 max-w-[50ch] m-0">
                We'll write as plans firm up. If you said you could help organise,
                expect a separate note from Rob about that side of things.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl m-0 mt-4 mb-4">
                Three checkboxes and we go.
              </h2>
              <p className="font-disrupt italic text-lg text-liberation-neutral-300 max-w-[55ch] mb-10">
                One minute. No commitment. We're collecting weight, not money.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-8 max-w-2xl">
                <fieldset className="space-y-3 border-0 p-0 m-0">
                  <legend className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500 mb-3 p-0">
                    Where are you?
                  </legend>
                  {INTEREST_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`block border cursor-pointer p-5 transition-colors ${
                        interestLevel === opt.value
                          ? 'border-liberation-sovereignty-gold bg-liberation-sovereignty-gold/5'
                          : 'border-liberation-neutral-800 hover:border-liberation-neutral-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="interest"
                        value={opt.value}
                        checked={interestLevel === opt.value}
                        onChange={() => setInterestLevel(opt.value)}
                        className="sr-only"
                      />
                      <div className="font-display font-black uppercase tracking-tight text-lg text-white m-0">
                        {opt.title}
                      </div>
                      <div className="font-disrupt italic text-base text-liberation-neutral-400 mt-1 m-0">
                        {opt.body}
                      </div>
                    </label>
                  ))}
                </fieldset>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="g-name" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                      Name
                    </label>
                    <input
                      id="g-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="g-email" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                      Email
                    </label>
                    <input
                      id="g-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couldHelp}
                    onChange={(e) => setCouldHelp(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-liberation-sovereignty-gold cursor-pointer"
                  />
                  <span className="text-liberation-neutral-300 text-base leading-relaxed">
                    <span className="font-display font-bold uppercase tracking-[0.15em] text-sm text-white block mb-1">
                      I could help organise
                    </span>
                    Logistics, group bookings, on-the-ground stuff. No formal role —
                    just willing to share the load if a group goes.
                  </span>
                </label>

                <div className="flex flex-col gap-2">
                  <label htmlFor="g-notes" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Anything else?{' '}
                    <span className="normal-case tracking-normal text-liberation-neutral-700 font-normal">— optional</span>
                  </label>
                  <textarea
                    id="g-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What would help you say yes. Anyone you'd want to travel with. Constraints we should know about."
                    className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold resize-y"
                  />
                </div>

                {error && (
                  <p className="m-0 text-base text-liberation-error">{error}</p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !email.trim() || !interestLevel}
                    className="bg-liberation-gold-divine text-liberation-black-power border-0 rounded-none px-8 py-5 font-display font-black text-sm tracking-[0.15em] uppercase cursor-pointer transition-colors hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Logging…' : 'Add me to the canvas →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        <section className="mb-20 border-t border-liberation-neutral-800 pt-8">
          <p className="font-disrupt italic text-base text-liberation-neutral-500 m-0">
            More about Global Black Pride at{' '}
            <a
              href="https://globalblackpride.org/"
              target="_blank"
              rel="noopener"
              className="not-italic font-display font-bold uppercase tracking-[0.15em] text-sm text-liberation-sovereignty-gold hover:text-liberation-gold-divine"
            >
              globalblackpride.org →
            </a>
          </p>
        </section>

        <footer className="border-t border-liberation-neutral-800 py-8 text-liberation-neutral-500 text-sm flex justify-between flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-4">
            <img src="/Branding and logos/blkoutlogo_wht_transparent.png" alt="BLKOUT" className="h-8 w-auto opacity-60" />
            BLKOUT CBS · Black queer men in the UK building infrastructure we own.
          </span>
          <span className="font-mono">blkoutuk.com</span>
        </footer>
      </div>
    </main>
  );
}
