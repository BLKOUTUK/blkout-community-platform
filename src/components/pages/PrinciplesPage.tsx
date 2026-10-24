/**
 * Principles — BLKOUT's 12 Principles for Action.
 *
 * Source: the 2020 Google Site (sites.google.com/view/blackoutprinciples/home), brought
 * home 24 Oct 2026 so the values are part of the platform, not buried in a hub resource.
 * Lives under About (/about/principles) by Rob's call, 24 Oct 2026: no nav heading of its own;
 * reached from the card at the top of About and the breadcrumb back.
 * Text is the site's, verbatim apart from typo fixes. The 2020 intro paragraph is replaced
 * by the approved mission statement (platform/COMMS.md). Plain-text twin: platform/VALUES.md.
 *
 * Each principle has an anchor id (e.g. /about/principles#becoming) so BLKOUTHUB and
 * other pages can deep-link to a single principle.
 *
 * Colours are arbitrary hex values on purpose, as in TenYears.tsx: several `liberation-*`
 * shorthand tokens are undefined in the preset and emit no CSS at all.
 */

const GOLD = '#FFD700';
const GOLD_DEEP = '#D4AF37';

// See TenYears.tsx: the preset's font keys point at fonts no app loads.
const SANS = "'Work Sans', system-ui, sans-serif";
const SERIF = "Fraunces, Georgia, serif";
const MONO = "'IBM Plex Mono', ui-monospace, monospace";

interface PrinciplesPageProps {
  onNavigate?: (tab: string) => void;
}

interface Quote {
  text: string;
  by: string;
  source?: string;
}

interface Reading {
  label: string;
  href: string;
}

interface Principle {
  id: string;
  name: string;
  commitment: string;
  body: string[];
  quotes: Quote[];
  reading: Reading[];
}

interface Group {
  stem: string;
  principles: Principle[];
}

