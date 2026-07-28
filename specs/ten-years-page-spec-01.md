# Ten Years Spec 01 — a page that looks back over BLKOUT's incarnations

**Status:** DRAFT for Rob's approval. Nothing is built until this spec is approved.
**Mandate:** Rob, 28 July 2026: *"create a BLKOUT legacy page that looks back over earlier incarnations of the organisation — use images from the archive and we can use the page as a way of reflecting back over the 10 years"*, then: *"it should be a page that we add to the website proper — so create a spec for it and consider where it would fit in the site architecture."*
**Source of truth for the history:** memory `blkout-origin-and-founding.md` and `~/blkout/projects/seen/funding/blkout-track-record-funder-summary.md`. Where this spec and those disagree, they win.

---

## 1. The naming problem, first

Rob asked for a "legacy page". **The word should not appear on the page.** Legacy reads as an ending, and BLKOUT's ten years end in a beginning — a member-owned society with an asset lock. The BLKOUT framing rule (memory `feedback_blkout_antideficit_framing`) is creation, not loss; the default drift in generated text is elegiac and must be actively corrected.

**Proposed title: "Ten Years."** Standfirst: *"Four shapes, one commitment. How we got from a table in 2016 to a society our members own."*

Route `/ten-years`. Nav label **Ten Years**.

*(Alternatives if Rob prefers: "How We Got Here" · "The Long Way Round" · "Still Here". Decision needed — §9.)*

---

## 2. Where it fits — and the architectural argument for it

**The site:** `blkoutuk.com` apex = `apps/community-platform` (React + Vite, served by Express — memory `reference_community_platform_runtime`). Repo `BLKOUTUK/blkout-community-platform`.

**How routing actually works** (verified in `src/App.tsx`, 28 Jul 2026 — this is *not* react-router):
- `type NavigationTab` union, line 58
- `getInitialTabFromURL()` reads `window.location.pathname.slice(1)` against a `validTabs` array, line 151
- `changeActiveTab()` does `window.history.pushState({}, '', '/' + tab)`, line 205
- `renderContent()` is a `switch (activeTab)` returning the page component, line 296

**Adding a route therefore means four edits plus one new file.** No router config, no lazy-loading pattern to match.

### The argument: this page adopts an orphan

`StoryArchive.tsx` already exists at `/stories`, backed by the Supabase `legacy_articles` table — **~296 migrated articles** spanning the whole history, deep-linkable at `/stories/<slug>`. It is a corpus with no frame: a reader arriving there gets a list and no reason to care.

**Ten Years is the narrative spine; the Story Archive is the evidence.** Each era section ends with a link into `/stories` filtered or anchored to that period. The page therefore adds no new data store, duplicates nothing, and makes an existing asset legible. That is the whole case for putting it on the site proper rather than leaving it as a standalone artefact.

**Relationship to `AboutUs.tsx`:** About says who we are now. Ten Years says how we got here. About gains one link to it; nothing moves out of About.

**Site map after:**
```
/                 liberation (home)
/about            who we are now  ──┐
/ten-years        NEW — how we got here ──┐
/stories          the 296-article archive ←┘  (Ten Years is its front door)
/stories/<slug>   individual article
```

---

## 3. Content structure — four movements

Each movement: a year range, a one-line name, 120–180 words, one or two archive images, and a link into the Story Archive.

### I. 2016–2019 · The table
Founded **2016**; first public event **7 February 2016** — so the tenth anniversary fell on **7 February 2026**. Rob Berkeley with **Marc Thompson** and **Antoine Rogers**, on "a shared commitment to revolutionary love for Black queer men."

Began as a **literary and cultural hub**, in the lineage of Barbara Smith's *Kitchen Table: Women of Color Press* and Joseph Beam. Incubated by **Evidence To Exist**. The community-led research project **In The Picture** surfaced the scale of need and turned a literary hub into a community organisation.

⚠ **Never write "since 2014."** It is 2016. The 2014 error recurs in funding drafts.

