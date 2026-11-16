"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useDSS } from "../../lib/store";
import { projectLatLngTo3D } from "../../lib/map-projection";
import cctvEksistingData from "../../data/cctv-eksisting.sim.json";
import jalanData from "../../data/jalan.sim.json";
import { PriorityMap2D } from "./PriorityMap2D";

export function PriorityMap3D() {
  const { dataset, result, activeMapMode, selectedAltId, setSelectedAltId } = useDSS();
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });
  const [hoveredAltId, setHoveredAltId] = useState<string | null>(null);
  const [view3D, setView3D] = useState(true);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 0xa8231a;
      case 2: return 0xb45309;
      case 3: return 0x8a6a00;
      case 4: return 0x2f6f8f;
      default: return 0x55625f;
    }
  };

  const getC9Color = (c9: number) => {
    if (c9 >= 4.5) return 0x0e6b66;
    if (c9 >= 3.5) return 0x2f6f8f;
    if (c9 >= 2.5) return 0x8a6a00;
    return 0xa8231a;
  };

  const getGapColor = (gap: number) => {
    if (gap > 400) return 0xa8231a;
    if (gap > 250) return 0xb45309;
    if (gap > 150) return 0x8a6a00;
    return 0x0e6b66;
  };

  const getNodeColorHex = React.useCallback((altId: string, rank: number) => {
    if (activeMapMode === "c9") {
      const c9 = dataset.values[altId]?.c9 ?? 3;
      return getC9Color(c9);
    }
    if (activeMapMode === "gap") {
      const gap = dataset.values[altId]?.kriteria["C7"] ?? 200;
      return getGapColor(gap);
    }
    return getRankColor(rank);
  }, [activeMapMode, dataset.values]);

  useEffect(() => {
    if (!view3D || !webglSupported) return;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = 360;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaf0ee);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 50, 60);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.9);
    sunLight.position.set(30, 60, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 4. Ground Plane
    const groundGeo = new THREE.PlaneGeometry(100, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2ece8,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 5. Road Networks
    jalanData.forEach((j) => {
      const pts = j.coords.map(([lat, lng]) => {
        const [x, z] = projectLatLngTo3D(lat, lng, 6);
        return new THREE.Vector3(x, 0.05, z);
      });
      const curve = new THREE.CatmullRomCurve3(pts);
      const points = curve.getPoints(50);
      const roadGeo = new THREE.BufferGeometry().setFromPoints(points);
      const roadMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 4 });
      const roadLine = new THREE.Line(roadGeo, roadMat);
      scene.add(roadLine);
    });

    // 6. Existing CCTV Cameras (Black Cubes)
    const cctvGeo = new THREE.BoxGeometry(2, 2, 2);
    const cctvMat = new THREE.MeshStandardMaterial({ color: 0x14201f, roughness: 0.5 });
    cctvEksistingData.forEach((c) => {
      const [x, z] = projectLatLngTo3D(c.lat, c.lng, 6);
      const mesh = new THREE.Mesh(cctvGeo, cctvMat);
      mesh.position.set(x, 1, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    // 7. Interactive Pillars for Candidate Segments
    const interactiveMeshes: { mesh: THREE.Mesh; altId: string }[] = [];

    dataset.alternatives.forEach((alt, idx) => {
      const [x, z] = projectLatLngTo3D(alt.lat, alt.lng, 6);
      const rank = result.topsis.rankings[idx] ?? idx + 1;
      const cc = result.topsis.CC[idx] ?? 0.5;
      const colHex = getNodeColorHex(alt.id, rank);

      // Height scaled by CC (higher CC = taller 3D column)
      const columnHeight = Math.max(3, cc * 18);
      const pillarGeo = new THREE.CylinderGeometry(2.4, 2.8, columnHeight, 24);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: colHex,
        roughness: 0.3,
        metalness: 0.2,
      });

      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, columnHeight / 2, z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;

      // Top beacon sphere
      const sphereGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colHex,
        emissive: colHex,
        emissiveIntensity: selectedAltId === alt.id ? 0.6 : 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(x, columnHeight + 1.2, z);

      scene.add(pillar);
      scene.add(sphere);

      interactiveMeshes.push({ mesh: pillar, altId: alt.id });
    });

    // 8. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes.map((im) => im.mesh));

      if (intersects.length > 0) {
        const hit = interactiveMeshes.find((im) => im.mesh === intersects[0].object);
        if (hit) {
          setHoveredAltId(hit.altId);
          renderer.domElement.style.cursor = "pointer";
          return;
        }
      }
      setHoveredAltId(null);
      renderer.domElement.style.cursor = "default";
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes.map((im) => im.mesh));

      if (intersects.length > 0) {
        const hit = interactiveMeshes.find((im) => im.mesh === intersects[0].object);
        if (hit) {
          setSelectedAltId(hit.altId);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousemove", onPointerMove);
    dom.addEventListener("click", onClick);

    // 9. Animation Loop
    let animId: number;
    let angle = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      // Gentle orbit camera
      angle += 0.0015;
      camera.position.x = Math.sin(angle) * 55;
      camera.position.z = Math.cos(angle) * 55;
      camera.lookAt(0, 4, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("mousemove", onPointerMove);
      dom.removeEventListener("click", onClick);
      renderer.dispose();
      if (container) container.innerHTML = "";
    };
  }, [view3D, webglSupported, dataset, result, activeMapMode, selectedAltId, getNodeColorHex, setSelectedAltId]);

  if (!webglSupported || !view3D) {
    return (
      <div className="relative">
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={() => setView3D(true)}
            className="px-2.5 py-1 text-xs bg-white/90 hover:bg-white text-[#0B3B38] font-medium rounded-lg border border-[#DDE3E1] shadow-xs"
          >
            Aktifkan Mode 3D
          </button>
        </div>
        <PriorityMap2D />
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-[#EAF0EE] border border-[#DDE3E1] overflow-hidden p-4">
      {/* 2D / 3D Switch Button */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setView3D(false)}
          className="px-2.5 py-1 text-xs bg-white/90 hover:bg-white text-[#0B3B38] font-medium rounded-lg border border-[#DDE3E1] shadow-xs transition-colors cursor-pointer"
        >
          Ganti ke Peta 2D
        </button>
      </div>

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-[280px] sm:h-[340px] md:h-[380px] cursor-grab active:cursor-grabbing rounded-xl overflow-hidden" />

      {/* Floating Hover Info Card */}
      {hoveredAltId && (
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl border border-[#DDE3E1] shadow-md text-xs pointer-events-none z-10 max-w-[190px] sm:max-w-[230px]">
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
                  <p>Tinggi Kolom (CC): <span className="font-mono font-medium">{cc.toFixed(4)}</span></p>
                  <p>Kelayakan C9: <span className="font-semibold">{c9}/5</span></p>
                  <p>Biaya: <span className="font-medium">Rp {(cost / 1e6).toFixed(1)} Jt</span></p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[#55625F] gap-2 pt-2 border-t border-[#DDE3E1]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A8231A]" /> Kolom 1 (Tertinggi)
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
        </div>
        <span className="text-[10px] text-[#475467] italic">
          Visual 3D Three.js · tinggi kolom ∝ CC TOPSIS [SIMULASI]
        </span>
      </div>
    </div>
  );
}
