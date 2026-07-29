/**
 * Ten Years — how BLKOUT got from a table in 2016 to a society its members own.
 *
 * Spec: specs/ten-years-page-spec-01.md (approved by Rob, 28 Jul 2026).
 * History source of truth: memory `blkout-origin-and-founding` +
 * projects/seen/funding/blkout-track-record-funder-summary.md.
 *
 * Two editorial rules this file exists to keep:
 *  1. The 2024–25 pause is a DECISION, not a decline. Rob: "honesty best policy."
 *  2. Founded 2016 — never 2014. First public event 7 February 2016.
 *
 * Colours are arbitrary hex values on purpose: several `liberation-*` shorthand
 * tokens are undefined in the preset and emit no CSS at all, failing silently.
 */

const GOLD = '#FFD700';
const GOLD_DEEP = '#D4AF37';

// The Tailwind preset's font keys are a known phantom: `font-sans` resolves to
// Inter and `font-mono` to JetBrains Mono, neither of which any app loads.
// index.html loads Work Sans / Fraunces / IBM Plex Mono, so name them directly.
const SANS = "'Work Sans', system-ui, sans-serif";
const SERIF = "Fraunces, Georgia, serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

interface TenYearsProps {
  onNavigate?: (tab: string) => void;
}

interface Artefact {
  src: string;
  alt: string;
  caption: string;
}

interface Movement {
  id: string;
  years: string;
  name: string;
  image: string;
  alt: string;
  body: string[];
  pull?: string;
  quiet?: boolean;
  artefacts?: Artefact[];
}

