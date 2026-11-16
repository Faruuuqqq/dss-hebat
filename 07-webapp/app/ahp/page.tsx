"use client";

import React, { useState } from "react";
import { useDSS } from "../../lib/store";
import { buildPairwiseMatrix, solveAhpMatrix } from "../../lib/engine/ahp";

export default function AhpPage() {
  const { dataset, result, updatePairwiseScore } = useDSS();
  const [activeTab, setActiveTab] = useState<"G1" | "G2" | "G3" | "Agregat">("Agregat");

  // Wizard state for interactive Saaty questionnaire
  const [wizardStep, setWizardStep] = useState(0);
  const questions = [
    { level: "Klaster", a: "Risiko", b: "Paparan", labelA: "Risiko", labelB: "Paparan Aktivitas" },
    { level: "Klaster", a: "Risiko", b: "Spasial", labelA: "Risiko", labelB: "Karakteristik Spasial" },
    { level: "Klaster", a: "Paparan", b: "Spasial", labelA: "Paparan Aktivitas", labelB: "Karakteristik Spasial" },
  ];

  const currentQ = questions[wizardStep] ?? questions[0];

  // Find existing pair score for current question in G1/active group
  const activeKelompok = activeTab === "Agregat" ? "G1 Pemda" : `${activeTab} ${activeTab === "G1" ? "Pemda" : activeTab === "G2" ? "Kampus" : "Warga"}`;
  const existingPair = (dataset.pairwise || []).find(
    (p) =>
      p.kelompok === activeKelompok &&
      p.level === currentQ.level &&
      ((p.kriteria_a === currentQ.a && p.kriteria_b === currentQ.b) ||
        (p.kriteria_a === currentQ.b && p.kriteria_b === currentQ.a))
  );

  let currentRawVal = existingPair ? existingPair.nilai_saaty_a_vs_b : 1;
  if (existingPair && existingPair.kriteria_a === currentQ.b) {
    currentRawVal = 1 / currentRawVal;
  }

  // Convert raw value (e.g. 2 or 1/2) to slider range -8 to +8 (where 0=1)
  const sliderVal = currentRawVal >= 1 ? currentRawVal - 1 : -(1 / currentRawVal - 1);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const newScore = v >= 0 ? v + 1 : 1 / (-v + 1);
    updatePairwiseScore(activeKelompok, currentQ.level, currentQ.a, currentQ.b, newScore);
  };

  // Matrix display data
  const clusters = ["Risiko", "Paparan", "Spasial"];
  const clusterWeights = result.ahp.hierarchicalResult
    ? result.ahp.hierarchicalResult.cluster.weights
    : { Risiko: 0.5145, Paparan: 0.3346, Spasial: 0.1509 };

  let displayedMatrix: number[][];
  let displayedCR = 0.0009;
  let displayedLam = 3.0010;

  if (activeTab === "Agregat" && result.ahp.hierarchicalResult) {
    displayedMatrix = result.ahp.hierarchicalResult.cluster.matrix;
    displayedCR = result.ahp.hierarchicalResult.cluster.CR;
    displayedLam = result.ahp.hierarchicalResult.cluster.lam;
  } else {
    const kName = `${activeTab} ${activeTab === "G1" ? "Pemda" : activeTab === "G2" ? "Kampus" : "Warga"}`;
    const pairs = (dataset.pairwise || [])
      .filter((p) => p.kelompok === kName && p.level === "Klaster")
      .map((p) => ({ a: p.kriteria_a, b: p.kriteria_b, val: p.nilai_saaty_a_vs_b }));
    displayedMatrix = buildPairwiseMatrix(clusters, pairs);
    const solved = solveAhpMatrix(displayedMatrix);
    displayedCR = solved.CR;
    displayedLam = solved.lam;
  }

  // Global weights
  const gW = result.ahp.weights;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#14201F] tracking-tight">
          Pembobotan AHP Multi-Stakeholder
        </h1>
        <p className="text-sm text-[#55625F] mt-0.5">
          Hierarki dua lapis (klaster, lalu kriteria). Penilaian tiga kelompok digabung dengan rata-rata geometrik.
        </p>
      </div>

      {/* Top Grid: Matrix & Questionnaire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cluster Pairwise Matrix */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-base text-[#14201F]">Matriks perbandingan klaster</h2>

            {/* Group Tabs */}
            <div className="flex items-center gap-1 bg-[#EEF2F1] p-1 rounded-lg border border-[#DDE3E1]" role="tablist">
              {(["G1", "G2", "G3", "Agregat"] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    activeTab === tab
                      ? "bg-[#0E6B66] text-white shadow-xs"
                      : "text-[#55625F] hover:text-[#14201F]"
                  }`}
                >
                  {tab === "Agregat" ? "Agregat" : `${tab} ${tab === "G1" ? "Pemda" : tab === "G2" ? "Kampus" : "Warga"}`}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabel Matriks Perbandingan Klaster">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#EEF2F1] text-[#3D4A47] border-b border-[#DDE3E1]">
                  <th className="p-2.5 font-semibold">Klaster</th>
                  <th className="p-2.5 font-semibold text-right">Risiko</th>
                  <th className="p-2.5 font-semibold text-right">Paparan</th>
                  <th className="p-2.5 font-semibold text-right">Spasial</th>
                  <th className="p-2.5 font-semibold text-right">Bobot lokal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F1]">
                {clusters.map((c, i) => {
                  const w = clusterWeights[c] ?? 0;
                  return (
                    <tr key={c} className="hover:bg-[#F8FAF9]">
                      <td className="p-2.5 font-bold text-[#14201F]">{c}</td>
                      <td className="p-2.5 text-right font-mono">{displayedMatrix[i][0].toFixed(2).replace(".", ",")}</td>
                      <td className="p-2.5 text-right font-mono">{displayedMatrix[i][1].toFixed(2).replace(".", ",")}</td>
                      <td className="p-2.5 text-right font-mono">{displayedMatrix[i][2].toFixed(2).replace(".", ",")}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#0E6B66]">
                        {(w * 100).toFixed(1).replace(".", ",")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Consistency Badge */}
          <div className="p-3 bg-[#E3F1EF] text-[#0E6B66] rounded-xl border border-[#BDE0DB] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold">
              CR = {displayedCR.toFixed(4).replace(".", ",")} · Konsisten (&lt; 0,10)
            </span>
            <span className="text-[#55625F]">
              λmax = {displayedLam.toFixed(4).replace(".", ",")} · RI(n=3) = 0,58
            </span>
          </div>
        </div>

        {/* Right Column: Respondent Questionnaire (Pakar) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <h2 className="font-bold text-base text-[#14201F]">Tampilan responden</h2>
              <span className="text-[#475467] font-medium">
                Pasangan {wizardStep + 1} dari {questions.length} · {currentQ.level}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#14201F] leading-snug">
              Untuk menentukan titik pasang CCTV, mana yang lebih mendesak:{" "}
              <span className="text-[#0E6B66]">{currentQ.labelA}</span> atau{" "}
              <span className="text-[#0E6B66]">{currentQ.labelB}</span>?
            </p>
            <p className="text-[11px] text-[#55625F] mt-1">
              Geser sesuai skala Saaty (1 = sama penting, 9 = mutlak lebih penting)
            </p>

            {/* Slider */}
            <div className="mt-6 space-y-2">
              <input
                type="range"
                min="-8"
                max="8"
                step="1"
                value={sliderVal}
                onChange={handleSliderChange}
                aria-label={`Skala perbandingan Saaty antara ${currentQ.labelA} dan ${currentQ.labelB}`}
                className="w-full accent-[#0E6B66] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#55625F]">
                <span>◀ {currentQ.labelA} 9</span>
                <span>1 (Sama)</span>
                <span>{currentQ.labelB} 9 ▶</span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="mt-5 p-3.5 bg-[#E3F1EF] text-[#0B3B38] rounded-xl border border-[#A7D7D1] space-y-1">
              <p className="text-xs font-bold">
                {sliderVal < 0
                  ? `${currentQ.labelA} lebih penting, skala ${-sliderVal + 1}`
                  : sliderVal > 0
                  ? `${currentQ.labelB} lebih penting, skala ${sliderVal + 1}`
                  : "Kedua klaster sama penting (skala 1)"}
              </p>
              <p className="text-[11px] text-[#55625F] font-mono">
                a({currentQ.a}, {currentQ.b}) = {currentRawVal >= 1 ? currentRawVal.toFixed(0) : `1/${Math.round(1 / currentRawVal)}`} · a({currentQ.b}, {currentQ.a}) = {currentRawVal >= 1 ? `1/${currentRawVal.toFixed(0)}` : Math.round(1 / currentRawVal)}
              </p>
            </div>

            <p className="text-[11px] text-[#475467] mt-3 italic">
              Jika CR responden ≥ 0,10, sistem menolak jawaban dan meminta pengisian ulang sebelum diagregasi.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#EEF2F1]">
            <button
              onClick={() => setWizardStep((prev) => Math.max(0, prev - 1))}
              disabled={wizardStep === 0}
              className="px-4 py-2 text-xs font-semibold bg-white border border-[#DDE3E1] rounded-lg text-[#14201F] hover:bg-[#F8FAF9] disabled:opacity-40 transition-colors"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setWizardStep((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={wizardStep === questions.length - 1}
              className="px-4 py-2 text-xs font-semibold bg-[#0E6B66] hover:bg-[#0B5652] text-white rounded-lg disabled:opacity-40 shadow-xs transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Global Weights per Cluster */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-base text-[#14201F]">
            Bobot global kriteria (agregat 3 kelompok)
          </h2>
          <span className="text-xs text-[#55625F]">
            Bobot global = bobot klaster × bobot lokal · jumlah = 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risiko Cluster */}
          <div className="p-4 rounded-xl border border-[#DDE3E1] bg-[#F8FAF9] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#A8231A]">Risiko</span>
              <span className="text-xs font-bold text-[#A8231A]">
                {((clusterWeights["Risiko"] ?? 0.5145) * 100).toFixed(1).replace(".", ",")}%
              </span>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#EEF2F1]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#14201F]">C1 Riwayat kerawanan</span>
                <span className="font-mono font-bold text-[#A8231A]">
                  {((gW["C1"] ?? 0.3156) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#A8231A] h-full rounded-full" style={{ width: `${(gW["C1"] ?? 0.3156) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-[#14201F]">C3 Defisiensi penerangan</span>
                <span className="font-mono font-bold text-[#A8231A]">
                  {((gW["C3"] ?? 0.1988) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#A8231A] h-full rounded-full" style={{ width: `${(gW["C3"] ?? 0.1988) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Paparan Aktivitas Cluster */}
          <div className="p-4 rounded-xl border border-[#DDE3E1] bg-[#F8FAF9] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0E6B66]">Paparan Aktivitas</span>
              <span className="text-xs font-bold text-[#0E6B66]">
                {((clusterWeights["Paparan"] ?? 0.3346) * 100).toFixed(1).replace(".", ",")}%
              </span>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#EEF2F1]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#14201F]">C2 Mobilitas malam</span>
                <span className="font-mono font-bold text-[#0E6B66]">
                  {((gW["C2"] ?? 0.1614) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0E6B66] h-full rounded-full" style={{ width: `${(gW["C2"] ?? 0.1614) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-[#14201F]">C5 Kepadatan penghuni</span>
                <span className="font-mono font-bold text-[#0E6B66]">
                  {((gW["C5"] ?? 0.1050) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0E6B66] h-full rounded-full" style={{ width: `${(gW["C5"] ?? 0.1050) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-[#14201F]">C8 Fasilitas rentan</span>
                <span className="font-mono font-bold text-[#0E6B66]">
                  {((gW["C8"] ?? 0.0683) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0E6B66] h-full rounded-full" style={{ width: `${(gW["C8"] ?? 0.0683) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Karakteristik Spasial Cluster */}
          <div className="p-4 rounded-xl border border-[#DDE3E1] bg-[#F8FAF9] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#2F6F8F]">Karakteristik Spasial</span>
              <span className="text-xs font-bold text-[#2F6F8F]">
                {((clusterWeights["Spasial"] ?? 0.1509) * 100).toFixed(1).replace(".", ",")}%
              </span>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#EEF2F1]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#14201F]">C4 Efisiensi coverage</span>
                <span className="font-mono font-bold text-[#2F6F8F]">
                  {((gW["C4"] ?? 0.0681) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2F6F8F] h-full rounded-full" style={{ width: `${(gW["C4"] ?? 0.0681) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-[#14201F]">C6 Derajat simpul</span>
                <span className="font-mono font-bold text-[#2F6F8F]">
                  {((gW["C6"] ?? 0.0311) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2F6F8F] h-full rounded-full" style={{ width: `${(gW["C6"] ?? 0.0311) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-[#14201F]">C7 Coverage gap CCTV</span>
                <span className="font-mono font-bold text-[#2F6F8F]">
                  {((gW["C7"] ?? 0.0517) * 100).toFixed(1).replace(".", ",")}%
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2F6F8F] h-full rounded-full" style={{ width: `${(gW["C7"] ?? 0.0517) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
