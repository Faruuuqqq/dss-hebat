"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDSS } from "../lib/store";
import { MapModeToggle } from "../components/map/MapModeToggle";
import { PriorityMapPanel } from "../components/map/PriorityMapPanel";
import { AllocationSummary } from "../components/AllocationSummary";
import { SegmentForm } from "../components/SegmentForm";
import { parseScenario } from "../lib/scenario";

export default function DashboardPage() {
  const {
    dataset,
    result,
    activeMapMode,
    setActiveMapMode,
    plafonPerFase,
    resetDataset,
    scenario,
    discardScenario,
    applyScenario,
    storageError,
  } = useDSS();

  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleExport = () => {
    if (!scenario) return;
    const blob = new Blob([JSON.stringify(scenario, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skenario-sipriocctv-${scenario.preset}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const parsed = parseScenario(await file.text());
    if (!parsed) {
      setNotice("Berkas skenario tidak valid atau versinya tidak didukung.");
      return;
    }
    applyScenario(parsed);
    setNotice("Skenario dipulihkan dari berkas.");
  };

  const handleReset = () => {
    if (scenario && !window.confirm("Reset akan menghapus Skenario Saya dan kembali ke preset. Lanjutkan?")) {
      return;
    }
    resetDataset();
    setShowForm(false);
  };

  // Find top ranked alternative
  const topAltIdx = result.topsis.sortedIndices[0] ?? 0;
  const topAlt = dataset.alternatives[topAltIdx];
  const topCC = result.topsis.CC[topAltIdx] ?? 0;

  // AHP consistency badge
  const crVal = result.ahp.hierarchicalResult
    ? result.ahp.hierarchicalResult.cluster.CR
    : result.ahp.flatResult?.CR ?? 0;
  const crText = crVal <= 0.002 ? "CR ≤ 0,002" : `CR = ${crVal.toFixed(4)}`;

  // Budget Phase 1 subtotal
  const fase1Spent = (result.allocation.subtotals[1] ?? 0) / 1_000_000;
  const plafonJt = plafonPerFase / 1_000_000;

  // Group alternatives by allocated phase

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-[#A8231A] text-white";
      case 2: return "bg-[#B45309] text-white";
      case 3: return "bg-[#8A6A00] text-white";
      case 4: return "bg-[#2F6F8F] text-white";
      default: return "bg-[#55625F] text-white";
    }
  };

  const getRankBarColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-[#A8231A]";
      case 2: return "bg-[#B45309]";
      case 3: return "bg-[#8A6A00]";
      case 4: return "bg-[#2F6F8F]";
      default: return "bg-[#55625F]";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#14201F] tracking-tight">
            Ringkasan Prioritas CCTV
          </h1>
          <p className="text-xs sm:text-sm text-[#55625F] mt-0.5">
            Kecamatan Jatinangor, Kab. Sumedang · {dataset.alternatives.length} segmen kandidat · DSS Multi-stakeholder
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="bg-[#FFF1D6] text-[#8A6A00] text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#F5DEB3]">
            Data ilustratif
          </span>
          <button
            onClick={handleReset}
            className="bg-[#0E6B66] hover:bg-[#0B5652] text-white text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Reset nilai
          </button>
        </div>
      </div>

      {/* Scenario bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DDE3E1] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="text-xs">
          <p className="font-bold text-[#14201F]">
            {scenario
              ? `Skenario Saya aktif · dasar preset ${scenario.preset} · ${dataset.alternatives.length} segmen`
              : "Preset acuan terkunci"}
          </p>
          <p className="text-[#55625F] mt-0.5 max-w-2xl">
            {scenario
              ? "Peringkat di bawah dihitung dari skenario ini, sehingga tidak identik dengan angka acuan paper."
              : "Menambah titik hanya mengubah salinan skenario; angka acuan paper tetap utuh."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            aria-expanded={showForm}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0E6B66] hover:bg-[#0B5652] rounded-lg transition-colors cursor-pointer"
          >
            {showForm ? "Tutup form" : "+ Tambah titik"}
          </button>
          {scenario && (
            <>
              <button
                type="button"
                onClick={handleExport}
                className="px-3 py-1.5 text-xs font-semibold text-[#14201F] bg-white hover:bg-[#F3F5F4] border border-[#DDE3E1] rounded-lg transition-colors cursor-pointer"
              >
                Ekspor JSON
              </button>
              <label className="px-3 py-1.5 text-xs font-semibold text-[#14201F] bg-white hover:bg-[#F3F5F4] border border-[#DDE3E1] rounded-lg transition-colors cursor-pointer">
                Impor JSON
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImport}
                  className="sr-only"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Hapus Skenario Saya dan kembali ke preset?")) discardScenario();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#A8231A] bg-white hover:bg-[#FBE4E1] border border-[#F5C2BC] rounded-lg transition-colors cursor-pointer"
              >
                Hapus skenario
              </button>
            </>
          )}
        </div>
      </div>

      {notice && (
        <p className="text-xs text-[#0B3B38] bg-[#E3F1EF] border border-[#A7D7D1] rounded-xl px-3 py-2" role="status">
          {notice}
        </p>
      )}
      {storageError && (
        <p className="text-xs text-[#A8231A] bg-[#FBE4E1] border border-[#F5C2BC] rounded-xl px-3 py-2" role="alert">
          {storageError}
        </p>
      )}

      {showForm && <SegmentForm onClose={() => setShowForm(false)} />}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE3E1] shadow-xs">
          <p className="text-xs font-medium text-[#55625F]">Segmen dievaluasi</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#14201F] mt-1 sm:mt-1.5">{dataset.alternatives.length}</p>
          <p className="text-xs text-[#475467] mt-1">A1–A{dataset.alternatives.length} · 8 kriteria urgensi</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE3E1] shadow-xs">
          <p className="text-xs font-medium text-[#55625F]">Urgensi tertinggi</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#A8231A] mt-1 sm:mt-1.5">
            {topAlt?.id} · {topCC.toFixed(4).replace(".", ",")}
          </p>
          <p className="text-xs text-[#475467] mt-1 truncate">{topAlt?.nama_segmen}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE3E1] shadow-xs">
          <p className="text-xs font-medium text-[#55625F]">Konsistensi AHP</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0E6B66] mt-1 sm:mt-1.5">{crText}</p>
          <p className="text-xs text-[#475467] mt-1">Agregat 3 kelompok · batas 0,10</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE3E1] shadow-xs">
          <p className="text-xs font-medium text-[#55625F]">Anggaran Fase 1</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#14201F] mt-1 sm:mt-1.5">
            Rp{fase1Spent.toFixed(1).replace(".", ",")} jt
          </p>
          <p className="text-xs text-[#475467] mt-1">dari plafon Rp{plafonJt.toFixed(1).replace(".", ",")} jt</p>
        </div>
      </div>

      {/* Main Grid: Map & Ranking List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Column: Map */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-base text-[#14201F]">Peta prioritas segmen</h2>
            <MapModeToggle mode={activeMapMode} onChange={setActiveMapMode} />
          </div>

          <PriorityMapPanel />
        </div>

        {/* Right Column: TOPSIS Ranking List */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4 flex flex-col justify-between h-full">
          <div>
            <h2 className="font-bold text-base text-[#14201F] mb-4">Peringkat urgensi (TOPSIS)</h2>

            <div className="space-y-4">
              {result.topsis.sortedIndices.map((origIdx, rankIdx) => {
                const alt = dataset.alternatives[origIdx];
                const rank = rankIdx + 1;
                const cc = result.topsis.CC[origIdx] ?? 0;
                const allocItem = result.allocation.items.find((i) => i.alternatif_id === alt.id);
                const phaseTag = allocItem?.fase === 1 ? "Segera" : (allocItem?.fase ? "Fase " + allocItem.fase : "Tidak dialokasikan");

                return (
                  <div key={alt.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${getRankBadgeColor(rank)}`}>
                          {rank}
                        </span>
                        <span className="text-[#14201F]">{alt.id} · {alt.nama_segmen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#14201F]">{cc.toFixed(4).replace(".", ",")}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            allocItem?.fase === 1
                              ? "bg-[#FBE4E1] text-[#A8231A]"
                              : allocItem?.fase === 2
                              ? "bg-[#FFF1D6] text-[#8A6A00]"
                              : "bg-[#E3ECEF] text-[#2F6F8F]"
                          }`}
                        >
                          {phaseTag}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#EEF2F1] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getRankBarColor(rank)}`}
                        style={{ width: `${Math.round(cc * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EEF2F1]">
            <Link
              href="/hasil"
              className="text-xs font-semibold text-[#0E6B66] hover:text-[#0B5652] hover:underline inline-flex items-center gap-1"
            >
              Lihat detail hasil & alokasi anggaran →
            </Link>
          </div>
        </div>
      </div>

      <AllocationSummary allocation={result.allocation} title="Rencana pemasangan bertahap" />
    </div>
  );
}
