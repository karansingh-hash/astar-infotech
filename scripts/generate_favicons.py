"""
Generate proper favicons from the existing logo for A-Star Infotech.

The current public/logo.png is actually a JPEG (mislabeled) and is 1254x1238px —
too large and wrong format for browsers to use as a favicon. This script:
1. Loads the logo and converts it to a proper PNG
2. Generates multiple sizes: 16x16, 32x32, 180x180, 192x192, 512x512
3. Generates a multi-resolution favicon.ico (16+32+48)
4. Generates an Apple touch icon (180x180)
5. Generates a web manifest
6. Updates public/logo.png to be a proper PNG (preserves original)
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw

PUBLIC_DIR = Path("/home/z/my-project/public")
SOURCE_LOGO = PUBLIC_DIR / "logo.png"  # actually a JPEG
BACKUP_LOGO = PUBLIC_DIR / "logo.original.png"

# Sizes to generate for PNG favicons
PNG_SIZES = [16, 32, 48, 180, 192, 512]
ICO_SIZES = [16, 32, 48]

def main():
    if not SOURCE_LOGO.exists():
        print(f"ERROR: Source logo not found at {SOURCE_LOGO}")
        sys.exit(1)

    # Open the source logo and force it to RGB (drop alpha if any)
    print(f"Loading source logo: {SOURCE_LOGO}")
    src = Image.open(SOURCE_LOGO)
    print(f"  Source format: {src.format}, mode: {src.mode}, size: {src.size}")

    # Backup the original mislabeled file
    if not BACKUP_LOGO.exists():
        src.save(BACKUP_LOGO, format="PNG")
        print(f"  Backed up original to: {BACKUP_LOGO}")

    # Convert to RGBA for cleanest resizing, then we'll flatten to RGB for output
    if src.mode != "RGBA":
        src = src.convert("RGBA")

    # Crop to square (center crop) — favicons should be square
    w, h = src.size
    if w != h:
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        src = src.crop((left, top, left + side, top + side))
        print(f"  Center-cropped to square: {src.size}")

    # 1. Generate proper logo.png (512x512, true PNG) — overwrites the mislabeled file
    logo_512 = src.resize((512, 512), Image.LANCZOS)
    # Flatten alpha onto white background for the main logo
    bg_white = Image.new("RGB", logo_512.size, (255, 255, 255))
    bg_white.paste(logo_512, mask=logo_512.split()[-1] if logo_512.mode == "RGBA" else None)
    bg_white.save(SOURCE_LOGO, format="PNG", optimize=True)
    print(f"  Saved proper PNG: {SOURCE_LOGO} (512x512)")

    # 2. Generate PNG favicons at each size
    for size in PNG_SIZES:
        out = PUBLIC_DIR / f"favicon-{size}.png"
        img = src.resize((size, size), Image.LANCZOS)
        # For small favicons, flatten to RGB on white for max compatibility
        if size <= 48:
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
            bg.save(out, format="PNG", optimize=True)
        else:
            img.save(out, format="PNG", optimize=True)
        print(f"  Saved: {out.name} ({size}x{size})")

    # 3. Generate apple-touch-icon.png (180x180) — Apple requires this exact name
    apple = src.resize((180, 180), Image.LANCZOS)
    # Apple touch icons should have a solid background (no transparency)
    bg = Image.new("RGB", apple.size, (255, 255, 255))
    bg.paste(apple, mask=apple.split()[-1] if apple.mode == "RGBA" else None)
    bg.save(PUBLIC_DIR / "apple-touch-icon.png", format="PNG", optimize=True)
    print(f"  Saved: apple-touch-icon.png (180x180)")

    # 4. Generate favicon.ico (multi-resolution)
    ico_images = []
    for size in ICO_SIZES:
        img = src.resize((size, size), Image.LANCZOS)
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        ico_images.append(bg)
    # Save as ICO — PIL picks the multi-res format automatically when given a list
    ico_images[0].save(
        PUBLIC_DIR / "favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in ICO_SIZES],
        append_images=ico_images[1:],
    )
    print(f"  Saved: favicon.ico (multi-res: {ICO_SIZES})")

    # 5. Generate site.webmanifest
    manifest = {
        "name": "A-Star Infotech",
        "short_name": "A-Star",
        "description": "Web Development & Digital Solutions Agency in Jaipur",
        "icons": [
            {"src": "/favicon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/favicon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"},
        ],
        "theme_color": "#059669",
        "background_color": "#ffffff",
        "display": "standalone",
        "start_url": "/",
    }
    import json
    manifest_path = PUBLIC_DIR / "site.webmanifest"
    manifest_path.write_text(json.dumps(manifest, indent=2))
    print(f"  Saved: site.webmanifest")

    # 6. Summary
    print("\n=== Generated files ===")
    for f in sorted(PUBLIC_DIR.glob("favicon*")) + sorted(PUBLIC_DIR.glob("apple-touch*")) + sorted(PUBLIC_DIR.glob("site.webmanifest*")) + sorted(PUBLIC_DIR.glob("logo.png")):
        size_kb = f.stat().st_size / 1024
        print(f"  {f.name:30s}  {size_kb:6.1f} KB")

if __name__ == "__main__":
    main()
