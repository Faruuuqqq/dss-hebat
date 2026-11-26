"use client";

import React, { useState } from "react";
import { useDSS } from "../../lib/store";
import type { AlternativeValue } from "../../lib/engine/index";
import { CriteriaCsvImport } from "../../components/CriteriaCsvImport";
import { SegmentEvidence } from "../../components/SegmentEvidence";
import { NumberCell } from "../../components/NumberCell";

export default function KriteriaPage() {
  const {
    dataset,
    baselineDataset,
    selectedAltId,
    setSelectedAltId,
    updateCriterionValue,
    updateC9Value,
    updateCostValue,
    scenario,
    persistScenarioValues,
    removeAlternative,
    storageError,
  } = useDSS();

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

  const selectedAlt =
    dataset.alternatives.find((a) => a.id === selectedAltId) ??
    dataset.alternatives[0];
  const selectedValues = dataset.values[selectedAlt.id] ?? {
    kriteria: {},
    c9: 3,
    biaya_rp: 0,
  };

  const saveLabel = scenario ? "Simpan skenario" : "Simpan sebagai skenario";
  const handleSave = (updates?: Record<string, AlternativeValue>) => {
    const saved = persistScenarioValues(updates);
    setSaveMessage(saved ? "Skenario Saya tersimpan di browser." : null);
    return saved;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#14201F] tracking-tight">
            Data Kriteria Segmen
          </h1>
          <p className="text-xs sm:text-sm text-[#55625F] mt-0.5">
            Nilai mentah C1–C8 menentukan urgensi. C9 dan biaya menjadi kendala kelayakan, bukan bagian TOPSIS.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            aria-expanded={showImport}
            aria-controls={showImport ? "criteria-csv-import" : undefined}
            onClick={() => setShowImport(!showImport)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-[#14201F] bg-white hover:bg-[#F3F5F4] border border-[#DDE3E1] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Impor CSV
          </button>
        </div>
      </div>

      {storageError && (
        <p role="alert" className="rounded-xl border border-[#F5C2BC] bg-[#FBE4E1] p-3 text-xs text-[#A8231A]">
          {storageError}
        </p>
      )}
      {scenario && !storageError && (
        <div role="status" className="p-3 bg-[#E3F1EF] text-[#0E6B66] border border-[#A7D7D1] rounded-xl text-xs font-medium">
          {saveMessage ?? "Skenario Saya aktif. Perubahan disimpan otomatis di browser."}
        </div>
      )}
      {showImport && (
        <CriteriaCsvImport
          key={dataset.id}
          alternatives={dataset.alternatives}
          onApply={handleSave}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Decision Matrix Table */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
        <h2 className="font-bold text-sm sm:text-base text-[#14201F]">
          Matriks keputusan ({dataset.alternatives.length} alternatif × 8 kriteria + kendala)
        </h2>

        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabel Matriks Keputusan">
          <table className="w-full min-w-[680px] text-xs text-left border-collapse">
            <thead>
              {/* Category Clusters row */}
              <tr className="text-center font-bold text-[11px] uppercase tracking-wider text-white">
                <th className="bg-transparent border-0"><span className="sr-only">Klaster</span></th>
                <th colSpan={2} className="bg-[#A8231A] py-1.5 px-2 rounded-t-sm">Risiko</th>
                <th colSpan={3} className="bg-[#2E7D32] py-1.5 px-2 rounded-t-sm">Paparan Aktivitas</th>
                <th colSpan={3} className="bg-[#2F6F8F] py-1.5 px-2 rounded-t-sm">Karakteristik Spasial</th>
                <th colSpan={2} className="bg-[#B45309] py-1.5 px-2 rounded-t-sm">Kendala</th>
              </tr>
              {/* Column details row */}
              <tr className="bg-[#EEF2F1] text-[#3D4A47] font-semibold border-b border-[#DDE3E1]">
                <th className="p-2.5">Segmen</th>
                <th className="p-2.5 text-right">C1<br /><span className="text-[10px] font-normal text-[#55625F]">insiden</span></th>
                <th className="p-2.5 text-right">C3<br /><span className="text-[10px] font-normal text-[#55625F]">skor 1–5</span></th>
                <th className="p-2.5 text-right">C2<br /><span className="text-[10px] font-normal text-[#55625F]">org/jam</span></th>
                <th className="p-2.5 text-right">C5<br /><span className="text-[10px] font-normal text-[#55625F]">kmr/km</span></th>
                <th className="p-2.5 text-right">C8<br /><span className="text-[10px] font-normal text-[#55625F]">POI/150m</span></th>
                <th className="p-2.5 text-right">C4<br /><span className="text-[10px] font-normal text-[#55625F]">m²/ttk</span></th>
                <th className="p-2.5 text-right">C6<br /><span className="text-[10px] font-normal text-[#55625F]">simpul</span></th>
                <th className="p-2.5 text-right">C7<br /><span className="text-[10px] font-normal text-[#55625F]">gap (m)</span></th>
                <th className="p-2.5 text-right">C9<br /><span className="text-[10px] font-normal text-[#55625F]">skor 1–5</span></th>
                <th className="p-2.5 text-right">Biaya<br /><span className="text-[10px] font-normal text-[#55625F]">Rp Jt</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F1]">
              {dataset.alternatives.map((alt) => {
                const val = dataset.values[alt.id] ?? { kriteria: {}, c9: 3, biaya_rp: 0 };
                const isSelected = alt.id === selectedAltId;

                return (
                  <tr
                    key={alt.id}
                    onClick={() => setSelectedAltId(alt.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#E3F1EF] font-semibold text-[#0B3B38]"
                        : "hover:bg-[#F8FAF9] text-[#14201F]"
                    }`}
                  >
                    <td className="p-2.5">
                      <span className="font-bold">{alt.id}</span> · {alt.nama_segmen}
                    </td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C1"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C3"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C2"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C5"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C8"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C4"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C6"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono">{val.kriteria["C7"] ?? "-"}</td>
                    <td className="p-2.5 text-right font-mono font-bold">{val.c9}</td>
                    <td className="p-2.5 text-right font-mono">{(val.biaya_rp / 1e6).toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#55625F] italic pt-1">
          Baris yang disorot sedang dibuka di form di bawah. Semua kriteria C1–C8 diarahkan benefit terhadap urgensi: nilai lebih tinggi berarti lebih mendesak.
        </p>
      </div>

      {/* Bottom Grid: Form Edit & Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Form Edit */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
          <h2 className="font-bold text-sm sm:text-base text-[#14201F]">
            Ubah nilai · {selectedAlt.id} {selectedAlt.nama_segmen}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label htmlFor="input-c1" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C1 Riwayat kerawanan
              </label>
              <NumberCell
                id="input-c1"
                label="C1 Riwayat kerawanan"
                min={0}
                value={selectedValues.kriteria["C1"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C1", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c2" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C2 Mobilitas malam
              </label>
              <NumberCell
                id="input-c2"
                label="C2 Mobilitas malam"
                min={0}
                value={selectedValues.kriteria["C2"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C2", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c3" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C3 Defisiensi penerangan
              </label>
              <NumberCell
                id="input-c3"
                label="C3 Defisiensi penerangan"
                min={0}
                value={selectedValues.kriteria["C3"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C3", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c4" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C4 Efisiensi coverage
              </label>
              <NumberCell
                id="input-c4"
                label="C4 Efisiensi coverage"
                min={0}
                value={selectedValues.kriteria["C4"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C4", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c5" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C5 Kepadatan penghuni
              </label>
              <NumberCell
                id="input-c5"
                label="C5 Kepadatan penghuni"
                min={0}
                value={selectedValues.kriteria["C5"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C5", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c6" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C6 Derajat simpul
              </label>
              <NumberCell
                id="input-c6"
                label="C6 Derajat simpul"
                min={0}
                value={selectedValues.kriteria["C6"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C6", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c7" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C7 Coverage gap CCTV (m)
              </label>
              <NumberCell
                id="input-c7"
                label="C7 Coverage gap CCTV (m)"
                min={0}
                value={selectedValues.kriteria["C7"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C7", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c8" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C8 Fasilitas rentan (POI)
              </label>
              <NumberCell
                id="input-c8"
                label="C8 Fasilitas rentan (POI)"
                min={0}
                value={selectedValues.kriteria["C8"] ?? 0}
                onCommit={(v) => updateCriterionValue(selectedAlt.id, "C8", v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="input-c9" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
                C9 Kelayakan (kendala)
              </label>
              <NumberCell
                id="input-c9"
                label="C9 Kelayakan (kendala)"
                min={1}
                max={5}
                value={selectedValues.c9}
                onCommit={(v) => updateC9Value(selectedAlt.id, v)}
                className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono font-bold text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="input-biaya" className="text-[11px] font-medium text-[#3D4A47] block mb-1">
              Biaya estimasi (Rp juta)
            </label>
            <NumberCell
              id="input-biaya"
              label="Biaya estimasi (Rp juta)"
              min={0}
              value={selectedValues.biaya_rp / 1e6}
              onCommit={(v) => updateCostValue(selectedAlt.id, v * 1e6)}
              className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-[#475467]">
              {scenario
                ? "Perubahan disimpan otomatis di Skenario Saya."
                : "Perubahan langsung dihitung. Simpan sebagai skenario agar tetap ada setelah muat ulang."}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {scenario && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Hapus ${selectedAlt.id} dari Skenario Saya?`)) {
                      removeAlternative(selectedAlt.id);
                    }
                  }}
                  className="px-3 py-2 text-xs font-semibold text-[#A8231A] bg-white hover:bg-[#FBE4E1] border border-[#F5C2BC] rounded-lg transition-colors cursor-pointer"
                >
                  Hapus dari skenario
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSave()}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0E6B66] hover:bg-[#0B5652] rounded-lg shadow-sm transition-colors cursor-pointer w-full sm:w-auto"
              >
                {saveLabel}
              </button>
            </div>
          </div>
        </div>

        <SegmentEvidence
          segment={selectedAlt}
          value={dataset.values[selectedAlt.id]}
          baseline={baselineDataset.values[selectedAlt.id]}
          criteria={dataset.criteria}
          preset={dataset.id}
        />
      </div>
    </div>
  );
}
