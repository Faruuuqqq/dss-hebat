/**
 * Tes perilaku input angka pada UI Next.js (halaman /kriteria) + kuesioner AHP (/ahp).
 *
 * Kontrak NumberCell yang diuji:
 *  - Selama mengetik, teks dipertahankan apa adanya (7.5 tidak berubah jadi 75).
 *  - Koma diterima sebagai pemisah desimal dan dinormalkan ke titik.
 *  - Penjepitan min/max dilakukan saat blur.
 *  - Mengosongkan sel/tidak valid mengembalikan nilai sah terakhir.
 *
 * Jalankan (server harus berjalan lebih dulu):
 *   BASE_URL=http://127.0.0.1:3111 node scripts/ui-bugs.mjs
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3111";

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const cache = path.join(os.homedir(), ".cache", "ms-playwright");
  if (!fs.existsSync(cache)) return null;
  for (const d of fs.readdirSync(cache).filter((x) => x.startsWith("chromium-")).sort().reverse()) {
    const p = path.join(cache, d, "chrome-linux64", "chrome");
    if (fs.existsSync(p)) return p;
  }
  return null;
}

let fail = 0;
function chk(label, got, exp) {
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${JSON.stringify(got)} (exp ${JSON.stringify(exp)})`);
}

const exe = findChrome();
if (!exe) {
  console.error("SKIP: Chromium tidak ditemukan.");
  process.exit(0);
}

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const sel = (label) => `input[aria-label="${label}"]`;

/** Pilih alternatif dengan mengklik barisnya di tabel matriks. */
async function selectAlt(code) {
  await page.locator("tbody tr").filter({ hasText: `${code} ·` }).first().click();
  await page.waitForTimeout(120);
}

/** Ketik karakter demi karakter, lalu blur (commit). */
async function typeThenBlur(label, text) {
  const el = page.locator(sel(label));
  await el.click();
  await el.press("Control+a");
  await el.press("Delete");
  await el.pressSequentially(text, { delay: 40 });
  const during = await el.inputValue();
  await el.blur();
  await page.waitForTimeout(120);
  return { during, after: await el.inputValue() };
}

/** Kosongkan sel lalu blur. */
async function clearThenBlur(label) {
  const el = page.locator(sel(label));
  await el.click();
  await el.press("Control+a");
  await el.press("Delete");
  await el.blur();
  await page.waitForTimeout(120);
  return el.inputValue();
}

await page.goto(`${BASE}/kriteria`, { waitUntil: "networkidle" });

// Nilai bawaan dataset (default: ilustratif) untuk uji reset.
await selectAlt("A1");
const defaultC1 = await page.locator(sel("C1 Riwayat kerawanan")).inputValue();
const defaultC9 = await page.locator(sel("C9 Kelayakan (kendala)")).inputValue();

// B1 — desimal tidak boleh rusak saat diketik
await selectAlt("A5");
const b1 = await typeThenBlur("Biaya estimasi (Rp juta)", "7.5");
chk("B1 selama mengetik teks utuh", b1.during, "7.5");
chk("B1 setelah blur", b1.after, "7.5");

// B2 — koma sebagai pemisah desimal
chk("B2 koma diterima, hasil", (await typeThenBlur("Biaya estimasi (Rp juta)", "6,5")).after, "6.5");

// B3 — C9 berskala 1..5
await selectAlt("A1");
chk("B3 C9=9 dijepit ke 5", (await typeThenBlur("C9 Kelayakan (kendala)", "9")).after, "5");
chk("B3 C9=0 dijepit ke 1", (await typeThenBlur("C9 Kelayakan (kendala)", "0")).after, "1");
chk("B3 C9 pulih ke 4", (await typeThenBlur("C9 Kelayakan (kendala)", "4")).after, "4");

// B4 — biaya negatif dijepit ke 0
await selectAlt("A5");
chk("B4 biaya -3 dijepit ke 0", (await typeThenBlur("Biaya estimasi (Rp juta)", "-3")).after, "0");
chk("B4 biaya pulih ke 5.5", (await typeThenBlur("Biaya estimasi (Rp juta)", "5.5")).after, "5.5");

// B5 — kosong lalu blur mempertahankan nilai sah
chk("B5 kosong lalu blur mempertahankan nilai", await clearThenBlur("Biaya estimasi (Rp juta)"), "5.5");

// B6 — sel matriks keputusan menerima desimal
await selectAlt("A1");
chk("B6 C1 A1 = 4.25", (await typeThenBlur("C1 Riwayat kerawanan", "4.25")).after, "4.25");

// B8 — angka besar tidak berubah
await selectAlt("A2");
chk("B8 C4 A2 = 1250", (await typeThenBlur("C4 Efisiensi coverage", "1250")).after, "1250");

// B9 — teks tidak valid mengembalikan nilai sah
await selectAlt("A1");
chk("B9 teks 'abc' ditolak", (await typeThenBlur("C1 Riwayat kerawanan", "abc")).after, "4.25");

// B7 — kuesioner AHP: slider memetakan skala Saaty (1..9)
await page.goto(`${BASE}/ahp`, { waitUntil: "networkidle" });
const slider = page.locator('input[type="range"]').first();
await slider.focus();
for (let i = 0; i < 20; i++) await slider.press("ArrowRight");
await page.waitForTimeout(150);
chk("B7 slider AHP ujung kanan = skala 9", /skala 9/.test(await page.innerText("main")), true);

// B10 — reset mengembalikan nilai bawaan dataset
await page.goto(`${BASE}/kriteria`, { waitUntil: "networkidle" });
await page.locator('button:visible:has-text("Reset ke Data Bawaan")').first().click();
await page.waitForTimeout(350);
await selectAlt("A1");
chk("B10 reset: C1 A1 kembali bawaan", await page.locator(sel("C1 Riwayat kerawanan")).inputValue(), defaultC1);
chk("B10 reset: C9 A1 kembali bawaan", await page.locator(sel("C9 Kelayakan (kendala)")).inputValue(), defaultC9);

await browser.close();

if (fail > 0) {
  console.log(`\n${fail} BUG MASIH ADA`);
  process.exit(1);
}
console.log("\nSEMUA PERILAKU INPUT TERVERIFIKASI.");
