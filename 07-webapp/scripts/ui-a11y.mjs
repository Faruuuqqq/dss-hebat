/**
 * Audit aksesibilitas otomatis dengan axe-core pada 5 layar SiPrioCCTV.
 *
 * Menjalankan aturan WCAG 2.1 A/AA pada halaman di desktop dan ponsel.
 *
 * Jalankan (server harus berjalan lebih dulu):
 *   BASE_URL=http://127.0.0.1:3111 node scripts/ui-a11y.mjs
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

const exe = findChrome();
if (!exe) {
  console.error("SKIP: Chromium tidak ditemukan.");
  process.exit(0);
}

const AXE = path.join(process.cwd(), "node_modules", "axe-core", "axe.min.js");
if (!fs.existsSync(AXE)) {
  console.error("SKIP: axe-core tidak terpasang.");
  process.exit(0);
}

const BLOCKING = new Set(["serious", "critical"]);
const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu"] });

let blocking = 0;
let advisory = 0;

async function audit(label, route, width) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.addScriptTag({ path: AXE });

  const result = await page.evaluate(async () => {
    // @ts-expect-error axe disuntikkan saat runtime
    return await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
    });
  });

  const violations = result.violations ?? [];
  console.log(`\n=== ${label} (${width}px) — ${violations.length} jenis pelanggaran ===`);

  for (const v of violations) {
    const isBlocking = BLOCKING.has(v.impact);
    if (isBlocking) blocking++;
    else advisory++;
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} elemen)`);
  }
  if (violations.length === 0) console.log("  tidak ada pelanggaran");

  await page.close();
  return violations;
}

// 1) Dashboard Desktop & Mobile
await audit("Dashboard Desktop", "/", 1440);
await audit("Dashboard Mobile", "/", 390);

// 2) Data Kriteria
await audit("Data Kriteria", "/kriteria", 1440);

// 3) Pembobotan AHP
await audit("Pembobotan AHP", "/ahp", 1440);

// 4) Hasil & Anggaran
await audit("Hasil TOPSIS & Anggaran", "/hasil", 1440);
await audit("Hasil TOPSIS & Anggaran Mobile", "/hasil", 390);

// 5) Bandingkan Skenario
await audit("Bandingkan Skenario", "/perbandingan", 1440);
await audit("Bandingkan Skenario Mobile", "/perbandingan", 390);

// 6) Uji Sensitivitas
await audit("Uji Sensitivitas", "/sensitivitas", 1440);

await browser.close();

console.log(`\nRingkasan: ${blocking} pelanggaran serius/kritis, ${advisory} pelanggaran ringan.`);
if (blocking > 0) {
  console.log("GAGAL: perbaiki pelanggaran serius/kritis.");
  process.exit(1);
}
console.log("LULUS: tidak ada pelanggaran serius/kritis.");
