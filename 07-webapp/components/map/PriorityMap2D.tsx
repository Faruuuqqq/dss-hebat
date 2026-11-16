"use client";

import React, { useState } from "react";
import { useDSS } from "../../lib/store";
import { projectLatLngTo2D } from "../../lib/map-projection";
import cctvEksistingData from "../../data/cctv-eksisting.sim.json";
import jalanData from "../../data/jalan.sim.json";

export function PriorityMap2D() {
  const { dataset, result, activeMapMode, selectedAltId, setSelectedAltId } = useDSS();
  const [hoveredAltId, setHoveredAltId] = useState<string | null>(null);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "#A8231A";
      case 2: return "#B45309";
      case 3: return "#8A6A00";
      case 4: return "#2F6F8F";
      default: return "#55625F";
    }
  };

  const getC9Color = (c9: number) => {
    if (c9 >= 4.5) return "#0E6B66";
    if (c9 >= 3.5) return "#2F6F8F";
    if (c9 >= 2.5) return "#8A6A00";
    return "#A8231A";
  };

  const getGapColor = (gap: number) => {
    if (gap > 400) return "#A8231A";
    if (gap > 250) return "#B45309";
    if (gap > 150) return "#8A6A00";
    return "#0E6B66";
  };

  const getNodeColor = (altId: string, rank: number) => {
    if (activeMapMode === "c9") {
      const c9 = dataset.values[altId]?.c9 ?? 3;
      return getC9Color(c9);
    }
    if (activeMapMode === "gap") {
      const gap = dataset.values[altId]?.kriteria["C7"] ?? 200;
      return getGapColor(gap);
    }
    return getRankColor(rank);
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#EAF0EE] border border-[#DDE3E1] overflow-hidden p-4">
      <svg
        viewBox="0 0 540 380"
        className="w-full h-auto select-none"
        aria-label="Peta Skematik Prioritas CCTV Jatinangor"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Road networks */}
        {jalanData.map((j) => {
          const points = j.coords
            .map(([lat, lng]) => {
              const [x, y] = projectLatLngTo2D(lat, lng);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polyline
              key={j.id}
              points={points}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            />
          );
        })}

        {/* Existing CCTV cameras (Black squares) */}
        {cctvEksistingData.map((c) => {
          const [cx, cy] = projectLatLngTo2D(c.lat, c.lng);
          return (
            <g key={c.id}>
              <rect
                x={cx - 7}
                y={cy - 7}
                width="14"
                height="14"
                fill="#14201F"
                rx="2"
              />
              <title>{`${c.nama} (${c.jenis})`}</title>
            </g>
          );
        })}

        {/* Candidate Segments */}
        {dataset.alternatives.map((alt, idx) => {
          const [cx, cy] = projectLatLngTo2D(alt.lat, alt.lng);
          const rank = result.topsis.rankings[idx] ?? idx + 1;
          const cc = result.topsis.CC[idx] ?? 0.5;
          const radius = Math.round(16 + cc * 10);
          const color = getNodeColor(alt.id, rank);
          const isSelected = selectedAltId === alt.id;
          const isHovered = hoveredAltId === alt.id;

          return (
            <g
              key={alt.id}
              className="cursor-pointer transition-transform"
              onClick={() => setSelectedAltId(alt.id)}
              onMouseEnter={() => setHoveredAltId(alt.id)}
              onMouseLeave={() => setHoveredAltId(null)}
            >
              {/* Highlight halo when selected or hovered */}
              {(isSelected || isHovered) && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius + 6}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
              )}

              {/* Main Node */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={color}
                filter="url(#shadow)"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />

              {/* Node ID label */}
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {alt.id}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Active Info Overlay */}
      {hoveredAltId && (
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#DDE3E1] shadow-md text-xs pointer-events-none z-10 max-w-[220px]">
          {(() => {
            const alt = dataset.alternatives.find((a) => a.id === hoveredAltId);
            const idx = dataset.alternatives.findIndex((a) => a.id === hoveredAltId);
            const rank = result.topsis.rankings[idx] ?? 1;
            const cc = result.topsis.CC[idx] ?? 0;
            const c9 = dataset.values[hoveredAltId]?.c9 ?? 3;
            const cost = dataset.values[hoveredAltId]?.biaya_rp ?? 0;
            return (
              <div>
                <p className="font-bold text-[#14201F] text-sm">{hoveredAltId} · {alt?.nama_segmen}</p>
                <p className="text-[#55625F]">{alt?.desa} · {alt?.tipe_segmen}</p>
                <div className="mt-2 space-y-1 text-[11px] pt-1 border-t border-[#EEF2F1]">
                  <p>Peringkat: <span className="font-semibold text-[#A8231A]">#{rank}</span></p>
                  <p>Closeness CC: <span className="font-mono font-medium">{cc.toFixed(4)}</span></p>
                  <p>Kelayakan C9: <span className="font-semibold">{c9}/5</span></p>
                  <p>Biaya Titik: <span className="font-medium">Rp {(cost / 1e6).toFixed(1)} Jt</span></p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer Disclaimer & Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[#55625F] gap-2 pt-2 border-t border-[#DDE3E1]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8231A]" /> 1
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" /> 2
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8A6A00]" /> 3
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F6F8F]" /> 4
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55625F]" /> 5
          </span>
          <span className="flex items-center gap-1 ml-2">
            <span className="w-2.5 h-2.5 bg-[#14201F] rounded-xs" /> CCTV Eksisting
          </span>
        </div>
        <span className="text-[10px] text-[#475467] italic">
          Peta skematik · koordinat ilustratif [SIMULASI]
        </span>
      </div>
    </div>
  );
}