const MOVEMENTS: Movement[] = [
  {
    id: 'I',
    years: '2016 — 2019',
    name: 'The table',
    image: '/images/ten-years/2019-pride-joy.jpg',
    alt: 'A man in a wide-brimmed hat laughing broadly at Pride, crowds and rainbow flags behind him',
    artefacts: [
      {
        src: '/images/ten-years/2019-black-men-who-brunch.jpg',
        alt: 'A man seated at a table with BLKOUT materials at Black Men Who Brunch',
        caption: 'Black Men Who Brunch — the long-running Sunday table.',
      },
      {
        src: '/images/ten-years/artefact-blackout-magazine-1986.jpg',
        alt: 'Cover of BLACK/OUT magazine, Volume 1 Number 2, Fall 1986',
        caption: 'BLACK/OUT, Fall 1986 — the magazine of the National Coalition of Black Lesbians and Gays. Essex Hemphill and Audre Lorde inside. Not ours; our lineage.',
      },
      {
        src: '/images/ten-years/artefact-in-the-picture-sticker.jpg',
        alt: 'In The Picture campaign sticker reading “London’s Black queer men in focus”',
        caption: 'In The Picture — London’s Black queer men in focus, 2019–20.',
      },
    ],
    body: [
      'In the summer of 2016, Rob Berkeley approached Marc Thompson and Antoine Rogers with thoughts about disruption, decentralised accountable organisations and new communications technology — but first and foremost a shared commitment to revolutionary love for Black queer men. The first public event was held on 7 February 2016. It was imagined as a five-year project.',
      'It looked like a table. People around it, eating, arguing, laughing. That has never stopped being the shape of the thing.',
      'It began as a literary and cultural hub, incubated by Evidence To Exist, in a lineage that runs through Barbara Smith’s Kitchen Table: Women of Color Press and BLACK/OUT magazine — where Joseph Beam, Essex Hemphill and Audre Lorde were already doing the work of putting Black queer life into print, which is the work of making it survivable.',
      'We also set out to prove what we already knew. In The Picture was peer-led research, with support from the Mayor of London, built to close the evidence gap about Black bi, gay and trans men in London. Policy only ever glimpsed us through sexual health, youth homelessness and asylum — education, work, play, love, growing older, happiness, death all went unrecorded. Into that vacuum rushes the tyrannical single story, and denial, and sensationalism, and well-meaning pity. They obscure the truths of our lives from policymakers. Far more importantly, they hide us from each other. We built the brunches and the dancefloors against that sentence. The survey opened that September and the work ran through the winter. The last piece before the world changed went up on 6 March 2020, a fortnight before the first lockdown. The report landed that October. The months in between did not go missing — they went to lockdown programming and the summer of Black Lives Matter.',
      'A literary hub had become a community organisation, because that first sentence is a job description.',
    ],
    pull: 'The single story, denial, sensationalism, well-meaning pity — together they obscure the truths of our lives from policymakers. Far more importantly, they hide us from each other.',
  },
  {
    id: 'II',
    years: '2020 — 2024',
    name: 'The company',
    image: '/images/ten-years/2023-picnic-all-white.jpg',
    alt: 'A group of Black queer men dressed in white at the BLKOUT annual picnic, August 2023',
    artefacts: [
      {
        src: '/images/ten-years/2023-picnic-toast.jpg',
        alt: 'Three men in white laughing and raising glasses at the annual picnic, 2023',
        caption: 'The annual picnic, August 2023.',
      },
      {
        src: '/images/ten-years/2019-gathering-forty.jpg',
        alt: 'Around forty Black queer men gathered together, December 2019',
        caption: 'Forty of us in one room, December 2019.',
      },
      {
        src: '/images/ten-years/artefact-blkout-tshirts.jpg',
        alt: 'BLKOUT t-shirts in pink, yellow, white and black with a two-faces line drawing',
        caption: 'The t-shirt, community-designed — the 2020 open call, still in the drawer.',
      },
      {
        src: '/images/ten-years/2019-mcalmont-croydon.jpg',
        alt: 'David McAlmont performing on stage beside the BLACK OUT UK flag at Croydon Pride, 2019',
        caption: 'David McAlmont, Croydon Pride 2019, singing under our flag.',
      },
      {
        src: '/images/ten-years/2019-berto-pasuka-prize.jpg',
        alt: 'The 2019 Berto Pasuka Prize graphic showing a dancer with arms raised',
        caption: 'The Berto Pasuka Prize, 2019 — named for the dancer who founded Les Ballets Nègres in London in 1946.',
      },
      {
        src: '/images/ten-years/artefact-2020-review-hub.jpg',
        alt: 'BLKOUT 2020 Review graphic with the BLACK OUT UK raised-fist roundel and THE HUB',
        caption: 'The 2020 review, with the old roundel and the Hub. A different wordmark, the same room.',
      },
    ],
    body: [
      'In 2020 we constituted independently, as a not-for-profit company limited by guarantee. These were the delivery years, and they were funded ones.',
      'Diasporan Dialogues on Black gay men’s health with ViiV Healthcare. Citizen-led participatory research with the GLA. Social Movement for Health. City for LGBT+ through The Funding Network. We_ARE_BLKOUT with giffgaff. A COVID-19 community response through the London Community Response Fund. Local Connections with The National Lottery Community Fund.',
      'And it was not all reports. Black Men Who Brunch. David McAlmont singing under our flag at Croydon Pride. The Berto Pasuka Prize, named for the Jamaican dancer who founded Les Ballets Nègres in London in 1946. A Progress Pride flag flown over Croydon captioned revolutionary love. In January 2023, A Place For Us at Queer Britain — four short films and a panel chaired by the Deputy Mayor of London.',
      'In July 2024, that company was wound up.',
    ],
  },
  {
    id: 'III',
    years: 'July 2024 — November 2025',
    name: 'The listening',
    artefacts: [
    ],
    image: '/images/ten-years/2025-nxt-coop.jpg',
    alt: 'The BLKOUT NXT co-op page, 2025 — Shared futures, Shared Ownership',
    quiet: true,
    body: [
      'The company was wound up in July 2024. The asking was not.',
      'In April 2025 we launched BLKOUT NXT — shaping our future together. Not a survey to file and forget. We put four propositions to the community and asked people to design, test and deliver them with us, registering as one of four: a Black queer man, an accomplice or ally, a QTIPOC organiser, or a partner organisation.',
      'Each came with a question rather than a promise. Cooperative community ownership — how does media transform when the community owns it? A StoryLab and newsroom on our own terms, no filter and no apology — what happens when we release media from elite control and set our own agenda? Channel BLKOUT, to preserve and amplify UK Black queer media — where else will you discover those hidden gems made for the culture? And IVOR, the Informed Voice Of Resources — how might our ancestors guide us through today’s challenges?',
      'The co-op proposition came with a plan and a clock: fourteen weeks, with support from Co-operatives UK already secured. Assembling our architects — a working group of five to seven community members, their time paid for, not volunteered. Designing our house — drafting rules with legal teeth and community heart, and governance that distributes power rather than concentrates it. Then claiming our power: registration, and a call for founding members — the people who could say “I built this.”',
      'We could not have done that and kept delivering. We did not have the resources for both, and doing both badly would have been worse than doing one well. So we stopped delivering, and we asked instead.',
      'Then we built all four.',
    ],
    pull: 'For too long, Black queer men have been framed as subjects, never architects — of media, of policy, of our own futures.',
  },
  {
    id: 'IV',
    years: 'November 2025 — now',
    name: 'The society',
    image: '/images/ten-years/2023-a-place-for-us.jpg',
    alt: 'Panel discussion at A Place For Us, Queer Britain, January 2023',
    artefacts: [
      {
        src: '/images/ten-years/2026-ivors-compass.jpg',
        alt: 'The Ivor’s Compass website — a graphic novel and reflection tool for Black queer men',
        caption: 'Ivor’s Compass, 2026 — delivered, evaluated, and free to claim.',
      },
      {
        src: '/images/ten-years/2023-picnic-dog.jpg',
        alt: 'A man in a fedora and white outfit walking a small dog at the picnic',
        caption: 'The picnic, 2023. It returns to Regent’s Park in August 2026.',
      },
    ],
    body: [
      'On 24 November 2025 we registered as BLKOUT Creative Ltd, a Community Benefit Society, FCA registered society no. 9639, with an asset lock. The first proposition, answered — and answered by the people who turned up to draft it. The rules were written by a community working group, not handed down.',
      'Twelve founding members started it — twelve people who put their name to a society while there was still nothing to join.',
      'It means what it says. Members, not shareholders. What we build is held for the community and cannot be sold out from under it — not by a future board, not by us.',
      'The others answered too. IVOR is live. The newsroom publishes. BLKOUTHUB is six years old and the calendar keeps running. Ivor’s Compass was delivered and evaluated in 2026. Seen is next.',
      'Ten years, four shapes, one commitment. We are not in a hurry. We mean to be here a long time.',
    ],
  },
];


