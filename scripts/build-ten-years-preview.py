#!/usr/bin/env python3
"""Regenerate TEN-YEARS-PREVIEW.html from TenYears.tsx.

A standalone, no-JS, no-server copy of the Ten Years page so Rob can open it
straight from Explorer. It parses the component's own MOVEMENTS array rather
than duplicating the copy, so the preview cannot drift from what ships.

    python3 scripts/build-ten-years-preview.py
"""
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPONENT = os.path.join(ROOT, 'src/components/pages/TenYears.tsx')
OUT = os.path.join(ROOT, 'TEN-YEARS-PREVIEW.html')

GOLD, GOLD_DEEP = '#FFD700', '#D4AF37'
TILTS = [-2.5, 2.2, -3.4, 1.8, -1.6, 3.1, -2.8, 2.6]
e = html.escape


def parse_movements(src):
    block = src[src.index('const MOVEMENTS'):src.index('/** Photographs as physical prints')]
    out = []
    for chunk in block.split("    id: '")[1:]:
        chunk = "    id: '" + chunk

        def field(name):
            m = re.search(rf"^    {name}: '((?:[^'\\]|\\.)*)'", chunk, re.M)
            return m.group(1).replace("\\'", "'") if m else ''

        # artefacts sit in their own block; keep them out of the top-level fields
        arts = []
        if 'artefacts: [' in chunk:
            seg = chunk[chunk.index('artefacts: ['):]
            depth, end = 0, 0
            for i, ch in enumerate(seg):
                if ch == '[':
                    depth += 1
                elif ch == ']':
                    depth -= 1
                    if depth == 0:
                        end = i
                        break
            for a in seg[:end].split('{')[1:]:
                s_ = re.search(r"src: '([^']*)'", a)
                al = re.search(r"alt: '((?:[^'\\]|\\.)*)'", a)
                c_ = re.search(r"caption: '((?:[^'\\]|\\.)*)'", a)
                if s_ and c_:
                    arts.append((s_.group(1),
                                 (al.group(1) if al else '').replace("\\'", "'"),
                                 c_.group(1).replace("\\'", "'")))

        body = [b.replace("\\'", "'")
                for b in re.findall(r"^      '((?:[^'\\]|\\.)*)',$", chunk, re.M)]

        out.append({
            'id': field('id'), 'years': field('years'), 'name': field('name'),
            'image': field('image'), 'alt': field('alt'), 'pull': field('pull'),
            'quiet': 'quiet: true' in chunk, 'body': body, 'artefacts': arts,
        })
    return out


def print_fig(src, alt, caption, tilt, cls, margin_left=None, z=None):
    style = f'transform:rotate({tilt}deg)'
    if margin_left is not None:
        style += f';margin-left:{margin_left}'
    if z is not None:
        style += f';z-index:{z}'
    cap = f'<figcaption>{e(caption)}</figcaption>' if caption else ''
    web = src if src.startswith('/images') else src
    return (f'<figure class="print {cls}" style="{style}">'
            f'<img src=".{web.replace("/images/", "/public/images/")}" alt="{e(alt)}">{cap}</figure>')


