import { ZeffyEmbed } from './ShopPage';

interface PrintRangePageProps {
  onNavigate?: (tab: string) => void;
}

// The Zeffy store form for the print range, e.g. '/embed/shop/blkout-print'.
// Empty until the form is built in Zeffy: the page then shows "opening soon" instead of the store.
// Paid orders reach ivor-core /api/webhooks/zeffy (ZEFFY_PRINT_CAMPAIGN_ID) -> public.print_orders.
const ZEFFY_PRINT_FORM_URL = '';

const NEWSLETTER_FORM = 'https://sendfox.com/form/3zpwee/1wj276';

interface Product {
  name: string;
  line: string;
  img?: string;
}

// Launch line-up to confirm. Images go in public/images/print/{slug}.jpg, passed as `img`.
const PRODUCTS: Product[] = [
  { name: 'Mug', line: 'Morning tea, our names on it.' },
  { name: 'Tote', line: 'Carry the movement to the shops.' },
  { name: 'Poster', line: 'Our icons, on your wall.' },
  { name: 'Coasters', line: 'A set for the table you host.' },
];

function ProductTile({ name, line, img }: Product) {
  return (
    <div className="border border-liberation-neutral-800 p-6 flex flex-col">
      {img ? (
        <img src={img} alt={`BLKOUT ${name.toLowerCase()}`} className="w-full h-auto block mb-6" />
      ) : (
        <div
          className="border border-dashed border-liberation-neutral-800 mb-6 aspect-square grid place-items-center text-liberation-neutral-700 text-xs tracking-[0.2em] uppercase"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(212,175,55,0.04) 0, rgba(212,175,55,0.04) 8px, transparent 8px, transparent 16px)',
            backgroundColor: '#0A0A0A',
          }}
        >
          [product image]
        </div>
      )}
      <h3 className="font-display font-black uppercase tracking-tight text-2xl leading-none m-0">{name}</h3>
      <p className="font-disrupt italic text-liberation-neutral-300 text-base leading-snug mt-2 mb-0">{line}</p>
    </div>
  );
}

export default function PrintRangePage({ onNavigate }: PrintRangePageProps) {
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
            <img width={300} height={300} src="/images/blkout-logo-white.png" alt="BLKOUT" className="h-10 w-auto block" />
            <span className="text-liberation-sovereignty-gold text-[0.7rem] tracking-[0.25em]">
              ← back to /shop
            </span>
          </a>
          <span>Print · Range 01</span>
        </div>

        {/* HERO */}
        <header className="pt-16 pb-12 md:pt-24 md:pb-20">
          <span className="font-display uppercase tracking-widest text-xs text-liberation-sovereignty-gold">
            BLKOUT Shop · Print
          </span>
          <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-8xl mt-6 mb-0">
            Bring it<br />
            <span className="text-liberation-gold-divine">home.</span>
          </h1>
          <p className="font-disrupt italic text-xl md:text-2xl leading-snug text-liberation-neutral-300 max-w-[42ch] mt-8 mb-0">
            Mugs, totes, posters and coasters. Printed when you order, posted to your door.
          </p>
          <hr className="h-1.5 bg-liberation-sovereignty-gold border-0 mt-12 w-24" />
        </header>

        {/* PRODUCTS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PRODUCTS.map((p) => (
            <ProductTile key={p.name} {...p} />
          ))}
        </section>

        {/* STORE */}
        <section className="border-t-8 border-liberation-pride-orange pt-12 pb-16">
          <span className="font-mono text-sm text-liberation-pride-orange tracking-[0.2em] uppercase block mb-4">
            Order
          </span>
          <h2 className="font-display font-black uppercase tracking-tight text-4xl md:text-6xl leading-none m-0">
            Pick yours.
          </h2>
          <p className="font-disrupt italic text-xl leading-snug text-liberation-neutral-300 mt-6 mb-8 max-w-[50ch]">
            Pay here and add your delivery address. Each piece is printed to order and posted straight to you.
          </p>
          {ZEFFY_PRINT_FORM_URL ? (
            <ZeffyEmbed formUrl={ZEFFY_PRINT_FORM_URL} title="BLKOUT print shop, powered by Zeffy" />
          ) : (
            <p className="font-display font-black uppercase tracking-[0.15em] text-sm text-liberation-sovereignty-gold m-0">
              The store opens soon.
            </p>
          )}
        </section>

        {/* NEWSLETTER: separate, optional, nothing pre-ticked */}
        <section className="border-t border-liberation-neutral-800 py-10">
          <p className="text-liberation-neutral-300 text-base m-0">
            Want BLKOUT's monthly letter too? That's a separate choice:{' '}
            <a href={NEWSLETTER_FORM} target="_blank" rel="noopener" className="text-liberation-sovereignty-gold underline">
              sign up here
            </a>
            .
          </p>
        </section>

        {/* FOOT */}
        <footer className="border-t border-liberation-neutral-800 py-8 text-liberation-neutral-500 text-sm flex justify-between flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-4">
            <img width={300} height={300} src="/images/blkout-logo-white.png" alt="BLKOUT" className="h-8 w-auto opacity-60" />
            BLKOUT CBS · Black queer men in the UK building infrastructure we own.
          </span>
          <span className="font-mono">blkoutuk.com/shop</span>
        </footer>
      </div>
    </main>
  );
}
