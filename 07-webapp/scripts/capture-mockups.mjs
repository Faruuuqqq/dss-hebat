import { chromium } from "playwright-core";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3111";
const OUT_DIR = path.resolve(process.cwd(), "../08-docs/mockup");

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

const exe = findChrome();
if (!exe) {
  console.error("Chromium not found");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: exe,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

try {
  // Desktop captures (1440x960)
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 2,
  });
  const page = await contextDesktop.newPage();

  // 1. Dashboard Desktop
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000); // allow Three.js canvas to render frame
  await page.screenshot({ path: path.join(OUT_DIR, "mockup-desktop.png") });
  console.log("Captured: mockup-desktop.png");

  // 2. Data Kriteria Desktop
  await page.goto(`${BASE}/kriteria`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "mockup-kriteria.png") });
  console.log("Captured: mockup-kriteria.png");

  // 3. Pembobotan AHP Desktop
  await page.goto(`${BASE}/ahp`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "mockup-ahp.png") });
  console.log("Captured: mockup-ahp.png");

  // 4. Hasil TOPSIS & Anggaran Desktop
  await page.goto(`${BASE}/hasil`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "mockup-hasil.png") });
  console.log("Captured: mockup-hasil.png");

  // 5. Uji Sensitivitas Desktop
  await page.goto(`${BASE}/sensitivitas`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "mockup-sensitivitas.png") });
  console.log("Captured: mockup-sensitivitas.png");

  await contextDesktop.close();

  // Mobile captures (390x844 iPhone 14 style)
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(OUT_DIR, "mockup-mobile.png") });
  console.log("Captured: mockup-mobile.png");

  await contextMobile.close();
  console.log("All modern mockups captured successfully!");
} finally {
  await browser.close();
}
