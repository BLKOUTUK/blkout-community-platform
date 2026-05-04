interface ShopPageProps {
  onNavigate?: (tab: string) => void;
}

interface RangeTileProps {
  num: string;
  name: string;
  brief: string;
  href: string;
}

function RangeTile({ num, name, brief, href }: RangeTileProps) {
  return (
    <a
      href={href}
      className="border border-liberation-neutral-800 p-6 aspect-[4/5] flex flex-col justify-between transition-colors hover:border-liberation-sovereignty-gold hover:bg-[rgba(212,175,55,0.04)]"
    >
      <div
        className="flex-1 -mx-2 -mt-2 mb-4 border border-dashed border-liberation-neutral-800 grid place-items-center text-liberation-neutral-700 text-xs tracking-[0.2em] uppercase"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(212,175,55,0.04) 0, rgba(212,175,55,0.04) 8px, transparent 8px, transparent 16px)',
          backgroundColor: '#0A0A0A',
        }}
      >
        [range image]
      </div>
      <span className="font-mono text-xs text-liberation-sovereignty-gold tracking-[0.2em] uppercase">
        {num}
      </span>
      <h3 className="font-display font-black uppercase tracking-tight text-2xl mt-2 mb-1 m-0">
        {name}
      </h3>
      <p className="font-disrupt italic text-liberation-neutral-500 text-base m-0">{brief}</p>
    </a>
  );
}

interface SectionHeaderProps {
  roman: string;
  name: string;
  pitch: string;
}

function SectionHeader({ roman, name, pitch }: SectionHeaderProps) {
  return (
    <header>
      <span className="font-mono text-sm text-liberation-sovereignty-gold tracking-[0.2em] uppercase block mb-4">
        {roman}
      </span>
      <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-6xl leading-none m-0">
        {name}
      </h2>
      <p className="font-disrupt italic text-xl leading-snug text-liberation-neutral-300 mt-6 mb-0 max-w-[50ch]">
        {pitch}
      </p>
    </header>
  );
}

function CTA({
  href,
  label,
  primary,
  external,
  onClick,
}: {
  href: string;
  label: string;
  primary?: boolean;
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const baseClasses =
    'inline-flex items-baseline gap-3 mt-8 px-6 py-4 border font-display font-black text-sm tracking-[0.15em] uppercase transition-colors';
  const styleClasses = primary
    ? 'bg-liberation-gold-divine text-liberation-black-power border-liberation-gold-divine hover:bg-white hover:border-white'
    : 'border-liberation-neutral-800 text-white hover:border-liberation-sovereignty-gold hover:text-liberation-gold-divine';
  const props = external ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <a href={href} className={`${baseClasses} ${styleClasses}`} onClick={onClick} {...props}>
      {label}
    </a>
  );
}

