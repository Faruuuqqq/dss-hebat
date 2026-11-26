/**
 * Uji interaksi UI aplikasi Next.js SiPrioCCTV di peramban sungguhan.
 *
 * Menguji 5 layar (Dashboard, Data Kriteria, Pembobotan AHP, Hasil & Anggaran, Uji Sensitivitas).
 *
 * Jalankan:
 *   BASE_URL=http://127.0.0.1:3111 node scripts/ui-check.mjs
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

fs.mkdirSync(".shots", { recursive: true });

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
page.on("response", (r) => {
  if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
});

console.log("=== 1. Layar Dashboard (/) ===");
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.screenshot({ path: ".shots/screen-1-dashboard.png", fullPage: true });

chk("judul dashboard", (await page.locator("main h1").textContent())?.trim(), "Ringkasan Prioritas CCTV");
const pageText = await page.innerText("main");
chk("KPI segmen dievaluasi", pageText.includes("Segmen dievaluasi") && pageText.includes("5"), true);
chk("KPI urgensi tertinggi A3", pageText.includes("A3 · 0,7674"), true);
chk("KPI konsistensi AHP", pageText.includes("CR ≤ 0,002"), true);
chk("KPI anggaran Fase 1", pageText.includes("Rp14,0 jt"), true);
chk("peringkat 1 A3 di daftar", pageText.includes("A3") && pageText.includes("Persimpangan Hegarmanah") && pageText.includes("0,7674"), true);
chk("peta prioritas termuat", (await page.locator("canvas, svg").count()) > 0, true);

// Test map mode switch
await page.getByRole("tab", { name: "Kelayakan C9" }).click();
await page.waitForTimeout(200);
await page.getByRole("tab", { name: "Urgensi" }).click();
await page.waitForTimeout(200);

console.log("\n=== 2. Layar Data Kriteria (/kriteria) ===");
await page.goto(`${BASE}/kriteria`, { waitUntil: "networkidle" });
await page.screenshot({ path: ".shots/screen-2-kriteria.png", fullPage: true });

chk("judul kriteria", (await page.locator("main h1").textContent())?.trim(), "Data Kriteria Segmen");
const kriteriaText = await page.innerText("main");
chk("tabel matriks keputusan", kriteriaText.includes("Matriks keputusan"), true);
chk("sumber data ditampilkan", kriteriaText.includes("Sumber data & status"), true);

// Click row to change selection
await page.locator("table tbody tr").nth(1).click();
await page.waitForTimeout(200);
chk("form edit berubah ke A2", (await page.innerText("main")).includes("Ubah nilai · A2"), true);

console.log("\n=== 3. Layar Pembobotan AHP (/ahp) ===");
await page.goto(`${BASE}/ahp`, { waitUntil: "networkidle" });
await page.screenshot({ path: ".shots/screen-3-ahp.png", fullPage: true });

chk("judul ahp", (await page.locator("main h1").textContent())?.trim(), "Pembobotan AHP Multi-Stakeholder");
const ahpText = await page.innerText("main");
chk("matriks klaster tampil", ahpText.includes("Matriks perbandingan klaster"), true);
chk("kuesioner responden tampil", ahpText.includes("Tampilan responden"), true);
chk("bobot global tampil", ahpText.includes("Bobot global kriteria"), true);

// Switch tab G1 Pemda
await page.getByRole("tab", { name: /G1/ }).click();
await page.waitForTimeout(200);
await page.getByRole("tab", { name: "Agregat" }).click();
await page.waitForTimeout(200);

console.log("\n=== 4. Layar Hasil & Anggaran (/hasil) ===");
await page.goto(`${BASE}/hasil`, { waitUntil: "networkidle" });
await page.screenshot({ path: ".shots/screen-4-hasil.png", fullPage: true });

chk("judul hasil", (await page.locator("main").getByRole("heading", { level: 1 }).innerText()).trim(), "Hasil TOPSIS & Alokasi Anggaran");
const hasilText = await page.innerText("main");
chk("tabel TOPSIS tampil", hasilText.includes("Peringkat urgensi dan jarak"), true);
chk("A3 peringkat 1", hasilText.includes("A3 Persimpangan Hegarmanah"), true);
chk("kartu alokasi fase 1", await page.getByRole("heading", { name: /Fase 1 · Segera/i }).isVisible(), true);
chk("input plafon tampil", await page.getByLabel("Plafon per fase dalam Rupiah").isVisible(), true);

console.log("\n=== 5. Layar Uji Sensitivitas (/sensitivitas) ===");
await page.goto(`${BASE}/sensitivitas`, { waitUntil: "networkidle" });
await page.screenshot({ path: ".shots/screen-5-sensitivitas.png", fullPage: true });

chk("judul sensitivitas", (await page.locator("main h1").textContent())?.trim(), "Uji Sensitivitas Bobot");
const sensText = await page.innerText("main");
chk("skenario chip tampil", sensText.includes("C1 Kerawanan"), true);
chk("tabel ringkasan 16 skenario", sensText.includes("Ringkasan 16 skenario"), true);

// Click -20%
await page.getByRole("button", { name: "−20%" }).click();
await page.waitForTimeout(200);
await page.getByRole("button", { name: "+20%" }).click();
await page.waitForTimeout(200);

console.log("\n=== 6. Pemeriksaan Aksesibilitas & Error Konsol ===");
chk("tanpa error konsol/halaman", errors.length === 0 ? "bersih" : errors.join(" | "), "bersih");

await browser.close();

if (fail > 0) {
  console.log(`\n${fail} UJI UI GAGAL`);
  process.exit(1);
}
console.log("\nSEMUA UJI UI INTERAKTIF LULUS (5 LAYAR TEREPRODUKSI) ✅");
