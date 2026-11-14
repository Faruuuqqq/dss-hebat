// Verifikasi algoritma APLIKASI (bukan mirror).
// Jalankan: node 05-aplikasi/test-algoritma.mjs
//
// Skrip ini mengekstrak <script> dari index.html, menjalankannya di Node vm
// dengan DOM stub, lalu menguji fungsi dan data yang benar-benar dipakai aplikasi.
// Dengan begitu test tidak bisa lolos jika index.html berubah tapi test tidak.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appPath = path.join(root, '05-aplikasi', 'index.html');
const html = fs.readFileSync(appPath, 'utf8');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (scripts.length !== 1) {
  console.error(`FAIL  index.html harus punya tepat 1 blok <script>, ditemukan ${scripts.length}`);
  process.exit(1);
}

// --- DOM stub minimal agar script aplikasi bisa dieksekusi tanpa browser ---
function stubEl() {
  return {
    innerHTML: '', textContent: '', className: '', value: '', style: {},
    dataset: {}, classList: { contains: () => false, add() {}, remove() {} },
    addEventListener() {}, setAttribute() {}, focus() {},
    selectionStart: 0, selectionEnd: 0,
  };
}
const elements = new Map();
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, stubEl());
    return elements.get(id);
  },
  querySelector() { return stubEl(); },
  querySelectorAll() { return []; },
  addEventListener() {},
  createElement() { return stubEl(); },
  body: stubEl(),
  activeElement: null,
};
const context = { document, window: { addEventListener() {} }, console };
vm.createContext(context);

const code = scripts[0][1] + `
;globalThis.__api = {
  ahp, topsis, allocPhases, feasibleFlags, sensitivity, DATASETS, A0,
  getState: () => ({ ALTS, X, C9, COST, A, activeKey })
};`;
vm.runInContext(code, context, { filename: appPath });

const api = context.__api;
if (!api) {
  console.error('FAIL  Gagal mengekstrak API dari script index.html');
  process.exit(1);
}

const { ahp, topsis, allocPhases, feasibleFlags, sensitivity, DATASETS, A0, getState } = api;
const state = getState();
const { X, C9, COST, ALTS } = state;

