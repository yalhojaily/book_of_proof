#!/usr/bin/env python3
"""
Cut the pages of "Book of Proof" into per-section image strips for the companion site.

For one chapter it produces, for every section:
  * reading    – the section text, from its heading up to "Exercises for Section x.y"
  * exercises  – the book's exercises for that section
  * solutions  – the book's solutions to the odd-numbered exercises (back of the book)

Running heads and page footers are cropped away so the strips read continuously.
Outputs:
  public/book/chNN/<section>-<kind>-<i>.webp
  src/data/pages/chNN.json

Requires poppler (pdftoppm, pdftotext) and Pillow.
Usage:  python3 tools/extract_chapter.py 1
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "public" / "book" / "book-of-proof.pdf"
OFFSET = 12  # pdf page = book page + OFFSET
SCALE = 2.6  # px per pt
BODY_TOP, BODY_BOTTOM = 76, 674  # pt; outside = running head / footer
CROP_W = 392  # pt
X_ODD, X_EVEN = 68, 43  # left edge of the crop on odd / even book pages
GAP = 10  # pt above a heading where a cut is made

# chapter -> (first pdf page of chapter, last pdf page of chapter, first & last pdf page of its solutions)
CHAPTERS = {
    1: dict(body=(15, 45), solutions=(304, 309)),
    2: dict(body=(46, 76), solutions=(309, 316)),
}


def lines_on_page(pdf_page: int):
    out = subprocess.run(
        ["pdftotext", "-f", str(pdf_page), "-l", str(pdf_page), "-bbox-layout", str(PDF), "-"],
        capture_output=True, text=True, check=True,
    ).stdout
    res = []
    for m in re.finditer(
        r'<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</line>', out, re.S
    ):
        words = re.findall(r">([^<]*)</word>", m.group(5))
        res.append((float(m.group(2)), float(m.group(4)), " ".join(words)))
    return sorted(res)


def render(pdf_page: int, tmp: Path) -> Image.Image:
    stem = tmp / f"p{pdf_page}"
    subprocess.run(
        ["pdftoppm", "-f", str(pdf_page), "-l", str(pdf_page), "-r", str(int(72 * SCALE)), "-gray", "-png",
         "-singlefile", str(PDF), str(stem)],
        check=True,
    )
    return Image.open(f"{stem}.png").convert("L")


def cut(markers, last_page, tmp, outdir, chap, store):
    """markers: ordered [(label, page, y)]. Each segment runs from one marker to the next."""
    cache = {}

    def page_img(pg):
        if pg not in cache:
            cache[pg] = render(pg, tmp)
        return cache[pg]

    def body_bottom(pg):
        ys = [y1 for y0, y1, t in lines_on_page(pg) if BODY_TOP <= y0 <= BODY_BOTTOM]
        return min(BODY_BOTTOM, (max(ys) + 6) if ys else BODY_BOTTOM)

    for i, (label, pg, y) in enumerate(markers):
        if label is None:
            continue
        end_pg, end_y = (markers[i + 1][1], markers[i + 1][2] - GAP) if i + 1 < len(markers) else (last_page, None)
        sec, kind = label
        parts = []
        p = pg
        while p <= end_pg:
            top = (y - GAP) if p == pg else BODY_TOP
            bottom = end_y if (p == end_pg and end_y is not None) else body_bottom(p)
            if bottom - top > 14:
                parts.append((p, top, bottom))
            p += 1
        for j, (p, top, bottom) in enumerate(parts):
            img = page_img(p)
            book_page = p - OFFSET
            x0 = X_ODD if book_page % 2 else X_EVEN
            box = tuple(int(v * SCALE) for v in (x0, top, x0 + CROP_W, bottom))
            strip = img.crop(box)
            name = f"{sec.replace('.', '-')}-{kind}-{j + 1}.webp"
            strip.save(outdir / name, "WEBP", quality=82, method=6)
            store.setdefault(sec, {"reading": [], "exercises": [], "solutions": []})[kind].append(
                {"src": f"book/ch{chap:02d}/{name}", "w": strip.width, "h": strip.height, "page": book_page}
            )


def main(chap: int):
    cfg = CHAPTERS[chap]
    outdir = ROOT / "public" / "book" / f"ch{chap:02d}"
    outdir.mkdir(parents=True, exist_ok=True)
    for f in outdir.glob("*.webp"):
        f.unlink()
    b0, b1 = cfg["body"]
    s0, s1 = cfg["solutions"]
    store: dict = {}
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        # --- body: section headings + exercise headings
        raw = []
        for pg in range(b0, b1 + 1):
            for y0, _y1, text in lines_on_page(pg):
                text = text.strip()
                m = re.match(rf"^{chap}\.(\d+) [A-Z][A-Za-z’' ,\-]+$", text)
                if m and y0 > BODY_TOP - 40:
                    raw.append(((f"{chap}.{m.group(1)}", "reading"), pg, y0))
                m = re.match(rf"^Exercises for Section {chap}\.(\d+)$", text)
                if m:
                    raw.append(((f"{chap}.{m.group(1)}", "exercises"), pg, y0))
        raw.sort(key=lambda t: (t[1], t[2]))
        # first section starts at the very top of the chapter opening page (include chapter title/intro)
        if raw and raw[0][0][1] == "reading":
            raw[0] = (raw[0][0], b0, 20 + GAP)
        cut(raw, b1, tmp, outdir, chap, store)

        # --- solutions
        raw = []
        for pg in range(s0, s1 + 1):
            for y0, _y1, text in lines_on_page(pg):
                text = text.strip()
                m = re.match(r"^Section (\d+)\.(\d+)$", text)
                if m and int(m.group(1)) == chap:
                    raw.append(((f"{chap}.{m.group(2)}", "solutions"), pg, y0))
                elif m or re.match(rf"^Chapter {chap + 1} Exercises$", text):
                    raw.append((None, pg, y0))
        raw.sort(key=lambda t: (t[1], t[2]))
        cut(raw, s1, tmp, outdir, chap, store)

    data = {"chapter": chap, "sections": store}
    dest = ROOT / "src" / "data" / "pages" / f"ch{chap:02d}.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1))
    total = sum(len(v) for s in store.values() for v in s.values())
    print(f"chapter {chap}: {total} strips")
    for sec, kinds in sorted(store.items(), key=lambda kv: [int(x) for x in kv[0].split('.')]):
        print(" ", sec, {k: [x["page"] for x in v] for k, v in kinds.items()})


if __name__ == "__main__":
    main(int(sys.argv[1]))
