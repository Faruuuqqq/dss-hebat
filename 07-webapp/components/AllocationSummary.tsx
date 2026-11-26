import type { PhaseAllocationResult } from "../lib/engine/index";
import { fmt } from "../lib/format";

const phaseColors = [
  "border-[#F5C2BC] bg-[#FBE4E1] text-[#A8231A]",
  "border-[#F5DEB3] bg-[#FFF1D6] text-[#7A4300]",
  "border-[#CADCE3] bg-[#E3ECEF] text-[#2F6F8F]",
];

const phaseBars = ["bg-[#A8231A]", "bg-[#8A6A00]", "bg-[#2F6F8F]"];

function formatMillions(rupiah: number) {
  return "Rp" + fmt(rupiah / 1e6, 1) + " jt";
}

export function AllocationSummary({ allocation, title }: { allocation: PhaseAllocationResult; title: string }) {
  const { items, subtotals, remainingBudget, plafonPerFase } = allocation;
  const phases = Object.keys(subtotals).map(Number).sort((a, b) => a - b);
  const excluded = items.filter((item) => item.fase === null);

  return (
    <section className="space-y-4 rounded-2xl border border-[#DDE3E1] bg-white p-5 sm:p-6">
      <h2 className="font-bold text-[#14201F]">{title}</h2>
      <p className="text-xs text-[#55625F]">Plafon {formatMillions(plafonPerFase)} per fase.</p>
      {phases.length === 0 && <p className="text-sm">Belum ada segmen yang dapat dialokasikan.</p>}
      <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))]">
        {phases.map((phase) => {
          const tone = Math.min(phase - 1, phaseColors.length - 1);
          const spent = subtotals[phase];
          const usedPercent = plafonPerFase > 0 ? (spent / plafonPerFase) * 100 : 0;
          return (
            <div key={phase} className={"space-y-2 rounded-xl border p-4 " + phaseColors[tone]}>
              <h3 className="text-sm font-bold">Fase {phase}{phase === 1 && " · Segera"}</h3>
              <p className="text-xs font-semibold">
                {formatMillions(spent)} · Sisa {formatMillions(remainingBudget[phase])}
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-white" aria-hidden="true">
                <div className={"h-full rounded-full " + phaseBars[tone]} style={{ width: usedPercent + "%" }} />
              </div>
              <ul className="space-y-2 text-xs text-[#14201F]">
                {items.filter((item) => item.fase === phase).map((item) => (
                  <li key={item.alternatif_id}>
                    {item.alternatif_id} · {item.nama_segmen} · {formatMillions(item.biaya_rp)}
                    {item.warning && <p className="mt-1 text-[#7A4300]">{item.warning}</p>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {excluded.length > 0 && (
        <div className="space-y-2 rounded-xl border border-[#F5C2BC] bg-[#FBE4E1] p-4 text-[#14201F]">
          <h3 className="text-sm font-bold">Tidak dialokasikan</h3>
          <ul className="space-y-2 text-xs">
            {excluded.map((item) => (
              <li key={item.alternatif_id}>
                <strong>{item.alternatif_id} · {item.nama_segmen}</strong>
                <p>{item.warning ?? item.keterangan}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
