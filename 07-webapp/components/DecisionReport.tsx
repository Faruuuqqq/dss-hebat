import type { PhaseAllocationResult } from "../lib/engine/index";
import { fmt, formatPhase, presetLabel } from "../lib/format";

export function DecisionReport({
  allocation, preset, scenario, c9Minimum,
}: {
  allocation: PhaseAllocationResult;
  preset: string;
  scenario: boolean;
  c9Minimum: number;
}) {
  const phases = Object.entries(allocation.subtotals).sort(([a], [b]) => Number(a) - Number(b));
  const warnings = allocation.items.filter((item) => item.warning || item.fase === null);

  return (
    <article className="decision-report">
      <p className="report-kicker">SiPrioCCTV · Jatinangor</p>
      <h1>Ringkasan keputusan CCTV</h1>
      <p>{scenario ? "Skenario Saya · Dasar preset " : "Data aktif · Preset "}{presetLabel(preset)}</p>
      <p>Plafon Rp{fmt(allocation.plafonPerFase, 0)} per fase · Ambang C9 {c9Minimum}/5 untuk {preset === "naskah_uts" ? "semua fase" : "Fase 1"}</p>

      <h2>Peringkat dan alokasi</h2>
      <table>
        <thead><tr>
          <th scope="col">Peringkat</th><th scope="col">Segmen</th><th scope="col">CC TOPSIS</th>
          <th scope="col">Fase</th><th scope="col">Biaya (Rp)</th>
        </tr></thead>
        <tbody>
          {allocation.items.map((item) => (
            <tr key={item.alternatif_id}>
              <td>{item.ranking}</td>
              <th scope="row">{item.alternatif_id} · {item.nama_segmen}</th>
              <td>{fmt(item.cc)}</td>
              <td>{formatPhase(item.fase)}</td>
              <td>{fmt(item.biaya_rp, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Subtotal per fase</h2>
      {phases.length > 0 ? (
        <ul>
          {phases.map(([phase, subtotal]) => <li key={phase}>Fase {phase} · Rp{fmt(subtotal, 0)}</li>)}
        </ul>
      ) : <p>Belum ada alokasi pada plafon dan ambang saat ini.</p>}

      {warnings.length > 0 && (
        <>
          <h2>Catatan kelayakan dan biaya</h2>
          <ul>
            {warnings.map((item) => (
              <li key={item.alternatif_id}>
                <strong>{item.alternatif_id} · {formatPhase(item.fase)}.</strong> {item.warning ?? item.keterangan}
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="report-evidence">
        Status data [SIMULASI]. Nilai per segmen dan perubahan skenario belum tervalidasi lapangan.
        AHP membobotkan C1 sampai C8, TOPSIS menentukan urutan urgensi, dan C9 serta biaya menentukan alokasi.
      </p>
    </article>
  );
}
