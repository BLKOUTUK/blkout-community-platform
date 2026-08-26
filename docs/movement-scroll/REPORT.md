# BUILD REPORT — /movement split-stage rebuild (26 Aug 2026)

Built by an Opus subagent from SPEC.md/BRIEF.md; committed as `40561a3a` on
`claude/movement-scroll-redesign`. Not pushed, no PR, no deploy at build time.
(The builder could not write this file itself; its report is recorded here verbatim
in substance by the orchestrating session.)

## What was built

`src/components/movement/MovementSplit.tsx` (~1090 lines) plus one sibling,
`MovementSplit.css` (~1080 lines). `App.tsx` changed by exactly 2 lines (import +
`case 'movement':`). `TheoryOfChangeMasonry.tsx` untouched. `package-lock.json` was
already dirty before the build and was left out of the commit.

**The mechanism.** One motion value, `balance` (0 = all ALONE, 1 = all TOGETHER),
derived from the root's `scrollYProgress` through a keyframe table computed from the act
list, spring-smoothed (stiffness 60, damping 20). It writes a single CSS custom property,
`--ms-balance`; CSS resolves everything else from
`--ms-seam: calc((1 - var(--ms-balance)) * 100%)`. The seam is a full-size box moved by a
percentage translate; grounds and per-act side layers are `clip-path: inset()`; copy
columns have static widths chosen so they can never cross the seam within that act's
balance range. Nothing animates width/height/top/left, no `transition: all`, only
transform/opacity/clip-path. Desktop seam vertical; below 768px it flips horizontal
(ALONE top, TOGETHER below, rising as balance grows).

## Acts as implemented

| # | Act | Device | Span | Balance |
|---|---|---|---|---|
| 1 | Split hero | pin | 1.8 | 0.5 |
| 2 | The question | flow (poll) | 1.2 | 0.5 |
| 3 | The problem | pin + kinetic | 2.2 | 0.5 → 0.28 |
| 4 | The turn | pin + reveal | 1.8 | 0.28 → 0.58 |
| 5 | The evidence | flow + in | 2.4 | 0.58 → 0.66 |
| 6 | The breath | ground only | 0.6 | 0.66 |
| 7 | The collapse (peak) | pin | 3.2 | → 1.0 at mid-act |
| 8 | The close | pin, cues hold | 1.4 | 1.0 |

Total 14.6vh. Cue windows follow the `from [to [rampIn [rampOut]]]` contract; every act
but the last closes its final cue with a two-value window ending at 1. Act 8's four cues
hold, so the final screen keeps all its content. Post-close carries the OOMF block ported
verbatim, the imagery disclaimer, and the existing footer compressed.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — MovementSplit.tsx zero errors. App.tsx has 8 errors, all pre-existing (proved by stashing the App.tsx change and re-running: identical 8 errors and identical repo total, 424, before and after) |
| `npm run build` | PASS — 2394 modules, 8.69s |
| Asset path diff | PASS — 14 paths referenced, 14 present, 0 misses, 0 orphans |
| `curl /movement` on vite preview | PASS — 200, text/html |
| `curl` each `/images/movement/*.jpg` | PASS — 11/11: 200, image/jpeg, content-length byte-identical to disk |
| `curl` both videos + OOMF promo | PASS — 200, video/mp4 ×2 and image/jpeg, lengths match disk |
| Bundle grep "each other's missing link" | PRESENT (inclusion only) |
| Built CSS carries the geometry | PRESENT — seam transform, both side clip-paths, the 767px and reduced-motion media blocks (confirmed two ways; `grep -o` under-reports on single-line minified CSS) |

**Not verified (no browser in this environment):** rendered pixels (contrast designed
for, never measured), scroll feel and spring response, whether act 3's pin travel carries
five staged beats, whether the act-7 collapse lands as the peak, the seam pulse, the
mobile horizontal-seam layout (highest-risk part, never rendered at any width), the
reduced-motion fallback, video playback, the OOMF iframe. `/movement` returning 200 is
the SPA catch-all: shell loads, not proof this component mounts.

## Commissioned images: all three real, no fallbacks

All three landed before the referencing code was written: gathering-wide.jpg (1920×1072),
gathering-portrait.jpg (1392×1728), empty-chair.jpg (1289×1600). The build script guards
empty-chair.jpg behind an existence check and reported `present, left untouched`. All
three plus every source card were opened and read before alt text was written.
Generation: Kie.ai nano-banana-2, 4 tasks (one reroll for a perspective seam in the
portrait), ≈ $0.20. Originals archived at
`~/blkout/projects/image-archive/generated/movement-2026-08/`.

Optimised from `theory-of-change/` PNGs via PIL, progressive JPEG q88: alone-isolation ←
card-01, together-repair ← card-38, apps-distance ← card-13, golden-hour ← card-09,
gatherings ← card-33, stories ← card-24. Plus lorde-poster / baldwin-poster extracted at
1.2s from the two videos.

## Deviations from SPEC, with reasons

1. **The Ownership plate ships with no figure.** SPEC named `intergenerational.png`; on
   inspection it is a purple infographic with text baked into the image, breaking two
   taste.md hard rules on a gold-on-black page. SPEC's copy and link kept verbatim; the
   plate runs as type on a gold hairline. If a figure is wanted there it needs a
   different or newly commissioned source.
2. **The hero h1 fades over the last 20% of act 1** rather than a literal hold — a true
   hold on a middle pinned act stays lit through the un-pin slide and crosses the sticky
   nav (the devices.md §2 failure). Window `[0, 1, 0, 0.2]`.
3. **Act 7's cues start at p=0.52** — a full-width copy column before balance reaches 1.0
   gets clipped by the seam still in transit; SPEC itself says the divider releases
   across the first half.
4. **Act 3 uses kinetic assembly on three headline entrances** (SPEC explicit), windows
   sequential so no two at full opacity together.
5. **Breakout measures `document.documentElement.clientWidth`** rather than `100vw`
   (scrollbar-safe), `left: 50%; translateX(-50%); margin-block: -2rem; overflow-x: clip`.
6. **A sibling CSS file** for the geometry — media queries, clip-path with `min()`,
   reduced-motion and the custom-property contract aren't expressible as utilities.
   Verified brand tokens only.
7. **One em dash survives in the OOMF promo alt text** (carried verbatim per SPEC); none
   in visible copy.

## Tuning notes

- Phone layout first when reviewing — least constrained, never rendered.
- If act 3 reads rushed: lift its span to 2.6 and trim act 5 to 2.2 in the `ACTS` table
  at the top of the component; the balance keyframes derive from that table.
