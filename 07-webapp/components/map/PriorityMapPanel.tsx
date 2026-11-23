"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { PriorityMap2D } from "./PriorityMap2D";

export type MapViewType = "gis" | "2d";

const PriorityMapGIS = dynamic(
  () => import("./PriorityMapGIS").then((m) => m.PriorityMapGIS),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] sm:h-[340px] md:h-[380px] rounded-xl bg-[#EAF0EE] border border-[#DDE3E1] flex items-center justify-center text-xs text-[#55625F]">
        <svg
          className="w-5 h-5 mr-2 animate-spin text-[#0E6B66]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        Memuat peta GIS Jatinangor...
      </div>
    ),
  }
);

/**
 * Panel peta prioritas: pemilih tampilan GIS (Leaflet/OSM) dan 2D skematik (SVG).
 * Tampilan 3D Three.js dihapus agar fokus pada peta dasar nyata.
 */
export function PriorityMapPanel() {
  const [viewType, setViewType] = useState<MapViewType>("gis");

  const switcherHeader = (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#DDE3E1]">
      <span className="text-xs font-semibold text-[#55625F]">Mode Visualisasi Peta:</span>
      <div
        className="inline-flex items-center gap-1 bg-white p-1 rounded-lg border border-[#DDE3E1]"
        role="group"
        aria-label="Pilih Jenis Visualisasi Peta"
      >
        <button
          type="button"
          aria-pressed={viewType === "gis"}
          onClick={() => setViewType("gis")}
          className={`px-2.5 py-1 rounded text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
            viewType === "gis"
              ? "bg-[#0E6B66] text-white shadow-xs"
              : "text-[#55625F] hover:text-[#14201F]"
          }`}
        >
          GIS (OSM)
        </button>
        <button
          type="button"
          aria-pressed={viewType === "2d"}
          onClick={() => setViewType("2d")}
          className={`px-2.5 py-1 rounded text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer ${
            viewType === "2d"
              ? "bg-[#0E6B66] text-white shadow-xs"
              : "text-[#55625F] hover:text-[#14201F]"
          }`}
        >
          2D Skematik
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full rounded-2xl bg-[#EAF0EE] border border-[#DDE3E1] overflow-hidden p-4">
      {switcherHeader}
      {viewType === "gis" ? <PriorityMapGIS /> : <PriorityMap2D />}
    </div>
  );
}
