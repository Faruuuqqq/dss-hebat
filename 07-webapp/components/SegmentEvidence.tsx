import type { Alternative, AlternativeValue, Criterion } from "../lib/engine/index";
import { fmt, presetLabel } from "../lib/format";
import { KRITERIA_URGENSI } from "../lib/scenario";

const surveyTasks = [
  "GPS segmen dan inventaris kamera sekitar",
  "Penghitungan mobilitas malam (C2)",
  "Observasi penerangan jalan (C3)",
  "Pemetaan fasilitas rentan (C8)",
  "Ketersediaan tiang, listrik, jaringan, dan penawaran biaya (C9/RAB)",
];

const inputDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
});

function fieldValue(value: AlternativeValue | undefined, code: string) {
  if (code === "RAB") return value?.biaya_rp;
  if (code === "C9") return value?.c9;
  return value?.kriteria[code];
}

export function SegmentEvidence({
  segment, value, baseline, criteria, preset,
}: {
  segment: Alternative;
  value?: AlternativeValue;
  baseline?: AlternativeValue;
  criteria: Criterion[];
  preset: string;
}) {
  const columns = new Map(criteria.map((criterion) => [criterion.kode, criterion]));
  return (
    <section id="bukti-segmen" tabIndex={-1} aria-labelledby="bukti-segmen-title"
      className="scroll-mt-20 space-y-4 rounded-2xl border border-[#DDE3E1] bg-white p-4 sm:p-6 lg:col-span-5">
      <div>
        <h2 id="bukti-segmen-title" className="font-bold">Sumber data &amp; status</h2>
        <p className="mt-1 text-sm text-[#55625F]">{segment.id} · {segment.nama_segmen}</p>
      </div>
      <ul className="divide-y divide-[#EEF2F1] text-xs">
        {[...KRITERIA_URGENSI, "C9", "RAB"].map((code) => {
          const criterion = columns.get(code);
          const current = fieldValue(value, code);
          const recorded = value?.inputEvidence?.[code];
          const recordedInput = recorded?.method === "manual" || recorded?.method === "csv" ? recorded : undefined;
          const changed = Boolean(recordedInput) || current !== fieldValue(baseline, code);
          const source = recorded?.method === "csv" ? "Impor CSV" : recorded?.method === "manual"
            ? "Input manual" : changed ? "Skenario tersimpan" : "Dataset " + presetLabel(preset);
          const dateTime = typeof recordedInput?.recordedAt === "string" ? recordedInput.recordedAt : "";
          const date = Date.parse(dateTime);
          return (
            <li key={code} className="space-y-1 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{code} · {criterion?.nama ?? "Estimasi biaya"}</p>
                <p className="shrink-0 font-semibold tabular-nums">{current === undefined ? "—" : code === "RAB"
                  ? "Rp" + fmt(current, 0) : String(current)}</p>
              </div>
              <p className="text-[#3D4A47]">
                {current === undefined ? "Belum ada nilai" : changed ? "Input [SIMULASI] · Belum terverifikasi" : "Estimasi [SIMULASI]"} · {source}
              </p>
              {!changed && criterion?.sumber_data && <p className="text-[#55625F]">Rujukan pengumpulan · {criterion.sumber_data}</p>}
              {Number.isFinite(date)
                ? <p className="text-[#55625F]">Tanggal input · <time dateTime={dateTime}>{inputDate.format(date)} WIB</time></p>
                : <p className="text-[#55625F]">{changed ? "Tanggal input belum tercatat" : "Tanggal pengukuran belum tercatat"}</p>}
            </li>
          );
        })}
      </ul>
      <div className="space-y-2 border-t border-[#DDE3E1] pt-3">
        <h3 className="text-sm font-semibold">Checklist survei {segment.id}</h3>
        <p className="text-xs text-[#55625F]">Pengukuran lapangan belum tercatat untuk item berikut.</p>
        <ul className="list-disc space-y-1 pl-4 text-xs text-[#3D4A47]">
          {surveyTasks.map((task) => <li key={task}>{task}</li>)}
        </ul>
      </div>
    </section>
  );
}
