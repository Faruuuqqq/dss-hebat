"use client";

/* eslint-disable react-hooks/set-state-in-effect -- skenario dibaca/ditulis ke localStorage: sinkronisasi state dengan sistem eksternal */

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import ilustratifData from "../data/ilustratif.json";
import naskahUtsData from "../data/naskah-uts.json";
import { FullDSSResult, solveDataset, SolveDatasetInput } from "./engine/index.ts";
import type { Alternative, AlternativeValue, RecordedInput } from "./engine/index.ts";
import {
  clearScenario,
  cloneFromPreset,
  loadScenario,
  KRITERIA_URGENSI,
  saveScenario,
  SCENARIO_VERSION,
} from "./scenario.ts";
import type { ScenarioState } from "./scenario.ts";

export type Role = "admin" | "pakar";
export type MapMode = "urgensi" | "c9" | "gap";

interface DSSContextType {
  datasetId: string;
  setDatasetId: (id: string) => void;
  dataset: SolveDatasetInput;
  baselineDataset: SolveDatasetInput;
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
  scenario: ScenarioState | null;
  persistScenarioValues: (updates?: Record<string, AlternativeValue>) => boolean;
  startScenario: () => void;
  discardScenario: () => void;
  applyScenario: (s: ScenarioState) => void;
  addAlternative: (alt: Alternative, value: AlternativeValue) => void;
  removeAlternative: (id: string) => void;
  draftLatLng: [number, number] | null;
  setDraftLatLng: (v: [number, number] | null) => void;
  pickMode: boolean;
  setPickMode: (v: boolean) => void;
  storageError: string | null;
}

const DSSContext = createContext<DSSContextType | null>(null);

const rawDatasets: Record<string, SolveDatasetInput> = {
  ilustratif: ilustratifData as unknown as SolveDatasetInput,
  naskah_uts: naskahUtsData as unknown as SolveDatasetInput,
};

const storageErrorMessage = "Skenario gagal disimpan. Penyimpanan browser mungkin penuh atau diblokir.";

