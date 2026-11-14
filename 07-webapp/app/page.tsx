"use client";

import { useMemo, useState } from "react";
import {
  A0,
  BUDGET,
  C9_MIN,
  CRITERIA,
  DATASETS,
  type Criterion,
  type Dataset,
  type DatasetKey,
  deepCopy,
  getDataset,
  evaluate,
  initialState,
} from "@/lib/engine";
import { buildCsv, download, fmt, pct } from "@/lib/format";
import { NumberCell } from "@/components/NumberCell";

/* ---------------------------- komponen kecil ---------------------------- */

function Panel({
  title,
  note,
  children,
  actions,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-md border border-line bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          {note ? <p className="mt-1 max-w-[70ch] text-[12.5px] leading-relaxed text-ink-soft">{note}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div className="w-full min-w-0 overflow-x-auto px-4 py-3">{children}</div>
    </section>
  );
}

function Badge({ tone, children }: { tone: "ok" | "bad" | "warn" | "neutral"; children: React.ReactNode }) {
  const cls =
    tone === "ok"
      ? "bg-ok-soft text-ok"
      : tone === "bad"
        ? "bg-bad-soft text-bad"
        : tone === "warn"
          ? "bg-warn-soft text-warn"
          : "bg-sunken text-ink-soft";
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${cls}`}>
      {children}
    </span>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-line px-2 py-2 text-[11px] font-semibold text-ink-soft ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={`border-b border-line/70 px-2 py-1.5 text-[13px] ${align === "right" ? "tnum text-right" : ""} ${className}`}
    >
      {children}
    </td>
  );
}

/* -------------------------------- halaman -------------------------------- */

export default function Page() {
  const [datasetKey, setDatasetKey] = useState<DatasetKey>("resmi");
  const [X, setX] = useState<number[][]>(() => deepCopy(DATASETS.resmi.X));
  const [C9, setC9] = useState<number[]>(() => DATASETS.resmi.C9.slice());
  const [COST, setCOST] = useState<number[]>(() => DATASETS.resmi.COST.slice());
  const [A, setA] = useState<number[][]>(() => deepCopy(A0));

  const dataset: Dataset = getDataset(datasetKey);

  const ev = useMemo(() => evaluate(String(datasetKey), X, C9, COST, A), [datasetKey, X, C9, COST, A]);

  const top = dataset.alts[ev.order[0]];
  const flips = ev.sensitivity.rows.filter((r) => r.reversals > 0);

  function loadDataset(key: DatasetKey) {
    const init = initialState(String(key));
    setDatasetKey(key);
    setX(init.X);
    setC9(init.C9);
    setCOST(init.COST);
    setA(init.A);
  }

  function reset() {
    loadDataset(datasetKey);
  }

  /** Tulis satu nilai matriks keputusan (C1–C8). */
  function setCell(i: number, j: number, v: number) {
    setX((prev) => prev.map((row, ri) => (ri === i ? row.map((c, cj) => (cj === j ? v : c)) : row)));
  }

  function setC9Cell(i: number, v: number) {
    setC9((prev) => prev.map((c, ri) => (ri === i ? v : c)));
  }

  function setCostCell(i: number, v: number) {
    setCOST((prev) => prev.map((c, ri) => (ri === i ? v : c)));
  }

  /** Ubah segitiga atas AHP; segitiga bawah otomatis resiprokal. */
  function setAhpCell(i: number, j: number, v: number) {
    setA((prev) =>
      prev.map((row, ri) =>
        row.map((c, cj) => {
          if (ri === i && cj === j) return v;
          if (ri === j && cj === i) return 1 / v;
          return c;
        }),
      ),
    );
  }

  function exportCsv() {
    const csv = buildCsv(
      dataset.label,
      dataset.alts.map((a) => a.code),
      dataset.alts.map((a) => a.name),
      ev.topsis.CC,
      ev.rank,
      COST,
      ev.allocation.phases,
      ev.feasible,
      C9,
      ev.ahp.w,
      CRITERIA.map((c) => c.code),
    );
    download(`dss-cctv-${datasetKey}.csv`, csv);
  }

  const sensLabel = (j: number, d: number) => `${CRITERIA[j].code} ${d > 0 ? "+20%" : "−20%"}`;

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Kepala halaman */}
      <header className="mb-5">
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em] sm:text-[30px]">
          Prioritisasi Penempatan CCTV Jatinangor
        </h1>
        <p className="mt-2 max-w-[75ch] text-[14px] leading-relaxed text-ink-soft">
          Sistem pendukung keputusan AHP–TOPSIS untuk memeringkat segmen gang permukiman mahasiswa.
          Kriteria C1–C8 diolah sebagai urgensi; C9 dan RAB diperlakukan sebagai kendala kelayakan dan
          anggaran, bukan kriteria perankingan.
        </p>
      </header>

      {/* Kontrol dataset */}
      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-md border border-line bg-surface px-4 py-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-ink-soft">Dataset</span>
          <select
            value={datasetKey}
            onChange={(e) => loadDataset(e.target.value as DatasetKey)}
            className="rounded border border-line bg-surface px-2 py-1.5 text-[13px] font-medium"
          >
            {Object.entries(DATASETS).map(([key, d]) => (
              <option key={key} value={key}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2 pb-0.5">
          <button
            type="button"
            onClick={reset}
            className="rounded border border-line bg-surface px-3 py-1.5 text-[13px] font-medium hover:bg-sunken"
          >
            Reset ke data awal
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded bg-accent px-3 py-1.5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            Ekspor CSV
          </button>
        </div>

        <p className="w-full text-[12.5px] leading-relaxed text-ink-soft">
          {dataset.simulated ? <Badge tone="warn">SIMULASI</Badge> : <Badge tone="ok">RESMI</Badge>}{" "}
          <span className="ml-1">{dataset.note}</span>
        </p>
      </div>

      {/* KPI */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Kpi label="Rasio Konsistensi (CR)" value={fmt(ev.ahp.CR, 4)} foot={ev.ahp.CR < 0.1 ? "konsisten (< 0,10)" : "tinjau ulang"} tone={ev.ahp.CR < 0.1 ? "ok" : "bad"} />
        <Kpi label="Alternatif Segmen" value={String(dataset.alts.length)} foot={dataset.simulated ? "skenario simulasi" : "sesuai naskah model"} />
        <Kpi label={`Layak (C9 ≥ ${C9_MIN})`} value={`${ev.feasibleCount}/${dataset.alts.length}`} foot="ambang operasional" tone={ev.feasibleCount === dataset.alts.length ? "ok" : "warn"} />
        <Kpi label="Prioritas Tertinggi" value={top.code} foot={top.name} />
        <Kpi label="Plafon per Tahun" value={`Rp ${fmt(BUDGET, 1)} Jt`} foot="batas subtotal fase" />
      </div>

      <div className="grid min-w-0 gap-5">
        {/* Matriks keputusan */}
        <Panel
          title="Matriks Keputusan (C1–C8 urgensi, C9 kelayakan, RAB)"
          note="Semua sel dapat diedit dan hasil dihitung ulang otomatis. C1–C8 berorientasi benefit terhadap urgensi (skor tinggi = lebih mendesak)."
        >
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr>
                <Th>Kode</Th>
                <Th>Alternatif segmen</Th>
                {CRITERIA.map((c) => (
                  <Th key={c.code} align="right">
                    {c.code}
                  </Th>
                ))}
                <Th align="right">C9</Th>
                <Th align="right">Biaya (Jt Rp)</Th>
              </tr>
            </thead>
            <tbody>
              {dataset.alts.map((alt, i) => (
                <tr key={alt.code}>
                  <Td className="font-semibold">{alt.code}</Td>
                  <Td>
                    {alt.name}
                    <span className="ml-1.5 text-[11.5px] text-ink-faint">{alt.desa}</span>
                  </Td>
                  {CRITERIA.map((c, j) => (
                    <Td key={c.code} align="right">
                      <NumberCell
                        label={`${c.code} ${alt.code}`}
                        value={X[i][j]}
                        min={0}
                        onCommit={(v) => setCell(i, j, v)}
                      />
                    </Td>
                  ))}
                  <Td align="right">
                    <NumberCell
                      label={`C9 ${alt.code}`}
                      value={C9[i]}
                      min={1}
                      max={5}
                      decimals={0}
                      onCommit={(v) => setC9Cell(i, v)}
                    />
                  </Td>
                  <Td align="right">
                    <NumberCell
                      label={`Biaya ${alt.code}`}
                      value={COST[i]}
                      min={0}
                      onCommit={(v) => setCostCell(i, v)}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[12px] text-ink-faint">
            C9 = kesiapan tiang/listrik/jaringan (skor 1–5). Nilai di bawah {C9_MIN} ditandai tidak layak dan
            tidak dialokasikan. Biaya = estimasi RAB per titik.
          </p>
        </Panel>

        {/* AHP */}
        <Panel
          title="Matriks Perbandingan Berpasangan AHP (8×8)"
          note="Skala Saaty 1–9. Ubah segitiga atas; segitiga bawah mengikuti sifat resiprokal secara otomatis."
          actions={
            <div className="text-right">
              <div className="tnum text-[13px] font-semibold">
                λmax {fmt(ev.ahp.lam, 4)} · CI {fmt(ev.ahp.CI, 4)} · CR {fmt(ev.ahp.CR, 4)}
              </div>
              <div className="mt-1">
                {ev.ahp.CR < 0.1 ? <Badge tone="ok">CR &lt; 0,10 konsisten</Badge> : <Badge tone="bad">CR ≥ 0,10 tinjau ulang</Badge>}
              </div>
            </div>
          }
        >
          <table className="border-collapse text-[12.5px]">
            <thead>
              <tr>
                <Th> </Th>
                {CRITERIA.map((c) => (
                  <Th key={c.code} align="right">
                    {c.code}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {A.map((row, i) => (
                <tr key={CRITERIA[i].code}>
                  <th scope="row" className="border-b border-line/70 px-2 py-1 text-left text-[11px] font-semibold text-ink-soft">
                    {CRITERIA[i].code}
                  </th>
                  {row.map((v, j) => (
                    <Td key={j} align="right">
                      {i === j ? (
                        <span className="text-ink-faint">1,00</span>
                      ) : j < i ? (
                        <span className="tnum text-ink-faint">{v.toFixed(2)}</span>
                      ) : (
                        <NumberCell
                          label={`AHP ${CRITERIA[i].code} terhadap ${CRITERIA[j].code}`}
                          value={v}
                          min={1 / 9}
                          max={9}
                          widthClass="w-[62px]"
                          onCommit={(next) => setAhpCell(i, j, next)}
                        />
                      )}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[12px] text-ink-faint">
            RI = 1,41 untuk n = 8. Matriks dinyatakan konsisten bila CR &lt; 0,10.
          </p>
        </Panel>

        {/* Bobot */}
        <Panel title="Bobot Global Kriteria" note="Hasil penurunan eigenvektor utama matriks AHP 8×8.">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <Th align="right">Rank</Th>
                <Th>Kriteria</Th>
                <Th>Satuan</Th>
                <Th align="right">Bobot</Th>
                <Th>Visual</Th>
              </tr>
            </thead>
            <tbody>
              {ev.ahp.w
                .map((v, i) => ({ v, i }))
                .sort((a, b) => b.v - a.v)
                .map(({ v, i }, r) => {
                  const c = CRITERIA[i] as Criterion;
                  const width = (v / Math.max(...ev.ahp.w)) * 100;
                  return (
                    <tr key={c.code}>
                      <Td align="right" className="text-ink-faint">
                        {r + 1}
                      </Td>
                      <Td className="font-medium">
                        {c.code} · {c.name}
                      </Td>
                      <Td className="text-[12px] text-ink-faint">{c.unit}</Td>
                      <Td align="right" className="font-semibold">
                        {pct(v, 2)}
                      </Td>
                      <Td>
                        <span className="block h-2.5 rounded-sm bg-sunken">
                          <span className="block h-2.5 rounded-sm bg-accent" style={{ width: `${width}%` }} />
                        </span>
                      </Td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Panel>

        {/* TOPSIS */}
        <Panel
          title="Hasil Perankingan TOPSIS"
          note="Normalisasi vektor Euclidean, pembobotan AHP, solusi ideal positif/negatif, jarak, lalu koefisien kedekatan CC."
        >
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <Th align="right">Rank</Th>
                <Th>Alternatif</Th>
                <Th align="right">
                  D<sup>+</sup>
                </Th>
                <Th align="right">
                  D<sup>−</sup>
                </Th>
                <Th align="right">CC</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {ev.order.map((i, r) => {
                const alt = dataset.alts[i];
                const overBudget = ev.feasible[i] && ev.allocation.phases[i] === null;
                return (
                  <tr key={alt.code} className={r === 0 ? "bg-accent-soft/60" : undefined}>
                    <Td align="right" className="font-semibold">
                      {r + 1}
                    </Td>
                    <Td>
                      <span className="font-semibold">{alt.code}</span> · {alt.name}
                    </Td>
                    <Td align="right">{fmt(ev.topsis.Dp[i], 4)}</Td>
                    <Td align="right">{fmt(ev.topsis.Dm[i], 4)}</Td>
                    <Td align="right" className="font-semibold">
                      {fmt(ev.topsis.CC[i], 4)}
                    </Td>
                    <Td>
                      {!ev.feasible[i] ? (
                        <Badge tone="bad">C9 &lt; {C9_MIN}</Badge>
                      ) : overBudget ? (
                        <Badge tone="warn">Biaya &gt; plafon</Badge>
                      ) : (
                        <Badge tone="ok">Fase {ev.allocation.phases[i]}</Badge>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-[12px] text-ink-faint">
            CC<sub>i</sub> ∈ [0,1]; makin tinggi makin urgen. Status mengikuti kendala alokasi, bukan
            perankingan.
          </p>
        </Panel>

        {/* Peta */}
        <Panel
          title="Peta Prioritas Skematik"
          note="Posisi bersifat relatif terhadap koridor jalan, bukan koordinat GPS. Warna dan ukuran mengikuti CC; label memuat peringkat dan status alokasi."
        >
          <PriorityMap
            alts={dataset.alts}
            cc={ev.topsis.CC}
            rank={ev.rank}
            phases={ev.allocation.phases}
            feasible={ev.feasible}
            mapPos={dataset.mapPos}
          />
        </Panel>

        {/* Fase anggaran */}
        <Panel
          title={`Alokasi Anggaran Bertahap (plafon Rp ${fmt(BUDGET, 1)} Jt/tahun)`}
          note={`Hanya alternatif dengan C9 ≥ ${C9_MIN} dan biaya satu titik tidak melebihi plafon yang dialokasikan.`}
        >
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                <Th align="right">Fase</Th>
                <Th>Alternatif</Th>
                <Th align="right">CC</Th>
                <Th align="right">Biaya (Jt Rp)</Th>
                <Th align="right">Subtotal fase</Th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ev.allocation.subtotals)
                .map(Number)
                .sort((a, b) => a - b)
                .map((p) => {
                  const members = ev.order.filter((i) => ev.allocation.phases[i] === p);
                  const subtotal = ev.allocation.subtotals[p];
                  return members.map((i, k) => (
                    <tr key={`${p}-${dataset.alts[i].code}`}>
                      {k === 0 ? (
                        <td
                          rowSpan={members.length}
                          className="border-b border-line/70 px-2 py-1.5 text-[13px] font-semibold"
                        >
                          Fase {p}
                        </td>
                      ) : null}
                      <Td>
                        <span className="font-semibold">{dataset.alts[i].code}</span> · {dataset.alts[i].name}
                      </Td>
                      <Td align="right">{fmt(ev.topsis.CC[i], 4)}</Td>
                      <Td align="right">{fmt(COST[i], 1)}</Td>
                      {k === 0 ? (
                        <td
                          rowSpan={members.length}
                          className="tnum border-b border-line/70 px-2 py-1.5 text-right text-[13px] font-semibold"
                        >
                          {fmt(subtotal, 1)}{" "}
                          {subtotal <= BUDGET + 1e-9 ? <Badge tone="ok">≤ plafon</Badge> : <Badge tone="bad">&gt; plafon</Badge>}
                        </td>
                      ) : null}
                    </tr>
                  ));
                })}
            </tbody>
          </table>

          {ev.allocation.excludedC9.length > 0 || ev.allocation.excludedBudget.length > 0 ? (
            <div className="mt-3 space-y-1 text-[12.5px] text-ink-soft">
              {ev.allocation.excludedC9.length > 0 ? (
                <p>
                  <Badge tone="bad">Tidak dialokasikan</Badge> C9 &lt; {C9_MIN}:{" "}
                  {ev.allocation.excludedC9
                    .map((i) => `${dataset.alts[i].code} (C9 ${C9[i]})`)
                    .join(", ")}
                </p>
              ) : null}
              {ev.allocation.excludedBudget.length > 0 ? (
                <p>
                  <Badge tone="warn">Tidak dialokasikan</Badge> biaya &gt; plafon:{" "}
                  {ev.allocation.excludedBudget
                    .map((i) => `${dataset.alts[i].code} (Rp ${fmt(COST[i], 1)} Jt)`)
                    .join(", ")}
                </p>
              ) : null}
            </div>
          ) : null}
        </Panel>

        {/* Sensitivitas */}
        <Panel
          title="Analisis Sensitivitas Bobot ±20% (One-At-A-Time, 16 skenario)"
          note={`Setiap kriteria dinaikkan/diturunkan 20%, bobot lain direnormalisasi proporsional, lalu TOPSIS dihitung ulang. Pembalikan peringkat terjadi pada ${flips.length} dari ${ev.sensitivity.rows.length} skenario.`}
        >
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr>
                <Th>Kriteria</Th>
                <Th>Variasi</Th>
                {dataset.alts.map((a) => (
                  <Th key={a.code} align="right">
                    {a.code}
                  </Th>
                ))}
                <Th>Susunan peringkat</Th>
              </tr>
            </thead>
            <tbody>
              {ev.sensitivity.rows.map((row) => {
                const changed = row.reversals > 0;
                return (
                  <tr key={`${row.j}-${row.d}`} className={changed ? "bg-warn-soft/60" : undefined}>
                    <Td className="font-medium">{CRITERIA[row.j].code}</Td>
                    <Td className="tnum">{row.d > 0 ? "+20%" : "−20%"}</Td>
                    {row.cc.map((cc, i) => (
                      <Td key={i} align="right">
                        {fmt(cc, 4)}
                      </Td>
                    ))}
                    <Td>
                      <span className="tnum">
                        {row.ranks.map((s) => dataset.alts[Number(s)].code).join(" › ")}
                      </span>{" "}
                      {changed ? <Badge tone="warn">pembalikan</Badge> : null}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {flips.length > 0 ? (
            <p className="mt-2 text-[12px] text-ink-faint">
              Skenario yang membalik peringkat: {flips.map((r) => sensLabel(r.j, r.d)).join(", ")}.
            </p>
          ) : null}
        </Panel>
      </div>

      <footer className="mt-6 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-faint">
        <p>
          Model dan angka mengikuti naskah kanonik <span className="font-medium text-ink-soft">dss_revisi.md</span>{" "}
          (AHP datar 8×8; PRISMA 582 → 416 → 121 → 12). Data per segmen bersifat hybrid: kalibrasi sekunder
          dan estimasi terdokumentasi, belum merupakan validasi lapangan.
        </p>
        <p className="mt-1">
          Ambang C9 ≥ {C9_MIN} adalah kebijakan implementasi terdokumentasi, bukan angka yang dinyatakan
          eksplisit dalam naskah model.
        </p>
      </footer>
    </main>
  );
}

/* --------------------------------- KPI --------------------------------- */

function Kpi({
  label,
  value,
  foot,
  tone,
}: {
  label: string;
  value: string;
  foot?: string;
  tone?: "ok" | "bad" | "warn";
}) {
  const valueTone =
    tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "text-ink";
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2.5">
      <div className="text-[11px] leading-snug font-semibold text-ink-soft">{label}</div>
      <div className={`tnum mt-1 text-[19px] leading-tight font-semibold ${valueTone}`}>{value}</div>
      {foot ? <div className="mt-0.5 truncate text-[11.5px] text-ink-faint">{foot}</div> : null}
    </div>
  );
}

/* ------------------------------ peta SVG ------------------------------ */

function PriorityMap({
  alts,
  cc,
  rank,
  phases,
  feasible,
  mapPos,
}: {
  alts: { code: string; name: string }[];
  cc: number[];
  rank: number[];
  phases: (number | null)[];
  feasible: boolean[];
  mapPos: Record<string, [number, number]> | null;
}) {
  const n = alts.length;
  const auto = (() => {
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const pos: Record<string, [number, number]> = {};
    alts.forEach((a, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const x = cols > 1 ? 110 + c * (580 / (cols - 1)) : 400;
      const y = rows > 1 ? 100 + r * (250 / (rows - 1)) : 220;
      pos[a.code] = [x, y];
    });
    return pos;
  })();

  const pos = mapPos ?? auto;
  const mn = Math.min(...cc);
  const mx = Math.max(...cc);
  const span = mx - mn || 1;
  const t01 = (i: number) => (cc[i] - mn) / span;
  const small = n > 6;

  return (
    <figure>
      <svg
        viewBox="0 0 800 440"
        role="img"
        aria-label="Peta prioritas skematik segmen CCTV Jatinangor"
        className="w-full rounded border border-line bg-surface"
      >
        <rect x="1" y="1" width="798" height="438" rx="6" fill="var(--surface)" />
        <text x="22" y="28" fontSize="13" fontWeight="700" fill="var(--ink-soft)">
          Kecamatan Jatinangor — skematik (posisi relatif, bukan GPS)
        </text>

        {mapPos ? (
          <>
            <path
              d="M 96 258 L 232 208 L 402 236 L 668 272"
              fill="none"
              stroke="var(--surface-sunken)"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 402 236 L 528 110"
              fill="none"
              stroke="var(--surface-sunken)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray="2 13"
            />
          </>
        ) : null}

        {alts.map((a, i) => {
          const [x, y] = pos[a.code] ?? [0, 0];
          const k = t01(i);
          const rr = (small ? 11 : 15) + (small ? 20 : 27) * k;
          const layak = feasible[i];
          const overBudget = layak && phases[i] === null;
          const fill = !layak ? "#98a2b3" : overBudget ? "#f79009" : "#1d4ed8";
          const stroke = !layak ? "#b42318" : overBudget ? "#b54708" : "#ffffff";
          const status = !layak
            ? `Tidak layak (C9 < ${C9_MIN})`
            : overBudget
              ? "Biaya > plafon"
              : `Fase ${phases[i]}`;

          return (
            <g key={a.code}>
              <circle
                cx={x}
                cy={y}
                r={rr}
                fill={fill}
                stroke={stroke}
                strokeWidth={layak && !overBudget ? 3 : 2}
                strokeDasharray={layak && !overBudget ? undefined : "4 3"}
              />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={13 + 3 * k} fontWeight="700" fill="#fff">
                {a.code}
              </text>
              <text x={x} y={y + rr + 15} textAnchor="middle" fontSize={small ? 10 : 12} fontWeight="600" fill="var(--ink)">
                {a.name}
              </text>
              <text x={x} y={y + rr + 28} textAnchor="middle" fontSize={small ? 9 : 11} fill="var(--ink-soft)">
                CC {fmt(cc[i], 4)} · Peringkat {rank[i]} · {status}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-[12px] leading-relaxed text-ink-faint">
        Ukuran dan posisi titik mengikuti CC (titik besar = lebih urgen). Titik abu putus-putus = tidak layak
        (C9 &lt; {C9_MIN}); titik kuning putus-putus = biaya satu titik melebihi plafon.
      </figcaption>
    </figure>
  );
}
