"""
Generate a proper 1200x630 og-image.png for A-Star Infotech.
This image is used by:
- Google search results (rich results)
- Facebook sharing
- Twitter cards
- LinkedIn sharing
- WhatsApp link previews
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUTPUT = Path("/home/z/my-project/public/og-image.png")
LOGO = Path("/home/z/my-project/public/logo.png")

# 1200x630 is the standard og:image size recommended by Facebook and used by Google
W, H = 1200, 630

# A-Star brand colors
BG_DARK = (6, 6, 15)           # #06060f - dark navy
BG_PANEL = (13, 13, 26)        # #0d0d1a
NEON_GREEN = (6, 214, 160)     # #06d6a0
NEON_CYAN = (6, 182, 212)      # #06b6d4
WHITE = (255, 255, 255)
GRAY = (148, 163, 184)         # slate-400

def main():
    # Create the base image with dark background
    img = Image.new("RGB", (W, H), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Add subtle gradient orbs (mimicking the website's hero design)
    # Top-right green orb
    for r in range(300, 0, -10):
        alpha = max(0, 30 - r // 15)
        color = (NEON_GREEN[0], NEON_GREEN[1], NEON_GREEN[2])
        draw.ellipse([W - 400 + r, -100 + r, W - 100 + r, 200 + r],
                     fill=tuple(int(c * alpha / 255) for c in color))

    # Bottom-left cyan orb
    for r in range(400, 0, -10):
        alpha = max(0, 25 - r // 20)
        color = (NEON_CYAN[0], NEON_CYAN[1], NEON_CYAN[2])
        draw.ellipse([-150 + r, H - 250 + r, 250 + r, H + 50 + r],
                     fill=tuple(int(c * alpha / 255) for c in color))

    # Add grid pattern (subtle)
    grid_color = (NEON_GREEN[0] // 20, NEON_GREEN[1] // 20, NEON_GREEN[2] // 20)
    for x in range(0, W, 60):
        draw.line([(x, 0), (x, H)], fill=grid_color, width=1)
    for y in range(0, H, 60):
        draw.line([(0, y), (W, y)], fill=grid_color, width=1)

    # Try to load fonts
    try:
        font_huge = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        font_mono = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 20)
    except IOError:
        font_huge = font_large = font_medium = font_small = font_mono = ImageFont.load_default()

    # Add the logo (top-left)
    if LOGO.exists():
        logo = Image.open(LOGO).convert("RGBA")
        logo_size = 100
        logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
        # Paste logo with white circle background
        circle_size = 120
        circle_x, circle_y = 80, 80
        # Draw white circle
        draw.ellipse([circle_x, circle_y, circle_x + circle_size, circle_y + circle_size],
                     fill=WHITE)
        # Paste logo centered in circle
        logo_x = circle_x + (circle_size - logo_size) // 2
        logo_y = circle_y + (circle_size - logo_size) // 2
        img.paste(logo, (logo_x, logo_y), logo)

    # Company name next to logo
    draw.text((220, 105), "A-Star Infotech", font=font_large, fill=WHITE)

    # Main headline (center-left)
    draw.text((80, 260), "Transform Your", font=font_huge, fill=WHITE)
    draw.text((80, 350), "Digital Presence", font=font_huge, fill=NEON_GREEN)

    # Subtitle
    draw.text((80, 460), "Web Development & Digital Solutions Agency", font=font_medium, fill=GRAY)

    # Tagline / services
    draw.text((80, 510), "Website Design  •  E-Commerce  •  SEO  •  Maintenance", font=font_small, fill=NEON_CYAN)

    # Location badge (bottom-right)
    badge_text = "Jaipur, India"
    bbox = draw.textbbox((0, 0), badge_text, font=font_mono)
    badge_w = bbox[2] - bbox[0] + 40
    badge_h = bbox[3] - bbox[1] + 24
    badge_x = W - badge_w - 80
    badge_y = H - badge_h - 80
    # Draw badge background
    draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
                           radius=badge_h // 2, fill=BG_PANEL, outline=NEON_GREEN, width=2)
    draw.text((badge_x + 20, badge_y + 12), badge_text, font=font_mono, fill=NEON_GREEN)

    # Website URL (bottom-left)
    draw.text((80, H - 50), "www.astarinfotech.in", font=font_mono, fill=GRAY)

    # Save
    img.save(OUTPUT, format="PNG", optimize=True)
    print(f"Generated: {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size / 1024:.1f} KB ({W}x{H})")

if __name__ == "__main__":
    main()
