"use client";

import React from "react";
import { MapMode } from "../../lib/store";

interface MapModeToggleProps {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}

export function MapModeToggle({ mode, onChange }: MapModeToggleProps) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 bg-[#EEF2F1] p-1 rounded-lg border border-[#DDE3E1]" role="tablist" aria-label="Mode Tampilan Peta">
      <button
        role="tab"
        aria-selected={mode === "urgensi"}
        onClick={() => onChange("urgensi")}
        className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
          mode === "urgensi"
            ? "bg-[#0E6B66] text-white shadow-xs"
            : "text-[#55625F] hover:text-[#14201F]"
        }`}
      >
        Urgensi
      </button>
      <button
        role="tab"
        aria-selected={mode === "c9"}
        onClick={() => onChange("c9")}
        className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
          mode === "c9"
            ? "bg-[#0E6B66] text-white shadow-xs"
            : "text-[#55625F] hover:text-[#14201F]"
        }`}
      >
        Kelayakan C9
      </button>
      <button
        role="tab"
        aria-selected={mode === "gap"}
        onClick={() => onChange("gap")}
        className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
          mode === "gap"
            ? "bg-[#0E6B66] text-white shadow-xs"
            : "text-[#55625F] hover:text-[#14201F]"
        }`}
      >
        Coverage gap
      </button>
    </div>
  );
}
