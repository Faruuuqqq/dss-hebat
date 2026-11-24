/**
 * Uji alur "Skenario Saya": tambah titik (manual & klik peta), simpan, muat
 * ulang, ekspor/impor JSON, hapus segmen, dan kembali ke preset.
 *
 * Jalankan server lebih dulu (npx next start -p 3111), lalu:
 *   BASE_URL=http://127.0.0.1:3111 node scripts/ui-scenario.mjs
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
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

const mainText = () => page.innerText("main");
const fill = async (sel, value) => page.fill(sel, value);

console.log("=== 1. Mulai dari preset bersih ===");
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.evaluate(() => window.localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
chk("status preset", (await mainText()).includes("Preset acuan terkunci"), true);
chk("pemilih preset tersedia", await page.locator("#dataset-preset-select").count(), 1);

console.log("=== 2. Form menolak draf tidak lengkap ===");
await page.getByRole("button", { name: "+ Tambah titik" }).click();
chk("form terbuka", (await mainText()).includes("Tambah segmen kandidat"), true);
chk("ID otomatis A6", await page.inputValue("#seg-id"), "A6");
await page.getByRole("button", { name: "Simpan segmen" }).click();
chk("draf kosong ditolak", (await mainText()).includes("harus angka"), true);
chk("segmen belum bertambah", (await mainText()).includes("5 segmen kandidat"), true);

console.log("=== 3. Isi manual lalu simpan ===");
await fill("#seg-nama", "Gang Uji Skala");
await fill("#seg-desa", "Cibeusi");
await fill("#seg-lat", "-6.9330");
await fill("#seg-lng", "107.7740");
const vals = { c1: "4", c2: "120", c3: "3", c4: "410", c5: "45", c6: "3", c7: "260", c8: "7" };
for (const [k, v] of Object.entries(vals)) await fill(`#seg-${k}`, v);
await fill("#seg-c9", "4");
await fill("#seg-biaya", "6,5");
await page.getByRole("button", { name: "Simpan segmen" }).click();
const afterSave = await mainText();
chk("skenario aktif", afterSave.includes("Skenario Saya aktif"), true);
chk("segmen menjadi 6", afterSave.includes("6 segmen kandidat"), true);
chk("A6 masuk peringkat", afterSave.includes("A6 · Gang Uji Skala"), true);
chk("peringatan skenario tampil", afterSave.includes("tidak identik dengan angka acuan paper"), true);

console.log("=== 4. Skenario bertahan setelah muat ulang ===");
await page.reload({ waitUntil: "networkidle" });
try {
  await page.getByText("Skenario Saya aktif").first().waitFor({ timeout: 5000 });
} catch {
  /* biarkan chk di bawah yang melaporkan */
}
const afterReload = await mainText();
chk("skenario pulih", afterReload.includes("Skenario Saya aktif"), true);
chk("A6 pulih", afterReload.includes("A6 · Gang Uji Skala"), true);

console.log("=== 5. Pilih lokasi lewat klik peta ===");
await page.getByRole("button", { name: "+ Tambah titik" }).click();
await page.getByRole("button", { name: "Pilih lokasi dari peta" }).click();
const map = page.locator('[aria-label="Peta GIS Interaktif Prioritas CCTV Jatinangor"]');
await map.click({ position: { x: 30, y: 30 } });
const lat = await page.inputValue("#seg-lat");
const lng = await page.inputValue("#seg-lng");
chk("latitude terisi dari peta", lat !== "" && Number(lat) < -6 && Number(lat) > -7, true);
chk("longitude terisi dari peta", lng !== "" && Number(lng) > 107 && Number(lng) < 108, true);
await page.getByRole("button", { name: "Batal" }).click();
chk("batal tidak menambah segmen", (await mainText()).includes("6 segmen kandidat"), true);

console.log("=== 6. Ekspor & impor JSON ===");
const [download] = await Promise.all([
  page.waitForEvent("download"),
  page.getByRole("button", { name: "Ekspor JSON" }).click(),
]);
const file = await download.path();
chk("berkas ekspor berisi JSON", fs.readFileSync(file, "utf8").includes("Gang Uji Skala"), true);

console.log("=== 7. Hapus segmen dari skenario ===");
await page.goto(`${BASE}/kriteria`, { waitUntil: "networkidle" });
await page.locator("tbody tr", { hasText: "A6" }).first().click();
page.once("dialog", (d) => d.accept());
await page.getByRole("button", { name: "Hapus dari skenario" }).click();
chk("A6 terhapus dari tabel", (await page.innerText("tbody")).includes("A6"), false);
chk("skenario tetap aktif", (await mainText()).includes("5 alternatif"), true);

console.log("=== 8. Impor memulihkan berkas ===");
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.setInputFiles('input[type="file"]', file);
await page.getByText("Skenario dipulihkan dari berkas.").first().waitFor({ timeout: 5000 });
chk("A6 kembali setelah impor", (await mainText()).includes("A6 · Gang Uji Skala"), true);

console.log("=== 9. Kembali ke preset ===");
page.once("dialog", (d) => d.accept());
await page.getByRole("button", { name: "Kembali ke preset" }).click();
const afterDiscard = await mainText();
chk("status preset kembali", afterDiscard.includes("Preset acuan terkunci"), true);
chk("A6 hilang", afterDiscard.includes("A6 · Gang Uji Skala"), false);
chk("pemilih preset muncul lagi", await page.locator("#dataset-preset-select").count(), 1);

chk("tanpa error konsol/halaman", errors.length, 0);
if (errors.length) console.log(errors.join("\n"));

await browser.close();
console.log(fail === 0 ? "\nSEMUA UJI SKENARIO UI LULUS." : `\n${fail} UJI SKENARIO UI GAGAL.`);
process.exit(fail === 0 ? 0 : 1);
