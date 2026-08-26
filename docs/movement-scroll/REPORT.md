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

## Revision 26 Aug (Rob's review)

Four notes from Rob, implemented in `MovementSplit.tsx` + `MovementSplit.css` only.

**1. Act 4, the turn — no lateral reveal, and the argument keeps its trail.**
The left-to-right clip-path wipe on `golden-hour.jpg` is gone. The image is now the
right column's ground from the act's first frame, opacity `0.4 → 1` across `p 0 → 0.22`
(present at p=0, so the "ground or greet" rule still holds). Nothing in act 4 translates
sideways. The right column dropped `ms-stack` (absolute, one-cue-at-a-time) for flow
layout in `.ms-col--turn-right`, so lines assemble in place and accumulate: each joins
the ones above it instead of replacing them. New order — LEFT: the Ru quote, then the
RuPaul amen gif beneath it as the bridge (`public/images/movement/rupaul-amen.gif`,
copied from `theory-of-change/`, ~1MB; `rupaul-amen-still.jpg` 36KB, frame 0 via PIL, is
swapped in under `prefers-reduced-motion`). RIGHT: "Hold on a minute, Ru…" → "Loving
ourselves is learned through community." → "We are each other's missing link." Cue
windows `[0,1,0,.08]`, `[.12,1,.14,.09]`, `[.30,1,.14,.11]`, `[.48,1,.19,.15]`,
`[.66,1,.29,.23]` — every one plateaus, all five begin their fade at p ≈ 0.92 and reach 0
at exactly 1, so the middle-act rule is intact. Divider swing 0.28 → 0.58 and the 0.5
seam pulse are untouched. Column widths are measured against the seam at its narrowest in
this act (42%): left `min(46ch, 38%)`, right `min(52ch, 42%)`, so neither can be clipped.
On phones the alone band shrinks as the seam rises, so the quote and the gif sit side by
side (gif 132px) instead of stacked.

**2. Act 8, the close — three doors instead of one CTA.**
The single `Join BLKOUT` button and the small secondary links are replaced by
`.ms-doors`: one decision at three depths, ascending. (1) "Sign up for the newsletter" /
"A monthly letter. Start here." → `https://crm.blkoutuk.cloud/join`. (2) "Join the
BLKOUTHUB" carrying Rob's differentiation near-verbatim ("The apps reduce you; their
model is you, staying alone. We built the Hub to do the opposite: a space driven by
building your networks.") → `https://blkouthub.com`, new tab — this pays off act 3's apps
beat. (3) "Become a member" is **not a link**: membership is a holding page, so it renders
quieter (no fill, muted hairline) with a "Coming soon" tag, the subline "Community-owned.
One member, one vote.", and one small underlined link, "How membership will work" →
`/governance` (44px target). Poll callback and thesis lines unchanged; the doors follow
them on the same holding cue `[0.28, 1, 0.1, 0]`. Three across at ≥1280px, full-width
rows below that and on phones. The close column widened to `min(88ch, 66%)` and the chair
frame moved to `left: 66%` so the doors have room; both revert to full-bleed on phones.
`.ms-cta` and `.ms-secondary` were removed from the CSS — nothing referenced them once the
single CTA went.

**3. Post-close — the film carries the OOMF invitation.**
The cold promo-image-then-iframe drop is now sequenced: kicker "One more thing", then
`/videos/Heroes2.mp4` full width in the content column (click to play, `controls`,
`preload="none"` so none of its 36 MB is fetched until the visitor presses it,
`poster="/images/poster-Heroes2.jpg"`, `playsInline`), then the payoff in live type,
"We're the heroes we've been waiting for." / "Now put yourself in the story.", then the
OOMF iframe and its open-in-new-tab fallback exactly as ported. **No `autoPlay` and no
`muted`**: nothing plays or fetches on its own, and sound arrives only on the visitor's
press, the same contract as the Lorde clip in act 5. (The homepage's Heroes2 element
carries `muted` as a leftover from when it autoplayed; muting a film the visitor has
deliberately started would cost the invitation the thing that makes it fun.)
**`oomf-heroes-promo.jpg` was dropped**, my call under the brief's option: its copy is
baked into the image, and that copy is now live type in the payoff headline directly
above the iframe, so keeping it would have duplicated the line, crowded the film and put
type-in-an-image on the page against the taste floor. It stays on disk and is still
referenced by the retained `TheoryOfChangeMasonry.tsx`. Dropping it also removed the last
em dash in visible copy: the page now has none. The purple leftover kicker became
`.ms-eyebrow`, the page's own gold uppercase.

