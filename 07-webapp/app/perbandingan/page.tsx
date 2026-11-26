"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { NumberCell } from "../../components/NumberCell";
import { solveDataset, type AllocationItem, type PhaseAllocationResult } from "../../lib/engine/index";
import { fmt, formatPhase, presetLabel } from "../../lib/format";
import { useDSS } from "../../lib/store";

function ComparisonTotals({ title, allocation }: { title: string; allocation: PhaseAllocationResult }) {
  return (
    <section className="space-y-1 rounded-xl border border-[#DDE3E1] bg-white p-4">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-[#3D4A47]">Plafon Rp{fmt(allocation.plafonPerFase, 0)} per fase</p>
      <p className="text-sm text-[#3D4A47]">
        {Object.keys(allocation.subtotals).length} fase · {allocation.items.length - allocation.excludedCount} segmen dialokasikan
      </p>
    </section>
  );
}

function ComparisonCell({ item }: { item?: AllocationItem }) {
  if (!item) return <span className="text-[#55625F]">Segmen tidak ada</span>;
  return (
    <>
      <span className="block tabular-nums">#{item.ranking} · CC {fmt(item.cc)}</span>
      <span className="block font-medium">{formatPhase(item.fase)}</span>
      <span className="block text-[#55625F]">Rp{fmt(item.biaya_rp, 0)}</span>
      {item.warning && <span className="mt-1 block text-xs text-[#7A4300]">{item.warning}</span>}
    </>
  );
}

export default function ComparisonPage() {
  const { baselineDataset, dataset, result, scenario, plafonPerFase } = useDSS();
  const [testBudget, setTestBudget] = useState<{ preset: string; rupiah: number }>();
  const budget = testBudget?.preset === dataset.id ? testBudget.rupiah : plafonPerFase;
  const baseline = useMemo(() => solveDataset(baselineDataset), [baselineDataset]);
  const simulation = useMemo(() => budget === plafonPerFase ? result : solveDataset({
    ...dataset,
    overrides: { ...dataset.overrides, plafonPerFase: budget },
  }), [budget, dataset, plafonPerFase, result]);
  const baselineItems = new Map(baseline.allocation.items.map((item) => [item.alternatif_id, item]));
  const simulationItems = new Map(simulation.allocation.items.map((item) => [item.alternatif_id, item]));
  const ids = new Set([...simulationItems.keys(), ...baselineItems.keys()]);
  const baselineLocations = new Map(baselineDataset.alternatives.map((alt) => [alt.id, alt]));
  const changedLocations = new Set(dataset.alternatives.filter((alt) => {
    const reference = baselineLocations.get(alt.id);
    return reference && (reference.lat !== alt.lat || reference.lng !== alt.lng);
  }).map((alt) => alt.id));
  const commonItems = simulation.allocation.items.filter((item) =>
    baselineItems.has(item.alternatif_id) && !changedLocations.has(item.alternatif_id),
  );
  const sameSegments = commonItems.length === ids.size;
  const sameRanks = sameSegments && commonItems.every((item) => baselineItems.get(item.alternatif_id)?.ranking === item.ranking);
  const changedPhases = commonItems.filter((item) => baselineItems.get(item.alternatif_id)?.fase !== item.fase).length;
  const baselineName = presetLabel(baselineDataset.id);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Bandingkan Skenario</h1>
        <p className="mt-1 text-sm text-[#55625F]">Bandingkan preset {baselineName} dengan nilai aktif dan coba plafon berbeda.</p>
      </div>
      <section className="space-y-3 rounded-xl border border-[#DDE3E1] bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="comparison-budget" className="mb-1 block text-sm font-medium">Plafon simulasi per fase (Rp)</label>
            <NumberCell id="comparison-budget" label="Plafon simulasi per fase (Rp)" min={0} max={Number.MAX_SAFE_INTEGER}
              value={budget} onCommit={(value) => setTestBudget({ preset: dataset.id, rupiah: Math.round(value) })} />
          </div>
          {budget !== plafonPerFase && (
            <button type="button" className="rounded-lg border border-[#DDE3E1] px-3 py-2 text-sm"
              onClick={() => setTestBudget(undefined)}>
              Pakai plafon aktif
            </button>
          )}
        </div>
        <p className="text-xs text-[#55625F]">Pengaturan ini hanya dipakai di halaman perbandingan.</p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        <ComparisonTotals title={"Acuan · " + baselineName} allocation={baseline.allocation} />
        <ComparisonTotals title={scenario ? "Simulasi · Skenario Saya" : "Simulasi · Data aktif"} allocation={simulation.allocation} />
      </div>
      <section aria-labelledby="comparison-results" className="space-y-3 rounded-xl border border-[#DDE3E1] bg-white p-4 sm:p-5">
        <h2 id="comparison-results" className="font-bold">Perubahan peringkat dan fase</h2>
        <p className="text-sm text-[#3D4A47]">
          {sameRanks ? "Urutan peringkat tetap." : sameSegments ? "Urutan peringkat berubah."
            : "Daftar segmen berbeda. TOPSIS menormalisasi masing-masing daftar secara terpisah."}
          {" "}{changedPhases} segmen mengalami perubahan alokasi di antara segmen yang ada di kedua daftar.
        </p>
        <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
          <thead className="bg-[#EEF2F1]">
            <tr>
              <th scope="col" className="w-[34%] p-2">Segmen</th>
              <th scope="col" className="p-2">Acuan</th>
              <th scope="col" className="p-2">Simulasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F1]">
            {[...ids].map((id) => {
              const before = baselineItems.get(id);
              const after = simulationItems.get(id);
              return (
                <tr key={id} className="align-top">
                  <th scope="row" className="break-words p-2 font-semibold">
                    {id} · {after?.nama_segmen ?? before?.nama_segmen}
                    {before && after && before.nama_segmen !== after.nama_segmen && (
                      <span className="block font-normal text-[#55625F]">Acuan · {before.nama_segmen}</span>
                    )}
                    {changedLocations.has(id) && (
                      <span className="block font-normal text-[#55625F]">Lokasi berbeda dari acuan</span>
                    )}
                  </th>
                  <td className="break-words p-2"><ComparisonCell item={before} /></td>
                  <td className="break-words p-2"><ComparisonCell item={after} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <Link href="/hasil" className="inline-block text-sm font-semibold text-[#0E6B66] underline">
        Kembali ke Hasil &amp; Anggaran
      </Link>
    </div>
  );
}
