"use client";

import Link from "next/link";
import { useState } from "react";
import { fmt, formatPhase, pct } from "../lib/format";
import { useDSS } from "../lib/store";

export function SegmentDecision() {
  const { dataset, result, selectedAltId, c9MinFase1 } = useDSS();
  const [compareId, setCompareId] = useState("");
  const { alternatives, values } = dataset;
  const { topsis, topsisCriterionCodes } = result;
  const selected = alternatives.find((alt) => alt.id === selectedAltId) ?? alternatives[0];
  const peers = topsis.sortedIndices.map((index) => alternatives[index]).filter((alt) => alt.id !== selected.id);
  const peer = peers.find((alt) => alt.id === compareId) ?? peers[0];
  const selectedIndex = alternatives.indexOf(selected);
  const peerIndex = peer ? alternatives.indexOf(peer) : -1;
  const allocation = result.allocation.items.find((item) => item.alternatif_id === selected.id);
  const criteria = new Map(dataset.criteria.map((criterion) => [criterion.kode, criterion]));
  const strongestDifference = peer
    ? topsisCriterionCodes.map((code, index) => ({
        code,
        difference: topsis.V[selectedIndex][index] - topsis.V[peerIndex][index],
      })).reduce(
        (largest, current) => Math.abs(current.difference) > Math.abs(largest.difference) ? current : largest,
        { code: "", difference: 0 },
      )
    : null;

  return (
    <section
      id="alasan-prioritas"
      tabIndex={-1}
      aria-labelledby="alasan-prioritas-title"
      className="scroll-mt-20 space-y-4 rounded-2xl border border-[#DDE3E1] bg-white p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="alasan-prioritas-title" className="font-bold">Mengapa titik ini diprioritaskan?</h2>
          <p className="mt-1 text-sm text-[#55625F]">{selected.id} · {selected.nama_segmen}</p>
        </div>
        {peer && (
          <div>
            <label htmlFor="segment-comparison" className="mb-1 block text-xs font-medium">Bandingkan dengan</label>
            <select
              id="segment-comparison"
              value={peer.id}
              onChange={(event) => setCompareId(event.target.value)}
              className="max-w-full rounded-lg border border-[#DDE3E1] bg-white p-2 text-sm"
            >
              {peers.map((alt) => <option key={alt.id} value={alt.id}>{alt.id} · {alt.nama_segmen}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#EEF2F1] p-3 text-sm">
          <p className="font-semibold">
            Peringkat {topsis.rankings[selectedIndex]} · CC {fmt(topsis.CC[selectedIndex])}
            {peer && " · " + peer.id + " peringkat " + topsis.rankings[peerIndex] + " (CC " + fmt(topsis.CC[peerIndex]) + ")"}
          </p>
          <p className="mt-1 text-xs text-[#55625F]">
            D⁺ {fmt(topsis.Dp[selectedIndex])} ke solusi ideal dan D⁻ {fmt(topsis.Dm[selectedIndex])} ke solusi terendah.
            CC dihitung dari kedua jarak itu.
          </p>
        </div>
        {allocation && (
          <div className="rounded-xl bg-[#EEF2F1] p-3 text-sm">
            <p className="font-semibold">
              {formatPhase(allocation.fase)} · C9 {allocation.skor_c9}/5 · Rp{fmt(allocation.biaya_rp, 0)}
            </p>
            <p className="mt-1 text-xs text-[#55625F]">
              {allocation.warning ?? "Biaya muat dalam sisa plafon fase ini saat segmen diproses menurut urutan urgensi."}
              {" "}Ambang C9 {c9MinFase1}/5 berlaku untuk {dataset.id === "naskah_uts" ? "semua fase" : "Fase 1"}.
            </p>
          </div>
        )}
      </div>

      {strongestDifference && strongestDifference.difference !== 0 && (
        <p className="text-sm text-[#3D4A47]">
          Selisih nilai terbobot terbesar ada pada {strongestDifference.code} {criteria.get(strongestDifference.code)?.nama}.
          Nilainya lebih tinggi pada {strongestDifference.difference > 0 ? selected.id : peer.id}.
        </p>
      )}
      <div tabIndex={0} role="region" aria-label="Perbandingan nilai kriteria" className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-xs tabular-nums">
          <thead className="bg-[#EEF2F1]">
            <tr>
              <th scope="col" className="p-2 text-left">Kriteria</th>
              <th scope="col" className="p-2">Bobot AHP</th>
              <th scope="col" className="p-2">{selected.id}</th>
              {peer && <th scope="col" className="p-2">{peer.id}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F1]">
            {topsisCriterionCodes.map((code) => {
              const criterion = criteria.get(code);
              const raw = values[selected.id]?.kriteria[code];
              const other = peer && values[peer.id]?.kriteria[code];
              return (
                <tr key={code}>
                  <th scope="row" className="p-2 text-left font-medium">
                    {code} · {criterion?.nama}
                    {criterion?.satuan && <span className="block text-[#55625F]">{criterion.satuan}</span>}
                  </th>
                  <td className="p-2">{pct(result.ahp.weights[code] ?? 0, 1)}</td>
                  <td className="p-2">{raw ?? "—"}</td>
                  {peer && <td className="p-2">{other ?? "—"}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#55625F]">
        Nilai per segmen belum tervalidasi lapangan.{" "}
        <Link href="/kriteria#bukti-segmen" className="font-semibold text-[#0E6B66] underline">Lihat sumber dan checklist survei</Link>
      </p>
    </section>
  );
}
