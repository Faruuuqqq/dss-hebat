import { getSupabase } from "./supabase.ts";
import ilustratifData from "../data/ilustratif.json";
import naskahUtsData from "../data/naskah-uts.json";
import type { SolveDatasetInput } from "./engine/index.ts";

export async function fetchDataset(datasetId: string): Promise<SolveDatasetInput> {
  const supabase = getSupabase();

  if (!supabase) {
    // Graceful fallback to static JSON
    return (datasetId === "naskah_uts" ? naskahUtsData : ilustratifData) as unknown as SolveDatasetInput;
  }

  try {
    const { data: datasetRow, error: dsErr } = await supabase
      .from("datasets")
      .select("*")
      .eq("id", datasetId)
      .single();

    if (dsErr || !datasetRow) {
      return (datasetId === "naskah_uts" ? naskahUtsData : ilustratifData) as unknown as SolveDatasetInput;
    }

    const { data: alternatives } = await supabase
      .from("alternatives")
      .select("*")
      .eq("dataset_id", datasetId);

    const { data: criteria } = await supabase
      .from("criteria")
      .select("*")
      .eq("dataset_id", datasetId);

    const { data: valuesRows } = await supabase
      .from("alternative_values")
      .select("*")
      .eq("dataset_id", datasetId);

    const valuesMap: Record<string, { kriteria: Record<string, number>; c9: number; biaya_rp: number }> = {};
    (valuesRows || []).forEach((row) => {
      valuesMap[row.alternative_id] = {
        kriteria: {
          C1: Number(row.c1),
          C2: Number(row.c2),
          C3: Number(row.c3),
          C4: Number(row.c4),
          C5: Number(row.c5),
          C6: Number(row.c6),
          C7: Number(row.c7),
          C8: Number(row.c8),
        },
        c9: Number(row.c9),
        biaya_rp: Number(row.biaya_rp),
      };
    });

    const { data: pairwiseRows } = await supabase
      .from("ahp_judgments")
      .select("*")
      .eq("dataset_id", datasetId);

    return {
      id: datasetRow.id,
      nama: datasetRow.nama,
      deskripsi: datasetRow.deskripsi,
      status: datasetRow.status,
      ahp_mode: datasetRow.ahp_mode,
      plafon_per_fase_rp: Number(datasetRow.plafon_per_fase_rp),
      c9_min_fase1: Number(datasetRow.c9_min_fase1),
      alternatives: alternatives || [],
      criteria: criteria || [],
      values: valuesMap,
      pairwise: pairwiseRows || [],
    } as unknown as SolveDatasetInput;
  } catch {
    return (datasetId === "naskah_uts" ? naskahUtsData : ilustratifData) as unknown as SolveDatasetInput;
  }
}
