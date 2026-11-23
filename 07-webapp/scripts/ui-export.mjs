/**
 * Uji ekspor CSV pada UI Next.js lewat unduhan nyata di peramban.
 *
 * Menguji tombol "Unduh hasil (CSV)" di /hasil untuk kedua preset dataset
 * (ilustratif & naskah_uts): nama berkas, jumlah kolom, nilai kanonik.
 *
 * Jalankan (server harus berjalan lebih dulu):
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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });

await page.goto(`${BASE}/hasil`, { waitUntil: "networkidle" });

/** Ganti preset (opsional) lalu unduh CSV dan kembalikan isinya. */
async function unduh(datasetId) {
  if (datasetId) {
    await page.selectOption("#dataset-preset-select", datasetId);
    await page.waitForTimeout(400);
  }
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 15000 }),
    page.getByRole("button", { name: "Unduh hasil (CSV)" }).click(),
  ]);
  const file = path.join(tmp, download.suggestedFilename());
  await download.saveAs(file);
  return { name: download.suggestedFilename(), text: fs.readFileSync(file, "utf8") };
}

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
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// --- Dataset ilustratif (default) ---
const il = await unduh(null);
chk("nama berkas ilustratif", il.name, "Hasil_DSS_CCTV_Jatinangor_ilustratif.csv");

const rows = parseCsv(il.text);
const head = rows[0];
chk("jumlah kolom header", head.length, 12);
chk("header kolom pertama", head[0], "Peringkat");
chk("header memuat Closeness_CC", head.includes("Closeness_CC"), true);
chk("jumlah baris data", rows.length - 1, 5);
chk("semua baris 12 kolom", rows.slice(1).every((r) => r.length === head.length), true);

chk("baris 1 adalah A3", rows[1][1], "A3");
const a3 = rows.find((r) => r[1] === "A3");
chk("A3 peringkat 1", a3[0], "1");
chk("A3 CC ilustratif", a3[6], "0.767446");
chk("A3 fase 1", a3[10], "1");
const a5 = rows.find((r) => r[1] === "A5");
chk("A5 CC ilustratif", a5[6], "0.139744");
chk("A5 fase 3", a5[10], "3");

// --- Dataset naskah_uts (kanonik AHP 8x8) ---
const nu = await unduh("naskah_uts");
chk("nama berkas naskah_uts", nu.name, "Hasil_DSS_CCTV_Jatinangor_naskah_uts.csv");

const rows2 = parseCsv(nu.text);
chk("jumlah baris naskah_uts", rows2.length - 1, 5);
const a3b = rows2.find((r) => r[1] === "A3");
chk("A3 CC naskah_uts", a3b[6], "0.644530");
chk("A3 peringkat 1 naskah_uts", a3b[0], "1");
chk("A1 CC naskah_uts", rows2.find((r) => r[1] === "A1")[6], "0.577385");

await browser.close();

if (fail > 0) {
  console.log(`\n${fail} GAGAL`);
  process.exit(1);
}
console.log("\nEKSPOR CSV TERVERIFIKASI (ilustratif & naskah_uts).");