const GROUPS: Group[] = [
  {
    stem: 'We are',
    principles: [
      {
        id: 'becoming',
        name: 'becoming',
        commitment: 'We are building our community; it is relational, dynamic and constantly becoming. It is not now, nor has it ever been, any more pure, fixed or static than its members.',
        body: [
          'We are building community based on relationships, experiences and commitment to shared futures. We neither assume that community exists nor submit unnecessarily to categorisations that are created by the state, media-industrial complex, or hierarchies, for bureaucratic convenience and/or control.',
          "We focus more on building relationships between those who recognise themselves as contributors and beneficiaries of our efforts, than on imposing any orthodoxy of thought/belief beyond shared humanity. We avoid the distraction created by the policing of the boundaries/borders of ethnicity, gender or sexuality — we lose when categorisations that we rely on to liberate in solidarity against oppression become tools used to sow dissent. We prefer 'Black is Black' to 'Black is, Black ain't'.",
        ],
        quotes: [
          {
            text: '. . . the ‘who’ we are, our being-ness, is the outcome of constant sociality enacted in common and created and sustained in common through the inter-relational linking of action, materiality, subjectivity, speech and the world of accepted meaning.',
            by: 'David Studdert & Valerie Walkerdine',
          },
          {
            text: 'Men are free when they belong to a living, organic, believing community, active in fulfilling some unfulfilled, perhaps unrealized purpose. Not when they are escaping to some wild west. The most unfree souls go west, and shout of freedom.',
            by: 'D.H. Lawrence',
          },
        ],
        reading: [
          { label: 'Community and social change theory', href: 'https://www.researchgate.net/publication/312652725_Community_Building_Challenges_of_constructing_community' },
          { label: 'Relational social capital', href: 'https://www.socialcapitalresearch.com/relational-social-capital/' },
        ],
      },
      {
        id: 'enough',
        name: 'enough',
        commitment: 'We are the leaders and followers we’ve been waiting for. There is no perfect moment in the future in which we will be ready to pursue our salvation.',
        body: [
          'There is no one better placed to understand our needs and ambitions, or respond to them, than us.',
          'We understand the importance of nurturing leadership and being responsive to the influence of leaders from all parts of the community we are building.',
          'We do not claim a monopoly on knowledge or legitimacy and some will find it easier to express their leadership through different means or define themselves in opposition to our organising.',
          'While keen to offer clarification of what we are seeking to achieve, our desire to be open to future work in communion with Black queer men will require diplomacy at times. This will be aided by clarity about our accountability to each other, and how we understand reparation and healing as a movement and as individuals.',
        ],
        quotes: [
          {
            text: 'All the black men that I love see themselves as isolated, cut off from any sense of group solidarity. They see most black male leaders as ineffectual hypocrites who are simply opportunists . . . The failure lies with the lack of collective radicalization on the part of black men.',
            by: 'bell hooks',
            source: 'We Real Cool',
          },
        ],
        reading: [
          { label: 'Building collaborative communities', href: 'https://scott.london/articles/oncollaboration.html' },
          { label: 'Community as spectrum: a topography', href: 'https://medium.com/@pforti/key-to-understanding-communities-the-centralized-to-distributed-spectrum-f41436f7a2f3' },
        ],
      },
      {
        id: 'not-all-the-same',
        name: 'not all the same',
        commitment: 'We are all equally valuable and all able to contribute to our movement: our differences are a strength.',
        body: [
          'Rather than viewing our differences as a problem to overcome, we welcome and need the challenge that comes with difference and encourage deliberation as a source of innovation.',
          'We all have a part to play in our collective liberation. We operate in a society riven by inequality, so work actively to counteract the impact that unfair discrimination and exclusion pose to full participation.',
          'We understand that unity does not require uniformity. Our basic requirement for all seeking to share community is mutual respect and a commitment to treating each other as we in turn would like to be treated.',
        ],
        quotes: [
          {
            text: 'Difference is that raw and powerful connection from which our personal power is forged . . . Without community, there is no liberation, only the most vulnerable and temporary armistice between an individual and her oppression . . . Survival is learning to take our differences and make them strengths.',
            by: 'Audre Lorde',
          },
          {
            text: 'I can’t pretend to be you. I don’t know your experience. I can’t live life from inside your head. So our living together must depend on a trade-off, a conversation, a process of translation.',
            by: 'Stuart Hall',
            source: 'Living With Difference',
          },
        ],
        reading: [
          { label: 'Difference and innovation in business', href: 'https://ideas.bkconnection.com/diversity-strength-the-power-of-multiple-points-of-view' },
          { label: '“They want our physical presence but not our voice” — the diversity business', href: 'https://time.com/5696943/diversity-business/' },
        ],
      },
    ],
  },
  {
    stem: 'We believe that',
    principles: [
      {
        id: 'the-whole',
        name: 'the whole is greater than the sum of its parts',
        commitment: 'We prize collaboration over competition and believe that sharing the problem-solving process can create value above and beyond the direct solution: skills, ownership, networks, and habits of solidarity.',
        body: [
          'Market competition may work as a way of distributing scarce resources in many contexts but in developing community it is too often wasteful and destructive of relationships. We prize our collective human capital and believe that it can grow through creating value together, even though collaboration can pose challenges and requires unlearning patterns and protocols of competition that are widespread in many areas of our lives.',
          'Collaborative working is more likely to create shared experiences that are key to building our community. It also builds habits of solidarity, shared ownership, and commitment to shared futures that are often absent from market-based interventions.',
        ],
        quotes: [
          {
            text: 'Collaboration is a key part of the success of any organization, executed through a clearly defined vision and mission and based on transparency and constant communication.',
            by: 'Virgil Abloh',
          },
          {
            text: 'It is essential to resist the depiction of history as the work of heroic individuals in order for people today to recognize their potential agency as a part of an ever-expanding community of struggle . . . It is in collectivities that we find reservoirs of hope and optimism.',
            by: 'Angela Davis',
          },
        ],
        reading: [
          { label: 'Are services ready to collaborate?', href: 'https://collaboratecic.com/the-state-of-collaboration-9f728888b269' },
        ],
      },
      {
        id: 'half-full',
        name: 'our glass is always half full',
        commitment: 'We start from what’s strong rather than what’s wrong. We invest in and grow the assets we hold, both individually and collectively, through sharing access, networks, knowledge, and skills, and working collaboratively.',
        body: [
          'We all have assets (skills, experience, networks and talents) to offer even when those assets are not completely visible to ourselves or denied by others. Part of the work of building relationships that sustain us is to understand and activate those assets for both individual and collective benefit.',
        ],
        quotes: [
          {
            text: 'Find the gifts and talents of everyone in the community. Find a place for that gift, utilise that gift in ways that build community, economy and mutual delight.',
            by: 'DeAmon Hodges',
          },
          {
            text: 'Treat a man as he is, and he will remain as he is. Treat a man as he could be, and he will become what he should be.',
            by: 'Ralph Waldo Emerson',
          },
          {
            text: 'A leader is best when people barely know he exists. When his work is done, his aim fulfilled, they will say: we did it ourselves.',
            by: 'Lao Tzu',
          },
        ],
        reading: [
          { label: 'Strength-based practice and asset-based community development', href: 'https://sustainingcommunity.wordpress.com/resources-for-students/strengths-based-approaches/' },
          { label: 'Rob Berkeley — The Conduit profile', href: 'https://theconduit.com/programme-insights-insights-gender-empowerment-dr-rob-berkeley-focus-whats-strong-rather-whats-wrong/' },
          { label: 'ABCD reading list', href: 'https://sustainingcommunity.wordpress.com/2016/04/11/abcd-reading-list/' },
          { label: 'ABCD: the Croydon projects', href: 'https://cvalive.org.uk/abcd/our-abcd-projects/' },
          { label: 'DeAmon Hodges at TEDx', href: 'https://youtu.be/y6yiRXVP90g' },
          { label: 'Strength-based approaches in social care', href: 'https://youtu.be/BALni0nEmGM' },
          { label: '10 tips for strength-based community engagement', href: 'https://sustainingcommunity.wordpress.com/2013/10/31/strengths-based-ce/' },
        ],
      },
      {
        id: 'the-time-is-always-now',
        name: 'the time is always now',
        commitment: 'We believe that prevention is both better and easier than cure. We seek to be responsive to the needs and ambitions of our peers in ways that challenge patterns of disregard and create cultures of care and support.',
        body: [
          'We are creating the conditions for our survival and building resilient communities among Black queer men. We understand the benefits to physical and mental health of working to address the ‘wider determinants’ of health, including socio-economic, environmental and cultural conditions.',
          'We value and promote the creation of sustainable, supportive networks of men, both through and beyond our interventions, and seek a legacy for our work that includes the growth of assets that bolster the resilience of Black queer men.',
        ],
        quotes: [
          {
            text: 'There is never a time in the future in which we will work out our salvation. The challenge is in the moment, the time is always now.',
            by: 'James Baldwin',
            source: 'Nobody Knows My Name',
          },
          {
            text: 'There’s good evidence that if people are disempowered, if they have little control over their lives, if they’re socially isolated or unable to participate fully in society, then there are biological effects . . . The lower you are in the hierarchy the worse your health, the higher you are, the better your health.',
            by: 'Prof Michael Marmot',
          },
          {
            text: 'A community that is defined by what it dreams of, not what holds it back. A community with ambition, resilience and influence. A community that cares for itself, is keen to collaborate and share, and is proud of the diverse groups that make it up.',
            by: 'Community Links',
            source: 'on a Ready for Everything community',
          },
        ],
        reading: [
          { label: 'A vision for population health', href: 'https://www.kingsfund.org.uk/publications/vision-population-health' },
          { label: 'NHS Long Term Plan', href: 'https://www.longtermplan.nhs.uk/' },
          { label: 'Early Action: a triple dividend', href: 'https://s27436.pcdn.co/wp-content/uploads/Triple_Dividend.pdf' },
        ],
      },
    ],
  },
  {
    stem: 'We understand that',
    principles: [
      {
        id: 'healing',
        name: 'unresolved trauma has a real impact in our lives',
        commitment: 'As a result of the impact of trauma in our lives we make space for healing and build communities of care.',
        body: [
          'We recognise the impact of violence and trauma in our lives, the damage that is caused by patriarchal masculinities and white supremacy, and that we cause to each other. We make space for healing and view community as a resource in helping us to address trauma.',
          'We recognise the importance of self-care. We want to take every opportunity to create cultures in which care is a shared commitment, leading to a more sustainable and sustaining community of care.',
        ],
        quotes: [
          {
            text: 'Confronting chronic emotional pain in Black life is the terrain of political resistance we must now explore, the new revolutionary frontier.',
            by: 'bell hooks',
          },
          {
            text: 'To build community requires vigilant awareness of the work we must continually do to undermine all the socialization that leads us to behave in ways that perpetuate domination.',
            by: 'bell hooks',
          },
        ],
        reading: [
          { label: 'Communities of care', href: 'https://mashable.com/article/community-care-versus-self-care' },
          { label: 'Healing justice', href: 'https://www.astraeafoundation.org/stories/healing-justice-report-launch/' },
          { label: 'Mental health literacy', href: 'https://www.huffpost.com/entry/why-black-mental-health-literacy-matters_b_5939b099e4b014ae8c69decf' },
          { label: 'Care as radical practice', href: 'https://www.opendemocracy.net/en/transformation/learning-care-feminist/' },
        ],
      },
      {
        id: 'justice-and-solidarity',
        name: 'justice and solidarity take work',
        commitment: 'None of us are perfect (yet). We would rather call our brothers in than call them out.',
        body: [
          'Unfortunately, we harm each other because we are human and subject to trauma, so we make space for accountability, reparation, justice, healing, and reconciliation as necessary tools to stay in community with each other.',
          'We are working towards an integrity-positive, delivery-focused culture in which we consciously take steps to make it easier to manage expectations, be accountable, take our share of responsibility, and build trust. We recognise that this will take time and is about both formal structures and informal relationships.',
        ],
        quotes: [
          {
            text: 'Our interior lives, our emotional lives are very much informed by ideology. We oftentimes do the work of the state in and through our interior lives. What we often assume belongs most intimately to ourselves and to our emotional life has been produced elsewhere and has been recruited to do the work of racism and repression.',
            by: 'Angela Davis',
          },
        ],
        reading: [
          { label: 'Tools for building solidarity', href: 'https://democracyctr.org/resource/five-ways-to-build-solidarity-across-our-difference/' },
          { label: 'Community accountability', href: 'https://www.transformativejustice.eu/wp-content/uploads/2010/06/6685_toolkitrev-cmtyacc.pdf' },
          { label: 'Transformative justice', href: 'https://www.transformativejustice.eu/en/what-are-ca-and-tj/' },
          { label: 'A guide to when and how to call in', href: 'https://everydayfeminism.com/2015/01/guide-to-calling-in/' },
        ],
      },
      {
        id: 'no-one-is-free',
        name: 'no one is free until everyone is free',
        commitment: 'We seek to be allies, partners, and accomplices in struggles for freedom and justice. We recognise that a threat to justice anywhere jeopardises justice everywhere.',
        body: [
          'We work with others who share similar values to deliver mutually beneficial outcomes and seek to communicate clearly the parameters of any partnerships.',
          'We strive to act in solidarity and appreciate those who act in solidarity with us; in particular those who are active in their support, open doors to opportunity, and influence those they are proximate to.',
          'Where possible we prefer to operate as accomplices: a more active way of supporting movements that mobilises our privileges and skills to disrupt patterns of injustice alongside those most impacted, rather than ‘allyship’ that can quickly become performative. We are mindful of the limits of our own resources and will seek to share the outcomes of our privilege, or proximity to privilege, in a manner that disrupts rather than reinforces existing power dynamics.',
        ],
        quotes: [
          {
            text: 'Whenever you conceptualize social justice struggles, you will always defeat your own purposes if you cannot imagine the people around whom you are struggling as equal partners.',
            by: 'Angela Davis',
          },
        ],
        reading: [
          { label: 'Don’t be an ally; be an accomplice', href: 'https://www.bostonglobe.com/opinion/2019/06/20/don-ally-accomplice/sdU0ulbN9q8SYLMgsxJfWI/story.html' },
        ],
      },
    ],
  },
  {
    stem: 'We practice',
    principles: [
      {
        id: 'accountability',
        name: 'accountability',
        commitment: 'We operate transparently and share equitably. We are accountable for our actions and expect others to follow suit.',
        body: [
          'We have witnessed too many promising movements flounder due to a lack of transparency, fallouts over money, and personal grievances that started small becoming overwhelming in effect. We seek therefore to create a culture of accountability that recognises the roles we can and do play in harming each other through our actions and inactions, and which holds space for recognition and reparation.',
          'We aim to share information freely and be accountable to our community as stakeholders, rather than just to the funders who require regular reports.',
          'We will use transparency dynamically to engage all stakeholders in how we make decisions, and seek to evidence our rationale for taking action through regular reporting and continuous research and development.',
        ],
        quotes: [
          {
            text: 'A body of men holding themselves accountable to nobody ought not to be trusted by anybody.',
            by: 'Thomas Paine',
          },
          {
            text: 'Accountability means to say what you do, do what you say.',
            by: 'Pearl Zhu',
          },
        ],
        reading: [
          { label: 'A process for movement accountability', href: 'https://www.racialequitytools.org/plan/change-process/accountability' },
        ],
      },
      {
        id: 'learning',
        name: 'learning',
        commitment: 'We invest in learning from the past. We evaluate, document, and archive our work as legacy to our future and share our learning as a contribution to broader movements for justice.',
        body: [
          'Homophobia, colonialism, racism, and the mistaken strategy of respectability in response, have combined to erase us from our histories and denied us the inheritance of wisdom from our forebears and the habits and routes for our legacy. We actively seek to reclaim and celebrate our histories. We commit to documenting and archiving our work as legacy for the future.',
          'We seek to learn from the experiences of those we admire and maximise learning from our own actions by evaluating practice and making the results available for others building movements for justice.',
        ],
        quotes: [
          {
            text: 'Impact measurement and evaluation is all about helping improve the good work you’re doing. By understanding what’s going well, and what’s not, you can take steps to better serve the people and causes you support.',
            by: 'New Philanthropy Capital',
          },
        ],
        reading: [
          { label: 'Tools for impact measurement and evaluation', href: 'https://www.thinknpc.org/themes/measure-and-manage-impact/impact-measurement-evaluation-and-data/' },
        ],
      },
      {
        id: 'joy',
        name: 'joy',
        commitment: 'We create radical change via inclusive, joy-filled spaces in which we can be our best selves.',
        body: [
          'We believe our liberation requires transformation of our society rather than simply reform. As a result, we undertake interventions that demonstrate a radical reframing of society. This requires a seriousness of approach but should never preclude opportunities for joy, laughter and celebration.',
          'We create spaces that are capable of including us all. We seek to remove barriers to participation. While not all spaces will suit all of us at all times, we will create a balance across our interventions to appeal to a broad range of interests, and to address a broad range of needs.',
          'We create interventions that support participants to be their best selves.',
        ],
        quotes: [
          {
            text: 'If I can’t dance to it, it’s not my revolution.',
            by: 'Emma Goldman',
          },
          {
            text: 'As we begin to recognize our deepest feelings, we begin to give up, of necessity, being satisfied with suffering and self-negation, and with the numbness which so often seems like their only alternative in our society.',
            by: 'Audre Lorde',
            source: 'Uses of the Erotic',
          },
        ],
        reading: [
          { label: 'The joy of protest', href: 'https://www.huckmag.com/perspectives/activism-2/joyful-resistance-emily-reynolds-extinction-rebellion-stansted-15/' },
          { label: 'Pleasure activism', href: 'https://www.manrepeller.com/2019/03/what-is-pleasure-activism.html' },
          { label: 'Black boy joy', href: 'http://www.mtv.com/news/2936762/on-carefree-black-boys/' },
        ],
      },
    ],
  },
];

