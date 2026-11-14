/**
 * PARITY TEST — memastikan mesin TypeScript mereproduksi angka kanonik.
 *
 * Dijalankan dengan type-stripping bawaan Node (tanpa build step):
 *   node scripts/parity.ts        atau        npm run parity
 *
 * Angka acuan berasal dari dss_revisi_markdown/dss_revisi.md dan dikunci
 * sebagai invarian proyek pada AGENTS.md §5.
 */
import {
  DATASETS,
  A0,
  BUDGET,
  C9_MIN,
  CRITERIA,
  ahp,
  topsis,
  feasibleFlags,
  allocPhases,
  sensitivity,
  evaluate,
  initialState,
} from "../lib/engine.ts";

let fail = 0;
const near = (a: number, b: number, eps = 5e-4) => Math.abs(a - b) < eps;

function chk(label: string, got: number | string | boolean, exp: number | string | boolean, eps?: number) {
  const ok =
    typeof got === "number" && typeof exp === "number" ? near(got, exp, eps) : got === exp;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${got} (exp ${exp})`);
}

console.log("=== 1. AHP kanonik (datar 8x8) ===");
const { w, lam, CI, CR } = ahp(A0);
chk("n kriteria", CRITERIA.length, 8);
chk("lambda_max", Number(lam.toFixed(4)), 8.1031, 1e-4);
chk("CI", Number(CI.toFixed(4)), 0.0147, 1e-4);
chk("CR", Number(CR.toFixed(4)), 0.0104, 1e-4);
chk("CR < 0,10 (konsisten)", CR < 0.1, true);

console.log("\n=== 2. Bobot global kriteria ===");
const expectedW = [0.2395, 0.1429, 0.1429, 0.077, 0.1245, 0.0515, 0.0974, 0.1245];
expectedW.forEach((e, i) => chk(`w_${CRITERIA[i].code}`, Number(w[i].toFixed(4)), e, 1e-4));
chk("jumlah bobot = 1", Number(w.reduce((a, b) => a + b, 0).toFixed(10)), 1, 1e-9);

console.log("\n=== 3. TOPSIS kanonik (dataset resmi) ===");
const resmi = DATASETS.resmi;
const { CC } = topsis(resmi.X, w);
const expectedCC = [0.5774, 0.4638, 0.6445, 0.4995, 0.182];
expectedCC.forEach((e, i) => chk(`CC_${resmi.alts[i].code}`, Number(CC[i].toFixed(4)), e, 1e-4));

const order = CC.map((_, i) => i).sort((a, b) => CC[b] - CC[a]);
chk("urutan prioritas", order.map((i) => resmi.alts[i].code).join(">"), "A3>A1>A4>A2>A5");

console.log("\n=== 4. Filter C9 dan alokasi fase ===");
const flags = feasibleFlags(resmi.C9);
chk("semua layak (C9 >= 3)", flags.every(Boolean), true);

const alloc = allocPhases(CC, resmi.COST, flags);
chk("fase resmi", JSON.stringify(alloc.phases), JSON.stringify([1, 2, 1, 2, 3]));
chk("subtotal fase 1", Number((alloc.subtotals[1] ?? 0).toFixed(1)), 14.0, 1e-9);
chk("subtotal fase 2", Number((alloc.subtotals[2] ?? 0).toFixed(1)), 13.0, 1e-9);
chk("subtotal fase 3", Number((alloc.subtotals[3] ?? 0).toFixed(1)), 5.5, 1e-9);
Object.entries(alloc.subtotals).forEach(([p, v]) => chk(`fase ${p} <= plafon`, v <= BUDGET + 1e-9, true));

const C9mod = resmi.C9.slice();
C9mod[0] = 1;
const flagsMod = feasibleFlags(C9mod);
const allocMod = allocPhases(CC, resmi.COST, flagsMod);
chk("C9=1 -> A1 tidak layak", flagsMod[0], false);
chk("C9=1 -> A1 tidak dialokasikan", allocMod.phases[0], null);
chk("C9=1 -> fase lain tetap", JSON.stringify(allocMod.phases), JSON.stringify([null, 2, 1, 2, 3]));

const costOver = resmi.COST.slice();
costOver[4] = 15.1;
const allocOver = allocPhases(CC, costOver, flags);
chk("biaya > plafon -> A5 tidak dialokasikan", allocOver.phases[4], null);
chk("biaya > plafon -> fase lain tetap", JSON.stringify(allocOver.phases), JSON.stringify([1, 2, 1, 2, null]));

console.log("\n=== 5. Sensitivitas OAT +-20% ===");
const sens = sensitivity(resmi.X, w);
chk("jumlah skenario", sens.rows.length, 16);
const flips = sens.rows.filter((r) => r.reversals > 0).length;
chk("jumlah pembalikan peringkat", flips, 2);
const flipLabels = sens.rows
  .filter((r) => r.reversals > 0)
  .map((r) => `${CRITERIA[r.j].code}${r.d > 0 ? "+20%" : "-20%"}`)
  .sort();
chk("skenario pembalikan", flipLabels.join(", "), "C1-20%, C2+20%");
sens.rows.forEach((r) => {
  const top2 = r.ranks.slice(0, 2).map((s) => resmi.alts[Number(s)].code).sort().join(",");
  if (top2 !== "A1,A3") fail++;
});
chk("A3 & A1 selalu dua teratas", fail === 0, true);

console.log("\n=== 6. Dataset perluasan (simulasi) ===");
const perluasan = DATASETS.perluasan;
chk("jumlah segmen", perluasan.alts.length, 12);
chk("ditandai simulasi", perluasan.simulated, true);
chk("dimensi X konsisten", perluasan.X.every((r) => r.length === CRITERIA.length), true);
chk("panjang C9/COST sesuai", perluasan.C9.length === 12 && perluasan.COST.length === 12, true);

console.log("\n=== 7. Orkestrasi evaluate() ===");
const init = initialState("resmi");
const ev = evaluate("resmi", init.X, init.C9, init.COST, init.A);
chk("prioritas tertinggi", ev.dataset.alts[ev.order[0]].code, "A3");
chk("jumlah layak", ev.feasibleCount, 5);
chk("fase via evaluate", JSON.stringify(ev.allocation.phases), JSON.stringify([1, 2, 1, 2, 3]));
chk("nilai C9_MIN terdokumentasi", C9_MIN, 3);

console.log("\n=== 8. Kekebalan input (data-driven) ===");
chk("X resmi 5 baris", resmi.X.length, 5);
chk("semua X 8 kolom", resmi.X.every((r) => r.length === 8), true);

// A0 memakai 0,33 sebagai pendekatan desimal 1/3, sehingga produk pasangan
// terendah adalah 0,33 x 3 = 0,99. Ini SENGAJA dipertahankan: nilai 0,33 yang
// mereproduksi λmax 8,1031 dan CR 0,0104 kanonik, sedangkan 1/3 tepat
// menghasilkan λmax 8,1067. Jadi yang diuji adalah kedekatan resiprokal
// sesuai presisi desimal yang dipakai, bukan resiprokal sempurna.
const reciprocalErr = Math.max(
  ...A0.flatMap((row, i) => row.map((v, j) => Math.abs(v * A0[j][i] - 1))),
);
chk("A0 hampir-resiprokal (toleransi pembulatan 0,33)", reciprocalErr < 0.011, true);
chk("λmax hanya cocok dengan A0 apa adanya", Number(ahp(A0).lam.toFixed(4)), 8.1031, 1e-4);

if (fail > 0) {
  console.log(`\n${fail} CHECK GAGAL`);
  process.exit(1);
}
console.log("\nSEMUA PARITY CHECK LULUS — mesin cocok dengan angka kanonik.");