/** Photographs as physical prints — cream borders, tilted, overlapping.
 *  The angles are deterministic (derived from index) so the layout never
 *  jitters between renders, and every tilt unwinds to 0 on hover. */
const TILTS = [-2.5, 2.2, -3.4, 1.8, -1.6, 3.1];
const PRINT = {
  background: '#f4efe4',
  padding: '10px 10px 34px',
  boxShadow: '0 18px 40px rgba(0,0,0,.65), 0 2px 6px rgba(0,0,0,.5)',
};

function Print({
  src, alt, caption, tilt, className = '', style = {},
}: {
  src: string; alt: string; caption?: string; tilt: number;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <figure
      className={`group transition-transform duration-300 hover:!rotate-0 hover:z-40 ${className}`}
      style={{ ...PRINT, transform: `rotate(${tilt}deg)`, ...style }}
    >
      <img src={src} alt={alt} loading="lazy" className="block w-full object-cover" />
      {caption && (
        <figcaption
          className="mt-2 text-[10.5px] leading-snug"
          style={{ fontFamily: MONO, color: '#3a352c' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Collage({ movement }: { movement: Movement }) {
  const arts = movement.artefacts ?? [];
  if (!movement.image && arts.length === 0) return null;

  return (
    <div className="relative mt-12 mb-4">
      {/* the main print, breaking out of the text column */}
      {movement.image && (
        <Print
          src={movement.image}
          alt={movement.alt}
          tilt={TILTS[0]}
          className="relative z-10 w-full max-w-lg"
        />
      )}

      {/* the rest, tucked in and overlapping */}
      {arts.length > 0 && (
        <div className="relative z-20 -mt-10 ml-auto flex w-full max-w-3xl flex-wrap items-start justify-end gap-x-[-1rem] gap-y-6 pl-8">
          {arts.map((a, i) => (
            <Print
              key={a.src}
              src={a.src}
              alt={a.alt}
              caption={a.caption}
              tilt={TILTS[(i + 1) % TILTS.length]}
              className="w-40 sm:w-52"
              style={{ marginLeft: i === 0 ? 0 : '-1.25rem', zIndex: 20 + i }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TenYears({ onNavigate }: TenYearsProps) {
  // THE MOTIF: one gold line, drawn once, running the whole height of the page.
  // It never breaks — not between sections, not at the masthead, and above all
  // not through movement III. The page argues that the gaps were choices rather
  // than failures; the line is that argument in visual form, so nothing is
  // allowed to interrupt it. Every other gold on the page is trim by comparison.
  const RAIL = 'left-7 sm:left-14';

  return (
    <div className="relative bg-black text-white" style={{ fontFamily: SANS }}>
      {/* ── the unbroken line ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute ${RAIL} top-0 bottom-0 z-20 w-[2px]`}
        style={{ background: GOLD }}
      />

      {/* ---------- masthead ----------
          The Croydon Pride graphic is a finished poster — it carries its own
          "revolutionary love" wordmark, roundel, URL and frame. So it is shown
          whole, uncropped and at full strength, as the first print on the page,
          rather than cropped and dimmed behind the headline. */}
      <header className="relative">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 pl-16 pr-6 pt-20 pb-16 sm:pl-28 sm:pt-28 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ color: GOLD, fontFamily: MONO }}>
              2016 — 2026
            </p>
            <h1 className="mt-5 text-5xl sm:text-6xl font-black uppercase leading-[0.95] tracking-tight">
              Ten Years
            </h1>
            <p className="mt-6 max-w-xl text-xl sm:text-2xl italic text-white/90" style={{ fontFamily: SERIF }}>
              Ten years of revolutionary love for Black queer men. Four shapes, one commitment, and
              a great deal of joy taken seriously.
            </p>
            <p className="mt-8 max-w-2xl text-white/70 leading-relaxed">
              Brunches, dancefloors, a prize named for Berto Pasuka, a flag at Croydon Pride.
              Research, reports and a co-op too. This is the whole of it — including the year and a
              half when there was no organisation, only a conversation.
            </p>
          </div>

          <Print
            src="/images/ten-years/2019-revolutionary-love.jpg"
            alt="A Black man holding a Progress Pride flag aloft against a blue sky at Croydon Pride, 2019, captioned revolutionary love"
            caption="Croydon Pride, 2019."
            tilt={2.4}
            className="w-full max-w-sm justify-self-center lg:justify-self-end"
          />
        </div>
      </header>

      {/* ---------- the movements ---------- */}
      <div className="relative mx-auto max-w-5xl">
        {MOVEMENTS.map((m) => (
          <section
            key={m.id}
            className={`relative pl-16 pr-6 sm:pl-28 ${m.quiet ? 'py-28 sm:py-40' : 'py-20 sm:py-28'}`}
          >

            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: GOLD, fontFamily: MONO }}>
              {m.years}
            </p>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black uppercase tracking-tight">
              {m.name}
            </h2>

            <Collage movement={m} />

            <div className={`mt-8 space-y-5 ${m.quiet ? 'max-w-xl' : 'max-w-2xl'}`}>
              {m.body.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${m.quiet ? 'text-lg text-white/85' : 'text-white/75'}`}
                >
                  {para}
                </p>
              ))}
            </div>

            {m.pull && (
              <blockquote
                className="mt-10 max-w-xl pl-5 text-xl sm:text-2xl italic"
                style={{ borderLeft: `1px solid ${GOLD_DEEP}66`, fontFamily: SERIF }}
              >
                {m.pull}
              </blockquote>
            )}

            {/* The archive has no date filter — StoryArchive takes only `initialSlug` —
                so this must not promise period-specific results. Relabelled after a
                review flagged four CTAs all landing on the same unfiltered listing.
                Wiring a real period filter is the improvement, not a better label. */}
            <button
              onClick={() => onNavigate?.('stories')}
              className="mt-10 inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-white/5"
              style={{ border: `1px solid ${GOLD_DEEP}66`, color: GOLD, fontFamily: MONO }}
            >
              Open the story archive →
            </button>
          </section>
        ))}
      </div>

      {/* ---------- a dated voice ---------- */}
      <section className="relative mx-auto max-w-5xl pl-16 pr-6 sm:pl-28 py-20">
        <p className="text-xs uppercase tracking-[0.22em]" style={{ color: GOLD, fontFamily: MONO }}>
          In his own words · 31 December 2021
        </p>
        <blockquote
          className="mt-6 max-w-2xl text-xl sm:text-2xl italic leading-snug"
          style={{ fontFamily: SERIF }}
        >
          “The best laid plans were scuppered by our existential need to survive the COVID-19
          pandemic. Rather than 2020 spent raising funds on the back of the research as planned,
          the pandemic encouraged us to do what we could with our limited staff resource in
          support of Black queer men. Given what we now knew from the research about the
          experiences of loneliness and isolation likely to be experienced by Black queer men, it
          felt like the only justifiable decision. Foolhardy? Perhaps.”
        </blockquote>
        <p className="mt-6 text-sm text-white/60">
          Rob Berkeley, <em>A Dream No Longer On Mute</em>, 31 December 2021
        </p>
        <button
          onClick={() => onNavigate?.('stories')}
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-white/5"
          style={{ border: `1px solid ${GOLD_DEEP}66`, color: GOLD, fontFamily: MONO }}
        >
          Read the whole thing →
        </button>
      </section>

      {/* ---------- close ---------- */}
      <footer className="relative">
        <div className="mx-auto max-w-5xl pl-16 pr-6 sm:pl-28 py-20">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: GOLD, fontFamily: MONO }}>
            The archive
          </p>
          <h2 className="mt-4 text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Nearly three hundred pieces, written as it happened
          </h2>
          <p className="mt-6 max-w-2xl text-white/70 leading-relaxed">
            Everything above was documented at the time — in essays, interviews, reports and
            arguments by Black queer men in Britain. It is all still here, and it is all still free
            to read.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate?.('stories')}
              className="px-6 py-3 text-xs uppercase tracking-[0.18em] font-bold text-black"
              style={{ background: GOLD, fontFamily: MONO }}
            >
              Open the story archive
            </button>
            <button
              onClick={() => onNavigate?.('about')}
              className="px-6 py-3 text-xs uppercase tracking-[0.18em] hover:bg-white/5 transition-colors"
              style={{ border: `1px solid ${GOLD_DEEP}66`, fontFamily: MONO }}
            >
              Who we are now
            </button>
          </div>
          <p className="mt-14 max-w-2xl text-xs text-white/60 leading-relaxed">
            BLKOUT UK is the trading name of BLKOUT Creative Ltd, a Community Benefit Society
            registered with the Financial Conduct Authority, no. 9639. Photographs are from the
            BLKOUT community archive, 2017–2023.
          </p>
        </div>
      </footer>
    </div>
  );
}
