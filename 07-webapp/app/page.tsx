"use client";

import React from "react";
import Link from "next/link";
import { useDSS } from "../lib/store";
import { MapModeToggle } from "../components/map/MapModeToggle";
import { PriorityMap3D } from "../components/map/PriorityMap3D";

export default function DashboardPage() {
  const { dataset, result, activeMapMode, setActiveMapMode, plafonPerFase, resetDataset } = useDSS();

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
  const phase1Items = result.allocation.items.filter((i) => i.fase === 1);
  const phase2Items = result.allocation.items.filter((i) => i.fase === 2);
  const phase3Items = result.allocation.items.filter((i) => i.fase === 3);

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
            onClick={resetDataset}
            className="bg-[#0E6B66] hover:bg-[#0B5652] text-white text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Hitung ulang
          </button>
        </div>
      </div>

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

          <PriorityMap3D />
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
                const phaseTag = allocItem?.fase === 1 ? "Segera" : `Fase ${allocItem?.fase ?? "-"}`;

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

      {/* Bottom Panel: Phased Installation Plan */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
        <h2 className="font-bold text-sm sm:text-base text-[#14201F]">
          Rencana pemasangan bertahap (plafon Rp{plafonJt.toFixed(1).replace(".", ",")} jt per fase)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Phase 1 Card */}
          <div className="bg-[#FBE4E1] p-4 rounded-xl border border-[#F5C2BC] space-y-2">
            <span className="text-xs font-bold text-[#A8231A] tracking-wider uppercase block">
              FASE 1 · SEGERA
            </span>
            <p className="text-sm font-bold text-[#14201F]">
              {phase1Items.map((i) => `${i.alternatif_id} ${i.nama_segmen.split(" ")[0]}`).join(" + ") || "Tidak ada segmen"}
            </p>
            <p className="text-xs text-[#55625F]">
              Rp{((result.allocation.subtotals[1] ?? 0) / 1e6).toFixed(1).replace(".", ",")} jt · sisa Rp{((result.allocation.remainingBudget[1] ?? 0) / 1e6).toFixed(1).replace(".", ",")} jt
            </p>
          </div>

          {/* Phase 2 Card */}
          <div className="bg-[#FFF1D6] p-4 rounded-xl border border-[#F5DEB3] space-y-2">
            <span className="text-xs font-bold text-[#8A6A00] tracking-wider uppercase block">
              FASE 2
            </span>
            <p className="text-sm font-bold text-[#14201F]">
              {phase2Items.map((i) => `${i.alternatif_id} ${i.nama_segmen.split(" ")[0]}`).join(" + ") || "Tidak ada segmen"}
            </p>
            <p className="text-xs text-[#55625F]">
              Rp{((result.allocation.subtotals[2] ?? 0) / 1e6).toFixed(1).replace(".", ",")} jt
              {phase2Items.some((i) => i.skor_c9 < 3) && " · A4 kelayakan C9 rendah (2)"}
            </p>
          </div>

          {/* Phase 3 Card */}
          <div className="bg-[#E3ECEF] p-4 rounded-xl border border-[#C5D7DC] space-y-2">
            <span className="text-xs font-bold text-[#2F6F8F] tracking-wider uppercase block">
              FASE 3
            </span>
            <p className="text-sm font-bold text-[#14201F]">
              {phase3Items.map((i) => `${i.alternatif_id} ${i.nama_segmen.split(" ")[0]}`).join(" + ") || "Tidak ada segmen"}
            </p>
            <p className="text-xs text-[#55625F]">
              Rp{((result.allocation.subtotals[3] ?? 0) / 1e6).toFixed(1).replace(".", ",")} jt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
