/**
 * Audit aksesibilitas otomatis dengan axe-core.
 *
 * Menjalankan aturan WCAG 2.1 A/AA pada halaman di dua lebar (desktop & ponsel)
 * dan pada dua keadaan (data resmi & kondisi tidak ada alternatif layak).
 *
 * Jalankan (server harus berjalan lebih dulu):
 *   BASE_URL=http://127.0.0.1:3111 node scripts/ui-a11y.mjs
 *
 * Kode keluar 1 bila ada pelanggaran tingkat `serious` atau `critical`,
 * sehingga bisa dipakai sebagai gerbang regresi.
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
  console.error("SKIP: axe-core tidak terpasang (npm i -D axe-core).");
  process.exit(0);
}

/** Pelanggaran yang dianggap memblokir. */
const BLOCKING = new Set(["serious", "critical"]);

const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu"] });

let blocking = 0;
let advisory = 0;

async function audit(label, width, prepare) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  if (prepare) await prepare(page);
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
    for (const node of v.nodes.slice(0, 3)) {
      console.log(`      target: ${node.target.join(" ")}`);
      const msg = (node.failureSummary ?? "").split("\n").filter(Boolean)[0];
      if (msg) console.log(`      sebab : ${msg.trim()}`);
    }
    if (v.nodes.length > 3) console.log(`      ... dan ${v.nodes.length - 3} elemen lain`);
  }
  if (violations.length === 0) console.log("  tidak ada pelanggaran");

  await page.close();
  return violations;
}

// 1) Tampilan normal, desktop
await audit("Data resmi", 1440);

// 2) Tampilan normal, ponsel
await audit("Data resmi", 390);

// 3) Kondisi batas: tidak ada alternatif layak (empty state)
await audit("Tanpa alternatif layak", 1440, async (page) => {
  for (const code of ["A1", "A2", "A3", "A4", "A5"]) {
    const el = page.locator(`input[aria-label="C9 ${code}"]`);
    await el.click();
    await el.press("Control+a");
    await el.press("Delete");
    await el.pressSequentially("1", { delay: 15 });
    await el.blur();
  }
  await page.waitForTimeout(400);
});

// 4) Dataset simulasi (12 alternatif)
await audit("Dataset simulasi", 1440, async (page) => {
  await page.selectOption("select", "perluasan");
  await page.waitForTimeout(400);
});

await browser.close();

console.log(`\nRingkasan: ${blocking} pelanggaran serius/kritis, ${advisory} pelanggaran ringan.`);
if (blocking > 0) {
  console.log("GAGAL: perbaiki pelanggaran serius/kritis.");
  process.exit(1);
}
console.log("LULUS: tidak ada pelanggaran serius/kritis.");
