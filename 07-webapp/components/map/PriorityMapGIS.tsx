"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useDSS } from "../../lib/store";
import { MAP_BOUNDS } from "../../lib/map-projection";
import cctvEksistingData from "../../data/cctv-eksisting.sim.json";
import jalanData from "../../data/jalan.sim.json";
import referensiRiilData from "../../data/referensi.riil.json";

export type BasemapStyle = "minimalis" | "osm" | "offline";

const FALLBACK_TILE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="#EAF0EE"/>
      <path d="M 64 0 L 64 256 M 128 0 L 128 256 M 192 0 L 192 256 M 0 64 L 256 64 M 0 128 L 256 128 M 0 192 L 256 192" stroke="#DDE3E1" stroke-width="0.75" stroke-dasharray="3 3"/>
      <rect width="256" height="256" fill="none" stroke="#D2DBD8" stroke-width="1"/>
    </svg>`
  );

const BASEMAP_CONFIG: Record<
  BasemapStyle,
  { url: string; attribution: string; maxZoom: number }
> = {
  minimalis: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  offline: {
    url: FALLBACK_TILE_SVG,
    attribution: "Grid Spasial Lokal Jatinangor (WGS84)",
    maxZoom: 19,
  },
};

const JATINANGOR_BOUNDS: L.LatLngBoundsExpression = [
  [MAP_BOUNDS.minLat, MAP_BOUNDS.minLng],
  [MAP_BOUNDS.maxLat, MAP_BOUNDS.maxLng],
];

const CAMPUS_CORE_BOUNDS: L.LatLngBoundsExpression = [
  [-6.9372, 107.7715],
  [-6.9315, 107.7798],
];

export function PriorityMapGIS() {
  const { dataset, result, activeMapMode, selectedAltId, setSelectedAltId } = useDSS();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayGroupRef = useRef<L.LayerGroup | null>(null);
  const isInitialMountRef = useRef<boolean>(true);

  const [basemap, setBasemap] = useState<BasemapStyle>("minimalis");
  const [showBuffer, setShowBuffer] = useState<boolean>(true);
  const [hoveredAltId, setHoveredAltId] = useState<string | null>(null);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#A8231A";
      case 2:
        return "#B45309";
      case 3:
        return "#8A6A00";
      case 4:
        return "#2F6F8F";
      default:
        return "#55625F";
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

  const getNodeColor = useCallback(
    (altId: string, rank: number) => {
      if (activeMapMode === "c9") {
        const c9 = dataset.values[altId]?.c9 ?? 3;
        return getC9Color(c9);
      }
      if (activeMapMode === "gap") {
        const gap = dataset.values[altId]?.kriteria["C7"] ?? 200;
        return getGapColor(gap);
      }
      return getRankColor(rank);
    },
    [activeMapMode, dataset.values]
  );

  const handleResetBounds = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds(JATINANGOR_BOUNDS, { padding: [28, 28], animate: true });
  }, []);

  const handleFocusCampus = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds(CAMPUS_CORE_BOUNDS, { padding: [28, 28], animate: true });
  }, []);

  // Effect #1: Initialize Leaflet map instance once on mount and clean up on unmount
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: [-6.9285, 107.7745],
      zoom: 15,
      zoomControl: false,
      keyboard: false,
      attributionControl: true,
    });

    // Remove focusable tabindex on container to prevent axe-core nested-interactive / scrollable-region violations
    container.removeAttribute("tabindex");

    L.control
      .zoom({
        position: "bottomright",
        zoomInTitle: "Perbesar peta",
        zoomOutTitle: "Perkecil peta",
      })
      .addTo(map);

    const cfg = BASEMAP_CONFIG.minimalis;
    const tileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
      errorTileUrl: FALLBACK_TILE_SVG,
    }).addTo(map);

    const overlayGroup = L.layerGroup().addTo(map);

    map.fitBounds(JATINANGOR_BOUNDS, { padding: [32, 32], animate: false });

    mapRef.current = map;
    tileLayerRef.current = tileLayer;
    overlayGroupRef.current = overlayGroup;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      overlayGroupRef.current = null;
    };
  }, []);

  // Effect #2: Update Basemap Tile URL without re-creating map instance
  useEffect(() => {
    const map = mapRef.current;
    const oldTile = tileLayerRef.current;
    if (!map) return;

    if (oldTile) {
      map.removeLayer(oldTile);
    }

    const cfg = BASEMAP_CONFIG[basemap];
    const nextTile = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
      errorTileUrl: FALLBACK_TILE_SVG,
    }).addTo(map);

    nextTile.bringToBack();
    tileLayerRef.current = nextTile;
  }, [basemap]);

  // Effect #3: Re-render Vector Overlays (Roads, Coverage Buffers, Existing CCTV, Candidate Markers)
  useEffect(() => {
    const group = overlayGroupRef.current;
    if (!group) return;

    group.clearLayers();

    // 1) Study Corridor Road Network (jalan.sim.json)
    jalanData.forEach((j) => {
      const latlngs = j.coords.map(([lat, lng]) => [lat, lng] as [number, number]);

      // Outer road casing for contrast on any basemap
      L.polyline(latlngs, {
        color: "#0E6B66",
        weight: 6,
        opacity: 0.25,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(group);

      // Inner corridor highlight
      L.polyline(latlngs, {
        color: "#FFFFFF",
        weight: 3,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(group);
    });

    // 2) Existing CCTV Cameras + 100m Reference Coverage Ring
    cctvEksistingData.forEach((c) => {
      if (showBuffer) {
        L.circle([c.lat, c.lng], {
          radius: 100,
          color: "#14201F",
          weight: 1.5,
          dashArray: "5 5",
          fillColor: "#14201F",
          fillOpacity: 0.06,
          interactive: false,
        }).addTo(group);
      }

      const existingIcon = L.divIcon({
        className: "dss-gis-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
        html: `
          <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;" title="${c.nama} (${c.jenis})">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <rect x="2" y="2" width="16" height="16" rx="3" fill="#14201F" stroke="#FFFFFF" stroke-width="2" />
              <circle cx="10" cy="10" r="3" fill="#FFFFFF" />
            </svg>
          </div>
        `,
      });

      const exMarker = L.marker([c.lat, c.lng], {
        icon: existingIcon,
        keyboard: false,
      });

      exMarker.on("add", () => {
        const el = exMarker.getElement();
        if (el) el.removeAttribute("tabindex");
      });

      exMarker.bindPopup(`
        <div style="min-width:185px;font-size:12px;color:#14201F;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span style="display:inline-block;width:10px;height:10px;background:#14201F;border-radius:2px;"></span>
            <strong style="font-size:12px;">${c.nama}</strong>
          </div>
          <div style="color:#55625F;font-size:11px;margin-bottom:6px;">${c.catatan}</div>
          <div style="border-top:1px solid #EEF2F1;padding-top:4px;font-size:11px;display:flex;justify-content:space-between;">
            <span>Jenis: <strong>${c.jenis}</strong></span>
            <span style="color:#0E6B66;font-weight:600;">${c.status}</span>
          </div>
          <div style="font-size:10px;color:#55625F;margin-top:3px;">
            ${c.kepastian === "riil" ? "Kamera riil (terdokumentasi)" : "Simulasi visual"} · ${c.sumber}
          </div>
        </div>
      `);

      exMarker.addTo(group);
    });

    // 2b) Real reference landmarks (campuses, gates, halte) for spatial context
    referensiRiilData.forEach((r) => {
      const refIcon = L.divIcon({
        className: "dss-gis-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8],
        html: `
          <div style="width:16px;height:16px;display:flex;align-items:center;justify-content:center;" title="${r.nama}">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <rect x="2.5" y="2.5" width="9" height="9" transform="rotate(45 7 7)" fill="#5B6B68" stroke="#FFFFFF" stroke-width="1.5" />
            </svg>
          </div>
        `,
      });

      const refMarker = L.marker([r.lat, r.lng], {
        icon: refIcon,
        keyboard: false,
      });

      refMarker.on("add", () => {
        const el = refMarker.getElement();
        if (el) el.removeAttribute("tabindex");
      });

      refMarker.bindPopup(`
        <div style="min-width:170px;font-size:12px;color:#14201F;">
          <strong style="font-size:12px;">${r.nama}</strong>
          <div style="color:#55625F;font-size:11px;margin:2px 0 6px;">${r.jenis}</div>
          <div style="border-top:1px solid #EEF2F1;padding-top:4px;font-size:10px;color:#55625F;">
            Referensi riil · ${r.sumber}
          </div>
        </div>
      `);

      refMarker.addTo(group);
    });

    // 3) Candidate CCTV Segments (A1-A5) + 75m Coverage Buffer
    dataset.alternatives.forEach((alt, idx) => {
      const rank = result.topsis.rankings[idx] ?? idx + 1;
      const cc = result.topsis.CC[idx] ?? 0.5;
      const c9 = dataset.values[alt.id]?.c9 ?? 3;
      const gapM = dataset.values[alt.id]?.kriteria["C7"] ?? 200;
      const costRp = dataset.values[alt.id]?.biaya_rp ?? 0;
      const allocItem = result.allocation.items.find((i) => i.alternatif_id === alt.id);
      const faseLabel =
        allocItem?.fase === 1
          ? "Fase 1 · Segera"
          : allocItem?.fase
          ? `Fase ${allocItem.fase}`
          : "Ditunda";

      const color = getNodeColor(alt.id, rank);
      const isSelected = selectedAltId === alt.id;

      // 75m Effective Camera Coverage Buffer Circle
      if (showBuffer) {
        L.circle([alt.lat, alt.lng], {
          radius: 75,
          color,
          weight: isSelected ? 2.2 : 1.4,
          fillColor: color,
          fillOpacity: isSelected ? 0.22 : 0.12,
          interactive: false,
        }).addTo(group);
      }

      const size = isSelected ? 42 : 36;
      const half = size / 2;

      const candidateIcon = L.divIcon({
        className: "dss-gis-marker",
        iconSize: [size, size],
        iconAnchor: [half, half],
        popupAnchor: [0, -half],
        html: `
          <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <svg width="${size}" height="${size}" viewBox="0 0 42 42" aria-hidden="true">
              ${
                isSelected
                  ? `<circle cx="21" cy="21" r="19" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="4 2" />`
                  : ""
              }
              <circle cx="21" cy="21" r="14.5" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" />
              <text x="21" y="25" text-anchor="middle" fill="#FFFFFF" font-size="11.5" font-weight="800" font-family="sans-serif">${alt.id}</text>
            </svg>
            <span style="position:absolute;top:-2px;right:-2px;background:#14201F;color:#FFFFFF;font-size:9px;font-weight:700;line-height:1;padding:2px 4px;border-radius:999px;border:1.5px solid #FFFFFF;box-shadow:0 1px 3px rgba(0,0,0,0.25);">
              #${rank}
            </span>
          </div>
        `,
      });

      const marker = L.marker([alt.lat, alt.lng], {
        icon: candidateIcon,
        keyboard: false,
        zIndexOffset: isSelected ? 1000 : (6 - rank) * 100,
      });

      marker.on("add", () => {
        const el = marker.getElement();
        if (el) el.removeAttribute("tabindex");
      });

      marker.on("click", () => {
        setSelectedAltId(alt.id);
      });

      marker.on("mouseover", () => {
        setHoveredAltId(alt.id);
      });

      marker.on("mouseout", () => {
        setHoveredAltId(null);
      });

      const ccText = cc.toFixed(4).replace(".", ",");
      const costText = (costRp / 1_000_000).toFixed(1).replace(".", ",");

      marker.bindPopup(`
        <div style="min-width:210px;font-size:12px;color:#14201F;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:2px;">
            <strong style="font-size:13px;">${alt.id} · ${alt.nama_segmen}</strong>
            <span style="background:${color};color:#FFFFFF;font-size:10px;font-weight:700;padding:1px 6px;border-radius:999px;">#${rank}</span>
          </div>
          <div style="color:#55625F;font-size:11px;margin-bottom:8px;">
            Desa ${alt.desa} · ${alt.tipe_segmen}
          </div>
          <div style="border-top:1px solid #EEF2F1;padding-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;font-size:11px;">
            <div>Skor TOPSIS: <strong style="font-family:monospace;">${ccText}</strong></div>
            <div>Kelayakan C9: <strong>${c9}/5</strong></div>
            <div>Jarak C7: <strong>${gapM} m</strong></div>
            <div>Biaya RAB: <strong>Rp${costText} jt</strong></div>
          </div>
          <div style="margin-top:6px;padding-top:6px;border-top:1px solid #EEF2F1;display:flex;align-items:center;justify-content:space-between;font-size:11px;">
            <span style="color:#55625F;">Rekomendasi:</span>
            <strong style="color:${allocItem?.fase === 1 ? "#A8231A" : "#0B3B38"};">${faseLabel}</strong>
          </div>
        </div>
      `);

      marker.addTo(group);
    });
  }, [dataset, result, activeMapMode, selectedAltId, showBuffer, getNodeColor, setSelectedAltId]);

  // Effect #4: Bi-directional camera focus when selectedAltId changes from table/list
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    const map = mapRef.current;
    if (!map || !selectedAltId) return;
    const target = dataset.alternatives.find((a) => a.id === selectedAltId);
    if (!target) return;

    const targetZoom = Math.max(map.getZoom(), 16);
    map.flyTo([target.lat, target.lng], targetZoom, { animate: true, duration: 0.45 });
  }, [selectedAltId, dataset.alternatives]);

  const activeAltId = hoveredAltId ?? selectedAltId;
  const activeAlt = dataset.alternatives.find((a) => a.id === activeAltId);
  const activeIdx = dataset.alternatives.findIndex((a) => a.id === activeAltId);
  const activeRank = activeIdx >= 0 ? result.topsis.rankings[activeIdx] ?? 1 : 1;
  const activeCC = activeIdx >= 0 ? result.topsis.CC[activeIdx] ?? 0 : 0;
  const activeC9 = activeAltId ? dataset.values[activeAltId]?.c9 ?? 3 : 3;
  const activeCost = activeAltId ? dataset.values[activeAltId]?.biaya_rp ?? 0 : 0;
  const activeGap = activeAltId ? dataset.values[activeAltId]?.kriteria["C7"] ?? 200 : 200;

  return (
    <div className="space-y-3">
      {/* Sub-toolbar for GIS Controls (Basemap, Buffer Radius, Reset View) */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#55625F] mr-1">Peta dasar:</span>
          <button
            type="button"
            onClick={() => setBasemap("minimalis")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              basemap === "minimalis"
                ? "bg-[#0B3B38] text-white border-[#0B3B38]"
                : "bg-white text-[#14201F] border-[#DDE3E1] hover:bg-[#F3F5F4]"
            }`}
          >
            OSM Minimalis (DSS)
          </button>
          <button
            type="button"
            onClick={() => setBasemap("osm")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              basemap === "osm"
                ? "bg-[#0B3B38] text-white border-[#0B3B38]"
                : "bg-white text-[#14201F] border-[#DDE3E1] hover:bg-[#F3F5F4]"
            }`}
          >
            OSM Warna
          </button>
          <button
            type="button"
            onClick={() => setBasemap("offline")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              basemap === "offline"
                ? "bg-[#0B3B38] text-white border-[#0B3B38]"
                : "bg-white text-[#14201F] border-[#DDE3E1] hover:bg-[#F3F5F4]"
            }`}
          >
            Grid Lokal
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowBuffer((prev) => !prev)}
            aria-pressed={showBuffer}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              showBuffer
                ? "bg-[#E3F1EF] text-[#0B3B38] border-[#0E6B66]"
                : "bg-white text-[#55625F] border-[#DDE3E1] hover:bg-[#F3F5F4]"
            }`}
          >
            Radius 75m {showBuffer ? "Aktif" : "Nonaktif"}
          </button>
          <button
            type="button"
            onClick={handleFocusCampus}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white text-[#14201F] border border-[#DDE3E1] hover:bg-[#F3F5F4] transition-colors cursor-pointer"
          >
            Fokus Kampus
          </button>
          <button
            type="button"
            onClick={handleResetBounds}
            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white text-[#14201F] border border-[#DDE3E1] hover:bg-[#F3F5F4] transition-colors cursor-pointer"
          >
            Koridor Penuh
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div
        className={`relative w-full rounded-xl overflow-hidden border border-[#DDE3E1] ${
          basemap === "minimalis" ? "dss-map-muted" : ""
        }`}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-[280px] sm:h-[340px] md:h-[380px]"
          role="region"
          aria-label="Peta GIS Interaktif Prioritas CCTV Jatinangor"
        />

        {/* Floating Active Segment Summary Overlay */}
        {activeAlt && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 rounded-xl border border-[#DDE3E1] shadow-md text-xs pointer-events-none z-20 max-w-[200px] sm:max-w-[235px]">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-[#14201F] text-xs sm:text-sm truncate">
                {activeAlt.id} · {activeAlt.nama_segmen}
              </p>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FBE4E1] text-[#A8231A] shrink-0">
                #{activeRank}
              </span>
            </div>
            <p className="text-[#55625F] text-[11px] mt-0.5">
              Desa {activeAlt.desa} · {activeAlt.tipe_segmen}
            </p>
            <div className="mt-2 pt-1.5 border-t border-[#EEF2F1] grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
              <p>
                CC:{" "}
                <span className="font-mono font-semibold text-[#14201F]">
                  {activeCC.toFixed(4).replace(".", ",")}
                </span>
              </p>
              <p>
                C9: <span className="font-semibold text-[#14201F]">{activeC9}/5</span>
              </p>
              <p>
                Gap C7: <span className="font-semibold text-[#14201F]">{activeGap} m</span>
              </p>
              <p>
                RAB:{" "}
                <span className="font-semibold text-[#14201F]">
                  Rp{(activeCost / 1e6).toFixed(1).replace(".", ",")} jt
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend & Academic Transparency Notice */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-[#55625F] gap-2 pt-2 border-t border-[#DDE3E1]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8231A]" /> #1
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" /> #2
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8A6A00]" /> #3
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2F6F8F]" /> #4
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#55625F]" /> #5
          </span>
          <span className="flex items-center gap-1 ml-1">
            <span className="w-2.5 h-2.5 bg-[#14201F] rounded-xs" /> CCTV Eksisting (100m)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#5B6B68] rotate-45" /> Referensi riil (kampus/halte)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border border-[#A8231A] bg-[#A8231A]/15" /> Buffer Usulan (75m)
          </span>
        </div>
        <span className="text-[10px] text-[#475467] italic">
          Peta GIS OpenStreetMap · koordinat segmen representatif [SIMULASI]
        </span>
      </div>
    </div>
  );
}