function recordValues(value: AlternativeValue, method: RecordedInput["method"], recordedAt: string): AlternativeValue {
  const inputEvidence = Object.fromEntries([...KRITERIA_URGENSI, "C9", "RAB"].map(
    (code) => [code, { method, recordedAt }],
  ));
  return { ...value, inputEvidence };
}

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

  // "Skenario Saya": salinan preset yang boleh ditambah/dihapus titiknya.
  const [scenarioAlts, setScenarioAlts] = useState<Alternative[] | null>(null);
  const [scenarioPreset, setScenarioPreset] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [draftLatLng, setDraftLatLng] = useState<[number, number] | null>(null);
  const [pickMode, setPickMode] = useState(false);

  const baseData = rawDatasets[datasetId] ?? rawDatasets.ilustratif;
  const alternatives = scenarioAlts ?? baseData.alternatives;

  const applyScenario = (s: ScenarioState) => {
    setDatasetIdState(s.preset);
    setScenarioAlts(s.alternatives);
    setScenarioPreset(s.preset);
    setValues(s.values);
    setPairwise(s.pairwise);
    setPlafonPerFase(s.plafonPerFase);
    setC9MinFase1(s.c9MinFase1);
    setSelectedAltId(s.alternatives[0]?.id ?? "A3");
    setStorageError(null);
  };

  useEffect(() => {
    const stored = loadScenario();
    if (stored) applyScenario(stored);
    setHydrated(true);
  }, []);

  const scenario = useMemo<ScenarioState | null>(() => {
    if (!scenarioAlts) return null;
    return {
      version: SCENARIO_VERSION,
      preset: scenarioPreset ?? datasetId,
      alternatives: scenarioAlts,
      values,
      pairwise,
      plafonPerFase,
      c9MinFase1,
    };
  }, [scenarioAlts, scenarioPreset, datasetId, values, pairwise, plafonPerFase, c9MinFase1]);

  useEffect(() => {
    if (!hydrated || !scenario) return;
    if (!saveScenario(scenario)) {
      setStorageError(storageErrorMessage);
    }
  }, [hydrated, scenario]);

  const persistScenarioValues = (updates: Record<string, AlternativeValue> = {}) => {
    const current = scenario ?? cloneFromPreset(
      { ...baseData, id: datasetId },
      values,
      pairwise,
      plafonPerFase,
      c9MinFase1,
    );
    const recordedAt = new Date().toISOString();
    const importedValues = Object.fromEntries(Object.entries(updates).map(([id, value]) => [
      id, recordValues(value, "csv", recordedAt),
    ]));
    const next = { ...current, values: { ...current.values, ...importedValues } };
    if (!saveScenario(next)) {
      setStorageError(storageErrorMessage);
      return false;
    }
    setScenarioAlts(next.alternatives);
    setScenarioPreset(next.preset);
    setValues(next.values);
    setStorageError(null);
    return true;
  };

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

  const startScenario = () => {
    const current = rawDatasets[datasetId] ?? rawDatasets.ilustratif;
    const cloned = cloneFromPreset(
      { ...current, id: datasetId },
      values,
      pairwise,
      plafonPerFase,
      c9MinFase1
    );
    setScenarioAlts(cloned.alternatives);
    setScenarioPreset(datasetId);
    setStorageError(null);
  };

  const discardScenario = () => {
    clearScenario();
    setScenarioAlts(null);
    setScenarioPreset(null);
    setDraftLatLng(null);
    setPickMode(false);
    setStorageError(null);
    const next = rawDatasets[datasetId] ?? rawDatasets.ilustratif;
    setValues(JSON.parse(JSON.stringify(next.values)));
    setPairwise(JSON.parse(JSON.stringify(next.pairwise || [])));
    setPlafonPerFase(next.plafon_per_fase_rp || 15_000_000);
    setC9MinFase1(next.c9_min_fase1 || 3);
    setSelectedAltId(next.alternatives[0]?.id ?? "A3");
  };

  const addAlternative = (alt: Alternative, value: AlternativeValue) => {
    setScenarioAlts((prev) => [
      ...(prev ?? JSON.parse(JSON.stringify(baseData.alternatives))),
      alt,
    ]);
    setScenarioPreset((prev) => prev ?? datasetId);
    const addedValues = recordValues(value, "manual", new Date().toISOString());
    setValues((prev) => ({ ...prev, [alt.id]: addedValues }));
    setSelectedAltId(alt.id);
    setStorageError(null);
  };

  const removeAlternative = (id: string) => {
    if (!scenarioAlts) return;
    if (scenarioAlts.length <= 1) {
      setStorageError("Minimal satu segmen harus tersisa di skenario.");
      return;
    }
    const nextAlts = scenarioAlts.filter((a) => a.id !== id);
    setScenarioAlts(nextAlts);
    setValues((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (selectedAltId === id) setSelectedAltId(nextAlts[0]?.id ?? "");
    setStorageError(null);
  };

  const updateValue = (id: string, code: string, next: number) => {
    const recordedAt = new Date().toISOString();
    setValues((prev) => {
      const value = prev[id] ?? { kriteria: {}, c9: 3, biaya_rp: 0 };
      const old = code === "C9" ? value.c9 : code === "RAB" ? value.biaya_rp : value.kriteria[code];
      if (old === next) return prev;

      const fields = code === "C9" ? { c9: next } : code === "RAB" ? { biaya_rp: next } : {
        kriteria: { ...value.kriteria, [code]: next },
      };
      return {
        ...prev,
        [id]: {
          ...value,
          ...fields,
          inputEvidence: { ...value.inputEvidence, [code]: { method: "manual", recordedAt } },
        },
      };
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
    if (scenarioAlts) {
      discardScenario();
      return;
    }
    const next = rawDatasets[datasetId] ?? rawDatasets.ilustratif;
    setPlafonPerFase(next.plafon_per_fase_rp || 15_000_000);
    setC9MinFase1(next.c9_min_fase1 || 3);
    setValues(JSON.parse(JSON.stringify(next.values)));
    setPairwise(JSON.parse(JSON.stringify(next.pairwise || [])));
  };

  const currentDatasetInput = useMemo<SolveDatasetInput>(() => {
    return {
      ...baseData,
      alternatives,
      values,
      pairwise,
      overrides: {
        plafonPerFase,
        c9MinFase1,
        strictC9Filter: datasetId === "naskah_uts",
      },
    };
  }, [baseData, alternatives, values, pairwise, plafonPerFase, c9MinFase1, datasetId]);

  const result = useMemo<FullDSSResult>(() => {
    return solveDataset(currentDatasetInput);
  }, [currentDatasetInput]);

  return (
    <DSSContext.Provider
      value={{
        datasetId,
        setDatasetId,
        dataset: currentDatasetInput,
        baselineDataset: baseData,
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
        updateCriterionValue: updateValue,
        updateC9Value: (id, value) => updateValue(id, "C9", value),
        updateCostValue: (id, value) => updateValue(id, "RAB", value),
        updatePairwiseScore,
        resetDataset,
        scenario,
        persistScenarioValues,
        startScenario,
        discardScenario,
        applyScenario,
        addAlternative,
        removeAlternative,
        draftLatLng,
        setDraftLatLng,
        pickMode,
        setPickMode,
        storageError,
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
