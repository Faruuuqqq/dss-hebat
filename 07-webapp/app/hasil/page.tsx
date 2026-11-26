"use client";

import React from "react";
import Link from "next/link";
import { AllocationSummary } from "../../components/AllocationSummary";
import { DecisionReport } from "../../components/DecisionReport";
import { SegmentDecision } from "../../components/SegmentDecision";
import { fmt, formatPhase, presetLabel } from "../../lib/format";
import { NumberCell } from "../../components/NumberCell";
import { useDSS } from "../../lib/store";

export default function HasilPage() {
  const {
    dataset,
    result,
    plafonPerFase,
    setPlafonPerFase,
    c9MinFase1,
    setC9MinFase1,
    setSelectedAltId,
    scenario,
  } = useDSS();

  const c9Label = dataset.id === "naskah_uts" ? "Skor C9 minimum untuk alokasi" : "Skor C9 minimum untuk Fase 1";

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

  return (
    <div className="decision-page space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#14201F] tracking-tight">
            Hasil TOPSIS & Alokasi Anggaran
          </h1>
          <p className="text-xs sm:text-sm text-[#55625F] mt-0.5">
            {scenario && "Skenario Saya · "}{presetLabel(dataset.id)}. Urgensi menentukan peringkat, lalu C9 dan biaya menentukan fase.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/perbandingan" className="px-3 py-2 text-xs font-semibold text-[#0E6B66] underline">
            Bandingkan skenario
          </Link>
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="rounded-lg border border-[#DDE3E1] bg-white px-3 py-2 text-xs font-semibold hover:bg-[#EEF2F1]"
          >
            Unduh hasil (CSV)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-[#0E6B66] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0B5652]"
          >
            Cetak / simpan PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
        <section className="space-y-4 rounded-2xl border border-[#DDE3E1] bg-white p-5 lg:col-start-2 lg:row-start-1">
          <h2 className="font-bold text-[#14201F]">Atur anggaran</h2>
          <p className="text-xs text-[#55625F]">Alokasi dihitung ulang saat nilai berubah.</p>
          <div>
            <label htmlFor="plafon-input" className="mb-1 block text-xs font-medium text-[#55625F]">
              Plafon per fase (Rp)
            </label>
            <NumberCell
              id="plafon-input"
              label="Plafon per fase dalam Rupiah"
              min={0}
              max={Number.MAX_SAFE_INTEGER}
              value={plafonPerFase}
              onCommit={(value) => setPlafonPerFase(Math.round(value))}
            />
          </div>
          <div>
            <label htmlFor="c9min-input" className="mb-1 block text-xs font-medium text-[#55625F]">
              {c9Label}
            </label>
            <NumberCell
              id="c9min-input"
              label={c9Label}
              min={1}
              max={5}
              value={c9MinFase1}
              onCommit={(value) => setC9MinFase1(Math.round(value))}
            />
          </div>
        </section>
        <div className="lg:col-start-1 lg:row-start-1">
          <AllocationSummary allocation={result.allocation} title="Alokasi bertahap" />
        </div>
      </div>

      {/* Main Table: TOPSIS Rankings and Distances */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#DDE3E1] shadow-xs space-y-4">
        <h2 className="font-bold text-sm sm:text-base text-[#14201F]">
          Peringkat urgensi dan jarak ke solusi ideal
        </h2>

        <ol aria-label="Ringkasan peringkat TOPSIS" className="divide-y divide-[#DDE3E1] md:hidden">
          {result.allocation.items.map((item) => {
            const index = dataset.alternatives.findIndex((alt) => alt.id === item.alternatif_id);
            return (
              <li key={item.alternatif_id} className="space-y-2 py-3 first:pt-0">
                <a href="#alasan-prioritas" aria-label={"Jelaskan " + item.alternatif_id}
                  onClick={() => setSelectedAltId(item.alternatif_id)} className="inline-block text-sm font-semibold text-[#0E6B66] underline">
                  {item.ranking}. {item.alternatif_id} · {item.nama_segmen}
                </a>
                <p className="text-sm text-[#3D4A47]">CC {fmt(item.cc)} · {formatPhase(item.fase)} · Rp{fmt(item.biaya_rp / 1e6, 1)} jt</p>
                <details className="text-xs text-[#55625F]">
                  <summary className="w-fit cursor-pointer py-1 font-medium">Rincian perhitungan</summary>
                  <p className="mt-1">D⁺ {fmt(result.topsis.Dp[index])} · D⁻ {fmt(result.topsis.Dm[index])} · C9 {item.skor_c9}/5</p>
                </details>
              </li>
            );
          })}
        </ol>

        <div className="hidden overflow-x-auto md:block" tabIndex={0} role="region" aria-label="Tabel Hasil TOPSIS">
          <table className="w-full min-w-[700px] text-xs text-left border-collapse">
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
                      <a href="#alasan-prioritas" aria-label={"Jelaskan " + alt.id}
                        onClick={() => setSelectedAltId(alt.id)} className="text-[#0E6B66] underline">
                        {alt.id} {alt.nama_segmen}
                      </a>
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

      <SegmentDecision />
      <DecisionReport
        allocation={result.allocation}
        preset={dataset.id}
        scenario={Boolean(scenario)}
        c9Minimum={c9MinFase1}
      />
    </div>
  );
}
