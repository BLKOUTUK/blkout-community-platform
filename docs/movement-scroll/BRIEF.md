# BRIEF — blkoutuk.com/movement scroll redesign

`Self-authored, not interviewed` — assembled from Rob's dispatch (26 Aug 2026: "dynamic,
engaging and persuasive... tone arc should hold interest, demonstrate welcome and joy, and
encourage conversions to CTA... vibrant landing page with a compelling story... existing
assets and commission up to three new ones") and from the existing Theory of Change page,
whose five-act copy is Rob's own manifesto text. Method: scrollcraft (nateherkai/scroll-craft,
reference copy at ~/tools/scrollcraft-ref/), implemented natively in the community-platform
React app.

## The eight answers

1. **Vibe:** vibrant, welcoming, joyful, unapologetic, persuasive. References: BLKOUT
   gold-on-black identity; the warmth of the gathering photography already in
   /images/theory-of-change; the wit of the existing manifesto copy.
2. **Journey (Rob's existing arc, tightened):** Recognition (alone in the crowd) → the
   question (how many could you call?) → the problem (proximity isn't community) → the turn
   (we are each other's missing link) → the evidence (what we're building is real) → the
   invitation (there's a room, and a seat in it).
3. **Energy curve:** quiet, intimate open → tension building as the wrong side wins → the
   turn snaps back → confident, warm evidence → a held breath → joyful flood → warm, direct,
   held close.
4. **Feeling curve** (one line per act, emotion then cause):
   - 1 Recognition — both truths on screen at once, split 50/50, both headlines readable
   - 2 Implication — the page asks THEM a question, and answers back
   - 3 Ache — the ALONE side physically takes over the frame while the copy names why
   - 4 Hope — the seam swings back through centre; the together side lights gold
   - 5 Confidence — real things with real links, plainly labelled
   - 6 Anticipation — authored silence: near-dark, just the gold seam (THIS SILENCE IS
     DELIBERATE, verification pass please note)
   - 7 Joy (THE PEAK) — the divider releases and the gathering floods the whole frame
   - 8 Welcome/resolve — the page hands back their own answer and holds on one action
5. **One thing no site does (signature move seed):** the page asks how many Black queer men
   you could call on in a crisis, and at the end it hands your answer back to you as the
   room fills around you.
6. **Aesthetic range:** maximalist-warm within the gold-on-black identity. NOT
   premium-minimal, NOT sanitised. The wit stays in the copy.
7. **One world or scenes?** Distinct scenes under one persistent structure: the split.
   Not a worldflight.
8. **Assets owned:** ~36 story images in /images/theory-of-change (AI-generated world,
   4:5 portrait, disclosed on-page), 8 videos, logo set. Up to 3 new assets commissioned.

## The peak

Act 7, the collapse. The sentence a visitor would say to a friend:

> "the page is split in two the whole way down, alone versus together, and near the end
> the wall between them gives way and the whole screen becomes the party"

## The tell-someone sentence

It's the site where you admit how few brothers you could call at 3am, and by the end the
page hands your answer back as the room fills around you.

## Authored silence

Act 6 (THE BREATH): one ground-only beat, ~0.6vh, near-black with only the gold seam lit.
It is intentional anticipation before the collapse, not dead scroll.

## Grammar: split stage — and why the other seven lost

Two columns held in tension for the whole page, resolved by scroll; the close is the
collapse of the divider and the CTA lives in the winning column.

- Filmic one-shot: the template default; flattens a two-sided argument into sequence.
- Chaptered editorial: right for reading a manifesto, wrong for "vibrant, dynamic"; its
  restraint fights the joy brief.
- Live surface: nothing to demo; forbids the warmth this page runs on.
- Continuous world: no geography here; most fragile build; bans the devices we need.
- Typographic poster: wastes the photography, and the photography IS the welcome.
- Gallery/catalog: options-shaped; this page is belief-shaped (the one belief: without
  community there is no love and no liberation).
- Rhythmic cutlist: has the pulse but bans holds, and welcome needs a held gaze.
- Split stage wins because the thesis is literally a split: "The damage is structural.
  The repair is relational." Alone vs Together. The page's mechanism enacts its argument,
  and the collapse hands the CTA the most satisfying moment on the page.

## Signature move

**The answer that returns.** An in-page poll in act 2 ("How many Black queer men could you
call on in a crisis?"); the choice is held in page state (nothing stored, nothing sent) and
the close addresses the visitor with their own answer before the CTA. Bespoke code, not a
kit device. One embodiment moment; no others (no magnet, no spotlight — banned by grammar
anyway).

## Fingerprint gate

Workspace registry is empty (first scrollcraft build on this machine): nothing to clear.
Row appended to FINGERPRINTS.md in this directory for the next build to differ from.

## The one action

**Join BLKOUT** → https://crm.blkoutuk.cloud/join — same label everywhere it appears.
Honest fulfilment copy (the newsletter is monthly; no promised cadence beyond that).
Secondary, quieter: BLKOUTHUB for those already in community; stories and events as
evidence links, not competing CTAs.