export default function ShopPage({ onNavigate }: ShopPageProps) {
  const goMembership = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('shop/membership');
    }
  };

  const placeholderBoxStyle = {
    backgroundImage:
      'repeating-linear-gradient(45deg, rgba(212,175,55,0.04) 0, rgba(212,175,55,0.04) 8px, transparent 8px, transparent 16px)',
    backgroundColor: '#0A0A0A',
  };

  return (
    <main className="bg-liberation-black-power min-h-screen px-6 md:px-12 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Top crumb with logo */}
        <div className="pt-6 flex justify-between items-center text-liberation-neutral-500 text-xs tracking-[0.2em] uppercase font-bold">
          <a href="/" className="inline-flex items-center gap-3" aria-label="BLKOUT home">
            <img src="/images/blkout-logo-white.png" alt="BLKOUT" className="h-10 w-auto block" />
            <span className="text-liberation-sovereignty-gold text-[0.7rem] tracking-[0.25em]">
              ← back to blkoutuk.com
            </span>
          </a>
          <span>Issue 01 · 2026</span>
        </div>

        {/* HERO */}
        <header className="pt-16 pb-12 md:pt-24 md:pb-20">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            BLKOUT Shop
          </span>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-8xl lg:text-9xl mt-6 mb-0">
            What we make.<br />
            <span className="text-liberation-gold-divine">What we ask.</span>
          </h1>
          <p className="font-disrupt italic text-xl md:text-2xl lg:text-[1.75rem] leading-snug text-liberation-neutral-300 max-w-[42ch] mt-8 mb-0">
            Six paths into a Black queer cooperative — buy what we made, sustain what we're making, give what you can.
          </p>
          <hr className="h-1.5 bg-liberation-sovereignty-gold border-0 mt-12 w-24" />
        </header>

        {/* PREFACE */}
        <section className="border-t border-b border-liberation-neutral-800 py-12 mb-20 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6 lg:gap-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
            What this is
          </span>
          <p className="font-disrupt italic text-xl md:text-2xl leading-snug text-white max-w-[50ch] m-0">
            BLKOUT is a{' '}
            <span className="not-italic font-display font-black uppercase tracking-tight text-liberation-sovereignty-gold">
              Community Benefit Society
            </span>
            . The shop is how the cooperative pays for itself — and how you find what we make. Wear it, support a print run, become a member, learn with us, gather with us, or just back the work.
          </p>
        </section>

        {/* I · APPAREL */}
        <section className="border-t-8 border-liberation-sovereignty-gold pt-12 pb-16">
          <SectionHeader
            roman="I · Wear it"
            name="Apparel."
            pitch="Three ranges, fulfilled by Teemill — print-on-demand, organic, low-waste. Read what each range is for, then buy where it's printed."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mt-8">
            <RangeTile
              num="range 01"
              name="BLKOUT Proud"
              brief="Pride pieces — joy as a political act."
              href="/shop/apparel/blkout-proud"
            />
            <RangeTile
              num="range 02"
              name="Brother to Brother"
              brief="Joseph Beam's revolutionary act, worn out loud."
              href="/shop/apparel/brother-to-brother"
            />
            <RangeTile
              num="range 03"
              name="Black Queer Icons UK"
              brief="Our forebears — worn into the present."
              href="/shop/apparel/icons"
            />
          </div>
          <CTA href="/shop/apparel" label="See the ranges →" />
          <p className="font-disrupt italic text-sm text-liberation-neutral-500 mt-6 max-w-[60ch]">
            BLKOUT earns the margin, Teemill prints + ships, no inventory risk. The buying decision happens here; the cart happens there.
          </p>
        </section>

        {/* II · DROPS */}
        <section className="border-t-8 border-liberation-sovereignty-gold pt-12 pb-16">
          <SectionHeader
            roman="II · Pre-orders"
            name="Drops."
            pitch="Limited print runs, threshold-to-print. You commit at order; we charge once enough of us are in. No inventory, no waste."
          />
          <div className="mt-8">
            <a
              href="/shop/drops/compass-journal"
              className="border border-liberation-neutral-800 border-t-4 border-t-liberation-gold-divine p-8 flex flex-col min-h-[22rem] transition-colors hover:border-liberation-sovereignty-gold hover:border-t-liberation-gold-divine"
            >
              <img
                src="/images/drops/compass-journal-card.jpg"
                alt="Ivor's Compass print journal"
                className="w-full h-auto block mb-6"
              />
              <span className="font-mono text-xs text-liberation-sovereignty-gold tracking-[0.2em] uppercase">
                drop 01 · printing soon
              </span>
              <h3 className="font-display font-black uppercase tracking-tight text-2xl md:text-3xl my-2 leading-none">
                Ivor's Compass — print journal
              </h3>
              <p className="font-disrupt italic text-liberation-neutral-300 text-base leading-snug m-0">
                The graphic novel and workshop record, in print. Pre-order to bring it home.
              </p>
            </a>
          </div>
          <CTA href="/shop/drops" label="All current drops →" />
          <p className="font-disrupt italic text-sm text-liberation-neutral-500 mt-6 max-w-[60ch]">
            You're not charged until the print run triggers. If a drop doesn't reach threshold, no card gets touched. More drops as partnerships confirm.
          </p>
        </section>

        {/* III · MEMBERSHIP */}
        <section className="border-t-8 border-liberation-sovereignty-gold pt-12 pb-16">
          <SectionHeader
            roman="III · Become"
            name="Membership."
            pitch="Three ways into the cooperative. None are about influence — governance is one-member-one-vote, regardless. All are about access."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mt-8">
            {[
              { roman: 'I', price: 'In-kind', name: 'Activity, not money', brief: 'Refer, share, upvote, witness. Everyone gives something.' },
              { roman: 'II', price: '£3 /mo', name: 'Sustaining', brief: 'One coffee a month, given to a cooperative you can vote inside.' },
              { roman: 'III', price: '£10 /mo', name: 'Patron', brief: "Same vote. Same room. More of the work that gets made because you're sustaining it." },
            ].map((t) => (
              <a
                key={t.roman}
                href="/shop/membership"
                onClick={goMembership}
                className="border border-liberation-neutral-800 p-6 transition-colors hover:border-liberation-sovereignty-gold hover:bg-[rgba(212,175,55,0.04)]"
              >
                <span className="font-mono text-xs text-liberation-sovereignty-gold tracking-[0.2em] uppercase">
                  {t.roman}
                </span>
                <p className="font-mono text-2xl text-liberation-gold-divine font-medium my-1">{t.price}</p>
                <p className="font-display font-black uppercase tracking-tight text-base my-1">{t.name}</p>
                <p className="font-disrupt italic text-sm text-liberation-neutral-500 m-0">{t.brief}</p>
              </a>
            ))}
          </div>
          <CTA href="/shop/membership" label="Join the cooperative →" primary onClick={goMembership} />
        </section>

        {/* IV · EVENTS */}
        <section className="border-t-8 border-liberation-sovereignty-gold pt-12 pb-16">
          <SectionHeader
            roman="IV · What's on"
            name="Events."
            pitch="Workshops, panels, gatherings. Tickets where they're priced; free where they're not. Sustaining and patron tiers carry concessions the board is finalising."
          />
          <a
            href="https://events.blkoutuk.com"
            target="_blank"
            rel="noopener"
            className="grid grid-cols-1 md:grid-cols-[7rem_1fr_auto] items-center gap-4 md:gap-8 border border-liberation-neutral-800 p-8 mt-8 transition-colors hover:border-liberation-sovereignty-gold"
          >
            <div className="font-mono text-sm text-liberation-sovereignty-gold tracking-[0.1em] uppercase leading-tight">
              <strong className="block text-liberation-gold-divine text-3xl font-medium leading-none mb-1">—</strong>
              <span>next event<br />tba</span>
            </div>
            <div>
              <h3 className="font-display font-black uppercase tracking-tight text-xl m-0">
                Pulled from events.blkoutuk.com
              </h3>
              <p className="font-disrupt italic text-liberation-neutral-500 text-base mt-1 m-0">
                Single most-imminent event surfaces here once API is wired. Static placeholder for now.
              </p>
            </div>
            <span className="font-display font-black tracking-[0.15em] uppercase text-sm text-liberation-sovereignty-gold">
              RSVP →
            </span>
          </a>
          <CTA href="https://events.blkoutuk.com" label="All events at events.blkoutuk.com →" external />
        </section>

        {/* V · COURSES */}
        <section className="border-t-8 border-liberation-sovereignty-gold pt-12 pb-16">
          <SectionHeader
            roman="V · Learn"
            name="Courses."
            pitch="BLKOUT-developed learning, delivered through BLKOUTHUB. The teacher is the headline. The first cohort is in the works."
          />
          <div className="border border-liberation-neutral-800 p-8 mt-8 font-disrupt italic text-lg text-liberation-neutral-500">
            First cohort coming. Until then, this section stays quiet — we'll tell you when it opens, not before.
          </div>
        </section>

        {/* VI · DONATE */}
        <section className="border-t-8 border-liberation-sovereignty-gold pt-12 pb-16 border-b border-b-liberation-neutral-800">
          <SectionHeader
            roman="VI · Support"
            name="Donate."
            pitch="Any amount. No strings. Zeffy charges no platform fees, so 100% reaches BLKOUT."
          />
          <CTA href="#" label="Make a donation →" primary />
          <p className="font-disrupt italic text-sm text-liberation-neutral-500 mt-6 max-w-[60ch]">
            Donations don't get you a vote — that's what membership is for. They just back the work.
          </p>
        </section>

        {/* DISRUPTION — asset lock */}
        <section
          className="my-20 py-16 text-center"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgb(10,10,10) 50%, transparent 100%)',
          }}
        >
          <p className="font-disrupt italic text-2xl md:text-3xl lg:text-4xl leading-snug text-white max-w-[32ch] mx-auto m-0">
            Any surplus serves the community.{' '}
            <span className="not-italic font-display font-black uppercase tracking-tight text-liberation-gold-divine">
              Never extracted.
            </span>
          </p>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-liberation-neutral-500 mt-8 mb-0">
            BLKOUT CBS · asset lock
          </p>
        </section>

        {/* HONEST CLOSE */}
        <section
          className="mb-16 p-10 border border-liberation-neutral-800 border-l-4"
          style={{ borderLeftColor: '#E31E24' }}
        >
          <p className="font-display font-black uppercase tracking-tight text-xl m-0 mb-3">
            Where this is right now
          </p>
          <p className="text-liberation-neutral-300 m-0 text-base leading-relaxed max-w-[60ch]">
            Some of these surfaces are still being built. Apparel and the membership page are live; the drops and courses sections will fill in as each thing opens. We mark each surface honestly so you know what's ready and what's promised.
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
