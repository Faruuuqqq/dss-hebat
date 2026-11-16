"use client";

import React from "react";
import { useDSS } from "../../lib/store";

export default function HasilPage() {
  const {
    dataset,
    result,
    plafonPerFase,
    setPlafonPerFase,
    c9MinFase1,
    setC9MinFase1,
  } = useDSS();

  const plafonJt = plafonPerFase / 1_000_000;

  // CSV download function
  const handleDownloadCSV = () => {
    const headers = [
      "Peringkat",
      "ID",
      "Nama_Segmen",
      "Desa",
      "D_Plus",
      "D_Minus",
      "Closeness_CC",
      "C9",
      "Biaya_Rp",
      "CC_per_Juta_Rp",
      "Fase",
      "Keterangan",
    ];

    const rows = result.topsis.sortedIndices.map((origIdx, rankIdx) => {
      const alt = dataset.alternatives[origIdx];
      const rank = rankIdx + 1;
      const dp = result.topsis.Dp[origIdx] ?? 0;
      const dm = result.topsis.Dm[origIdx] ?? 0;
      const cc = result.topsis.CC[origIdx] ?? 0;
      const val = dataset.values[alt.id] ?? { kriteria: {}, c9: 3, biaya_rp: 0 };
      const alloc = result.allocation.items.find((i) => i.alternatif_id === alt.id);
      const ccPerJuta = alloc?.cc_per_juta_rp ?? 0;

      return [
        rank,
        alt.id,
        `"${alt.nama_segmen}"`,
        `"${alt.desa}"`,
        dp.toFixed(4),
        dm.toFixed(4),
        cc.toFixed(6),
        val.c9,
        val.biaya_rp,
        ccPerJuta.toFixed(4),
        alloc?.fase ?? "Tidak Dialokasikan",
        `"${alloc?.keterangan ?? ""}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hasil_DSS_CCTV_Jatinangor_${dataset.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Warning for alternatives deferred due to low C9
  const lowC9Item = result.allocation.items.find((i) => i.skor_c9 < c9MinFase1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#14201F] tracking-tight">
            Hasil TOPSIS & Alokasi Anggaran
          </h1>
          <p className="text-sm text-[#55625F] mt-0.5">
            Urgensi diperingkat dulu, lalu kelayakan C9 dan plafon anggaran membagi pemasangan ke dalam fase.
          </p>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 text-xs font-semibold text-[#14201F] bg-white hover:bg-[#F3F5F4] border border-[#DDE3E1] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          Unduh hasil (CSV)
        </button>
      </div>

      {/* Main Table: TOPSIS Rankings and Distances */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
        <h2 className="font-bold text-base text-[#14201F]">
          Peringkat urgensi dan jarak ke solusi ideal
        </h2>

        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Tabel Hasil TOPSIS">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#EEF2F1] text-[#3D4A47] font-semibold border-b border-[#DDE3E1]">
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">Segmen</th>
                <th className="p-3 text-right">D⁺</th>
                <th className="p-3 text-right">D⁻</th>
                <th className="p-3 w-48">Closeness (CC)</th>
                <th className="p-3 text-center">C9</th>
                <th className="p-3 text-right">Biaya (Rp Jt)</th>
                <th className="p-3 text-right">CC per Rp jt</th>
                <th className="p-3 text-center">Fase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F1]">
              {result.topsis.sortedIndices.map((origIdx, rankIdx) => {
                const alt = dataset.alternatives[origIdx];
                const rank = rankIdx + 1;
                const dp = result.topsis.Dp[origIdx] ?? 0;
                const dm = result.topsis.Dm[origIdx] ?? 0;
                const cc = result.topsis.CC[origIdx] ?? 0;
                const val = dataset.values[alt.id] ?? { kriteria: {}, c9: 3, biaya_rp: 0 };
                const alloc = result.allocation.items.find((i) => i.alternatif_id === alt.id);
                const isC9Low = val.c9 < c9MinFase1;

                return (
                  <tr key={alt.id} className="hover:bg-[#F8FAF9]">
                    <td className="p-3 text-center">
                      <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${getRankBadgeClass(rank)}`}>
                        {rank}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#14201F]">
                      <span className="font-bold">{alt.id}</span> {alt.nama_segmen}
                    </td>
                    <td className="p-3 text-right font-mono text-[#55625F]">{dp.toFixed(4).replace(".", ",")}</td>
                    <td className="p-3 text-right font-mono text-[#55625F]">{dm.toFixed(4).replace(".", ",")}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#EEF2F1] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getRankBarClass(rank)}`}
                            style={{ width: `${Math.round(cc * 100)}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[#14201F] w-12 text-right">
                          {cc.toFixed(4).replace(".", ",")}
                        </span>
                      </div>
                    </td>
                    <td className={`p-3 text-center font-bold ${isC9Low ? "text-[#A8231A]" : "text-[#14201F]"}`}>
                      {val.c9}
                    </td>
                    <td className="p-3 text-right font-mono">{(val.biaya_rp / 1e6).toFixed(1).replace(".", ",")}</td>
                    <td className="p-3 text-right font-mono text-[#55625F]">
                      {(alloc?.cc_per_juta_rp ?? 0).toFixed(4).replace(".", ",")}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          alloc?.fase === 1
                            ? "bg-[#FBE4E1] text-[#A8231A]"
                            : alloc?.fase === 2
                            ? "bg-[#FFF1D6] text-[#8A6A00]"
                            : alloc?.fase === 3
                            ? "bg-[#E3ECEF] text-[#2F6F8F]"
                            : "bg-[#EEF2F1] text-[#55625F]"
                        }`}
                      >
                        {alloc?.fase ? `Fase ${alloc.fase}` : "Tidak Dialokasikan"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#55625F] italic pt-1">
          CC mendekati 1 berarti segmen makin dekat ke solusi ideal (paling mendesak). Skor C9 rendah ditandai merah karena butuh survei tiang, listrik, dan jaringan sebelum dipasang.
        </p>
      </div>

      {/* Bottom Grid: Phased Allocation & Budget Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Phased Allocation Cards */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
          <h2 className="font-bold text-base text-[#14201F]">
            Alokasi bertahap (plafon Rp{plafonJt.toFixed(1).replace(".", ",")} jt per fase)
          </h2>

          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="p-4 rounded-xl border border-[#F5C2BC] bg-[#FDF5F4] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#A8231A]">FASE 1 · SEGERA</span>
                <span className="text-[#55625F]">
                  Rp{((result.allocation.subtotals[1] ?? 0) / 1e6).toFixed(1).replace(".", ",")} jt dari Rp{plafonJt.toFixed(1).replace(".", ",")} jt
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#A8231A] h-full rounded-full"
                  style={{ width: `${Math.min(100, (((result.allocation.subtotals[1] ?? 0) / plafonPerFase) * 100))}%` }}
                />
              </div>
              <p className="text-xs text-[#14201F] font-medium pt-1">
                {result.allocation.items
                  .filter((i) => i.fase === 1)
                  .map((i) => `${i.alternatif_id} ${i.nama_segmen} · Rp${(i.biaya_rp / 1e6).toFixed(1)} jt`)
                  .join("   ")}
              </p>
            </div>

            {/* Phase 2 */}
            <div className="p-4 rounded-xl border border-[#F5DEB3] bg-[#FFFBF0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#8A6A00]">FASE 2</span>
                <span className="text-[#55625F]">
                  Rp{((result.allocation.subtotals[2] ?? 0) / 1e6).toFixed(1).replace(".", ",")} jt dari Rp{plafonJt.toFixed(1).replace(".", ",")} jt
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#B45309] h-full rounded-full"
                  style={{ width: `${Math.min(100, (((result.allocation.subtotals[2] ?? 0) / plafonPerFase) * 100))}%` }}
                />
              </div>
              <p className="text-xs text-[#14201F] font-medium pt-1">
                {result.allocation.items
                  .filter((i) => i.fase === 2)
                  .map((i) => `${i.alternatif_id} ${i.nama_segmen} · Rp${(i.biaya_rp / 1e6).toFixed(1)} jt`)
                  .join("   ")}
              </p>
            </div>

            {/* Phase 3 */}
            <div className="p-4 rounded-xl border border-[#C5D7DC] bg-[#F5F8F9] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#2F6F8F]">FASE 3</span>
                <span className="text-[#55625F]">
                  Rp{((result.allocation.subtotals[3] ?? 0) / 1e6).toFixed(1).replace(".", ",")} jt dari Rp{plafonJt.toFixed(1).replace(".", ",")} jt
                </span>
              </div>
              <div className="w-full bg-[#E5E9E8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2F6F8F] h-full rounded-full"
                  style={{ width: `${Math.min(100, (((result.allocation.subtotals[3] ?? 0) / plafonPerFase) * 100))}%` }}
                />
              </div>
              <p className="text-xs text-[#14201F] font-medium pt-1">
                {result.allocation.items
                  .filter((i) => i.fase === 3)
                  .map((i) => `${i.alternatif_id} ${i.nama_segmen} · Rp${(i.biaya_rp / 1e6).toFixed(1)} jt`)
                  .join("   ")}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Budget Settings */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
          <h2 className="font-bold text-base text-[#14201F]">Atur anggaran</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="plafon-input" className="text-xs font-medium text-[#55625F] block mb-1">
                Plafon per fase (Rp)
              </label>
              <input
                id="plafon-input"
                type="number"
                step="500000"
                value={plafonPerFase}
                onChange={(e) => setPlafonPerFase(Number(e.target.value))}
                aria-label="Plafon per fase dalam Rupiah"
                className="w-full p-2.5 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            <div>
              <label htmlFor="c9min-input" className="text-xs font-medium text-[#55625F] block mb-1">
                Skor C9 minimum untuk Fase 1
              </label>
              <input
                id="c9min-input"
                type="number"
                step="1"
                min="1"
                max="5"
                value={c9MinFase1}
                onChange={(e) => setC9MinFase1(Number(e.target.value))}
                aria-label="Skor C9 minimum untuk Fase 1"
                className="w-full p-2.5 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
              />
            </div>

            {/* Warning Callout */}
            {lowC9Item && (
              <div className="p-3.5 bg-[#FFF1D6] text-[#7A4300] rounded-xl border border-[#F5DEB3] text-xs space-y-1">
                <p className="font-bold">
                  Perhatian: {lowC9Item.alternatif_id} peringkat {lowC9Item.ranking}, tetapi C9 = {lowC9Item.skor_c9}
                </p>
                <p className="text-[11px] leading-relaxed">
                  Pastikan tiang, listrik, dan sinyal tersedia sebelum menjadwalkan Fase 2.
                </p>
              </div>
            )}

            <button
              onClick={() => {}}
              className="w-full py-2.5 px-4 bg-[#0E6B66] hover:bg-[#0B5652] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Hitung ulang alokasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
