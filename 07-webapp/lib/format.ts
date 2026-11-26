/** Pembantu format angka dan ekspor hasil. */

/**
 * Format angka gaya Indonesia tanpa bergantung pada data ICU peramban/Node.
 *
 * `toLocaleString("id-ID")` menghasilkan keluaran berbeda bila runtime dibangun
 * tanpa ICU lengkap (small-icu) — di server bisa jadi "0.0104" sementara di
 * peramban "0,0104", yang memicu hydration mismatch pada React. Formatter ini
 * deterministik: titik ribuan, koma desimal, selalu sama di server dan klien.
 */
export function fmt(v: number, digits = 4): string {
  if (!Number.isFinite(v)) return "—";
  const negative = v < 0;
  const fixed = Math.abs(v).toFixed(digits);
  const [intPart, decPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const body = decPart ? `${withThousands},${decPart}` : withThousands;
  return negative ? `−${body}` : body;
}

/** Persentase dengan desimal tetap. */
export function pct(v: number, digits = 2): string {
  return `${fmt(v * 100, digits)}%`;
}

/** Angka ringkas tanpa nol berekor, memakai titik desimal (untuk sel input). */
export function compact(v: number, digits?: number): string {
  if (!Number.isFinite(v)) return "";
  if (digits !== undefined) return v.toFixed(digits);
  return String(Number(v.toFixed(6)));
}

/**
 * Ubah teks masukan pengguna menjadi angka.
 *
 * Koma maupun titik diterima sebagai pemisah desimal (kebiasaan mengetik
 * Indonesia), spasi di tepi diabaikan, dan teks parsial seperti "", "-", "."
 * menghasilkan null supaya pemanggil tidak memaksa nilai 0.
 */
export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (t === "" || t === "-" || t === "." || t === "-.") return null;
  // Tolak selain digit, satu titik, dan tanda minus di depan.
  if (!/^-?\d*\.?\d*$/.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

/** Bangun CSV hasil keputusan. Dipakai tombol ekspor. */
export function buildCsv(
  datasetLabel: string,
  altCodes: string[],
  altNames: string[],
  cc: number[],
  rank: number[],
  cost: number[],
  phases: (number | null)[],
  feasible: boolean[],
  c9: number[],
  weights: number[],
  criterionCodes: string[],
): string {
  const head = [
    "dataset",
    "kode",
    "alternatif",
    "peringkat",
    "CC",
    "biaya_jt",
    "C9",
    "layak",
    "fase",
    ...criterionCodes.map((c) => `w_${c}`),
  ];
  const rows = altCodes.map((code, i) => [
    datasetLabel,
    code,
    altNames[i],
    String(rank[i]),
    cc[i].toFixed(6),
    cost[i].toFixed(2),
    String(c9[i]),
    feasible[i] ? "ya" : "tidak",
    phases[i] === null ? "" : String(phases[i]),
    ...weights.map((w) => w.toFixed(6)),
  ]);
  return [head, ...rows]
    .map((r) => r.map((cell) => (/[",;\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join(","))
    .join("\n");
}

/** Unduh teks sebagai berkas di sisi peramban. */
export function download(filename: string, text: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function presetLabel(id: string): string {
  return id === "naskah_uts" ? "Acuan Naskah UTS" : "Ilustratif";
}

export function formatPhase(phase: number | null): string {
  return phase === null ? "Tidak dialokasikan" : "Fase " + phase;
}
