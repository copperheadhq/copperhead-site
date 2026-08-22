# copperhead branding

The copperhead mark is a fiducial: the circle and crosshair ticks used on a
PCB as an optical alignment target. It is the same geometry the site ships in
its favicon and navbar, extracted here as standalone masters so it can be used
anywhere without the site's CSS or fonts.

The lockup pairs the fiducial with the wordmark `copperhead`, always
lowercase, set in JetBrains Mono Bold with -0.02em tracking. The text in the
SVG masters is outlined to paths, so the files render identically whether or
not the font is installed.

![copperhead lockup](png/copperhead-lockup-light-h128.png#gh-light-mode-only)
![copperhead lockup](png/copperhead-lockup-h128.png#gh-dark-mode-only)

The words that go next to the mark — tagline, one-liner, bios, hero copy —
live in `COPY.md`.

## Files

| Path | What it is |
| --- | --- |
| `svg/copperhead-mark.svg` | The fiducial alone, copper for dark backgrounds (#D08F39) |
| `svg/copperhead-mark-light.svg` | Copper for light backgrounds (#A75F14) |
| `svg/copperhead-mark-black.svg`, `-white.svg` | Single-color versions for print and one-ink contexts |
| `svg/copperhead-mark-tile.svg` | The mark on a rounded near-black tile, for avatars and app icons |
| `svg/copperhead-lockup.svg` | Mark plus wordmark, for dark backgrounds |
| `svg/copperhead-lockup-light.svg` | Mark plus wordmark, for light backgrounds |
| `svg/copperhead-lockup-black.svg`, `-white.svg` | Single-color lockups |
| `png/` | Raster exports: mark at 64, 256, and 1024 px, tile at 512 px, lockups at 128 and 512 px tall |
| `kicad/copperhead-mark-5mm.kicad_mod` | The mark as a KiCad silkscreen footprint, 5 mm square, for putting on boards the agent helped design |

The SVGs are the masters. If a size or color you need is missing, export it
from the SVG rather than scaling a PNG.

## Colors

The copper flips with the background so it keeps contrast on both:

| Token | On dark | On light |
| --- | --- | --- |
| Copper (the mark) | `#D08F39` | `#A75F14` |
| Text (the wordmark) | `#EDEDEF` | `#0A0A0A` |
| Tile background | `#15181c` | `#15181c` |

These match the `--copper` and `--text` tokens in `src/styles/global.css`.

## Usage

- Prefer the lockup where there is room; use the mark alone at small sizes or
  where the name already appears in text.
- Keep clear space around the mark equal to the length of one crosshair tick
  (about a quarter of the mark's height).
- Minimum sizes: 16 px for the mark, 90 px wide for the lockup. Below that,
  the ring closes up.
- The wordmark is always lowercase. Do not set it in another font, recolor the
  mark outside the palette above, rotate it, or add effects.
- On photographs or busy backgrounds, use the tile or the single-color
  white/black versions.

## On a board

`kicad/copperhead-mark-5mm.kicad_mod` places the mark on the front silkscreen
at 5 mm square. It is a graphic footprint: no pads, excluded from the BOM and
position files. Scale it in KiCad if you need another size, and keep it clear
of real fiducials so it does not confuse a pick-and-place camera.

## Provenance and license

The wordmark is outlined from JetBrains Mono, which is licensed under the
SIL Open Font License 1.1. The rest of the artwork is original to Chouhan
Industries. The files in this folder are for identifying copperhead and
projects built with it; do not use them to imply endorsement or affiliation.
