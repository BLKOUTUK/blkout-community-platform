import { useState } from 'react';
import { supabase } from '@/lib/supabase';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
      {children}
    </span>
  );
}

type Tier = 'free' | 'three' | 'ten';

interface TierBlockProps {
  roman: string;
  label: string;
  name: string;
  priceMain: string;
  priceMeta: string;
  pitch: string;
  accessHead: string;
  accessItems: string[];
  bringHead?: string;
  bringItems?: string[];
}

function TierBlock({
  roman,
  label,
  name,
  priceMain,
  priceMeta,
  pitch,
  accessHead,
  accessItems,
  bringHead,
  bringItems,
}: TierBlockProps) {
  return (
    <article className="border-t-8 border-liberation-sovereignty-gold pt-12 pb-16 last:border-b last:border-b-liberation-neutral-800">
      <header className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-end mb-6">
        <div>
          <span className="font-mono text-sm tracking-[0.2em] uppercase text-liberation-sovereignty-gold block mb-4">
            {roman} · {label}
          </span>
          <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-6xl leading-none m-0">
            {name}
          </h2>
        </div>
        <div className="font-mono tabular-nums font-medium text-liberation-gold-divine text-4xl md:text-6xl leading-none whitespace-nowrap text-right self-end">
          {priceMain}
          <small className="block font-sans font-normal text-sm text-liberation-neutral-500 tracking-[0.15em] uppercase mt-2">
            {priceMeta}
          </small>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16">
        <p className="font-disrupt italic text-xl leading-snug text-liberation-neutral-300 m-0 max-w-[36ch]">
          {pitch}
        </p>
        <div className="space-y-8">
          {bringItems && bringHead && (
            <div>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-sovereignty-gold m-0 mb-2">
                {bringHead}
              </p>
              <ul className="m-0 p-0 list-none">
                {bringItems.map((item, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[1.25rem_1fr] gap-3 py-3 border-t border-liberation-neutral-800 text-base leading-snug"
                  >
                    <span className="font-bold text-liberation-sovereignty-gold">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500 m-0 mb-2">
              {accessHead}
            </p>
            <ul className="m-0 p-0 list-none">
              {accessItems.map((item, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[1.25rem_1fr] gap-3 py-3 border-t border-liberation-neutral-800 text-base leading-snug"
                >
                  <span className="font-bold text-liberation-sovereignty-gold">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MembershipPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<Tier>('three');
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const params = new URLSearchParams(window.location.search);

    const { error: insertError } = await supabase
      .from('membership_interest')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        tier_chosen: tier,
        motivation_text: motivation.trim() || null,
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
      });

    if (insertError) {
      const isDuplicate = insertError.code === '23505' || /duplicate/i.test(insertError.message);
      setError(
        isDuplicate
          ? "You're already on the list — we'll be in touch when the doors open."
          : "Couldn't save your interest right now. Try again, or email rob@blkoutuk.com.",
      );
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="bg-liberation-black-power min-h-screen px-6 md:px-12 py-12 md:py-16 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <header className="pt-12 pb-16 md:pt-24 md:pb-24">
          <Eyebrow>
            <span className="text-liberation-sovereignty-gold">Cooperative Membership · BLKOUT CBS</span>
          </Eyebrow>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-8xl lg:text-9xl mt-6 mb-0">
            Three ways<br />
            <span className="text-liberation-gold-divine">in.</span>
          </h1>
          <p className="font-disrupt italic text-xl md:text-2xl lg:text-[1.75rem] leading-snug text-liberation-neutral-300 max-w-[38ch] mt-8 mb-0">
            None of them are about influence. All of them are about access — and about whether we get to keep building this together.
          </p>
          <hr className="h-1.5 bg-liberation-sovereignty-gold border-0 mt-12 w-24" />
        </header>

        {/* Manifesto band */}
        <section className="border-t border-b border-liberation-neutral-800 py-16 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-8 lg:gap-16 items-start">
            <Eyebrow>What this is</Eyebrow>
            <div>
              <p className="font-disrupt italic text-2xl md:text-3xl leading-snug text-white m-0 max-w-[40ch]">
                BLKOUT is a{' '}
                <span className="not-italic font-display font-black uppercase tracking-tight text-liberation-sovereignty-gold">
                  Community Benefit Society
                </span>{' '}
                — Black queer men in the UK building infrastructure we own together.
              </p>
              <ul className="list-none m-0 p-0 mt-8 text-liberation-neutral-300 text-base leading-relaxed">
                {[
                  'Asset-locked: any surplus serves the community, never extracted.',
                  'Governance is one-member-one-vote. Tiers are about access to additional services, never influence.',
                  'In-kind activity is real membership. Sustaining money pays for the work, and for the services we build at each tier.',
                  "Concessions and in-kind exchange exist for anyone the prices don't fit.",
                ].map((line, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[2.5rem_1fr] gap-4 py-4 border-t border-dashed border-liberation-neutral-800 first:border-t-0"
                  >
                    <span className="font-mono text-xs tracking-[0.1em] text-liberation-sovereignty-gold pt-1">
                      0{i + 1}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="mb-24" aria-label="Membership tiers">
          <TierBlock
            roman="I"
            label="In-kind"
            name="In-kind."
            priceMain="In-kind"
            priceMeta="activity, not money"
            pitch="You're in — and you're active. Not everyone has £3 to spare; everyone has something. At this tier you give what you can in time, attention, and signal-boosting."
            bringHead="What you bring"
            bringItems={[
              'Refer one person to BLKOUT each year — bring someone who belongs.',
              'Share an article, an event, or a campaign — make this cooperative findable.',
              'Upvote news on the platform — keep what matters visible.',
              'A social post, a comment, a witness — show up where the conversation is.',
            ]}
            accessHead="What this opens"
            accessItems={[
              'Membership of the BLKOUT CBS — full one-member-one-vote at the AGM.',
              'The newsletter, the events feed, the platform.',
              'BLKOUTHUB community space.',
              'Concessions on paid programmes, where they exist.',
            ]}
          />
          <TierBlock
            roman="II"
            label="Sustaining"
            name="£3 /mo"
            priceMain="£3"
            priceMeta="per month · £36 / year"
            pitch="The price of one coffee a month, given to a cooperative you can vote inside. Most of our work is paid for at this level."
            accessHead="Everything in I, plus"
            accessItems={[
              'Discounted entry to events and paid programmes.',
              'Early sight of new things — courses, commissions, pre-orders — before public launch.',
              "Briefings on what we're building and how money's been spent.",
            ]}
          />
          <TierBlock
            roman="III"
            label="Patron"
            name="£10 /mo"
            priceMain="£10"
            priceMeta="per month · £120 / year"
            pitch="For those with more to give. Same vote. Same room. More of the work that gets made because you're sustaining it."
            accessHead="Everything in II, plus"
            accessItems={[
              'Deeper discounts on events, plus a guest pass for someone you bring.',
              'Invitations to patron-tier gatherings and peer spaces as we build them.',
              "Named (or unnamed, your call) in the cooperative's annual letter.",
            ]}
          />
        </section>

        {/* Disruption — tiers ≠ hierarchy */}
        <section
          className="my-24 py-16 text-center"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgb(10,10,10) 50%, transparent 100%)',
          }}
          aria-label="Governance principle"
        >
          <p className="font-disrupt italic text-2xl md:text-3xl lg:text-4xl leading-snug text-white max-w-[28ch] mx-auto m-0">
            Tiers are not a hierarchy.{' '}
            <span className="not-italic font-display font-black uppercase tracking-tight text-liberation-gold-divine">
              One member · one vote
            </span>
            , regardless of what you pay.
          </p>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-liberation-neutral-500 mt-8 mb-0">
            BLKOUT CBS · Rule 4.2
          </p>
        </section>

        {/* Honest pre-launch state */}
        <section
          className="mb-16 p-10 border border-liberation-neutral-800 border-l-4"
          style={{ borderLeftColor: '#E31E24' }}
          id="register"
        >
          <p className="font-display font-black uppercase tracking-tight text-xl m-0 mb-3">
            Where this is right now
          </p>
          <p className="text-liberation-neutral-300 m-0 text-base leading-relaxed max-w-[60ch]">
            The board is finalising the structure — exact discounts, guest passes, the shape of patron services. The benefits above point the direction; the detail comes before launch. Nothing on this page charges you anything yet. Tell us which way in feels right — we'll write the day the doors open, and again if anything material changes.
          </p>
        </section>

        {/* Interest form */}
        <section className="mb-32 border-t-8 border-liberation-sovereignty-gold pt-12">
          <Eyebrow>
            <span className="text-liberation-sovereignty-gold">Register interest</span>
          </Eyebrow>

          {submitted ? (
            <div className="mt-6">
              <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl m-0 mb-4">
                You're on the list.
              </h2>
              <p className="font-disrupt italic text-lg text-liberation-neutral-300 max-w-[50ch] m-0">
                We'll write to you the day the doors open — and again if anything material changes between now and then.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl m-0 mt-4 mb-4">
                Walk through<br />when we open.
              </h2>
              <p className="font-disrupt italic text-lg text-liberation-neutral-300 max-w-[50ch] mb-10">
                No payment now. Just your name on the list — and a note about which way in feels right today.
              </p>

              <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div className="flex flex-col gap-2">
                  <label htmlFor="m-name" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Name
                  </label>
                  <input
                    id="m-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="m-email" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Email
                  </label>
                  <input
                    id="m-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border border-liberation-neutral-800 rounded-none px-4 py-3 text-white text-base outline-none transition-colors focus:border-liberation-sovereignty-gold"
                  />
                </div>

                <div className="flex flex-col gap-3 md:col-span-2">
                  <span className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Which way in feels right today?
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {(
                      [
                        { value: 'free' as Tier, label: 'I · In-kind', sub: 'Activity, not money. Everyone gives something.' },
                        { value: 'three' as Tier, label: 'II · £3 /mo', sub: 'Sustaining the work most of us do.' },
                        { value: 'ten' as Tier, label: 'III · £10 /mo', sub: 'Patron — bring someone with you.' },
                      ]
                    ).map((opt) => {
                      const checked = tier === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`border p-4 cursor-pointer transition-colors ${
                            checked
                              ? 'border-liberation-sovereignty-gold bg-[rgba(212,175,55,0.08)]'
                              : 'border-liberation-neutral-800 hover:border-[#8a6f1f]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tier"
                            value={opt.value}
                            checked={checked}
                            onChange={() => setTier(opt.value)}
                            className="hidden"
                          />
                          <span className={`font-display font-black uppercase tracking-tight text-base block ${checked ? 'text-liberation-gold-divine' : 'text-white'}`}>
                            {opt.label}
                          </span>
                          <small className={`block mt-1 text-sm font-disrupt italic ${checked ? 'text-white' : 'text-liberation-neutral-500'}`}>
                            {opt.sub}
                          </small>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="m-note" className="font-display font-bold uppercase tracking-[0.2em] text-xs text-liberation-neutral-500">
                    Anything you want us to know?{' '}
                    <span className="normal-case tracking-normal text-liberation-neutral-700 font-normal">— optional</span>
                  </label>
                  <textarea
                    id="m-note"
                    rows={3}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="What you'd want from a Black queer cooperative. What would make this feel like yours."
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
                    {submitting ? 'Adding you…' : 'Add me to the list →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        {/* Foot hairline */}
        <footer className="border-t border-liberation-neutral-800 py-8 text-liberation-neutral-500 text-sm flex justify-between flex-wrap gap-4">
          <span>BLKOUT CBS · Black queer men in the UK building infrastructure we own.</span>
          <span className="font-mono">blkoutuk.com</span>
        </footer>
      </div>
    </main>
  );
}