**4. Act 5, "Voices we carry" — two clips, equal weight.**
`.ms-voices` went from `2fr / 1fr` to `repeat(2, minmax(0, 1fr))`: Lorde and Baldwin now
render the same size side by side, and stack equal full-width on phones. No headline and
companion any more. Baldwin was hard to read at a third of the row, so it gains `controls`
(pause to read, or go fullscreen) while keeping its muted IntersectionObserver loop.
`MutedLoopVideo` now **hands over the moment the visitor touches the controls**: a pause
while the clip is on screen, or an unmute, stops the observer playing or pausing it again,
so a clip stopped mid-sentence stays stopped. `muted` is no longer a JSX attribute; it is
set once imperatively on mount and never re-asserted, so **an audio track arriving in a
later mp4 swap needs no code change** and an unmute through the controls sticks. Captions
follow: "James Baldwin, from the archive. Pause it to read." replaces "Silent loop", and
the aria-label drops "no sound", so neither goes stale when Rob finds the audio. Lorde's
contract is untouched: user-initiated, sound on press.

### Verification of the revision

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS — zero errors in MovementSplit.tsx/.css; App.tsx's same 8 pre-existing errors, repo total still 424 |
| `npm run build` | PASS — 2394 modules, 13.0s |
| Asset path diff | PASS — 17 paths referenced, 17 present, 0 missing, 0 orphans in `public/images/movement/` |
| `curl` new assets on :4173 | PASS — `rupaul-amen.gif` 200 `image/gif` 1066428, `rupaul-amen-still.jpg` 200 `image/jpeg` 36245, `Heroes2.mp4` 200 `video/mp4` 36789221, `poster-Heroes2.jpg` 200 `image/jpeg` 51307; every content-length byte-identical to disk |
| Bundle grep | "staying alone", "Become a member", "Coming soon", "How membership will work", "heroes we've been waiting for", "Now put yourself in the story" all PRESENT; "oomf-heroes-promo" absent (inclusion only — an un-code-split bundle carries every page's strings) |
| Cue windows | Simulated `cueSpec` for all five act-4 cues: each plateaus, all close at 1, none holds |
| Em dashes in visible copy | Zero in the file, comments included |
| `curl` both Voices clips on :4173 | PASS — `Lordescroll.mp4` and `baldwinscroll.mp4` 200 `video/mp4`, 4592066 and 4945881, both matching disk |
| Built CSS carries the equalised row | PRESENT — `.ms-voices{...repeat(2,minmax(0,1fr))...}` plus the single-column phone rule; "Silent loop" and "no sound" now absent from the bundle |

**Still not verified:** rendered pixels, scroll feel, the gif's weight against the type at
real size, the phone layouts (act 4's side-by-side band and the stacked doors), whether the
three doors read as equal weight with the third deliberately quieter, whether the film
at full width leaves the OOMF iframe enough air below it, and whether Baldwin's on-screen
text is actually legible at half the Voices row (the controls are the fallback if it is
not: pause, or fullscreen).

## Tuning notes

- Phone layout first when reviewing — least constrained, never rendered.
- If act 3 reads rushed: lift its span to 2.6 and trim act 5 to 2.2 in the `ACTS` table
  at the top of the component; the balance keyframes derive from that table.
