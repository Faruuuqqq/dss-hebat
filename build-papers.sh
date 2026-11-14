#!/usr/bin/env bash
# Compile kedua paper menjadi PDF secara deterministik.
#
# Butuh Tectonic (binary tunggal, tanpa instalasi TeX penuh):
#   curl -fsSL -o tectonic.tar.gz \
#     "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz"
#   tar xzf tectonic.tar.gz          # menghasilkan ./tectonic
#
# Pemakaian:
#   TECTONIC=/path/ke/tectonic bash build-papers.sh
#
# SOURCE_DATE_EPOCH membuat PDF deterministik, sehingga `git status` tetap
# bersih setelah rebuild dan hasil compile bisa diverifikasi ulang kapan saja.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TECTONIC="${TECTONIC:-tectonic}"
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-1731000000}"

command -v "$TECTONIC" >/dev/null 2>&1 || {
  echo "ERROR: '$TECTONIC' tidak ditemukan. Set TECTONIC=/path/ke/tectonic" >&2
  exit 1
}

fail=0
build () { # $1 = direktori, $2 = berkas .tex
  local dir="$ROOT/$1" tex="$2" log="${2%.tex}.log"
  printf '%-24s ' "$1/$2"
  if ( cd "$dir" && "$TECTONIC" -X compile "$tex" --keep-logs >/dev/null 2>&1 ); then
    local pages over undef
    pages=$(sed -n 's/.*(\([0-9]\+\) pages.*/\1/p' "$dir/$log" | tail -1)
    over=$(grep -c 'Overfull \\hbox' "$dir/$log" || true)
    undef=$(grep -c 'undefined' "$dir/$log" || true)
    echo "OK  ${pages:-?} halaman · overfull hbox: $over · undefined: $undef"
    [ "$over" = "0" ] || { echo "  PERINGATAN: ada overfull hbox"; }
    [ "$undef" = "0" ] || { echo "  PERINGATAN: ada referensi/sitasi undefined"; fail=1; }
  else
    echo "GAGAL compile (lihat ${log})"
    fail=1
  fi
}

build "06-paper-hasil" "draft-paper-hasil.tex"
build "04-paper"      "draft-paper.tex"

[ "$fail" -eq 0 ] || exit 1
echo "SELESAI: kedua paper tercompile."
