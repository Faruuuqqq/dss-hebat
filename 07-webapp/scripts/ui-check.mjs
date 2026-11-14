/**
 * Uji interaksi UI aplikasi Next.js di peramban sungguhan.
 *
 * Prasyarat: server produksi sudah berjalan (npm run build && npm start)
 * dan Chromium tersedia. Skrip memakai playwright-core dengan executablePath
 * ke Chromium yang sudah ada, jadi tidak mengunduh peramban baru.
 *
 * Jalankan:
 *   BASE_URL=http://127.0.0.1:3111 CHROME=/path/ke/chrome node scripts/ui-check.mjs
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
  const dirs = fs
    .readdirSync(cache)
    .filter((d) => d.startsWith("chromium-"))
    .sort()
    .reverse();
  for (const d of dirs) {
    const p = path.join(cache, d, "chrome-linux64", "chrome");
    if (fs.existsSync(p)) return p;
  }
  return null;
}

let fail = 0;
function chk(label, got, exp) {
  const ok = got === exp;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${got} (exp ${exp})`);
}

const exe = findChrome();
if (!exe) {
  console.error("SKIP: Chromium tidak ditemukan. Set CHROME=/path/ke/chrome");
  process.exit(0);
}

const browser = await chromium.launch({
  executablePath: exe,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
// Catat URL permintaan yang gagal supaya penyebabnya bisa ditelusuri,
// bukan hanya pesan "Failed to load resource".
page.on("response", (r) => {
  if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
});

await page.goto(BASE, { waitUntil: "networkidle" });

/** Ambil teks KPI berdasarkan labelnya. */
async function kpi(labelPrefix) {
  const el = page.locator(`div:has(> div:text-is("${labelPrefix}")) > div`).nth(1);
  return (await el.textContent())?.trim() ?? "";
}

// 1) Render awal
chk("judul halaman", (await page.locator("h1").textContent())?.trim(), "Prioritisasi Penempatan CCTV Jatinangor");

const cr = await kpi("Rasio Konsistensi (CR)");
chk("KPI CR", cr, "0,0104");

const feasible = await kpi("Layak (C9 ≥ 3)");
chk("KPI layak awal", feasible, "5/5");

const top = await kpi("Prioritas Tertinggi");
chk("KPI prioritas", top, "A3");

// 2) Angka TOPSIS di tabel
const topsisRows = page.locator('section:has(h2:text-is("Hasil Perankingan TOPSIS")) tbody tr');
chk("jumlah baris TOPSIS", await topsisRows.count(), 5);
const firstRow = (await topsisRows.nth(0).innerText()).replace(/\s+/g, " ");
chk("peringkat 1 = A3 CC 0,6445", /A3/.test(firstRow) && /0,6445/.test(firstRow), true);

// 3) C9 awal terlihat di matriks
const c9a1 = page.locator('input[aria-label="C9 A1"]');
chk("nilai C9 A1 awal", await c9a1.inputValue(), "4");

// 4) Edit C9 -> 1, hasil harus berubah
await c9a1.fill("1");
await page.waitForTimeout(300);
chk("KPI layak setelah C9=1", await kpi("Layak (C9 ≥ 3)"), "4/5");

const topsisText = await page
  .locator('section:has(h2:text-is("Hasil Perankingan TOPSIS"))')
  .innerText();
chk("badge C9 < 3 muncul", topsisText.includes("C9 < 3"), true);

const faseText = await page
  .locator('section:has(h2:text-is("Alokasi Anggaran Bertahap (plafon Rp 15,0 Jt/tahun)"))')
  .innerText();
chk("A1 disebut tidak dialokasikan", /Tidak dialokasikan[\s\S]*A1/.test(faseText), true);

// 5) Kembalikan C9, lalu uji biaya di atas plafon
await c9a1.fill("4");
await page.waitForTimeout(200);
chk("KPI layak pulih", await kpi("Layak (C9 ≥ 3)"), "5/5");

const costA5 = page.locator('input[aria-label="Biaya A5"]');
await costA5.fill("15.1");
await page.waitForTimeout(300);
const topText = await page
  .locator('section:has(h2:text-is("Hasil Perankingan TOPSIS"))')
  .innerText();
chk("badge biaya > plafon muncul", topText.includes("Biaya > plafon"), true);

// 6) Fokus input bertahan saat mengetik (tidak dirender ulang paksa)
await page.locator('input[aria-label="C1 A2"]').click();
await page.keyboard.type("9");
const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
chk("fokus bertahan saat mengedit", focused, "C1 A2");

// 7) Reset memulihkan nilai awal
await page.getByRole("button", { name: "Reset ke data awal" }).click();
await page.waitForTimeout(300);
chk("reset: C9 A1 kembali 4", await c9a1.inputValue(), "4");
chk("reset: biaya A5 kembali 5.5", await page.locator('input[aria-label="Biaya A5"]').inputValue(), "5.5");

// 8) Ganti dataset ke simulasi
await page.selectOption("select", "perluasan");
await page.waitForTimeout(400);
chk("dataset simulasi: jumlah alternatif", await kpi("Alternatif Segmen"), "12");
const simulasiText = await page.locator("main").innerText();
chk("label SIMULASI tampil", simulasiText.includes("SIMULASI"), true);

// 9) Tidak ada error konsol
chk("tanpa error konsol/halaman", errors.length === 0 ? "bersih" : errors.join(" | "), "bersih");


// 11) Region bergulir horizontal harus dapat dijangkau papan ketik,
//     supaya tabel lebar tetap bisa digeser tanpa tetikus.
{
  const audit = await page.evaluate(() => {
    const regions = Array.from(document.querySelectorAll(".overflow-x-auto"));
    return {
      total: regions.length,
      focusable: regions.filter((r) => r.tabIndex === 0).length,
      named: regions.filter((r) => (r.getAttribute("aria-label") ?? "").length > 0).length,
    };
  });
  chk("jumlah region bergulir", audit.total > 0, true);
  chk("semua region focusable", audit.focusable, audit.total);
  chk("semua region punya nama aksesibel", audit.named, audit.total);
}

// 12) Fokus keyboard benar-benar bisa masuk ke region bergulir
{
  const ok = await page.evaluate(() => {
    const r = document.querySelector(".overflow-x-auto");
    if (!r) return false;
    r.focus();
    return document.activeElement === r;
  });
  chk("region bergulir dapat menerima fokus", ok, true);
}

// 10) Screenshot untuk bukti. Folder dibuat lebih dulu supaya skrip tetap
// berjalan pada clone baru, tempat .shots/ belum ada (dan memang di-gitignore).
await page.selectOption("select", "resmi");
await page.waitForTimeout(400);
fs.mkdirSync(".shots", { recursive: true });
await page.screenshot({ path: ".shots/ui-check.png", fullPage: false });
console.log("PASS  screenshot bukti ditulis ke .shots/ui-check.png");

await browser.close();

if (fail > 0) {
  console.log(`\n${fail} CHECK GAGAL`);
  process.exit(1);
}
console.log("\nSEMUA UI CHECK LULUS — interaksi aplikasi Next.js terverifikasi.");