### II. 2020–2024 · The company
Constituted independently in **2020** as a not-for-profit company limited by guarantee (board included Romeo Effs as treasurer, Nalla, Francis). The delivery years — and the page should say what was actually delivered, by funder and year, **without amounts** (only ViiV £8,500 and Compass £2,500 are confirmed from agreements):

Diasporan Dialogues on Black gay men's health (ViiV Healthcare, 2018–19) · citizen-led participatory research (GLA / City Hall, 2019–20) · Social Movement for Health (2019) · City for LGBT+ (The Funding Network, 2020) · We_ARE_BLKOUT (giffgaff via Neighbourly, 2020) · COVID-19 community response (London Community Response Fund, 2020) · Local Connections (TNL Community Fund, 2021) · **A Place For Us** — LGBT History Month at **Queer Britain, 31 January 2023**, four short films and a panel chaired by Deputy Mayor Debbie Weekes-Bernard.

**July 2024: the company was wound up.**

### III. July 2024 – November 2025 · The pause
**This section carries the most editorial risk on the page and must be written last, and carefully.**

For sixteen months **no organisation existed**. That was a decision, not a decline: a lack of resources meant the organisational review and delivery could not be funded at the same time, so delivery stopped by choice while the infrastructure to hold members properly was built.

⚠ **Guardrail.** Any reader — or any funder — who reads this as failure, drift or neglect has been failed by our writing. The gap is also why membership numbers spanning 2024–25 must never be read as decline: there was nothing to join. Say the quiet part out loud: *we stopped rather than limp.* (Memory `blkout-origin-and-founding`, `reference_hub_demographics`.)

### IV. November 2025 – now · The society
**24 November 2025:** registered as **BLKOUT Creative Ltd**, a Community Benefit Society, FCA registered society **no. 9639 (RS009639)**, asset-locked, registered office 2 Grange Park Road, Thornton Heath CR7 8QA.

Members, not shareholders. What we build is held for the community and cannot be sold out from under it. Close on the present: BLKOUTHUB six years running, the calendar, Ivor's Compass delivered and evaluated in 2026, Seen ahead.

⚠ **Use RS009639.** RS008088 is wrong and was purged from eight files on 28 Jul 2026.

---

## 4. Images — real candidates, verified on disk 28 July 2026

Found via `findimg.py` over the 68,947-image tagged archive. **The archive drive is currently mounted as `/mnt/e`, not `/mnt/d`** (documented drift).

| Era | Path | Size | Why |
|---|---|---|---|
| I | `/mnt/e/2023/2023_IMAGES/JUN_20171018_191941-e1518613410361.jpg` | 2.3M | 28 faces, a full room — dated 18 Oct 2017 by filename. The early-era crowd shot. |
| I | `/mnt/e/2023/2023_IMAGES/JUN_Joseph-Beam-black-out-4.jpg` | 84K | Joseph Beam — the literary lineage made visible. |
| I | `/mnt/e/2018/2018_IMAGES/JUL_36450368_10156922429024305_4387573512525578240_n.jpg` | 64K | 2018 publication/zine era. |
| II | `/mnt/e/2019/DEC_2019/WhatsApp Image 2019-12-30 at 01.02.43 (1).jpeg` | 476K | **40 faces.** The single strongest "we were many" image in the archive. |
| II | `/mnt/e/2023/2023_IMAGES/JUN_Screen-Shot-2018-07-06-at-11.55.45-795x520.png` | 820K | 20 faces, Pride, July 2018. |
| II | `/mnt/e/2023/FEB_2023/Placeforus panel.mp4` | 57M | A Place For Us panel — **video, not for embed.** Pull a still frame with ffmpeg. |

**Still to source (§9):** a founders image (Rob / Marc Thompson / Antoine Rogers together), an *In The Picture* artefact, and something for movement IV. `findimg.py --who` face-clustering is Phase 2 and may not be built — check before assuming.

**Processing rules** (CLAUDE.md, non-negotiable):
- Never commit raw multi-MB originals. Downsample to max edge 1200–1800px, JPEG q86–90, progressive, `optimize=True`. Typical win 6.7MB → 209KB.
- Rename to `public/images/kebab-case.jpg` — no spaces, no capitals. `WhatsApp Image 2019-12-30 at 01.02.43 (1).jpeg` → `2019-gathering-forty.jpg`.
- `/mnt/e` paths may need PowerShell hydration before they open.

