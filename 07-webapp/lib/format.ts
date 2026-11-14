/** Pembantu format angka dan ekspor hasil. */

/** Format angka gaya Indonesia dengan jumlah desimal tetap. */
export function fmt(v: number, digits = 4): string {
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Persentase satu desimal. */
export function pct(v: number, digits = 2): string {
  return `${fmt(v * 100, digits)}%`;
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
