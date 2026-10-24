# Principles page: spec 01 (DRAFT for Rob, 24 Oct 2026)

Page: blkoutuk.com/about/principles. It sits under About, with no navigation heading of its own.
The current version (branch `claude/principles-page`) is a faithful copy of the 2020 site. This spec
covers making it great.

## Why (Rob, 24 Oct 2026)

The 12 Principles were "one of the most significant pieces of work" done in the run-up to the
pandemic. They distil what would be different about this organisation. The seeds of everything since
are in them: emergent strategy, fundamental thinking about democracy, and the move to become a co-operative.
The page should be:

1. **beautiful**, and inspiring to come to;
2. **something you can learn from**;
3. **evidence** that what BLKOUT is doing is not the same as what its peers do.

## The idea: seeds and what grew from them

Written in 2020, the principles read as a promise. Read now, they read as a forecast. The page pairs each
principle with what grew from it, using dated facts only. That pairing is the evidence of difference. It
doesn't claim we are different; it shows choices that peers mostly don't make. No peer is named or
compared, because the difference is shown, not argued.

### Evidence map

The source for these facts is the Ten Years page (`src/components/pages/TenYears.tsx`), which Rob approved
on 28 Jul 2026. Rows marked ⚠ have no evidence yet, so Rob needs to fill them.

| Principle | What grew from it | Source |
|---|---|---|
| we are becoming | Imagined as a five-year project in 2016. Became four shapes: the table, the company, the listening, the society. | Ten Years |
| we are enough | July 2024: "we stopped delivering, and we asked instead." The co-op rules were written by a community working group, not handed down. | Ten Years |
| we are not all the same | BLKOUT NXT (April 2025): people registered as one of four (Black queer man, accomplice or ally, QTIPOC organiser, partner organisation). | Ten Years |
| the whole is greater than the sum of its parts | The co-op working group's time was paid, not volunteered. Twelve founding members signed up while there was still nothing to join. | Ten Years |
| our glass is always half full | In The Picture: peer-led research recording education, work, play, love, growing older and happiness, not only sexual health, homelessness and asylum. | Ten Years |
| the time is always now | The 2024 pause: we read what the moment needed and changed shape, rather than delivering badly. Each generation has its own task. | Ten Years + Rob's meaning (memory) |
| unresolved trauma has a real impact in our lives | A mental-health focus to the work. Ivor's Compass (SCT 150, launched 12 Apr 2026). ⚠ The wording of the line still needs drafting. | Rob, 24 Oct 2026; memory |
| justice and solidarity take work | Each One Teach One. Community research. DiaspoRainbow (our response to the partner consultation, 2026). Vocal, pre-emptive public support for Jason Osamede Okundaye (2017), Revd Jarel Robinson-Brown (2021) and Christopher Joell-DeShields (2025) when the press was circling threateningly. ⚠ Dates, and the spelling of names, still to be confirmed. ⚠ Naming them publicly needs their consent. | Rob, 24 Oct 2026 |
| no one is free until everyone is free | Our policy that money is no barrier to taking part. Intergenerational work: on HIV, ageing and youth. "Accomplice or ally" was one of the four ways to register for NXT. ⚠ Examples and dates for each still to come from Rob. | Rob, 24 Oct 2026; Ten Years |
| we practice accountability | Registered 24 Nov 2025 as a Community Benefit Society (no. 9639) with an asset lock: members, not shareholders. One member, one vote. Everyone on a project is paid the same flat rate. The Year One report is public. | Ten Years, COMMS.md, memory |
| we practice learning | In The Picture (2019–20). The Stories archive. The Commons Kit values exercise, offered to other organisations. "We learn, not fail." | Ten Years, projects/commons |
| we practice joy | Black Men Who Brunch. David McAlmont singing at Croydon Pride. The Berto Pasuka Prize. A Place For Us at Queer Britain (January 2023). | Ten Years |

### How we show support (Rob, 24 Oct 2026)

"Public media is not the only way we may offer support; it's often an escalation." Support starts in private,
person to person, and goes public only when that is what's needed. This is the principle itself, "call our
brothers in rather than call them out", applied to how we stand with people. The page should present the
three public statements (2017, 2021, 2025) as the visible tip of that support, not the whole of it, and
should not imply that a public statement is the measure of solidarity. Private support is not evidenced
or described, for the protection of the people involved.

Rob then named what solidarity rests on: **holding space, building relationships, supporting networks, and building
the commons. All of these are necessary, though not sufficient, for solidarity.** That gives the principle's
"What grew" section its shape: the everyday groundwork (the Hub, brunches and picnics, the Commons Kit,
community-owned media) comes first, and the public statements are the escalation it makes possible.
"Necessary, not sufficient" is Rob's framing, and it stays: solidarity is never claimed as achieved.

### From the story archive (searched 24 Oct 2026: `archived_articles`, 268 posts, 2016–2024)

