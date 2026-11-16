"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import ilustratifData from "../data/ilustratif.json";
import naskahUtsData from "../data/naskah-uts.json";
import { FullDSSResult, solveDataset, SolveDatasetInput } from "./engine/index.ts";

export type Role = "admin" | "pakar";
export type MapMode = "urgensi" | "c9" | "gap";

interface DSSContextType {
  datasetId: string;
  setDatasetId: (id: string) => void;
  dataset: SolveDatasetInput;
  result: FullDSSResult;
  role: Role;
  setRole: (role: Role) => void;
  activeMapMode: MapMode;
  setActiveMapMode: (mode: MapMode) => void;
  selectedAltId: string;
  setSelectedAltId: (id: string) => void;
  plafonPerFase: number;
  setPlafonPerFase: (val: number) => void;
  c9MinFase1: number;
  setC9MinFase1: (val: number) => void;
  updateCriterionValue: (altId: string, criterionCode: string, val: number) => void;
  updateC9Value: (altId: string, val: number) => void;
  updateCostValue: (altId: string, val: number) => void;
  updatePairwiseScore: (kelompok: string, level: string, critA: string, critB: string, val: number) => void;
  resetDataset: () => void;
}

const DSSContext = createContext<DSSContextType | null>(null);

const rawDatasets: Record<string, SolveDatasetInput> = {
  ilustratif: ilustratifData as unknown as SolveDatasetInput,
  naskah_uts: naskahUtsData as unknown as SolveDatasetInput,
};

export function DSSProvider({ children }: { children: React.ReactNode }) {
  const [datasetId, setDatasetIdState] = useState<string>("ilustratif");
  const [role, setRole] = useState<Role>("admin");
  const [activeMapMode, setActiveMapMode] = useState<MapMode>("urgensi");
  const [selectedAltId, setSelectedAltId] = useState<string>("A3");

  const initialData = rawDatasets.ilustratif;
  const [plafonPerFase, setPlafonPerFase] = useState<number>(initialData.plafon_per_fase_rp || 15_000_000);
  const [c9MinFase1, setC9MinFase1] = useState<number>(initialData.c9_min_fase1 || 3);
  const [values, setValues] = useState(initialData.values);
  const [pairwise, setPairwise] = useState(initialData.pairwise || []);

  const setDatasetId = (newId: string) => {
    setDatasetIdState(newId);
    const next = rawDatasets[newId] ?? rawDatasets.ilustratif;
    setPlafonPerFase(next.plafon_per_fase_rp || 15_000_000);
    setC9MinFase1(next.c9_min_fase1 || 3);
    setValues(JSON.parse(JSON.stringify(next.values)));
    setPairwise(JSON.parse(JSON.stringify(next.pairwise || [])));
    if (next.alternatives.length > 0) {
      setSelectedAltId(next.alternatives[0].id);
    }
  };

  const updateCriterionValue = (altId: string, criterionCode: string, val: number) => {
    setValues((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[altId]) {
        copy[altId] = { kriteria: {}, c9: 3, biaya_rp: 0 };
      }
      copy[altId].kriteria[criterionCode] = val;
      return copy;
    });
  };

  const updateC9Value = (altId: string, val: number) => {
    setValues((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[altId]) {
        copy[altId] = { kriteria: {}, c9: 3, biaya_rp: 0 };
      }
      copy[altId].c9 = val;
      return copy;
    });
  };

  const updateCostValue = (altId: string, val: number) => {
    setValues((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[altId]) {
        copy[altId] = { kriteria: {}, c9: 3, biaya_rp: 0 };
      }
      copy[altId].biaya_rp = val;
      return copy;
    });
  };

  const updatePairwiseScore = (
    kelompok: string,
    level: string,
    critA: string,
    critB: string,
    val: number
  ) => {
    setPairwise((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex(
        (p) =>
          p.kelompok === kelompok &&
          p.level === level &&
          ((p.kriteria_a === critA && p.kriteria_b === critB) ||
            (p.kriteria_a === critB && p.kriteria_b === critA))
      );
      if (idx >= 0) {
        if (copy[idx].kriteria_a === critA) {
          copy[idx] = { ...copy[idx], nilai_saaty_a_vs_b: val };
        } else {
          copy[idx] = { ...copy[idx], nilai_saaty_a_vs_b: 1 / val };
        }
      } else {
        copy.push({
          kelompok,
          level,
          kriteria_a: critA,
          kriteria_b: critB,
          nilai_saaty_a_vs_b: val,
        });
      }
      return copy;
    });
  };

  const resetDataset = () => {
    const next = rawDatasets[datasetId] ?? rawDatasets.ilustratif;
    setPlafonPerFase(next.plafon_per_fase_rp || 15_000_000);
    setC9MinFase1(next.c9_min_fase1 || 3);
    setValues(JSON.parse(JSON.stringify(next.values)));
    setPairwise(JSON.parse(JSON.stringify(next.pairwise || [])));
  };

  const baseData = rawDatasets[datasetId] ?? rawDatasets.ilustratif;

  const currentDatasetInput = useMemo<SolveDatasetInput>(() => {
    return {
      ...baseData,
      values,
      pairwise,
      overrides: {
        plafonPerFase,
        c9MinFase1,
        strictC9Filter: datasetId === "naskah_uts",
      },
    };
  }, [baseData, values, pairwise, plafonPerFase, c9MinFase1, datasetId]);

  const result = useMemo<FullDSSResult>(() => {
    return solveDataset(currentDatasetInput);
  }, [currentDatasetInput]);

  return (
    <DSSContext.Provider
      value={{
        datasetId,
        setDatasetId,
        dataset: currentDatasetInput,
        result,
        role,
        setRole,
        activeMapMode,
        setActiveMapMode,
        selectedAltId,
        setSelectedAltId,
        plafonPerFase,
        setPlafonPerFase,
        c9MinFase1,
        setC9MinFase1,
        updateCriterionValue,
        updateC9Value,
        updateCostValue,
        updatePairwiseScore,
        resetDataset,
      }}
    >
      {children}
    </DSSContext.Provider>
  );
}

export function useDSS(): DSSContextType {
  const ctx = useContext(DSSContext);
  if (!ctx) {
    throw new Error("useDSS must be used within a DSSProvider");
  }
  return ctx;
}
