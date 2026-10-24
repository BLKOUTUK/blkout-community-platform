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
| unresolved trauma has a real impact in our lives | ⚠ Candidates: Diasporan Dialogues on Black gay men's health (ViiV); Social Movement for Health; the mental-health pathway page. | Rob |
| justice and solidarity take work | ⚠ No evidence yet. | Rob |
| no one is free until everyone is free | "Accomplice or ally" was one of the four ways to register for NXT. ⚠ Anything stronger? | Ten Years / Rob |
| we practice accountability | Registered 24 Nov 2025 as a Community Benefit Society (no. 9639) with an asset lock: members, not shareholders. One member, one vote. Everyone on a project is paid the same flat rate. The Year One report is public. | Ten Years, COMMS.md, memory |
| we practice learning | In The Picture (2019–20). The Stories archive. The Commons Kit values exercise, offered to other organisations. "We learn, not fail." | Ten Years, projects/commons |
| we practice joy | Black Men Who Brunch. David McAlmont singing at Croydon Pride. The Berto Pasuka Prize. A Place For Us at Queer Britain (January 2023). | Ten Years |

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
