import { STATEMENT } from './MissionOpening';

// What BLKOUT is, as visible text directly under the intro (Rob, 12 Nov 2026): answer engines and
// search read real text, not animation. The mission statement is COMMS.md's, verbatim; its first
// sentence is the homepage's only H1.

interface HomeStatementProps {
  onAbout?: () => void;
}

export default function HomeStatement({ onAbout }: HomeStatementProps) {
  const [heading, ...rest] = STATEMENT;
  return (
    <section aria-labelledby="what-blkout-is" className="bg-[#0a0a14] text-[#f5f1e8] border-t border-[#1e1e2a] px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-4xl">
        <p className="font-meta text-xs uppercase tracking-[0.14em] text-[#a8a195] mb-5">What BLKOUT is</p>
        <h1
          id="what-blkout-is"
          className="font-black uppercase text-[clamp(32px,5vw,64px)] leading-[0.95] tracking-[-0.03em] [text-wrap:balance] text-[#f5f1e8]"
          style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}
        >
          {heading}
        </h1>
        <div className="w-[120px] h-1 bg-[#d4af37] my-8" aria-hidden="true" />
        <p
          className="text-[19px] md:text-[22px] leading-[1.55] max-w-[44ch] text-[#f5f1e8]"
          style={{ fontFamily: "'Work Sans', system-ui, sans-serif" }}
        >
          {rest.join(' ')}
        </p>
        <a
          href="/about"
          onClick={(e) => { if (onAbout) { e.preventDefault(); onAbout(); } }}
          className="inline-block mt-8 text-[#d4af37] hover:text-[#ffd700] text-xl italic underline underline-offset-4 decoration-1"
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300 }}
        >
          Find out more →
        </a>
      </div>
    </section>
  );
}
