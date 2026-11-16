"use client";

import React, { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = navItems.find((i) => i.href === pathname) ?? navItems[0];

  const renderNavContent = (isMobile = false) => (
    <>
      <div>
        {/* Brand Header */}
        <div className="p-5 sm:p-6 border-b border-[#144F4B] flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0E6B66] flex items-center justify-center text-white shadow-inner shrink-0">
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

          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu navigasi"
              className="p-2 rounded-lg text-[#95B5B0] hover:text-white hover:bg-[#0E4B47] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5" aria-label={isMobile ? "Menu Halaman Mobile" : "Menu Halaman"}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#E3ECEF] text-[#0B3B38] shadow-xs font-semibold"
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
          <label
            htmlFor={isMobile ? "dataset-preset-select-m" : "dataset-preset-select"}
            className="text-xs font-medium text-[#95B5B0] block mb-1"
          >
            Preset Dataset:
          </label>
          <select
            id={isMobile ? "dataset-preset-select-m" : "dataset-preset-select"}
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
          className="w-full py-2 px-3 text-xs text-[#DDE3E1] hover:text-white bg-[#0E4B47] hover:bg-[#135A55] rounded-lg transition-colors font-medium cursor-pointer"
        >
          Reset ke Data Bawaan
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Mobile Top Navigation Bar (Hidden on desktop lg:hidden) */}
      <header className="lg:hidden w-full bg-[#0B3B38] text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40 border-b border-[#0E4B47] shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0E6B66] flex items-center justify-center text-white shadow-inner">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight text-white">SiPrioCCTV</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#0E4B47] text-[11px] font-semibold text-white truncate max-w-[130px]">
            {activeItem.label}
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            className="p-2 rounded-lg bg-[#0E4B47] hover:bg-[#135A55] text-white transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* 2. Mobile Drawer Backdrop & Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0B3B38] text-white z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-label="Navigasi Mobile"
      >
        {renderNavContent(true)}
      </aside>

      {/* 4. Desktop Sidebar (Permanent, hidden on mobile) */}
      <aside
        className="hidden lg:flex w-64 bg-[#0B3B38] text-white flex-col justify-between shrink-0 min-h-screen border-r border-[#0E4B47] sticky top-0 h-screen overflow-y-auto"
        aria-label="Navigasi Utama"
      >
        {renderNavContent(false)}
      </aside>
    </>
  );
}