Each of these can be a "What grew" link to blkoutuk.com/stories/<slug>.

| Principle | Article | Slug |
|---|---|---|
| our glass is always half full | "BlackOut: what's the big idea?" (17 May 2019). It names the "glass-half-full focus on lack rather than abundance" imposed on us, which shows the principle predates the 2020 site. | `blackout-whats-the-big-idea` |
| justice and solidarity take work (each one teach one) | "Apply: Lessons In The Life" (14 Dec 2018): an online curriculum "by Black queer men for Black queer men" for 2019, with paid facilitators, funded by The National Lottery Community Fund. | `apply-lessons-in-the-life` |
| justice and solidarity take work (community research) | "Wanted: 10 community researchers" (17 May 2019): paid, trained, and joining a pan-London research panel. | `apply-wanted-10-community-researchers` |
| justice and solidarity take work (community research) | "Report: In The Picture" (29 Oct 2020). | `report-in-the-picture` |
| justice and solidarity take work (press support) | "We Stand with Jason" (7 Aug 2017). The archive gives his name as Jason **Osamede** Okundaye. | `read-we-stand-with-jason` |
| justice and solidarity take work (press support) | "In Solidarity" (5 Feb 2021): an open letter for **Revd Jarel Robinson-Brown**, co-signed with House of Rainbow. Rob had given the name as "Fr Jarel Brown"; this is the archive's version. | `read-in-solidarity` |
| justice and solidarity take work (press support) | "One Month Later: Are Pride's Anonymous Board Proud?" (Voices, 11 Oct 2025), in support of Pride in London CEO **Christopher Joell-DeShields** after the board's High Court injunction. It was the first Voices essay (Rob). It is in `voices_articles`, not the old archive. | `one-month-later-are-pride-s-anonymous-board-proud-mgmj86p2` |
| no one is free (money, generations, HIV) | The 2019 researcher call: paid, and it particularly sought men under 25, men over 55, trans men and men living with HIV. | `apply-wanted-10-community-researchers` |
| no one is free (HIV) | World AIDS Day 2018, "No longer speechless?": a film by Phil Samba, *Standing on the Shoulders of Giants*. Also "30 years with HIV: celebrating life" (1 Dec 2016). | `watch-no-longer-speechless-world-aids-day-2018`, `read-30-years-with-hiv-celebrating-life` |
| no one is free (intergenerational) | "Pearl's Return" (3 Mar 2021): reviving Pearl Alcock's Brixton shebeen from the 1960s and 70s. Also the "BlackOut Inheritance" series (Mar–Apr 2018). | `pledge-pearls-return`, `read-blackout-inheritance-part-one` |
| unresolved trauma (mental health) | "Is being Black and Queer bad for your health?" (event 24 Jul 2018, report back 6 Sep 2018). | `event-is-being-black-and-queer-bad-for-your-health`, `listen-is-being-black-and-queer-bad-for-your-health-the-report-back` |
| accountability | "Cometh the hour… join the vanguard" (5 Apr 2020): Hub members shaping the community, with interventions that "match our values/mission". | `read-cometh-the-hour` |

## Structure

1. **Opening.** Joseph Beam's line, then the mission statement. Then one paragraph, in Rob's voice, on
   what the principles were for in 2020 and why they still lead (Rob drafts it or approves a draft).
2. **The twelve at a glance.** Kept from the current page. On a phone it's the whole idea on one screen.
3. **The twelve in full.** Each principle has:
   - the 2020 commitment, as written;
   - **"What grew"**: a dated line or two from the evidence map, with a link to proof where we have it
     (Ten Years, the FCA register, the Year One report);
   - the essay, quotations and further reading, folded away under "Read more" so the page stays calm.
4. **Lineage.** Beam, Lorde, hooks, Baldwin, Hall, Davis: the voices the principles quote. Plus kin
   they share moves with, such as adrienne maree brown's *Emergent Strategy*. That one is presented as
   kinship, not citation, because the 2020 site doesn't cite it.
5. **Use them.** How the principles are used: holding decisions to them, and the Commons Kit exercise
   that helps other organisations find their own. This is the "learn from" part.
6. **Close.** Become a member, and back to About.

## Design

- The blkoutuk.com palette (black, gold, white) with Work Sans and Fraunces italic. Afrofuturist, not
  retro: slow and roomy, with no engagement tricks.
- Images: real archive photos only. There's evidence already in `public/images/ten-years/`; use the
  find-image skill for more. No generated people. The photos in the values graphic need their rights
  checked before reuse.
- Each principle has its own link, so BLKOUTHUB, posts and the card can point to one principle.
- Below the opening, nothing should depend on JavaScript, so the prerendered page reads in full for
  search engines and AI models.

## Process

Rob approves this spec and fills the ⚠ rows, then the page is built. As a flagship page it's a candidate
for the design-loop skill (a builder and three critics), which is deliberately expensive and runs only
if Rob says so. The page goes live only on Rob's word.