⚠ **Rights and consent.** These are photographs of identifiable community members, many from a decade ago, taken before any current consent process. **Do not publish a face on the public site without a consent decision from Rob.** This is a gate, not a footnote — see §9.

---

## 5. Design

Per `blkout-brand` (ratified 22 Jul 2026): black ground, sovereignty gold (`#FFD700` / `#D4AF37`), white text, **Work Sans** with **Fraunces italic** accents. Matches blkoutuk.com.

- Vertical scroll, four movements, each a full-bleed image with the text over a gradient scrim.
- A thin gold rule as a continuous timeline down the left, with year markers — the visual argument that the pause is *part of* the line, not a break in it.
- Movement III deliberately quieter: more space, fewer images, no crowd. Restraint carries it better than explanation.
- Tailwind tokens: **verify every token against `tailwind.preset.js` before use.** Known-broken: `sovereignty-divine`, `sovereignty-rich`, `pride-purple`, `community-*`, `liberation-silver`. Known-good: `liberation-gold-divine`, `liberation-sovereignty-gold`, `liberation-black-power`, `blkout-600`. Undefined tokens emit no CSS and fail silently.
- Responsive; images `max-width:100%`; respect `prefers-reduced-motion` on any scroll animation.

---

## 6. Build steps

1. `src/components/pages/TenYears.tsx` — new component, content hard-coded (four movements is not a CMS problem).
2. `src/App.tsx:58` — add `'ten-years'` to the `NavigationTab` union.
3. `src/App.tsx:151` — add `'ten-years'` to `validTabs`.
4. `src/App.tsx:296` — add `case 'ten-years': return <TenYears onNavigate={...} />;`
5. Nav entry + `SECTION_ACCENT['ten-years']`.
6. One link from `AboutUs.tsx`.
7. Images processed into `public/images/`.
8. Each movement links to `/stories`.

**Scope discipline:** this touches `App.tsx`, one new component, `AboutUs.tsx`, and `public/images/`. Nothing else. No refactor of the routing model while we're in there.

---

## 7. Acceptance criteria

- [ ] `blkoutuk.com/ten-years` loads directly (not only via nav) — the pathname route works on a cold load.
- [ ] Deep link survives refresh and back-button.
- [ ] All four movements render with images; no broken image requests in the console.
- [ ] Every Tailwind token used appears in `tailwind.preset.js` — verified by building and diffing emitted CSS, not by reading.
- [ ] Every image in `public/images/` is under ~400KB.
- [ ] `curl -sI` the deployed route returns 200 **and** `content-length` matches the real page, not the SPA shell.
- [ ] Rob has read movement III and confirmed it does not read as failure.
- [ ] Consent decision recorded for every identifiable face published.

---

## 8. What this spec deliberately is not

Not a redesign of `/stories`. Not a CMS. Not an interactive timeline. Not a fundraising page — though it will be useful to funders asking "have they done this before", which is exactly the question Hugo Burge and City Bridge are asking this fortnight.

---

## 9. Open — Rob's decisions

1. **Title and route.** "Ten Years" at `/ten-years`, or one of the alternatives in §1?
2. **Consent for archive faces.** The blocking one. Publish identifiable faces from 2017–2023 on the public site — yes, no, or only where we can trace the person? A workable middle: use wide room shots where individuals are not the subject, and no close portraits without a named yes.
3. **Naming the founders.** Marc Thompson and Antoine Rogers are named in memory as co-founders. Naming them publicly is a courtesy call — tell them first, or is the record already public?
4. **Evidence To Exist.** The track-record doc already flags this: citing Antoine Rogers' CIC as incubator is accurate and helpful, but it names his organisation. Cleared for public use?
5. **Movement III wording.** Do you want to write the pause yourself? It is the paragraph that most needs your voice.
6. **The 2023 A Place For Us video** — pull a still, or leave that era to photographs?
