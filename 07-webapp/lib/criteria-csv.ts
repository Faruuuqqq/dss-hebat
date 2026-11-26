import type { AlternativeValue } from "./engine/types.ts";
import { parseNumber } from "./format.ts";
import { KRITERIA_URGENSI } from "./scenario.ts";

export interface CriteriaCsvRow {
  id: string;
  value: AlternativeValue;
}

type ParseResult = { rows: CriteriaCsvRow[] } | { error: string };

function readRows(source: string): string[][] | null {
  const text = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trimEnd() + "\n";
  const header = text.trimStart().split("\n", 1)[0];
  const hasSemicolon = header.match(/"(?:""|[^"])*"|[;,]/g)?.some((token) => token === ";");
  const cell = hasSemicolon
    ? /(?:"((?:[^"]|"")*)"|([^";\n]*))([;\n])/gy
    : /(?:"((?:[^"]|"")*)"|([^",\n]*))([,\n])/gy;
  const rows: string[][] = [];
  let row: string[] = [];
  while (cell.lastIndex < text.length) {
    const match = cell.exec(text);
    if (!match) return null;
    const [, quoted, plain, delimiter] = match;
    row.push((quoted === undefined ? plain : quoted.replace(/""/g, '"')).trim());
    if (delimiter === "\n") {
      if (row.length > 1 || row[0]) rows.push(row);
      row = [];
    }
  }
  return rows;
}

export function parseCriteriaCsv(source: string, existingIds: ReadonlySet<string>): ParseResult {
  const parsed = readRows(source);
  if (!parsed) return { error: "Format CSV rusak. Periksa pemisah kolom dan tanda kutip." };
  const [header, ...records] = parsed;
  if (!header) return { error: "Berkas CSV kosong." };
  if (!records.length) return { error: "CSV harus berisi setidaknya satu baris data." };

  const columns = header.map((col) => col.toUpperCase());
  if (columns.includes("") || new Set(columns).size !== columns.length) {
    return { error: "Nama kolom CSV harus terisi dan unik." };
  }
  const ids = columns.filter((col) => col === "ID" || col === "KODE");
  const costs = columns.filter((col) => col === "BIAYA_RP" || col === "BIAYA_JUTARP");
  if (ids.length !== 1 || costs.length !== 1 || ![...KRITERIA_URGENSI, "C9"].every((col) => columns.includes(col))) {
    return { error: "Kolom wajib: ID atau Kode, C1–C9, serta Biaya_Rp atau Biaya_JutaRp. Gunakan satu kolom ID dan satu kolom biaya." };
  }

  const rows: CriteriaCsvRow[] = [];
  const seen = new Set<string>();
  for (const [index, record] of records.entries()) {
    const rowLabel = "Baris data " + (index + 1) + ": ";
    if (record.length !== columns.length) return { error: rowLabel + "jumlah kolom berbeda dari header." };
    const raw = Object.fromEntries(columns.map((col, i) => [col, record[i]]));
    const id = raw[ids[0]];
    if (!existingIds.has(id)) return { error: rowLabel + "ID segmen tidak ditemukan pada data aktif." };
    if (seen.has(id)) return { error: rowLabel + "ID " + id + " berulang." };
    seen.add(id);

    const kriteria: Record<string, number> = {};
    for (const code of KRITERIA_URGENSI) {
      const value = parseNumber(raw[code]);
      if (value === null || value < 0 || value > Number.MAX_SAFE_INTEGER) {
        return { error: rowLabel + code + " harus berupa angka nonnegatif." };
      }
      kriteria[code] = value;
    }

    const c9 = parseNumber(raw.C9);
    if (c9 === null || !Number.isInteger(c9) || c9 < 1 || c9 > 5) {
      return { error: rowLabel + "C9 harus bilangan bulat 1–5." };
    }
    const cost = parseNumber(raw[costs[0]]);
    const rupiah = costs[0] === "BIAYA_JUTARP" ? Math.round((cost ?? NaN) * 1e6) : cost;
    if (cost === null || cost < 0 || rupiah === null || !Number.isSafeInteger(rupiah)) {
      return { error: rowLabel + "biaya harus bernilai nonnegatif dalam rupiah utuh setelah dikonversi." };
    }
    rows.push({ id, value: { kriteria, c9, biaya_rp: rupiah } });
  }
  return { rows };
}
