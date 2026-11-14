#!/usr/bin/env bash
# Regenerasi gambar arsitektur kanonik (PNG) dari sumber TikZ.
#
# Sumber tunggal : assets/diagram/arsitektur-4-lapis-kanonik.tex
# Keluaran       : 06-paper-hasil/img/arsitektur.png
#                  04-paper/gambar-3-arsitektur.png
#
# Prasyarat: tectonic (engine LaTeX) dan Python + pymupdf.
#   Contoh pasang tectonic:
#     curl -fsSL -o tectonic.tar.gz \
#       https://github.com/tectonic-typesetting/tectonic/releases/download/\
# tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz
#     tar xzf tectonic.tar.gz
#
# Pemakaian: bash assets/diagram/build-arsitektur-png.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/assets/diagram/arsitektur-4-lapis-kanonik.tex"
TECTONIC="${TECTONIC:-tectonic}"
PYTHON="${PYTHON:-python3}"
DPI="${DPI:-400}"

for bin in "$TECTONIC"; do
  command -v "$bin" >/dev/null 2>&1 || { echo "ERROR: '$bin' tidak ditemukan. Set TECTONIC=/path/ke/tectonic" >&2; exit 1; }
done
"$PYTHON" -c 'import pymupdf' 2>/dev/null || { echo "ERROR: butuh Python + pymupdf (pip install pymupdf)" >&2; exit 1; }
[ -f "$SRC" ] || { echo "ERROR: sumber tidak ada: $SRC" >&2; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cat > "$WORK/fig.tex" <<EOF
\\documentclass[border=2pt]{standalone}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{mathptmx}
\\usepackage{amsmath}
\\usepackage{tikz}
\\usetikzlibrary{arrows.meta}
\\newcommand{\\cost}{\\mathit{Cost}}
\\begin{document}
\\input{$SRC}
\\end{document}
EOF

( cd "$WORK" && "$TECTONIC" -X compile fig.tex --keep-logs >/dev/null 2>&1 )

"$PYTHON" - "$WORK/fig.pdf" "$ROOT" "$DPI" <<'PY'
import sys, pymupdf
pdf, root, dpi = sys.argv[1], sys.argv[2], int(sys.argv[3])
page = pymupdf.open(pdf)[0]
pix = page.get_pixmap(dpi=dpi, alpha=False)
targets = [
    f'{root}/06-paper-hasil/img/arsitektur.png',
    f'{root}/04-paper/gambar-3-arsitektur.png',
]
for t in targets:
    pix.save(t)
    print(f'  tulis {t} ({pix.width}x{pix.height}, {dpi} dpi)')
PY

echo "SELESAI: gambar arsitektur kanonik dibangun ulang dari $SRC"
