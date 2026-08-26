# SPEC — /movement scroll redesign (split-stage)

Build target: `src/components/movement/MovementSplit.tsx` (new file) in
blkout-community-platform, replacing `TheoryOfChangeMasonry` at the `movement` route in
`src/App.tsx` (one-line import + case swap; do NOT delete the old component file).
Stack: React + framer-motion (`useScroll`, `useTransform`, `useMotionValueEvent`) +
Tailwind. No new dependencies. No `require()` anywhere (Vite is ESM-only; CJS throws
silently into the ErrorBoundary).

Read before writing markup:
- `docs/movement-scroll/BRIEF.md` (this folder)
- `~/tools/scrollcraft-ref/taste.md` — the design floor (spacing, type, contrast, motion)
- `~/tools/scrollcraft-ref/devices.md` §2 (the cue contract), §4, §5, §8
- `~/tools/scrollcraft-ref/uniqueness.md` §2.7 (split stage: what it forbids)
- Brand: gold `#FFD700` / `#D4AF37`, black ground, white body; Work Sans 400/600/900 +
  Fraunces italic (both already load in this app — verify in index.html before relying on
  a weight). Tailwind tokens verified working: `liberation-gold-divine`,
  `liberation-sovereignty-gold`, `liberation-black-power`, `blkout-600`. NEVER
  `liberation-purple-spirit` or other unverified shorthands; safe fallbacks `amber-400`,
  `gray-300/400`, `black`.

## The persistent structure

The whole page is one split: **ALONE** (left/cool) vs **TOGETHER** (right/warm). The
divider is the chrome: a 2px seam in `#D4AF37` with a soft 1px `#FFD700` core, carrying
the two small uppercase labels (Work Sans 600, letterspaced, ~12px) near the top of each
column. The page adds NO chrome of its own beyond the divider: the app shell already
renders the real sticky site nav (App.tsx, `sticky top-1 z-40`, ~64px tall, opaque black)
above every route, so there is no page wordmark and no second bar. Two consequences:
1. **Full-bleed breakout**: routes render inside `<main className="container mx-auto px-4
   py-8">`. The component's root must escape it: `w-screen relative left-1/2
   -translate-x-1/2 -my-8` (or the `-mx-[50vw]` equivalent), so the split runs edge to
   edge. Verify no horizontal scrollbar results (`overflow-x: clip` on the root).
2. **Clear zone**: the sticky nav overlays the top ~70px of every pinned viewport. Keep
   headlines and the side-labels below that line (pad stage tops ~88px); never put a cue's
   landing position under the nav.
The site's normal footer follows the close, compressed.

Divider position = a single motion value `balance` (0 = all ALONE, 1 = all TOGETHER),
driven per-act by scroll progress, spring-smoothed (stiffness ~60, damping ~20 — it should
glide, not snap). Left column ground `#0B0B0D`; right column ground `#120D02` with a faint
gold radial cast. Grounds are per-side and hard; no drift interpolation between them.

Desktop (≥768px): vertical seam, columns side by side.
**Mobile (<768px): the seam is horizontal** — ALONE is the top half, TOGETHER the bottom;
`balance` moves the seam vertically, so the together side literally rises as the page
progresses. Same acts, same copy, full-width stacked content within each half.

Reduced motion (`prefers-reduced-motion: reduce`): no springs, cues render fully visible
per act, divider steps between per-act rest positions, no scale/parallax transforms. The
poll still works. Meaning survives without motion.

## Acts

Total scroll length ≈ 14 viewport-heights. Spans below are the act's scroll budget
(pinned acts pin for that travel; flow acts just occupy document flow of roughly that
height). Balance values are the divider's rest position by the END of the act.

