#!/usr/bin/env bash
# Smoke test UI: fokus input tidak hilang + filter C9 terlihat.
# Jalankan: bash 05-aplikasi/test-ui.sh
# Butuh Chromium/Chrome. Jika tidak ditemukan, test di-skip (exit 0).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/05-aplikasi/index.html"

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$c" >/dev/null 2>&1; then CHROME="$(command -v "$c")"; break; fi
  done
fi
if [ -z "$CHROME" ]; then
  CHROME="$(ls "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome 2>/dev/null | tail -1 || true)"
fi
if [ -z "$CHROME" ] || [ ! -x "$CHROME" ]; then
  echo "SKIP: Chromium/Chrome tidak ditemukan. Set CHROME=/path/ke/chrome untuk menjalankan."
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp "$APP" "$TMP/test.html"
cat >> "$TMP/test.html" <<'EOF'
<script>
window.addEventListener('load', ()=>{
  const out=[];
  out.push('kpiTopInit='+document.getElementById('kpi-top').textContent);
  out.push('crInit='+document.getElementById('cr-line').textContent);
  out.push('mapCircles='+document.querySelectorAll('#map circle').length);
  const inp=document.querySelector('input.cell');
  inp.focus();
  out.push('focusBefore='+(document.activeElement===inp));
  inp.value='12.5';
  inp.dispatchEvent(new Event('input',{bubbles:true}));
  out.push('focusRetainedX='+(document.activeElement===inp));
  out.push('kpiFeasibleInit='+document.getElementById('kpi-feasible').textContent);
  const c9=document.querySelector('input[data-c9="0"]');
  c9.focus();
  c9.value='1';
  c9.dispatchEvent(new Event('input',{bubbles:true}));
  out.push('focusRetainedC9='+(document.activeElement===c9));
  out.push('kpiFeasibleAfter='+document.getElementById('kpi-feasible').textContent);
  out.push('phaseHasExcluded='+document.getElementById('tbl-phase').innerHTML.includes('Tidak dialokasikan'));
  out.push('topsisHasBadge='+document.getElementById('tbl-topsis').innerHTML.includes('C9 &lt; 3'));
  out.push('mapHasInfeasible='+document.getElementById('map').innerHTML.includes('Tidak layak'));
  c9.value='4';
  c9.dispatchEvent(new Event('input',{bubbles:true}));
  const cost=document.querySelector('input[data-cost="4"]');
  cost.value='15.1';
  cost.dispatchEvent(new Event('input',{bubbles:true}));
  out.push('phaseHasOverBudgetExcluded='+document.getElementById('tbl-phase').innerHTML.includes('Biaya &gt; plafon'));
  out.push('mapHasOverBudgetExcluded='+document.getElementById('map').innerHTML.includes('Biaya &gt; plafon'));
  document.body.setAttribute('data-test', out.join(' | '));
});
</script>
EOF

DOM="$("$CHROME" --headless=new --no-sandbox --disable-gpu --dump-dom "file://$TMP/test.html" 2>/dev/null)"
RESULT="$(printf '%s' "$DOM" | grep -o 'data-test="[^"]*"' | head -1 || true)"

if [ -z "$RESULT" ]; then
  echo "FAIL: harness UI tidak menghasilkan data-test"
  exit 1
fi
echo "$RESULT"

fail=0
check() { if printf '%s' "$RESULT" | grep -q "$1"; then echo "PASS  $2"; else echo "FAIL  $2"; fail=1; fi; }
check 'kpiTopInit=A3' 'render awal: prioritas A3'
check 'crInit=.*0,0104' 'render awal: CR 0,0104'
check 'mapCircles=5' 'peta: 5 node'
check 'focusBefore=true' 'fokus awal di input'
check 'focusRetainedX=true' 'fokus bertahan saat edit matriks X'
check 'kpiFeasibleInit=5/5' 'KPI layak awal 5/5'
check 'focusRetainedC9=true' 'fokus bertahan saat edit C9'
check 'kpiFeasibleAfter=4/5' 'KPI layak berubah 4/5 setelah C9=1'
check 'phaseHasExcluded=true' 'alokasi mengecualikan C9 < 3'
check 'topsisHasBadge=true' 'badge C9 < 3 tampil di TOPSIS'
check 'mapHasInfeasible=true' 'peta menandai tidak layak'
check 'phaseHasOverBudgetExcluded=true' 'fase mengecualikan biaya di atas plafon'
check 'mapHasOverBudgetExcluded=true' 'peta menandai biaya di atas plafon'

if [ "$fail" -ne 0 ]; then exit 1; fi
echo "SEMUA SMOKE TEST UI LULUS ✅"
