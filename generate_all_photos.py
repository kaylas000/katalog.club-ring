"""Generate placeholder club photos for ALL clubs missing them."""
from PIL import Image, ImageDraw, ImageFont
import os

base = os.path.join(os.path.dirname(__file__), 'public', 'images', 'clubs')

clubs_config = {
    'atlant': {'color': (50, 50, 120), 'text': 'Атлант'},
    'vostok': {'color': (120, 50, 30), 'text': 'Восток'},
    'sibir': {'color': (30, 90, 100), 'text': 'Сибирь'},
    'kuban': {'color': (100, 80, 20), 'text': 'Кубань'},
    'volga': {'color': (60, 80, 120), 'text': 'Волга'},
    'neva': {'color': (40, 60, 100), 'text': 'Нева'},
    'ural': {'color': (80, 60, 40), 'text': 'Урал'},
    'kazan': {'color': (100, 30, 60), 'text': 'Казань'},
}

try:
    font_large = ImageFont.truetype('arial.ttf', 48)
    font_small = ImageFont.truetype('arial.ttf', 24)
    font_cover = ImageFont.truetype('arial.ttf', 56)
except Exception:
    font_large = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_cover = ImageFont.load_default()

for prefix, info in clubs_config.items():
    # 6 photos per club
    for num in range(1, 7):
        fname = os.path.join(base, f'{prefix}-{num}.jpg')
        if os.path.exists(fname) and os.path.getsize(fname) > 20000:
            continue  # skip real photos
        img = Image.new('RGB', (800, 600), info['color'])
        draw = ImageDraw.Draw(img)
        for y in range(600):
            v = int(60 * (y / 600))
            c = tuple(max(0, x - v) for x in info['color'])
            draw.line([(0, y), (800, y)], fill=c)
        bbox = draw.textbbox((0, 0), info['text'], font=font_large)
        tw = bbox[2] - bbox[0]
        draw.text(((800 - tw) // 2, 250), info['text'], fill=(255, 255, 255), font=font_large)
        sb = draw.textbbox((0, 0), f'Photo {num}', font=font_small)
        sw = sb[2] - sb[0]
        draw.text(((800 - sw) // 2, 320), f'Photo {num}', fill=(200, 200, 200), font=font_small)
        img.save(fname, 'JPEG', quality=85)
        print(f'{prefix}-{num}.jpg ({os.path.getsize(fname) // 1024}KB)')

    # Cover
    cover = os.path.join(base, f'{prefix}-cover.jpg')
    if not os.path.exists(cover) or os.path.getsize(cover) < 20000:
        img = Image.new('RGB', (1200, 400), info['color'])
        draw = ImageDraw.Draw(img)
        for y in range(400):
            v = int(50 * (y / 400))
            c = tuple(max(0, x - v) for x in info['color'])
            draw.line([(0, y), (1200, y)], fill=c)
        bbox = draw.textbbox((0, 0), info['text'], font=font_cover)
        tw = bbox[2] - bbox[0]
        draw.text(((1200 - tw) // 2, 170), info['text'], fill=(255, 255, 255), font=font_cover)
        img.save(cover, 'JPEG', quality=85)
        print(f'{prefix}-cover.jpg ({os.path.getsize(cover) // 1024}KB)')

print('Done.')