### Act 1 — SPLIT HERO · pin · span 1.8 · balance 0.5 throughout
Left: `card-01-isolation` (crop keeps the seated figure whole; cool grade via CSS
`saturate(0.55)`). Right: `card-38-damage-repair` (warm, untouched). Both full-bleed
within their columns, a text scrim only where the type sits (never a full-frame overlay).
Greet cues (`0 1 0 0` equivalent — visible at p=0):
- Left h1 (Work Sans 900, ~clamp(2rem,4.5vw,4rem), white): **"You are often the only one."**
- Right h1 (same scale, `#FFD700`): **"You were never meant to be."**
Both readable at once on the landing view — this teaches the format before any scrolling.
During the pin, one supporting line per side cues in and closes before act end
(two-value windows):
- Left small: *"even in spaces full of us, you can feel alone"* (Rob's line)
- Right small: *"a plan by us, for us"*
No scroll cue, no arrow, no counter. `<h1>` is the left line; right line is a styled `<p
role="heading" aria-level="1">`? No — one real h1 only: make the pair a single `<h1>` with
two spans (one per column) so the document h1 reads "You are often the only one. You were
never meant to be."

### Act 2 — THE QUESTION · flow · ~1.2vh · balance 0.5
The split persists as layout. LEFT column carries the interaction:
- Heading (Work Sans 600): **"How many Black queer men could you call on in a crisis?"**
- Small print (Fraunces italic): *"(Booty calls may be urgent, but they don't count.)"*
- Four buttons: `0` · `1–2` · `3–5` · `Squad deep`. In-page state only; nothing stored,
  nothing sent. Buttons: 44px min tap target, gold border, black fill; selected =
  gold fill, black text. Keyboard operable, `aria-pressed`.
RIGHT column sits dim until an answer is chosen (or until the section scrolls 60% past,
whichever first), then reveals:
- *"When we asked, most of us said: 1 or fewer."*
- Small: *"And that includes the GC: banter that's been on mute since 2019."*
Store the choice in component state for Act 8.

### Act 3 — THE PROBLEM · pin · span 2.4 · balance moves 0.5 → 0.28 (ALONE wins ground)
The only act where the wrong side grows. Left column (dominant) runs a staged argument —
kinetic line-assembly on each entrance (translate-y behind an overflow mask, per line,
60–80ms stagger; masks must clear descenders), cue windows overlapping ~15%, every cue
closed before act end (two-value windows; only Act 8 holds):
1. **"That's not community. That's just proximity."** (large, white)
2. *"Funny fake names, borrowed pics, unclear motives."*
3. `card-13-app` reveals (clip-path wipe `up`, on a wrapper, not on the type) with:
   **"No face, no case, no intimacy."** + *"The apps reward sharing as little of yourself
   as possible: what you want, not what you need."*
4. **"Racism and patriarchy don't just harm our life chances. They keep us from healing
   by cutting us off from each other."**
5. **"We think we are brand new. Black queer folk always existed. Thrived. Built
   community."** + *"An inconvenient truth, erased from our history to hold back our
   future."*
RIGHT column compresses to a sliver but NEVER disappears (min-width ~64px desktop / 56px
height mobile): the warm image still burning at the edge, with one small rotated label in
gold: *"still here"*.

### Act 4 — THE TURN · reveal · span 1.8 · balance 0.28 → 0.58
Left column, fading as it shrinks: **"What we've been told: 'If you can't love yourself,
how you gonna love somebody else?'"**
Right column takes over mid-act with a big clip-path reveal (left-to-right wipe, the
loudest reveal on the page) of `card-09-inversion` (two men, golden hour), then staged
lines:
1. Fraunces italic, gold, large: **"Hold on a minute, Ru. You've missed a step."**
2. **"Loving ourselves is learned through community."**
3. Largest (Work Sans 900): **"We are each other's missing link."**
As `balance` crosses 0.5 the seam pulses once (brief glow widening ~6px and settling) —
the felt centre-crossing. Subtle; skip under reduced motion.

### Act 5 — THE EVIDENCE · flow + in · ~2.0vh · balance 0.58 → 0.66
Right column dominant, carrying three fact-plates that reveal on entry (IntersectionObserver,
once, 30–80ms stagger; content never re-hides). Museum-label register, not pitch:
1. **Gatherings** — `card-33-show-up` — *"Real rooms. Real conversations. No transaction
   required."* → quiet link "See what's on" → https://events.blkoutuk.cloud
2. **Stories** — `card-24-articles` — *"Our archive. Our stories, told on our terms."*
   → quiet link "Read the archive" → /stories
3. **Ownership** — `intergenerational.png` — *"A Community Benefit Society: one member,
   one vote. Asset-locked — it can never be sold out from under us."* Set the dash as a
   colon or comma instead (house scroll rule: no em dashes visible) → quiet link
   "How it works" → /governance
4. **Voices we carry** (Rob's directive 26 Aug: Lorde and Baldwin stay) — the pairing from
   the current page, kept: `videos/Lordescroll.mp4` as the headline item (controls shown,
   sound available, playback USER-INITIATED — never autoplay with audio) beside
   `videos/baldwinscroll.mp4` as the muted companion (IntersectionObserver play/pause,
   muted loop, playsInline, like the current ScrollVideo). Give both `preload="metadata"`
   and a poster frame so nothing flashes empty.
No invented numbers, no counters. Left sliver: dim, image only.
(Act 5 span becomes ~2.4vh to give Voices room; Act 3 trims to 2.2 to hold ~14vh total.)

### Act 6 — THE BREATH · ground-only · 0.6vh · balance 0.66
Authored silence. Both columns dip to near-black (images fade to ~8% opacity), the seam
alone stays lit gold. No copy. Declared in BRIEF.md so it is not read as dead scroll.

### Act 7 — THE COLLAPSE (PEAK) · pin · span 3.2 (largest by a visible margin) · balance → 1.0
The divider releases across the first half of the pin: the together side floods the whole
frame. The ALONE label fades out with its column; the TOGETHER label scales up and
travels to become the act's small kicker. Full-frame asset: commissioned wide gathering
(`movement/gathering-wide.jpg`, 16:9; mobile uses `movement/gathering-portrait.jpg`).
Slow progress-driven scale on the image (1.06 → 1.0, transform only) so the room settles
as you arrive. Staged cues over it (scrim only under the type):
1. Gold, huge (this is the largest type on the page): **"Tenderness is a political act."**
2. White: **"Black queer joy is revolutionary."**
Both close before act end. This is the moment; nothing else competes with it.

### Act 8 — THE CLOSE · pin · span 1.4 · balance 1.0 · cues HOLD
Same room, dimmed ~35% behind a left-anchored text block; foreground asset
`movement/empty-chair.jpg` (commissioned: an empty chair in the same warm room, shallow
focus) as the right-hand ground on desktop, full-bleed behind on mobile.
1. The callback (the signature move lands). If answered: **"Earlier you said {answer}."**
   If not: **"Most of us said 1 or fewer."** Then, Fraunces italic gold:
   **"Let's change that. There's a seat here with your name on it."**
2. Thesis, held: **"The damage is structural. The repair is relational."**
   Small under it: *"This is the work. This is the joy."*
3. Primary CTA (one action, one label): **Join BLKOUT** → https://crm.blkoutuk.cloud/join
   Gold fill, black text, generous padding, plain hover (no magnet). Subline, small,
   honest: *"A monthly letter. First through the door as membership opens."*
4. One quiet secondary line, small underlined links: *"Already in community?
   [BLKOUTHUB](https://blkouthub.com) · Just looking? [The stories](/stories)"*
The final screen holds with all of this on it (one-value cues). The page resolves; it does
not trail off.

### Post-close (document flow, compact)
- OOMF stays as-is (Rob's directive 26 Aug): keep the current page's post-credit section —
  `oomf-heroes-promo.jpg` promo image, the live `https://oomf.blkoutuk.com/` iframe with
  its existing sandbox/allow attributes, and the "Open in new tab" fallback link. Port the
  block from TheoryOfChangeMasonry.tsx (lines ~951–969) essentially verbatim.
- Imagery disclaimer, small, one line (keep the current page's honesty):
  *"Imagery: AI-generated (Wan 2.6, Gemini 3); real photos in select frames."*
- The existing footer block from TheoryOfChangeMasonry, reused.

## Assets

Optimise every used image into `public/images/movement/` as kebab-case progressive JPEG,
max edge 1600px, quality 86–90 (source PNGs are ~2MB each; never ship them raw on this
page). Keep originals untouched. Files with spaces are renamed at optimisation time.
Enumerate every path the component references and verify each exists on disk before
claiming done (compile/diff, not read).

Commissioned (already generated into `public/images/movement/` by the time you build; if
any is missing, build with the named fallback and say so in your report):
- `gathering-wide.jpg` (16:9 peak; fallback: card-38 cropped)
- `gathering-portrait.jpg` (4:5 mobile peak; fallback: card-33)
- `empty-chair.jpg` (close; fallback: dimmed peak image only)

## Hard rules (scrollcraft floor + house)
- No scroll-cue arrows/mice, no `01/06` counters, no em dashes in visible copy, no
  gradient text, no neon glow, no `transition: all`, no animating top/left/width/height
  (transform + opacity + clip-path only), no invented statistics, no autoplaying audio.
- Real semantic HTML: one `<h1>`, real `<p>`, real `<a>`. Focus-visible on everything
  interactive. Alt text on every image. Contrast ≥4.5:1 measured against the busiest
  frame under the type (scrims are load-bearing).
- Surgical diff: touch only `src/App.tsx` (import + case), the new component file(s), and
  `public/images/movement/`. Match the codebase's existing style.

## Verify (no browser exists in this environment — do what CAN be proven)
1. `npx tsc --noEmit` clean on changed files; `npm run build` (vite) succeeds.
2. Diff every image path referenced in the component against `ls public/images/movement/`
   — zero misses.
3. `npx vite preview` (or serve dist/) and curl: `/movement` 200; every
   `/images/movement/*.jpg` 200 with `content-type: image/jpeg` and content-length
   matching the file on disk.
4. Grep the built bundle for a copy phrase unique to this page ("each other's missing
   link") — present. (Bundle over-reports; this only proves inclusion, say so.)
5. State plainly in your report what is NOT verified: rendered pixels, scroll feel,
   mobile device behaviour. Rob reviews by scrolling the preview himself.
