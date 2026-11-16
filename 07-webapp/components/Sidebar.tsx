"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDSS } from "../lib/store";

const navItems = [
  { href: "/", label: "Dashboard", badge: "1" },
  { href: "/kriteria", label: "Data Kriteria", badge: "2" },
  { href: "/ahp", label: "Pembobotan AHP", badge: "3" },
  { href: "/hasil", label: "Hasil & Anggaran", badge: "4" },
  { href: "/sensitivitas", label: "Uji Sensitivitas", badge: "5" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, datasetId, setDatasetId, resetDataset } = useDSS();

  return (
    <aside
      className="w-64 bg-[#0B3B38] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#0E4B47]"
      aria-label="Navigasi Utama"
    >
      <div>
        {/* Logo and Brand */}
        <div className="p-6 border-b border-[#144F4B]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E6B66] flex items-center justify-center text-white shadow-inner">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">SiPrioCCTV</span>
              <p className="text-xs text-[#95B5B0]">DSS Jatinangor</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5" aria-label="Menu Halaman">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E3ECEF] text-[#0B3B38] shadow-sm font-semibold"
                    : "text-[#DDE3E1] hover:bg-[#0E4B47] hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-[#0B3B38] text-white" : "bg-[#144F4B] text-[#95B5B0]"
                  }`}
                >
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Preset & Role Controls Footer */}
      <div className="p-4 border-t border-[#144F4B] space-y-3">
        {/* Dataset selector */}
        <div className="bg-[#082D2B] p-3 rounded-lg border border-[#144F4B]">
          <label htmlFor="dataset-preset-select" className="text-xs font-medium text-[#95B5B0] block mb-1">
            Preset Dataset:
          </label>
          <select
            id="dataset-preset-select"
            value={datasetId}
            onChange={(e) => setDatasetId(e.target.value)}
            className="w-full bg-[#0B3B38] border border-[#144F4B] text-white text-xs rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
          >
            <option value="ilustratif">Ilustratif (xlsx - Hierarki)</option>
            <option value="naskah_uts">Naskah UTS (AHP 8×8)</option>
          </select>
        </div>

        {/* Role toggle card */}
        <div className="bg-[#082D2B] p-3 rounded-lg border border-[#144F4B]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-white">
              Peran: <span className="text-[#3DD6CB] capitalize">{role}</span>
            </span>
            <button
              onClick={() => setRole(role === "admin" ? "pakar" : "admin")}
              className="text-[11px] underline text-[#95B5B0] hover:text-white"
            >
              Ubah ke {role === "admin" ? "Pakar" : "Admin"}
            </button>
          </div>
          <p className="text-[11px] text-[#95B5B0] leading-relaxed">
            {role === "admin"
              ? "Admin mengelola nilai kriteria dan alokasi anggaran."
              : "Pakar mengisi kuesioner perbandingan AHP berpasangan."}
          </p>
        </div>

        <button
          onClick={resetDataset}
          className="w-full py-2 px-3 text-xs text-[#DDE3E1] hover:text-white bg-[#0E4B47] hover:bg-[#135A55] rounded-lg transition-colors font-medium"
        >
          Reset ke Data Bawaan
        </button>
      </div>
    </aside>
  );
}
