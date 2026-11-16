"use client";

import React, { useState } from "react";
import { useDSS } from "../../lib/store";
import { solveTopsis } from "../../lib/engine/topsis";

export default function SensitivitasPage() {
  const { dataset, result } = useDSS();

  const criteriaList = [
    { code: "C1", label: "C1 Kerawanan" },
    { code: "C2", label: "C2 Mobilitas malam" },
    { code: "C3", label: "C3 Penerangan" },
    { code: "C4", label: "C4 Coverage" },
    { code: "C5", label: "C5 Kepadatan" },
    { code: "C6", label: "C6 Simpul jalan" },
    { code: "C7", label: "C7 Coverage gap" },
    { code: "C8", label: "C8 POI rentan" },
  ];

  const [activeCrit, setActiveCrit] = useState<string>("C2");
  const [activeDelta, setActiveDelta] = useState<number>(0.2); // -0.2, 0, +0.2

  // Baseline weights and values
  const critCodes = criteriaList.map((c) => c.code);
  const baseWeights = result.ahp.weights;
  const X: number[][] = dataset.alternatives.map((alt) => {
    const vals = dataset.values[alt.id]?.kriteria ?? {};
    return critCodes.map((code) => vals[code] ?? 0);
  });

  // Compute scenario weights
  const wBase = baseWeights[activeCrit] ?? 0.125;
  const wPrime = activeDelta === 0 ? wBase : wBase * (1 + activeDelta);
  const remainingSum = 1 - wPrime;
  const oldRemainingSum = 1 - wBase;

  const scenarioWeights: Record<string, number> = {};
  critCodes.forEach((code) => {
    if (code === activeCrit) {
      scenarioWeights[code] = wPrime;
    } else {
      const oldW = baseWeights[code] ?? 0;
      scenarioWeights[code] = oldRemainingSum > 0 ? oldW * (remainingSum / oldRemainingSum) : 0;
    }
  });

  // Solve TOPSIS for current active scenario
  const scenarioTopsis = solveTopsis(X, scenarioWeights, critCodes);
  const scenarioTopAlt = dataset.alternatives[scenarioTopsis.sortedIndices[0]];
  const baseOrder = result.sensitivity.baseOrder;
  const scenarioOrder = scenarioTopsis.sortedIndices
    .map((i) => dataset.alternatives[i].id)
    .join(" > ");
  const isFullOrderPreserved = scenarioOrder === baseOrder;

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1: return "bg-[#A8231A] text-white";
      case 2: return "bg-[#B45309] text-white";
      case 3: return "bg-[#8A6A00] text-white";
      case 4: return "bg-[#2F6F8F] text-white";
      default: return "bg-[#55625F] text-white";
    }
  };

  const getRankBarClass = (rank: number) => {
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#14201F] tracking-tight">
          Uji Sensitivitas Bobot
        </h1>
        <p className="text-sm text-[#55625F] mt-0.5">
          Ubah satu bobot kriteria sebesar ±20% (one-at-a-time), lalu lihat apakah peringkat berubah. Hitungan TOPSIS dijalankan ulang langsung.
        </p>
      </div>

      {/* Top Grid: Scenario Controls & Interactive Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scenario Controls */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-5">
          <h2 className="font-bold text-base text-[#14201F]">Skenario</h2>

          {/* Criteria Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#55625F] block">Kriteria yang diubah</span>
            <div className="flex flex-wrap gap-2">
              {criteriaList.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setActiveCrit(c.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCrit === c.code
                      ? "bg-[#0E6B66] text-white shadow-xs"
                      : "bg-[#EEF2F1] text-[#3D4A47] hover:bg-[#DDE3E1]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delta Segmented Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#55625F] block">Perubahan bobot</span>
            <div className="grid grid-cols-3 gap-2 bg-[#EEF2F1] p-1.5 rounded-xl border border-[#DDE3E1]">
              <button
                onClick={() => setActiveDelta(-0.2)}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeDelta === -0.2
                    ? "bg-[#0E6B66] text-white shadow-xs"
                    : "text-[#55625F] hover:text-[#14201F]"
                }`}
              >
                −20%
              </button>
              <button
                onClick={() => setActiveDelta(0)}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeDelta === 0
                    ? "bg-[#0E6B66] text-white shadow-xs"
                    : "text-[#55625F] hover:text-[#14201F]"
                }`}
              >
                0%
              </button>
              <button
                onClick={() => setActiveDelta(0.2)}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeDelta === 0.2
                    ? "bg-[#0E6B66] text-white shadow-xs"
                    : "text-[#55625F] hover:text-[#14201F]"
                }`}
              >
                +20%
              </button>
            </div>
          </div>

          {/* Weights After Renormalization */}
          <div className="space-y-3 pt-2 border-t border-[#EEF2F1]">
            <span className="text-xs font-semibold text-[#55625F] block">Bobot setelah renormalisasi</span>
            <div className="space-y-2">
              {critCodes.map((code) => {
                const wNew = scenarioWeights[code] ?? 0;
                const wOld = baseWeights[code] ?? 0;
                const isTarget = code === activeCrit;

                return (
                  <div key={code} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${isTarget ? "text-[#0E6B66]" : "text-[#14201F]"}`}>
                        {criteriaList.find((c) => c.code === code)?.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#14201F]">
                          {(wNew * 100).toFixed(1).replace(".", ",")}%
                        </span>
                        <span className="text-[11px] text-[#475467]">
                          (awal {(wOld * 100).toFixed(1).replace(".", ",")}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#EEF2F1] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isTarget ? "bg-[#0E6B66]" : "bg-[#55625F]"}`}
                        style={{ width: `${Math.round(wNew * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Results */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-bold text-base text-[#14201F]">Peringkat pada skenario ini</h2>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#E3F1EF] text-[#0E6B66] border border-[#BDE0DB] rounded-lg text-xs font-bold">
                Peringkat 1 tetap: {scenarioTopAlt.id}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  isFullOrderPreserved
                    ? "bg-[#E3F1EF] text-[#0E6B66] border-[#BDE0DB]"
                    : "bg-[#FFF1D6] text-[#7A4300] border-[#F5DEB3]"
                }`}
              >
                {isFullOrderPreserved ? "Urutan penuh tetap" : "Urutan penuh berubah"}
              </span>
            </div>

            {/* Alternative Ranks List */}
            <div className="space-y-3.5 pt-2">
              {scenarioTopsis.sortedIndices.map((origIdx, newRankIdx) => {
                const alt = dataset.alternatives[origIdx];
                const newRank = newRankIdx + 1;
                const oldRank = result.topsis.rankings[origIdx];
                const cc = scenarioTopsis.CC[origIdx];
                const diff = oldRank - newRank;

                return (
                  <div key={alt.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${getRankBadgeClass(newRank)}`}>
                          {newRank}
                        </span>
                        <span className="text-[#14201F]">{alt.id} · {alt.nama_segmen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#14201F]">{cc.toFixed(4).replace(".", ",")}</span>
                        <span
                          className={`text-[11px] font-bold ${
                            diff > 0
                              ? "text-[#0E6B66]"
                              : diff < 0
                              ? "text-[#A8231A]"
                              : "text-[#475467]"
                          }`}
                        >
                          {diff > 0 ? `▲ naik ${diff}` : diff < 0 ? `▼ turun ${-diff}` : "tetap"}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#EEF2F1] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getRankBarClass(newRank)}`}
                        style={{ width: `${Math.round(cc * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EEF2F1] text-[11px] text-[#55625F]">
            <p className="font-semibold text-[#14201F]">Urutan awal (bobot AHP agregat):</p>
            <p className="font-mono text-[#55625F] mt-0.5">{baseOrder}</p>
          </div>
        </div>
      </div>

      {/* Bottom Panel: 16 Scenarios Summary Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-base text-[#14201F]">
            Ringkasan 16 skenario (8 kriteria × ±20%)
          </h2>
          <span className="text-xs text-[#55625F]">
            Peringkat 1 tetap di {result.sensitivity.summary.rank1PreservedCount} dari 16 skenario · urutan penuh tetap di {result.sensitivity.summary.fullOrderPreservedCount} dari 16
          </span>
        </div>

        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabel Ringkasan 16 Skenario">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#EEF2F1] text-[#3D4A47] font-semibold border-b border-[#DDE3E1]">
                <th className="p-3 w-48">Kriteria</th>
                <th className="p-3">Bobot −20%</th>
                <th className="p-3">Bobot +20%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F1]">
              {critCodes.map((code) => {
                const scMinus = result.sensitivity.scenarios.find((s) => s.kriteria === code && s.deltaPct === -20);
                const scPlus = result.sensitivity.scenarios.find((s) => s.kriteria === code && s.deltaPct === 20);

                return (
                  <tr key={code} className="hover:bg-[#F8FAF9]">
                    <td className="p-3 font-bold text-[#14201F]">
                      {criteriaList.find((c) => c.code === code)?.label}
                    </td>
                    <td className={`p-3 font-mono ${scMinus && !scMinus.isFullOrderPreserved ? "bg-[#FFF1D6] font-bold text-[#7A4300]" : "text-[#14201F]"}`}>
                      {scMinus?.rankingOrder ?? "-"}
                    </td>
                    <td className={`p-3 font-mono ${scPlus && !scPlus.isFullOrderPreserved ? "bg-[#FFF1D6] font-bold text-[#7A4300]" : "text-[#14201F]"}`}>
                      {scPlus?.rankingOrder ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#55625F] italic pt-1">
          Sel berwarna oranye menandakan urutan penuh berbeda dari urutan awal. Sel putih berarti urutan sama persis.
        </p>
      </div>
    </div>
  );
}
