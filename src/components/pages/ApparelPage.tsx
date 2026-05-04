interface ApparelPageProps {
  onNavigate?: (tab: string) => void;
}

interface RangeCardProps {
  num: string;
  name: string;
  brief: string;
  body: string;
  href: string;
  poster?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function RangeCard({ num, name, brief, body, href, poster, onClick }: RangeCardProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block border border-liberation-neutral-800 p-8 transition-colors hover:border-liberation-sovereignty-gold hover:bg-[rgba(212,175,55,0.04)]"
    >
      {poster ? (
        <img
          src={poster}
          alt={`${name} range`}
          className="w-full h-auto block mb-6"
        />
      ) : (
        <div
          className="border border-dashed border-liberation-neutral-800 mb-6 min-h-[14rem] grid place-items-center text-liberation-neutral-700 text-xs tracking-[0.2em] uppercase"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(212,175,55,0.04) 0, rgba(212,175,55,0.04) 8px, transparent 8px, transparent 16px)',
            backgroundColor: '#0A0A0A',
          }}
        >
          [range image]
        </div>
      )}
      <span className="font-mono text-xs text-liberation-sovereignty-gold tracking-[0.2em] uppercase">
        {num}
      </span>
      <h2 className="font-display font-black uppercase tracking-tight text-3xl md:text-4xl my-2 leading-none">
        {name}
      </h2>
      <p className="font-disrupt italic text-liberation-neutral-300 text-lg leading-snug mb-3">
        {brief}
      </p>
      <p className="text-liberation-neutral-500 text-base leading-relaxed m-0">{body}</p>
      <span className="inline-block mt-6 font-display font-black tracking-[0.15em] uppercase text-sm text-liberation-sovereignty-gold">
        Read the range →
      </span>
    </a>
  );
}

export default function ApparelPage({ onNavigate }: ApparelPageProps) {
  const go = (tab: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(tab);
    }
  };

  return (
    <main className="bg-liberation-black-power min-h-screen px-6 md:px-12 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Top crumb with logo */}
        <div className="pt-6 flex justify-between items-center text-liberation-neutral-500 text-xs tracking-[0.2em] uppercase font-bold">
          <a href="/shop" onClick={go('shop')} className="inline-flex items-center gap-3" aria-label="BLKOUT Shop">
            <img src="/images/blkout-logo-white.png" alt="BLKOUT" className="h-10 w-auto block" />
            <span className="text-liberation-sovereignty-gold text-[0.7rem] tracking-[0.25em]">
              ← back to /shop
            </span>
          </a>
          <span>Apparel · Issue 01</span>
        </div>

        {/* HERO */}
        <header className="pt-16 pb-12 md:pt-24 md:pb-20">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            BLKOUT Shop · Apparel
          </span>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-8xl mt-6 mb-0">
            Three ranges.<br />
            <span className="text-liberation-gold-divine">Worn out loud.</span>
          </h1>
          <p className="font-disrupt italic text-xl md:text-2xl leading-snug text-liberation-neutral-300 max-w-[42ch] mt-8 mb-0">
            Print-on-demand, organic, low-waste. The buying decision happens here. The cart happens on Teemill.
          </p>
          <hr className="h-1.5 bg-liberation-sovereignty-gold border-0 mt-12 w-24" />
        </header>

        {/* Why ranges, not styles */}
        <section className="border-t border-b border-liberation-neutral-800 py-12 mb-20 grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6 lg:gap-16">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-neutral-500">
            Why three ranges
          </span>
          <p className="font-disrupt italic text-xl md:text-2xl leading-snug text-white max-w-[55ch] m-0">
            Apparel isn't decoration. Each range carries a frame for{' '}
            <span className="not-italic font-display font-black uppercase tracking-tight text-liberation-sovereignty-gold">
              who we are
            </span>{' '}
            and a name for who we wear. Read the range first; the piece will mean more when you put it on.
          </p>
        </section>

        {/* Three ranges — vertical stack, each gets full editorial weight.
            When promo posters are ready, drop into public/images/apparel/{slug}-poster.jpg
            and pass via `poster="…"` below. Until then, hatched placeholder. */}
        <section className="space-y-12 mb-24">
          <RangeCard
            num="range 01"
            name="BLKOUT Proud."
            brief="Pride pieces — joy as a political act."
            body="Pride isn't a season. It's the daily insistence that we love each other and we won't be made small. The Proud range carries that — for the parade and the days that need it more."
            href="/shop/apparel/blkout-proud"
            onClick={go('shop/apparel/blkout-proud')}
          />
          <RangeCard
            num="range 02"
            name="Brother to Brother."
            brief="Joseph Beam's revolutionary act, worn out loud."
            body="Beam wrote it in 1986: Black men loving Black men is the revolutionary act. We're still writing it now — on backs, on chests, on days when the world tells us to make ourselves smaller."
            href="/shop/apparel/brother-to-brother"
            onClick={go('shop/apparel/brother-to-brother')}
          />
          <RangeCard
            num="range 03"
            name="Black Queer Icons UK."
            brief="Our forebears — worn into the present."
            body="The chain of Black queer UK lives that made our presence possible. Each piece carries a name. Worn so the lineage is visible — to ourselves, and to whoever needs to see us."
            href="/shop/apparel/icons"
            onClick={go('shop/apparel/icons')}
          />
        </section>

        {/* DISRUPTION — sizzle/sausage */}
        <section
          className="my-20 py-16 text-center"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgb(10,10,10) 50%, transparent 100%)',
          }}
        >
          <p className="font-disrupt italic text-2xl md:text-3xl lg:text-4xl leading-snug text-white max-w-[36ch] mx-auto m-0">
            BLKOUT earns the margin. Teemill prints + ships.{' '}
            <span className="not-italic font-display font-black uppercase tracking-tight text-liberation-gold-divine">
              No inventory, no waste.
            </span>
          </p>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-liberation-neutral-500 mt-8 mb-0">
            Print-on-demand · organic · low-waste
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
