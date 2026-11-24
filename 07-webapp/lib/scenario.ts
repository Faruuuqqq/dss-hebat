import type { Alternative, AlternativeValue, PairwiseItem, SolveDatasetInput } from "./engine/index.ts";

export const SCENARIO_VERSION = 1;
export const SCENARIO_KEY = "dss-jatinangor-scenario-v1";

export interface ScenarioState {
  version: number;
  preset: string;
  alternatives: Alternative[];
  values: Record<string, AlternativeValue>;
  pairwise: PairwiseItem[];
  plafonPerFase: number;
  c9MinFase1: number;
}

export function cloneFromPreset(
  base: SolveDatasetInput,
  values: Record<string, AlternativeValue>,
  pairwise: PairwiseItem[],
  plafonPerFase: number,
  c9MinFase1: number
): ScenarioState {
  return {
    version: SCENARIO_VERSION,
    preset: base.id,
    alternatives: JSON.parse(JSON.stringify(base.alternatives)),
    values: JSON.parse(JSON.stringify(values)),
    pairwise: JSON.parse(JSON.stringify(pairwise)),
    plafonPerFase,
    c9MinFase1,
  };
}

export function parseScenario(raw: string | null): ScenarioState | null {
  if (!raw) return null;
  try {
    const x = JSON.parse(raw);
    if (!x || x.version !== SCENARIO_VERSION) return null;
    if (typeof x.preset !== "string" || !Array.isArray(x.alternatives) || x.alternatives.length === 0) return null;
    if (!x.values || typeof x.values !== "object") return null;
    const validAlts = x.alternatives.every(
      (a: Alternative) => a && typeof a.id === "string" && Number.isFinite(a.lat) && Number.isFinite(a.lng)
    );
    const validValues = x.alternatives.every((a: Alternative) => {
      const v = x.values[a.id];
      return v && typeof v.c9 === "number" && typeof v.biaya_rp === "number";
    });
    if (!validAlts || !validValues) return null;
    return {
      version: SCENARIO_VERSION,
      preset: x.preset,
      alternatives: x.alternatives,
      values: x.values,
      pairwise: Array.isArray(x.pairwise) ? x.pairwise : [],
      plafonPerFase: Number(x.plafonPerFase) || 15_000_000,
      c9MinFase1: Number(x.c9MinFase1) || 3,
    };
  } catch {
    return null;
  }
}

export function loadScenario(): ScenarioState | null {
  try {
    return parseScenario(window.localStorage.getItem(SCENARIO_KEY));
  } catch {
    return null;
  }
}

export function saveScenario(s: ScenarioState): boolean {
  try {
    window.localStorage.setItem(SCENARIO_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function clearScenario(): void {
  try {
    window.localStorage.removeItem(SCENARIO_KEY);
  } catch {
    /* storage tidak tersedia: tidak ada yang perlu dibersihkan */
  }
}

export const KRITERIA_URGENSI = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"] as const;

export interface SegmentDraft {
  id: string;
  nama_segmen: string;
  desa: string;
  tipe_segmen: string;
  lat: string;
  lng: string;
  kriteria: Record<string, string>;
  c9: string;
  biaya_juta: string;
}

export function emptyDraft(nextId: string): SegmentDraft {
  return {
    id: nextId,
    nama_segmen: "",
    desa: "",
    tipe_segmen: "Gang permukiman",
    lat: "",
    lng: "",
    kriteria: Object.fromEntries(KRITERIA_URGENSI.map((k) => [k, ""])),
    c9: "3",
    biaya_juta: "",
  };
}

function toNumber(v: string): number {
  return Number(String(v).trim().replace(",", "."));
}

function filled(v: string): boolean {
  return String(v).trim() !== "" && Number.isFinite(toNumber(v));
}

export type DraftValidation =
  | { ok: true; alternative: Alternative; value: AlternativeValue; warnings: string[] }
  | { ok: false; errors: string[] };

export function validateDraft(draft: SegmentDraft, existingIds: string[]): DraftValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!/^[A-Za-z0-9_-]{1,12}$/.test(draft.id.trim())) {
    errors.push("ID hanya huruf/angka/underscore/tanda hubung, maksimal 12 karakter.");
  } else if (existingIds.includes(draft.id.trim())) {
    errors.push(`ID ${draft.id.trim()} sudah dipakai.`);
  }
  if (draft.nama_segmen.trim().length < 3) errors.push("Nama segmen minimal 3 karakter.");
  if (draft.desa.trim().length === 0) errors.push("Desa wajib diisi.");

  if (!filled(draft.lat)) errors.push("Latitude harus angka.");
  if (!filled(draft.lng)) errors.push("Longitude harus angka.");

  const kriteria: Record<string, number> = {};
  KRITERIA_URGENSI.forEach((k) => {
    if (!filled(draft.kriteria[k])) {
      errors.push(`${k} harus angka dan tidak boleh kosong.`);
      return;
    }
    const n = toNumber(draft.kriteria[k]);
    if (n < 0) errors.push(`${k} tidak boleh negatif.`);
    kriteria[k] = n;
  });

  if (!filled(draft.c9)) {
    errors.push("C9 harus angka 1–5.");
  } else if (!Number.isInteger(toNumber(draft.c9)) || toNumber(draft.c9) < 1 || toNumber(draft.c9) > 5) {
    errors.push("C9 harus bilangan bulat 1–5.");
  }

  if (!filled(draft.biaya_juta)) {
    errors.push("Biaya harus angka (Rp juta).");
  } else if (toNumber(draft.biaya_juta) < 0) {
    errors.push("Biaya tidak boleh negatif.");
  }

  if (errors.length > 0) return { ok: false, errors };

  const lat = toNumber(draft.lat);
  const lng = toNumber(draft.lng);
  if (lat < -90 || lat > 90) errors.push("Latitude di luar rentang -90..90.");
  if (lng < -180 || lng > 180) errors.push("Longitude di luar rentang -180..180.");
  if (lat > -6.9455 || lat < -6.908 || lng < 107.7585 || lng > 107.7825) {
    warnings.push("Koordinat di luar batas peta studi Jatinangor; pastikan titik memang di area kajian.");
  }
  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    warnings,
    alternative: {
      id: draft.id.trim(),
      nama_segmen: draft.nama_segmen.trim(),
      tipe_segmen: draft.tipe_segmen.trim() || "Gang permukiman",
      desa: draft.desa.trim(),
      lat,
      lng,
      karakteristik: "Segmen tambahan skenario pengguna [SIMULASI]",
    },
    value: {
      kriteria,
      c9: toNumber(draft.c9),
      biaya_rp: Math.round(toNumber(draft.biaya_juta) * 1_000_000),
    },
  };
}