export default function PrinciplesPage({ onNavigate }: PrinciplesPageProps) {
  let n = 0;
  return (
    <article className="max-w-4xl mx-auto text-white" style={{ fontFamily: SANS }}>
      {/* Opening */}
      <header className="pt-6 pb-12 md:pt-12 md:pb-16 border-b" style={{ borderColor: `${GOLD_DEEP}55` }}>
        <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ fontFamily: MONO, color: GOLD_DEEP }}>
          <button onClick={() => onNavigate?.('about')} className="uppercase hover:underline underline-offset-4">About</button>
          {' / '}Our principles · first published 2020
        </p>
        <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.95] mb-6">
          12 Principles<br />for Action
        </h1>
        <blockquote className="text-2xl md:text-3xl italic leading-snug mb-3" style={{ fontFamily: SERIF, color: GOLD }}>
          “Black men loving Black men is the revolutionary act . . .”
        </blockquote>
        <p className="text-sm text-gray-400 mb-10">
          Joseph Beam, <cite>In The Life: A Black Gay Anthology</cite> (1986)
        </p>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl">
          BLKOUT is the Black Queer Men's Liberation Collective. We host gatherings, build space for dialogue, and create community-owned technology for the health, wealth and happiness of Black gay, bi and trans men across the UK. Through local chapters, cooperative membership, creative events, shared learning, and digital media, we turn connection into individual well-being and collective power — owned by and accountable to the people we serve.
        </p>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mt-4">
          We are a values-led organisation. These twelve principles are how we decide what to do, and how we hold each other to it.
        </p>
      </header>

      {/* The twelve at a glance */}
      <nav aria-label="The twelve principles" className="py-12 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 border-b" style={{ borderColor: `${GOLD_DEEP}55` }}>
        {GROUPS.map((g) => (
          <div key={g.stem}>
            <p className="text-sm uppercase tracking-[0.2em] mb-3" style={{ fontFamily: MONO, color: GOLD_DEEP }}>
              {g.stem} . . .
            </p>
            <ul className="space-y-1">
              {g.principles.map((p) => (
                <li key={p.id}>
                  <a href={`#${p.id}`} className="text-lg md:text-xl font-bold hover:underline underline-offset-4" style={{ color: GOLD }}>
                    . . . {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* The principles in full */}
      {GROUPS.map((g) => (
        <section key={g.stem} className="pt-14">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-2" style={{ color: GOLD }}>
            {g.stem} . . .
          </h2>
          {g.principles.map((p) => {
            n += 1;
            return (
              <div key={p.id} id={p.id} className="scroll-mt-28 py-10 border-b border-white/10">
                <p className="text-xs mb-2" style={{ fontFamily: MONO, color: GOLD_DEEP }}>
                  {String(n).padStart(2, '0')} / 12
                </p>
                <h3 className="text-2xl md:text-4xl font-black mb-5">. . . {p.name}</h3>
                <p className="text-xl md:text-2xl italic leading-snug mb-6" style={{ fontFamily: SERIF, color: GOLD }}>
                  {p.commitment}
                </p>
                <div className="space-y-4 text-gray-200 leading-relaxed text-base md:text-lg">
                  {p.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <div className="mt-8 space-y-5">
                  {p.quotes.map((q, i) => (
                    <figure key={i} className="pl-5 border-l-2" style={{ borderColor: GOLD_DEEP }}>
                      <blockquote className="italic text-gray-300 leading-relaxed" style={{ fontFamily: SERIF }}>
                        “{q.text}”
                      </blockquote>
                      <figcaption className="text-sm text-gray-400 mt-1">
                        — {q.by}
                        {q.source && <>, <cite>{q.source}</cite></>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                {p.reading.length > 0 && (
                  <div className="mt-8">
                    <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ fontFamily: MONO, color: GOLD_DEEP }}>
                      Further reading
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {p.reading.map((r) => (
                        <li key={r.href + r.label}>
                          <a
                            href={r.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-sm px-3 py-1 rounded-full border border-white/20 text-gray-200 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
                          >
                            {r.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}

      {/* Close */}
      <footer className="py-16 text-center">
        <p className="text-2xl md:text-3xl italic mb-8" style={{ fontFamily: SERIF, color: GOLD }}>
          If these are yours too, this is your society.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate?.('shop/membership')}
            className="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm text-black"
            style={{ background: GOLD }}
          >
            Become a member
          </button>
          <button
            onClick={() => onNavigate?.('about')}
            className="px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm border text-white hover:text-[#FFD700]"
            style={{ borderColor: GOLD_DEEP }}
          >
            About BLKOUT
          </button>
        </div>
      </footer>
    </article>
  );
}
