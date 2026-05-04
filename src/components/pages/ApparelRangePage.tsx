interface ApparelRangePageProps {
  range: 'blkout-proud' | 'brother-to-brother' | 'icons';
  onNavigate?: (tab: string) => void;
}

// Asset convention (drop in when ready, no code change required):
//   public/videos/apparel/{slug}.mp4    — looping muted hero video, 10–15s
//   public/images/apparel/{slug}-poster.jpg — poster frame + range card image
// If heroVideo is set, the page renders a <video>. Else if heroPoster is set,
// it renders a <img>. Else falls back to the hatched placeholder.
interface RangeContent {
  num: string;
  name: string;
  subtitle: string;
  imageNote: string;
  heroVideo?: string;
  heroPoster?: string;
  paragraphs: string[];
  pull?: { quote: string; attr: string };
  teemillHref: string;
  teemillLabel: string;
  imageNoteRight?: string;
}

const CONTENT: Record<ApparelRangePageProps['range'], RangeContent> = {
  'blkout-proud': {
    num: 'Range 01',
    name: 'BLKOUT Proud.',
    subtitle: 'Pride pieces — joy as a political act.',
    imageNote: '[range hero · 2018 BOPride archive — to be confirmed]',
    paragraphs: [
      "Pride isn't a season. It's the daily insistence that we're here, that we love each other, that we won't be made small. The Proud range carries that — for the parade and for the days that need it more.",
      'Each piece is for the moment of being seen as Black, queer, and unafraid in the same breath. Wear it where it matters. Wear it where it costs something.',
    ],
    pull: {
      quote: 'You are your best thing.',
      attr: 'Toni Morrison',
    },
    teemillHref: 'https://blkoutuk.teemill.com',
    teemillLabel: 'Browse the Proud range on Teemill →',
    imageNoteRight: 'Photography from BLKOUT @ Pride 2018 — usable as range mood.',
  },
  'brother-to-brother': {
    num: 'Range 02',
    name: 'Brother to Brother.',
    subtitle: "Joseph Beam's revolutionary act, worn out loud.",
    imageNote: '[range hero · Joseph Beam tribute, archive imagery]',
    paragraphs: [
      "In 1986 Joseph Beam wrote: Black men loving Black men is the revolutionary act. He was right then. He's right now. The Brother-to-Brother range carries that line forward — onto backs, onto chests, into the daily.",
      "These pieces aren't subtle. They're not meant to be. They're for the brothers who already know — and for the ones still working out that knowing each other is the work.",
    ],
    pull: {
      quote: 'Black men loving Black men is the revolutionary act.',
      attr: 'Joseph Beam, In the Life (1986)',
    },
    teemillHref: 'https://blkoutuk.teemill.com',
    teemillLabel: 'Browse Brother-to-Brother on Teemill →',
  },
  icons: {
    num: 'Range 03',
    name: 'Black Queer Icons UK.',
    subtitle: 'Our forebears — worn into the present.',
    imageNote: '[range hero · forebear portraits, archive sourcing]',
    paragraphs: [
      'The names we weren\'t taught. The chain of Black queer UK lives that made our presence possible — gathered, named, and worn.',
      "Each piece in the Icons range carries a face from the lineage. Worn so it stays visible — to ourselves, and to whoever needs to see us. The archive isn't behind us. It's what we wear.",
    ],
    pull: {
      quote: 'There is power in naming yourself, in proclaiming to the world that you exist on your own terms.',
      attr: 'Diriye Osman',
    },
    teemillHref: 'https://blkoutuk.teemill.com',
    teemillLabel: 'Browse the Icons range on Teemill →',
  },
};