let fail = 0;
const near = (a, b, e = 5e-4) => Math.abs(a - b) < e;
const chk = (label, got, exp, e = 5e-4) => {
  const ok = typeof got === 'number' ? near(got, exp, e) : got === exp;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${got} (exp ${exp})`);
};

// 1) AHP + TOPSIS kanonik (dss_revisi.md)
const { w, lam, CI, CR } = ahp(A0);
chk('λmax', lam, 8.1031);
chk('CI', CI, 0.0147);
chk('CR', CR, 0.0104);

[[0, 0.2395], [1, 0.1429], [2, 0.1429], [3, 0.0770], [4, 0.1245],
 [5, 0.0515], [6, 0.0974], [7, 0.1245]].forEach(([i, e]) => chk('w_C' + (i + 1), w[i], e));

const { CC } = topsis(X, w);
[[0, 0.5774], [1, 0.4638], [2, 0.6445], [3, 0.4995], [4, 0.1820]]
  .forEach(([i, e]) => chk('CC_A' + (i + 1), CC[i], e));

// 2) Kelayakan C9 dan alokasi fase
const flags = feasibleFlags();
const phases = allocPhases(CC, COST, flags);
chk('semua alternatif layak (C9 >= 3)', flags.every(Boolean), true);
chk('fase resmi', JSON.stringify(phases), JSON.stringify([1, 2, 1, 2, 3]));

// Filter C9: A1 dibuat tidak layak, harus keluar dari alokasi
const originalC9 = C9[0];
C9[0] = 1;
const flagsFiltered = feasibleFlags();
const phasesFiltered = allocPhases(CC, COST, flagsFiltered);
C9[0] = originalC9;
chk('C9=1 -> A1 tidak layak', flagsFiltered[0], false);
chk('C9=1 -> A1 tidak dialokasikan', phasesFiltered[0], null);
chk('C9=1 -> fase alternatif lain tetap', JSON.stringify(phasesFiltered), JSON.stringify([null, 2, 1, 2, 3]));

// Biaya yang melampaui plafon tidak boleh masuk ke fase mana pun.
const costsOverBudget = COST.slice();
costsOverBudget[4] = 15.1;
const phasesOverBudget = allocPhases(CC, costsOverBudget, flags);
chk('biaya > plafon -> A5 tidak dialokasikan', phasesOverBudget[4], null);
chk('biaya > plafon -> fase lain tetap', JSON.stringify(phasesOverBudget), JSON.stringify([1, 2, 1, 2, null]));

// 3) Sensitivitas 16 run, 2 rank reversal (C1 -20%, C2 +20%)
const sens = sensitivity(X, w);
chk('jumlah run sensitivitas', sens.rows.length, 16);
const flips = sens.rows.filter(r => r.reversals > 0).length;
chk('rank reversal', flips, 2);

// 3b) Paritas tabel sensitivitas di paper (06 hasil & 04 proposal) dengan output engine
function checkSensTable(file, marker, label) {
  const text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf(marker);
  if (start < 0) {
    console.error(`FAIL  ${marker} tidak ditemukan di ${file}`);
    fail++;
    return;
  }
  const first = text.indexOf('| C1 |', start);
  const block = text.slice(first, text.indexOf('\n\n', first));
  const rows = block.split('\n').filter(l => /^\|\s*C\d\s*\|/.test(l));
  chk(`${label}: baris tabel`, rows.length, 16);
  let mism = 0;
  rows.forEach(line => {
    const c = line.split('|').map(s => s.trim());
    const sign = c[2].startsWith('+') ? '+' : '-';
    const row = sens.rows.find(r => 'C' + (r.j + 1) === c[1] && (r.d > 0 ? '+' : '-') === sign);
    if (!row) { mism++; return; }
    const vals = c.slice(3, 8).map(s => Number(s.replace(',', '.')));
    vals.forEach((v, i) => { if (!near(v, row.cc[i])) mism++; });
    const order = c[8].replace(/[\s*]/g, '');
    if (row.ranks.join('>') !== order) mism++;
  });
  chk(`${label}: nilai = output kode`, mism, 0);
}
checkSensTable(path.join(root, '06-paper-hasil/draft-paper-hasil.md'), '**Tabel VIII.', 'Tabel VIII (paper hasil)');
checkSensTable(path.join(root, '04-paper/draft-paper.md'), '**Tabel X.', 'Tabel X (paper proposal)');

// 4) Dataset perluasan tetap 12 segmen (simulasi)
chk('dataset perluasan', DATASETS.perluasan.alts.length, 12);

// 5) Paritas data CSV (dokumentasi) vs data inline yang dipakai aplikasi
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { quoted = false; }
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const alternatifRows = parseCsv(fs.readFileSync(path.join(root, '05-aplikasi/data/alternatif-kriteria.csv'), 'utf8'));
const altData = alternatifRows.filter(r => /^A\d+$/.test(r[1] || ''));
chk('jumlah baris CSV alternatif', altData.length, ALTS.length);
altData.forEach((r, i) => {
  const xCsv = r.slice(4, 12).map(Number);
  const c9Csv = Number(r[12]);
  const costCsv = Number(r[13]);
  const xOk = xCsv.every((v, j) => near(v, X[i][j], 1e-9));
  if (!xOk) fail++;
  console.log(`${xOk ? 'PASS' : 'FAIL'}  CSV X ${r[1]} = data inline`);
  chk(`CSV C9 ${r[1]}`, c9Csv, C9[i], 1e-9);
  chk(`CSV biaya ${r[1]}`, costCsv, COST[i], 1e-9);
});

const bobotLines = fs.readFileSync(path.join(root, '05-aplikasi/data/bobot-ahp.csv'), 'utf8').split(/\r?\n/);
const start = bobotLines.findIndex(l => l.trim().startsWith('#,C1'));
if (start < 0) {
  console.error('FAIL  Header #,C1 tidak ditemukan di bobot-ahp.csv');
  fail++;
} else {
  const matrix = bobotLines.slice(start + 1, start + 9)
    .map(l => l.split(',').slice(1).map(Number));
  chk('jumlah baris CSV AHP', matrix.length, 8);
  let ahpOk = true;
  matrix.forEach((row, i) => row.forEach((v, j) => {
    if (!near(v, A0[i][j], 0.005)) ahpOk = false;
  }));
  if (!ahpOk) fail++;
  console.log(`${ahpOk ? 'PASS' : 'FAIL'}  CSV AHP = matriks inline (toleransi 0,005)`);
}

console.log(fail ? `\n${fail} CHECK GAGAL` : '\nSEMUA CHECK LULUS ✅ (kode aktual dari index.html)');
process.exit(fail ? 1 : 0);