def build():
    src = open(COMPONENT).read()
    movements = parse_movements(src)
    secs = []
    for m in movements:
        main = print_fig(m['image'], m['alt'], None, TILTS[0], 'main') if m['image'] else ''
        cards = ''.join(
            print_fig(s_, a_, c_, TILTS[(i + 1) % len(TILTS)], 'small',
                      '0' if i == 0 else '-1.25rem', 20 + i)
            for i, (s_, a_, c_) in enumerate(m['artefacts']))
        row = f"<div class='row'>{cards}</div>" if cards else ''
        coll = f'<div class="collage">{main}{row}</div>' if (main or cards) else ''
        body = ''.join(f'<p>{e(p)}</p>' for p in m['body'])
        pull = f'<blockquote>{e(m["pull"])}</blockquote>' if m['pull'] else ''
        secs.append(
            f'<section class="{"quiet" if m["quiet"] else ""}">'
            f'<p class="kick">{e(m["years"])}</p><h2>{e(m["name"])}</h2>{coll}'
            f'<div class="body {"narrow" if m["quiet"] else ""}">{body}</div>{pull}'
            f'<a class="btn" href="#">Read from this period &rarr;</a></section>')

    css = f'''*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#000;color:#fff;font-family:'Work Sans',system-ui,sans-serif;line-height:1.6}}
.page{{position:relative;max-width:1024px;margin:0 auto}}
.rail{{position:absolute;left:1.75rem;top:0;bottom:0;width:2px;background:{GOLD};z-index:20}}
@media(min-width:640px){{.rail{{left:3.5rem}}}}
header{{position:relative}}
.mast{{display:grid;grid-template-columns:1fr;align-items:center;gap:2.5rem;padding:5rem 1.5rem 4rem 4rem;max-width:64rem;margin:0 auto}}
@media(min-width:640px){{.mast{{padding-left:7rem;padding-top:7rem}}}}
@media(min-width:1024px){{.mast{{grid-template-columns:1fr 22rem;gap:3.5rem}}}}
.print.mast-print{{width:100%;max-width:24rem;justify-self:center}}
@media(min-width:1024px){{.print.mast-print{{justify-self:end}}}}
.kick{{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:{GOLD}}}
h1{{font-size:clamp(48px,7vw,60px);font-weight:900;text-transform:uppercase;line-height:.95;margin-top:1.25rem}}
.sub{{font-family:Fraunces,Georgia,serif;font-style:italic;font-size:clamp(20px,2.6vw,26px);color:rgba(255,255,255,.9);max-width:36ch;margin-top:1.5rem}}
.lede{{color:rgba(255,255,255,.7);max-width:62ch;margin-top:2rem}}
section{{position:relative;padding:5rem 1.5rem 5rem 4rem}}
@media(min-width:640px){{section{{padding:7rem 1.5rem 7rem 7rem}}}}
section.quiet{{padding-top:9rem;padding-bottom:9rem}}
h2{{font-size:clamp(30px,4.6vw,48px);font-weight:900;text-transform:uppercase;margin-top:.75rem;line-height:1}}
.collage{{position:relative;margin:3rem 0 1rem}}
.print{{background:#f4efe4;padding:10px 10px 34px;box-shadow:0 18px 40px rgba(0,0,0,.65),0 2px 6px rgba(0,0,0,.5);transition:transform .3s}}
.print:hover{{transform:rotate(0deg) !important;z-index:40;position:relative}}
.print img{{display:block;width:100%;object-fit:cover}}
.print figcaption{{font-family:'IBM Plex Mono',monospace;font-size:10.5px;line-height:1.45;color:#3a352c;margin-top:.5rem}}
.print.main{{position:relative;z-index:10;width:100%;max-width:32rem}}
.collage .row{{position:relative;z-index:20;display:flex;flex-wrap:wrap;justify-content:flex-end;align-items:flex-start;gap:1.5rem 0;margin-top:-2.5rem;margin-left:auto;max-width:48rem;padding-left:2rem}}
.print.small{{width:10rem}}
@media(min-width:640px){{.print.small{{width:13rem}}}}
.body{{margin-top:2.5rem;max-width:65ch}} .body.narrow{{max-width:54ch}}
.body p{{color:rgba(255,255,255,.78);margin-bottom:1.25rem}}
.quiet .body p{{color:rgba(255,255,255,.88);font-size:1.125rem}}
blockquote{{font-family:Fraunces,Georgia,serif;font-style:italic;font-size:clamp(20px,2.4vw,26px);border-left:1px solid {GOLD_DEEP}66;padding-left:1.25rem;margin-top:2.5rem;max-width:38ch}}
.btn{{display:inline-block;margin-top:2.5rem;padding:.75rem 1.25rem;border:1px solid {GOLD_DEEP}66;color:{GOLD};font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;text-decoration:none}}
.attrib{{color:rgba(255,255,255,.6);font-size:14px;margin-top:1.5rem}}
.cta{{display:inline-block;margin-top:2.25rem;margin-right:1rem;padding:.85rem 1.5rem;background:{GOLD};color:#000;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;text-decoration:none}}
.fine{{margin-top:3.5rem;font-size:12px;color:rgba(255,255,255,.6);max-width:60ch}}'''

    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Ten Years — preview</title>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;900&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{css}</style></head><body><div class="page"><div class="rail"></div>
<header><div class="mast">
<div class="mast-text"><p class="kick">2016 &mdash; 2026</p><h1>Ten Years</h1>
<p class="sub">Ten years of revolutionary love for Black queer men. Four shapes, one commitment, and a great deal of joy taken seriously.</p>
<p class="lede">Brunches, dancefloors, a prize named for Berto Pasuka, a flag at Croydon Pride. Research, reports and a co-op too. This is the whole of it &mdash; including the year and a half when there was no organisation, only a conversation.</p></div>
<figure class="print mast-print" style="transform:rotate(2.4deg)"><img src="./public/images/ten-years/2019-revolutionary-love.jpg" alt="A Black man holding a Progress Pride flag aloft against a blue sky at Croydon Pride, 2019, captioned revolutionary love"><figcaption>Croydon Pride, 2019.</figcaption></figure>
</div></header>
{''.join(secs)}
<section class="voice"><p class="kick">In his own words &middot; 31 December 2021</p>
<blockquote style="border:0;padding:0;max-width:58ch">&ldquo;The best laid plans were scuppered by our existential need to survive the COVID-19 pandemic&hellip; it felt like the only justifiable decision. Foolhardy? Perhaps.&rdquo;</blockquote>
<p class="attrib">Rob Berkeley, <em>A Dream No Longer On Mute</em>, 31 December 2021</p></section>
<footer><section><p class="kick">The archive</p><h2>Nearly three hundred pieces, written as it happened</h2>
<div class="body"><p>Everything above was documented at the time. It is all still here, and it is all still free to read.</p></div>
<a class="cta" href="#">Open the story archive</a><a class="btn" href="#">Who we are now</a>
<p class="fine">BLKOUT UK is the trading name of BLKOUT Creative Ltd, a Community Benefit Society registered with the FCA, no. 9639.</p></section></footer>
</div></body></html>'''

    open(OUT, 'w').write(doc)

    refs = re.findall(r'src="(\./[^"]+)"', doc)
    missing = [r for r in refs if not os.path.exists(os.path.join(ROOT, r[2:]))]
    banned = [w for w in ['whites'] if w in doc.lower()]
    print(f'movements: {len(movements)}  images: {len(refs)}  missing: {missing or "none"}')
    if banned:
        print(f'!! banned word present: {banned}', file=sys.stderr)
        return 1
    if missing:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(build())
