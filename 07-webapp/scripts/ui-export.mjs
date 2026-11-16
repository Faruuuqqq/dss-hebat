/**
 * Uji EKSPOR CSV pada webapp Next.js.
 * Uji EKSPOR CSV pada webapp Next.js SiPrioCCTV.
 *
 * Fitur ekspor sebelumnya tidak pernah diverifikasi otomatis. Skrip ini menekan
 * tombol "Ekspor CSV" di peramban sungguhan, menangkap berkas unduhan, lalu
 * memeriksa isinya terhadap angka kanonik.
 * Menguji tombol "Unduh hasil (CSV)" pada halaman /hasil.
 *
 * Jalankan (server harus berjalan lebih dulu):
 * Jalankan:
 *   BASE_URL=http://127.0.0.1:3111 node scripts/ui-export.mjs
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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dss-export-"));
const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu"] });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
});

await page.goto(BASE, { waitUntil: "networkidle" });
await page.goto(`${BASE}/hasil`, { waitUntil: "networkidle" });

async function unduh(selectorDataset) {
  if (selectorDataset) {
    await page.selectOption("select", selectorDataset);
    await page.waitForTimeout(350);
  }
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 10000 }),
    page.getByRole("button", { name: "Ekspor CSV" }).click(),
  ]);
  const file = path.join(tmp, download.suggestedFilename());
  await download.saveAs(file);
  return { file, name: download.suggestedFilename(), text: fs.readFileSync(file, "utf8") };
}
const [download] = await Promise.all([
  page.waitForEvent("download", { timeout: 10000 }),
  page.getByRole("button", { name: "Unduh hasil (CSV)" }).click(),
]);

/** Parse CSV sederhana dengan dukungan tanda kutip. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
const file = path.join(tmp, download.suggestedFilename());
await download.saveAs(file);
const csvText = fs.readFileSync(file, "utf8");

// --- dataset resmi ---
const resmi = await unduh(null);
chk("nama berkas resmi", resmi.name, "dss-cctv-resmi.csv");
chk("unduhan berhasil", fs.existsSync(file), true);
chk("nama file CSV", download.suggestedFilename().includes("Hasil_DSS_CCTV"), true);

const rows = parseCsv(resmi.text);
const head = rows[0];
chk("jumlah kolom header", head.length, 9 + 8);
chk("header kolom pertama", head[0], "dataset");
chk("header memuat CC", head.includes("CC"), true);
chk("header memuat 8 bobot", head.filter((h) => h.startsWith("w_")).length, 8);
chk("jumlah baris data", rows.length - 1, 5);
const lines = csvText.trim().split("\n");
chk("jumlah baris CSV (1 header + 5 alts)", lines.length, 6);

const a3 = rows.find((r) => r[1] === "A3");
chk("A3 ada di CSV", Boolean(a3), true);
chk("A3 peringkat 1", a3[3], "1");
chk("A3 CC kanonik", a3[4], "0.644530");
chk("A3 biaya", a3[5], "7.50");
chk("A3 C9", a3[6], "4");
chk("A3 layak", a3[7], "ya");
chk("A3 fase 1", a3[8], "1");
const header = lines[0];
chk("header memuat Peringkat, ID, Closeness_CC, Fase",
  header.includes("Peringkat") && header.includes("Closeness_CC") && header.includes("Fase"),
  true
);

const a5 = rows.find((r) => r[1] === "A5");
chk("A5 CC kanonik", a5[4], "0.182026");
chk("A5 fase 3", a5[8], "3");
// Peringkat 1 harus A3 dengan CC 0.7674
const row1 = lines[1];
chk("baris 1 adalah A3", row1.includes("A3"), true);
chk("baris 1 CC A3 ~0.7674", row1.includes("0.7674"), true);

// setiap baris punya jumlah kolom sama dengan header
chk("semua baris 17 kolom", rows.slice(1).every((r) => r.length === head.length), true);

// --- dataset simulasi ---
const sim = await unduh("perluasan");
chk("nama berkas simulasi", sim.name, "dss-cctv-perluasan.csv");
const rowsSim = parseCsv(sim.text);
chk("jumlah baris simulasi", rowsSim.length - 1, 12);
chk("label dataset simulasi", rowsSim[1][0], "12 Desa (Simulasi)");

// --- ekspor menghormati pengeditan ---
await page.selectOption("select", "resmi");
await page.waitForTimeout(300);
const c9a1 = page.locator('input[aria-label="C9 A1"]');
await c9a1.click();
await c9a1.press("Control+a");
await c9a1.press("Delete");
await c9a1.pressSequentially("1", { delay: 30 });
await c9a1.blur();
await page.waitForTimeout(300);

const edited = await unduh(null);
const rowsEdited = parseCsv(edited.text);
const a1 = rowsEdited.find((r) => r[1] === "A1");
chk("CSV mengikuti C9 hasil edit", a1[6], "1");
chk("A1 ditandai tidak layak", a1[7], "tidak");
chk("A1 fase kosong", a1[8], "");

await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

if (fail > 0) {
  console.log(`\n${fail} CHECK GAGAL`);
  console.log(`\n${fail} UJI EKSPOR CSV GAGAL`);
  process.exit(1);
}
console.log("\nSEMUA CHECK EKSPOR CSV LULUS.");
console.log("\nSEMUA UJI EKSPOR CSV LULUS ✅");
