import assert from "node:assert/strict";
import { after, test } from "node:test";
import { chromium } from "playwright-core";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3111";
const browser = await chromium.launch({ executablePath: process.env.CHROME });
after(() => browser.close());

async function openPage(t, path) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(7000);
  t.after(() => page.close());
  await page.goto(base + path);
  return page;
}

test("tile dan marker GIS terpasang pada panel saat pan dan zoom", async (t) => {
  const page = await openPage(t, "/");
  const map = page.locator(".leaflet-container");
  await map.locator(".leaflet-tile-loaded").first().waitFor();
  const positions = await map.evaluate((el) => [".leaflet-tile-loaded", ".dss-gis-marker"]
    .map((selector) => getComputedStyle(el.querySelector(selector)).position));
  assert.deepEqual(positions, ["absolute", "absolute"]);
  await map.locator(".leaflet-tile").first().evaluate(() =>
    Promise.all([...document.querySelectorAll(".leaflet-tile")].map((tile) => tile.decode().catch(() => {})))
  );
  assert.equal(await map.evaluate((el) => {
    const bounds = el.getBoundingClientRect();
    const tiles = [...el.querySelectorAll(".leaflet-tile-loaded")];
    return [0.1, 0.5, 0.9].every((x) => [0.1, 0.5, 0.9].every((y) =>
      tiles.some((tile) => {
        const rect = tile.getBoundingClientRect();
        const px = bounds.left + bounds.width * x;
        const py = bounds.top + bounds.height * y;
        return px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
      })
    ));
  }), true);

  const bounds = await map.boundingBox();
  const marker = map.locator(".dss-gis-marker").first();
  const before = await marker.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width / 2 + 45, bounds.y + bounds.height / 2, { steps: 5 });
  await page.mouse.up();
  assert.ok((await marker.boundingBox()).x > before.x + 25);
  const markerSpacing = () => map.locator(".dss-gis-marker").evaluateAll(([first, second]) =>
    Math.abs(first.getBoundingClientRect().x - second.getBoundingClientRect().x));
  const spacing = await markerSpacing();
  const zoom = await map.locator(".leaflet-tile-loaded").first().evaluate((tile) => Number(tile.src.split("/").at(-3)));
  await map.locator(".leaflet-control-zoom-in").click();
  await page.waitForFunction((previousZoom) => [...document.querySelectorAll(".leaflet-tile-loaded")]
    .some((tile) => Number(tile.src.split("/").at(-3)) === previousZoom + 1), zoom);
  await map.locator(".leaflet-zoom-anim").waitFor({ state: "detached" });
  assert.ok(Math.abs((await markerSpacing()) - spacing * 2) <= 3);
});

test("semua fase dan alasan tidak dialokasikan tampil di Hasil dan Dashboard", async (t) => {
  const page = await openPage(t, "/hasil");
  const budget = page.getByLabel("Plafon per fase dalam Rupiah");
  await budget.fill("8000000");
  const hasil = page.getByRole("heading", { name: /Alokasi bertahap/ }).locator("..");
  assert.match(await hasil.innerText(), /Fase 5[\s\S]*A5/i);
  await page.getByRole("link", { name: "Dashboard" }).click();
  const dashboard = page.getByRole("heading", { name: /Rencana pemasangan bertahap/i }).locator("..");
  assert.match(await dashboard.innerText(), /Fase 5[\s\S]*A5/i);
  await page.getByRole("link", { name: "Hasil & Anggaran" }).click();
  await budget.fill("6000000");
  assert.match(await hasil.innerText(), /Tidak dialokasikan[\s\S]*A3[\s\S]*melebihi plafon/i);
});

test("perubahan kriteria dapat disimpan sebagai skenario dan pulih setelah muat ulang", async (t) => {
  const page = await openPage(t, "/kriteria");
  const field = page.getByLabel("C1 Riwayat kerawanan", { exact: true });
  await field.fill("17");
  const save = page.getByRole("button", { name: "Simpan sebagai skenario", exact: true });
  assert.equal(await save.count(), 1);
  await save.click();
  await page.getByRole("status").filter({ hasText: /tersimpan di browser/i }).waitFor();
  await page.reload();
  await page.locator("main").getByRole("status").filter({ hasText: /Skenario Saya aktif/i }).waitFor();
  await page.getByRole("row", { name: /A3.*Hegarmanah/i }).click();
  assert.equal(await field.inputValue(), "17");
});

test("impor CSV memvalidasi berkas dan baru mengubah skenario setelah konfirmasi", async (t) => {
  const page = await openPage(t, "/kriteria");
  const field = page.getByLabel("C1 Riwayat kerawanan", { exact: true });
  page.on("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Impor CSV", exact: true }).click();
  const input = page.getByLabel("Berkas matriks CSV");
  assert.equal(await input.count(), 1);
  const upload = (text) => input.setInputFiles({ name: "matriks.csv", mimeType: "text/csv", buffer: Buffer.from(text) });
  await upload("ID,C1\nA3,21");
  await page.getByRole("alert").filter({ hasText: /kolom/i }).waitFor();
  assert.equal(await field.inputValue(), "15");

  const header = "ID,C1,C2,C3,C4,C5,C6,C7,C8,C9,Biaya_Rp\n";
  const row = "A3,21,460,4,780,150,5,110,14,4,7500000";
  for (const [text, error] of [
    [row + "\n" + row, /berulang/i],
    [row.replace("A3", "A9"), /tidak ditemukan/i],
    [row.replace(",14,4,", ",14,6,"), /C9/],
    [row.replace(",460,", ",,"), /C2/],
    [row.replace("7500000", "-1"), /biaya/i],
  ]) {
    await upload(header + text);
    await page.getByRole("alert").filter({ hasText: error }).waitFor();
    assert.equal(await field.inputValue(), "15");
  }

  await upload("\uFEFFKode;C1;C2;C3;C4;C5;C6;C7;C8;C9;Biaya_JutaRp\r\nA3;21;460;4;780;150;5;110;14;4;\"7,5\"\r\n");
  const preview = page.getByRole("table", { name: "Pratinjau impor CSV" });
  await preview.waitFor();
  assert.match(await preview.innerText(), /A3[\s\S]*21[\s\S]*7\.500\.000/);
  assert.equal(await field.inputValue(), "15");
  await page.getByRole("button", { name: "Terapkan ke skenario" }).click();
  assert.equal(await field.inputValue(), "21");
  await page.reload();
  await page.locator("main").getByRole("status").filter({ hasText: /Skenario Saya aktif/i }).waitFor();
  await page.getByRole("row", { name: /A3.*Hegarmanah/i }).click();
  assert.equal(await field.inputValue(), "21");
});
