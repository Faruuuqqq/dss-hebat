/**
 * Tes reproduksi BUG pada UI webapp.
 *
 * Setiap pemeriksaan dirancang GAGAL pada implementasi yang salah, sehingga
 * perbaikan bisa dibuktikan, bukan diasumsikan.
 *
 * Kontrak input yang diuji:
 *  - Selama mengetik, teks yang diketik dipertahankan apa adanya (tidak
 *    ditimpa), sehingga "7.5" tidak berubah menjadi "75".
 *  - Koma maupun titik diterima sebagai pemisah desimal.
 *  - Penjepitan nilai (min/max) dilakukan saat blur, bukan di tengah ketikan.
 *  - Mengosongkan sel lalu blur mengembalikan nilai sah sebelumnya, bukan 0.
 *  - Teks tidak valid mengembalikan nilai sah sebelumnya.
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
await page.goto(BASE, { waitUntil: "networkidle" });

const sel = (label) => `input[aria-label="${label}"]`;

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

// B1 — desimal tidak boleh rusak saat diketik
{
  const r = await typeThenBlur("Biaya A5", "7.5");
  chk("B1 selama mengetik teks utuh", r.during, "7.5");
  chk("B1 setelah blur", r.after, "7.5");
}

// B2 — koma sebagai pemisah desimal
{
  const r = await typeThenBlur("Biaya A5", "6,5");
  chk("B2 koma diterima, hasil", r.after, "6.5");
}

// B3 — C9 berskala 1..5
chk("B3 C9=9 dijepit ke 5", (await typeThenBlur("C9 A1", "9")).after, "5");
chk("B3 C9=0 dijepit ke 1", (await typeThenBlur("C9 A1", "0")).after, "1");
chk("B3 C9 pulih ke 4", (await typeThenBlur("C9 A1", "4")).after, "4");

// B4 — biaya negatif dijepit ke 0
chk("B4 biaya -3 dijepit ke 0", (await typeThenBlur("Biaya A5", "-3")).after, "0");
chk("B4 biaya pulih ke 5.5", (await typeThenBlur("Biaya A5", "5.5")).after, "5.5");

// B5 — kosong lalu blur tidak diam-diam jadi 0
chk("B5 kosong lalu blur mempertahankan nilai", await clearThenBlur("Biaya A5"), "5.5");

// B6 — sel matriks keputusan menerima desimal
chk("B6 C1 A1 = 4.25", (await typeThenBlur("C1 A1", "4.25")).after, "4.25");

// B7 — matriks AHP menerima desimal
chk("B7 AHP C1-C2 = 2.5", (await typeThenBlur("AHP C1 terhadap C2", "2.5")).after, "2.5");
chk("B7 AHP di atas 9 dijepit ke 9", (await typeThenBlur("AHP C1 terhadap C2", "12")).after, "9");

// B8 — angka besar tidak berubah
chk("B8 C4 A2 = 1250", (await typeThenBlur("C4 A2", "1250")).after, "1250");

// B9 — teks tidak valid mengembalikan nilai sah
chk("B9 teks 'abc' ditolak", (await typeThenBlur("C1 A1", "abc")).after, "4.25");

// B10 — hasil tetap konsisten setelah semua interaksi
await page.getByRole("button", { name: "Reset ke data awal" }).click();
await page.waitForTimeout(300);
chk("B10 reset: C1 A1 kembali 4.2", await page.locator(sel("C1 A1")).inputValue(), "4.2");
chk("B10 reset: C9 A1 kembali 4", await page.locator(sel("C9 A1")).inputValue(), "4");

await browser.close();

if (fail > 0) {
  console.log(`\n${fail} BUG MASIH ADA`);
  process.exit(1);
}
console.log("\nSEMUA BUG INPUT TERTANGANI.");
