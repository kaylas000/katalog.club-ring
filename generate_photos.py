"""Generate placeholder club photos with proper branding."""
from PIL import Image, ImageDraw, ImageFont
import os

base = os.path.join(os.path.dirname(__file__), 'public', 'images', 'clubs')

clubs = {
    'thaifight': {'color': (140, 30, 30), 'text': 'ThaiFight', 'need': ['4', '5', '6']},
    'aviator': {'color': (25, 70, 130), 'text': 'Aviator BC', 'need': ['1', '2', '3', '4', '5', '6']},
}

for club, info in clubs.items():
    for num in info['need']:
        fname = os.path.join(base, f'{club}-{num}.jpg')
        img = Image.new('RGB', (800, 600), info['color'])
        draw = ImageDraw.Draw(img)
        for y in range(600):
            v = int(60 * (y / 600))
            c = tuple(max(0, x - v) for x in info['color'])
            draw.line([(0, y), (800, y)], fill=c)
        try:
            font = ImageFont.truetype('arial.ttf', 48)
        except Exception:
            font = ImageFont.load_default()
        bbox = draw.textbbox((0, 0), info['text'], font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((800 - tw) // 2, 250), info['text'], fill=(255, 255, 255), font=font)
        try:
            sfont = ImageFont.truetype('arial.ttf', 24)
        except Exception:
            sfont = ImageFont.load_default()
        sub = f'Photo {num}'
        sb = draw.textbbox((0, 0), sub, font=sfont)
        sw = sb[2] - sb[0]
        draw.text(((800 - sw) // 2, 320), sub, fill=(200, 200, 200), font=sfont)
        img.save(fname, 'JPEG', quality=85)
        print(f'Created: {club}-{num}.jpg ({os.path.getsize(fname) // 1024}KB)')

# Fix covers
covers = {
    'thaifight-cover': {'color': (140, 30, 30), 'text': 'ThaiFight'},
    'aviator-cover': {'color': (25, 70, 130), 'text': 'Aviator Boxing Club'},
}
for name, info in covers.items():
    fname = os.path.join(base, f'{name}.jpg')
    img = Image.new('RGB', (1200, 400), info['color'])
    draw = ImageDraw.Draw(img)
    for y in range(400):
        v = int(50 * (y / 400))
        c = tuple(max(0, x - v) for x in info['color'])
        draw.line([(0, y), (1200, y)], fill=c)
    try:
        font = ImageFont.truetype('arial.ttf', 56)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), info['text'], font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((1200 - tw) // 2, 170), info['text'], fill=(255, 255, 255), font=font)
    img.save(fname, 'JPEG', quality=85)
    print(f'Created cover: {name}.jpg ({os.path.getsize(fname) // 1024}KB)')

print('Done.')
