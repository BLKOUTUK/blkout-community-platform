"""Write src/data/image-sizes.json: intrinsic [width, height] for images components pick at runtime
(ten-years, apparel, drops), so every <img> can carry width/height and the layout doesn't jump.
Re-run after adding an image to those folders: python3 scripts/image-sizes.py
"""
import glob, json, os
from PIL import Image
ROOT = os.path.join(os.path.dirname(__file__), '..')
sizes = {}
for d in ('ten-years', 'apparel', 'drops'):
    for p in sorted(glob.glob(os.path.join(ROOT, 'public/images', d, '*'))):
        if p.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            sizes['/images/%s/%s' % (d, os.path.basename(p))] = list(Image.open(p).size)
with open(os.path.join(ROOT, 'src/data/image-sizes.json'), 'w') as f:
    json.dump(sizes, f, indent=0, sort_keys=True)
print(len(sizes), 'images')