export default function ApparelRangePage({ range, onNavigate }: ApparelRangePageProps) {
  const c = CONTENT[range];

  const go = (tab: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(tab);
    }
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
          <a
            href="/shop/apparel"
            onClick={go('shop/apparel')}
            className="inline-flex items-center gap-3"
            aria-label="Apparel ranges"
          >
            <img src="/images/blkout-logo-white.png" alt="BLKOUT" className="h-10 w-auto block" />
            <span className="text-liberation-sovereignty-gold text-[0.7rem] tracking-[0.25em]">
              ← back to apparel
            </span>
          </a>
          <span>{c.num}</span>
        </div>

        {/* HERO */}
        <header className="pt-16 pb-12 md:pt-20 md:pb-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            BLKOUT Apparel · {c.num}
          </span>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-5xl sm:text-6xl md:text-8xl mt-6 mb-0">
            {c.name}
          </h1>
          <p className="font-disrupt italic text-xl md:text-2xl leading-snug text-liberation-neutral-300 max-w-[42ch] mt-6 mb-0">
            {c.subtitle}
          </p>
          <hr className="h-1.5 bg-liberation-sovereignty-gold border-0 mt-10 w-24" />
        </header>

        {/* Range hero — video > poster image > hatched placeholder */}
        <section className="mb-16">
          {c.heroVideo ? (
            <video
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={c.heroPoster}
              aria-label={`${c.name} promo`}
            >
              <source src={c.heroVideo} type="video/mp4" />
            </video>
          ) : c.heroPoster ? (
            <img
              src={c.heroPoster}
              alt={`${c.name} range hero`}
              className="w-full h-auto block"
            />
          ) : (
            <div
              className="border border-dashed border-liberation-neutral-800 min-h-[24rem] md:min-h-[32rem] grid place-items-center text-liberation-neutral-700 text-sm tracking-[0.2em] uppercase"
              style={placeholderStyle}
            >
              {c.imageNote}
            </div>
          )}
          {c.imageNoteRight && (
            <p className="font-disrupt italic text-sm text-liberation-neutral-500 mt-3 m-0">
              {c.imageNoteRight}
            </p>
          )}
        </section>

        {/* Editorial body */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6 lg:gap-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
            What this range is for
          </span>
          <div className="space-y-6 max-w-[55ch]">
            {c.paragraphs.map((p, i) => (
              <p key={i} className="text-liberation-neutral-300 text-lg leading-relaxed m-0">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Pull quote */}
        {c.pull && (
          <section
            className="my-20 py-16 text-center"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgb(10,10,10) 50%, transparent 100%)',
            }}
          >
            <p className="font-disrupt italic text-2xl md:text-3xl lg:text-4xl leading-snug text-white max-w-[34ch] mx-auto m-0">
              "{c.pull.quote}"
            </p>
            <p className="font-display text-xs tracking-[0.25em] uppercase text-liberation-neutral-500 mt-8 mb-0">
              — {c.pull.attr}
            </p>
          </section>
        )}

        {/* CTA — outbound to Teemill */}
        <section className="mb-20 border-t-8 border-liberation-sovereignty-gold pt-12">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            Buy the range
          </span>
          <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-5xl mt-4 mb-4 leading-none">
            Pick your size on Teemill.
          </h2>
          <p className="font-disrupt italic text-lg text-liberation-neutral-300 max-w-[55ch] mb-8">
            BLKOUT earns the margin. Teemill prints to order, ships in days, no inventory, no waste. Click out, pick a size, come back.
          </p>
          <a
            href={c.teemillHref}
            target="_blank"
            rel="noopener"
            className="inline-flex items-baseline gap-3 px-8 py-5 bg-liberation-gold-divine text-liberation-black-power border border-liberation-gold-divine font-display font-black text-sm tracking-[0.15em] uppercase transition-colors hover:bg-white hover:border-white"
          >
            {c.teemillLabel}
          </a>
          <p className="font-disrupt italic text-sm text-liberation-neutral-500 mt-6 max-w-[60ch]">
            Teemill carries the cart and the cards. We carry the story.
          </p>
        </section>

        {/* Other ranges */}
        <section className="mb-20 border-t border-liberation-neutral-800 pt-12">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
            The other ranges
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-6">
            {(Object.entries(CONTENT) as [ApparelRangePageProps['range'], RangeContent][])
              .filter(([slug]) => slug !== range)
              .map(([slug, other]) => (
                <a
                  key={slug}
                  href={`/shop/apparel/${slug}`}
                  onClick={go(`shop/apparel/${slug}`)}
                  className="border border-liberation-neutral-800 p-6 transition-colors hover:border-liberation-sovereignty-gold hover:bg-[rgba(212,175,55,0.04)]"
                >
                  <span className="font-mono text-xs text-liberation-sovereignty-gold tracking-[0.2em] uppercase">
                    {other.num}
                  </span>
                  <h3 className="font-display font-black uppercase tracking-tight text-2xl mt-2 mb-1 leading-none">
                    {other.name}
                  </h3>
                  <p className="font-disrupt italic text-liberation-neutral-500 text-base m-0">
                    {other.subtitle}
                  </p>
                </a>
              ))}
          </div>
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
