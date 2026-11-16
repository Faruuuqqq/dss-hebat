"use client";

import React from "react";
import { MapMode } from "../../lib/store";

interface MapModeToggleProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}

export function MapModeToggle({ mode, onChange }: MapModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-[#EEF2F1] p-1 rounded-lg border border-[#DDE3E1]" role="tablist" aria-label="Mode Tampilan Peta">
      <button
        role="tab"
        aria-selected={mode === "urgensi"}
        onClick={() => onChange("urgensi")}
        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
          mode === "urgensi"
            ? "bg-[#0E6B66] text-white shadow-sm"
            : "text-[#55625F] hover:text-[#14201F]"
        }`}
      >
        Urgensi
      </button>
      <button
        role="tab"
        aria-selected={mode === "c9"}
        onClick={() => onChange("c9")}
        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
          mode === "c9"
            ? "bg-[#0E6B66] text-white shadow-sm"
            : "text-[#55625F] hover:text-[#14201F]"
        }`}
      >
        Kelayakan C9
      </button>
      <button
        role="tab"
        aria-selected={mode === "gap"}
        onClick={() => onChange("gap")}
        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
          mode === "gap"
            ? "bg-[#0E6B66] text-white shadow-sm"
            : "text-[#55625F] hover:text-[#14201F]"
        }`}
      >
        Coverage gap
      </button>
    </div>
  );
}
