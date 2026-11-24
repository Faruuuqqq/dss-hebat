/**
 * Uji unit "Skenario Saya": validasi draf, persistensi (serialisasi), isolasi
 * salinan preset, dan mesin dengan jumlah alternatif tambahan.
 *
 *   node scripts/scenario-check.mts
 */
import fs from "node:fs";
import path from "node:path";
import { solveDataset } from "../lib/engine/index.ts";
import {
  cloneFromPreset,
  emptyDraft,
  parseScenario,
  validateDraft,
} from "../lib/scenario.ts";

let fail = 0;
function chk(label: string, ok: boolean, detail = "") {
  if (ok) {
    console.log(`PASS  ${label}`);
  } else {
    fail++;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const ilustratif = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "../data/ilustratif.json"), "utf8")
);

const validDraft = {
  ...emptyDraft("A6"),
  nama_segmen: "Gang Uji Skala",
  desa: "Cibeusi",
  tipe_segmen: "Gang permukiman",
  lat: "-6,9330",
  lng: "107,7740",
  kriteria: { C1: "4", C2: "120", C3: "3", C4: "410", C5: "45", C6: "3", C7: "260", C8: "7" },
  c9: "4",
  biaya_juta: "6,5",
};

// 1. Draf kosong ditolak dengan pesan spesifik (bukan diam-diam menjadi nol)
const empty = validateDraft(emptyDraft("A6"), ["A1", "A2"]);
chk("draf kosong ditolak", !empty.ok);
chk(
  "draf kosong menyebut C1 dan latitude",
  !empty.ok && empty.errors.some((e) => e.includes("C1")) && empty.errors.some((e) => e.toLowerCase().includes("latitude"))
);

// 2. Draf lengkap diterima dan dikonversi dengan benar
const good = validateDraft(validDraft, ["A1", "A2"]);
chk(
  "draf lengkap diterima",
  good.ok &&
    good.alternative.id === "A6" &&
    good.value.c9 === 4 &&
    good.value.biaya_rp === 6_500_000 &&
    good.value.kriteria.C7 === 260 &&
    Math.abs(good.alternative.lat + 6.933) < 1e-9
);

// 3. ID duplikat ditolak
const dup = validateDraft({ ...validDraft, id: "A1" }, ["A1", "A2"]);
chk("ID duplikat ditolak", !dup.ok && dup.errors.some((e) => e.includes("sudah dipakai")));

// 4. C9 di luar 1–5 ditolak (termasuk desimal)
const c9high = validateDraft({ ...validDraft, c9: "6" }, []);
const c9frac = validateDraft({ ...validDraft, c9: "2,5" }, []);
chk("C9 6 ditolak", !c9high.ok);
chk("C9 2,5 ditolak", !c9frac.ok);

// 5. Koordinat di luar area studi: sah tetapi diberi peringatan
const outside = validateDraft({ ...validDraft, lat: "-6.9", lng: "107.6" }, []);
chk("koordinat luar area tetap sah + peringatan", outside.ok && outside.warnings.length === 1);

// 6. Salinan preset tidak memutasi preset asli
const clone = cloneFromPreset(ilustratif, ilustratif.values, ilustratif.pairwise || [], 15_000_000, 3);
const originalName = ilustratif.alternatives[0].nama_segmen;
clone.alternatives[0].nama_segmen = "BERUBAH";
chk("salinan skenario terisolasi dari preset", ilustratif.alternatives[0].nama_segmen === originalName);

// 7. Serialisasi/restorasi
const raw = JSON.stringify(clone);
const restored = parseScenario(raw);
chk(
  "skenario dapat disimpan & dipulihkan",
  !!restored &&
    restored.preset === clone.preset &&
    restored.alternatives.length === clone.alternatives.length &&
    restored.plafonPerFase === 15_000_000
);
chk("versi skenario lain ditolak", parseScenario(JSON.stringify({ ...clone, version: 99 })) === null);
chk("JSON rusak ditolak", parseScenario("{bukan json") === null);
chk(
  "skenario tanpa nilai alternatif ditolak",
  parseScenario(JSON.stringify({ ...clone, values: {} })) === null
);

// 8. Mesin tetap berjalan dengan alternatif tambahan
if (good.ok) {
  const values = { ...ilustratif.values, [good.alternative.id]: good.value };
  const withExtra = solveDataset({
    ...ilustratif,
    alternatives: [...ilustratif.alternatives, good.alternative],
    values,
  });
  const cc = withExtra.topsis.CC;
  const ranks = [...withExtra.topsis.rankings].sort((a, b) => a - b);
  chk("6 alternatif: CC terhitung semua", cc.length === 6 && cc.every((x) => Number.isFinite(x)));
  chk("6 alternatif: peringkat unik 1..6", ranks.join(",") === "1,2,3,4,5,6");
  chk(
    "6 alternatif: peringkat bisa berubah dari baseline",
    cc.length === 6 && withExtra.topsis.CC[0] >= 0
  );
}

console.log(fail === 0 ? "\nSEMUA UJI SKENARIO LULUS." : `\n${fail} UJI SKENARIO GAGAL.`);
process.exit(fail === 0 ? 0 : 1);
