"use client";

import { useState } from "react";
import type { Alternative, AlternativeValue } from "../lib/engine/index";
import { parseCriteriaCsv, type CriteriaCsvRow } from "../lib/criteria-csv";
import { fmt } from "../lib/format";
import { KRITERIA_URGENSI } from "../lib/scenario";

export function CriteriaCsvImport({
  alternatives,
  onApply,
  onClose,
}: {
  alternatives: Alternative[];
  onApply: (values: Record<string, AlternativeValue>) => boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<CriteriaCsvRow[]>([]);
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const existingIds = new Set(alternatives.map((segment) => segment.id));
  const previewStillValid = rows.every(({ id }) => existingIds.has(id));

  async function readFile(file: File | undefined) {
    if (!file) return;
    setRows([]);
    setError("");
    setReading(true);
    try {
      const result = parseCriteriaCsv(await file.text(), existingIds);
      if ("error" in result) setError(result.error);
      else setRows(result.rows);
    } catch {
      setError("Berkas CSV gagal dibaca. Pilih ulang berkasnya.");
    } finally {
      setReading(false);
    }
  }

  return (
    <section id="criteria-csv-import" className="space-y-4 rounded-2xl border border-[#DDE3E1] bg-white p-4 sm:p-6">
      <h2 className="text-sm font-bold">Impor nilai kriteria</h2>
      <p id="criteria-csv-format" className="text-xs text-[#55625F]">
        Gunakan kolom ID atau Kode, C1 sampai C9, dan Biaya_Rp atau Biaya_JutaRp.
        Pemisah kolom bisa koma atau titik koma. Cantumkan ID segmen yang sudah ada.
      </p>
      <div className="space-y-1">
        <label htmlFor="criteria-csv-file" className="block text-xs font-semibold">Berkas matriks CSV</label>
        <input
          id="criteria-csv-file"
          type="file"
          accept=".csv,text/csv"
          aria-describedby="criteria-csv-format"
          disabled={reading}
          className="max-w-full text-xs file:mr-2 file:rounded-lg file:border file:border-[#DDE3E1] file:bg-[#EEF2F1] file:px-3 file:py-2"
          onChange={(event) => {
            void readFile(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </div>
      {error && <p role="alert" className="text-sm text-[#A8231A]">{error}</p>}
      {reading && <p role="status" className="text-xs">Membaca berkas…</p>}
      {rows.length > 0 && (
        <>
          <p className="text-xs text-[#55625F]">
            {rows.length} segmen akan diperbarui di Skenario Saya. Segmen lainnya tetap memakai nilai saat ini.
          </p>
          <div tabIndex={0} role="region" aria-label="Gulir pratinjau CSV" className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-right text-xs tabular-nums">
              <caption className="sr-only">Pratinjau impor CSV</caption>
              <thead className="bg-[#EEF2F1]">
                <tr>
                  <th scope="col" className="p-2 text-left">ID</th>
                  {[...KRITERIA_URGENSI, "C9", "Biaya (Rp)"].map((code) => (
                    <th key={code} scope="col" className="p-2">{code}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ id, value }) => (
                  <tr key={id} className="border-b border-[#DDE3E1]">
                    <th scope="row" className="p-2 text-left">{id}</th>
                    {KRITERIA_URGENSI.map((code) => <td key={code} className="p-2">{value.kriteria[code]}</td>)}
                    <td className="p-2">{value.c9}</td>
                    <td className="p-2">{fmt(value.biaya_rp, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!previewStillValid && <p role="alert" className="text-sm text-[#A8231A]">Daftar segmen berubah. Pilih ulang berkas CSV.</p>}
        </>
      )}
      <div className="flex flex-wrap gap-2">
        {rows.length > 0 && (
          <button
            type="button"
            disabled={!previewStillValid}
            className="rounded-lg bg-[#0E6B66] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B5652] disabled:opacity-50"
            onClick={() => {
              if (onApply(Object.fromEntries(rows.map(({ id, value }) => [id, value])))) onClose();
            }}
          >
            Terapkan ke skenario
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[#DDE3E1] px-4 py-2 text-xs font-semibold hover:bg-[#EEF2F1]"
        >
          Batal
        </button>
      </div>
    </section>
  );
}
