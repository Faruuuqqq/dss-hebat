"use client";

import React, { useMemo, useState } from "react";
import { useDSS } from "../lib/store";
import { emptyDraft, KRITERIA_URGENSI, SegmentDraft, validateDraft } from "../lib/scenario";

const KRITERIA_LABEL: Record<string, string> = {
  C1: "C1 Riwayat kerawanan",
  C2: "C2 Mobilitas malam",
  C3: "C3 Defisiensi penerangan",
  C4: "C4 Efisiensi coverage",
  C5: "C5 Kepadatan penghuni",
  C6: "C6 Derajat simpul",
  C7: "C7 Coverage gap (m)",
  C8: "C8 Fasilitas rentan",
};

function Field({
  id,
  label,
  value,
  onChange,
  numeric = true,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] font-medium text-[#3D4A47] block mb-1">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={numeric ? "decimal" : "text"}
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-[#F8FAF9] border border-[#DDE3E1] rounded-lg text-xs font-mono text-[#14201F] focus:outline-none focus:ring-1 focus:ring-[#0E6B66]"
      />
      {hint && <p className="text-[10px] text-[#55625F] mt-0.5">{hint}</p>}
    </div>
  );
}

/**
 * Form tambah segmen kandidat ke "Skenario Saya".
 * Sengaja memakai input teks, bukan NumberCell: nilai kosong harus tetap kosong
 * sampai diisi, supaya tidak diam-diam dihitung sebagai nol oleh mesin.
 */
export function SegmentForm({ onClose }: { onClose: () => void }) {
  const { dataset, addAlternative, draftLatLng, setDraftLatLng, pickMode, setPickMode } = useDSS();

  const nextId = useMemo(() => {
    let n = 0;
    dataset.alternatives.forEach((a) => {
      const m = /^A(\d+)$/.exec(a.id);
      if (m) n = Math.max(n, Number(m[1]));
    });
    return `A${n + 1}`;
  }, [dataset.alternatives]);

  const [draft, setDraft] = useState<SegmentDraft>(() => emptyDraft(nextId));
  const [manual, setManual] = useState<{ lat?: string; lng?: string }>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Koordinat hasil klik peta ditampilkan langsung; ketikan manual menimpanya
  // sampai tombol "Pilih lokasi dari peta" ditekan lagi.
  const latShown = manual.lat ?? (draftLatLng ? draftLatLng[0].toFixed(6) : draft.lat);
  const lngShown = manual.lng ?? (draftLatLng ? draftLatLng[1].toFixed(6) : draft.lng);

  const set = (patch: Partial<SegmentDraft>) => setDraft((prev) => ({ ...prev, ...patch }));
  const setK = (k: string, v: string) =>
    setDraft((prev) => ({ ...prev, kriteria: { ...prev.kriteria, [k]: v } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateDraft(
      { ...draft, lat: latShown, lng: lngShown },
      dataset.alternatives.map((a) => a.id)
    );
    if (!res.ok) {
      setErrors(res.errors);
      setWarnings([]);
      return;
    }
    addAlternative(res.alternative, res.value);
    setDraftLatLng(null);
    setPickMode(false);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F8FAF9] p-4 sm:p-5 rounded-xl border border-[#DDE3E1] space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm text-[#14201F]">Tambah segmen kandidat</h3>
          <p className="text-[11px] text-[#55625F]">
            Masuk ke Skenario Saya; preset acuan tidak diubah. Nilai yang belum tahu boleh dikosongkan
            (form menolak menyimpan sampai lengkap).
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FFF1D6] text-[#8A6A00]">
          [SIMULASI]
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field id="seg-id" label="ID segmen" value={draft.id} onChange={(v) => set({ id: v })} numeric={false} hint="Contoh: A6" />
        <Field id="seg-nama" label="Nama segmen" value={draft.nama_segmen} onChange={(v) => set({ nama_segmen: v })} numeric={false} />
        <Field id="seg-desa" label="Desa" value={draft.desa} onChange={(v) => set({ desa: v })} numeric={false} />
        <Field id="seg-tipe" label="Tipe segmen" value={draft.tipe_segmen} onChange={(v) => set({ tipe_segmen: v })} numeric={false} />
        <Field
          id="seg-lat"
          label="Latitude"
          value={latShown}
          onChange={(v) => {
            setManual((m) => ({ ...m, lat: v }));
            set({ lat: v });
          }}
          hint="Desimal, contoh -6.9335"
        />
        <Field
          id="seg-lng"
          label="Longitude"
          value={lngShown}
          onChange={(v) => {
            setManual((m) => ({ ...m, lng: v }));
            set({ lng: v });
          }}
          hint="Desimal, contoh 107.7733"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setManual({});
            setPickMode(!pickMode);
          }}
          aria-pressed={pickMode}
          className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors cursor-pointer ${
            pickMode
              ? "bg-[#0E6B66] text-white border-[#0E6B66]"
              : "bg-white text-[#14201F] border-[#DDE3E1] hover:bg-[#F3F5F4]"
          }`}
        >
          {pickMode ? "Klik peta untuk menaruh titik…" : "Pilih lokasi dari peta"}
        </button>
        <span className="text-[11px] text-[#55625F]">
          Koordinat terisi otomatis setelah peta diklik.
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {KRITERIA_URGENSI.map((k) => (
          <Field
            key={k}
            id={`seg-${k.toLowerCase()}`}
            label={KRITERIA_LABEL[k]}
            value={draft.kriteria[k]}
            onChange={(v) => setK(k, v)}
          />
        ))}
        <Field id="seg-c9" label="C9 Kelayakan (1–5)" value={draft.c9} onChange={(v) => set({ c9: v })} />
        <Field id="seg-biaya" label="Biaya (Rp juta)" value={draft.biaya_juta} onChange={(v) => set({ biaya_juta: v })} />
      </div>

      {errors.length > 0 && (
        <ul className="text-[11px] text-[#A8231A] bg-[#FBE4E1] border border-[#F5C2BC] rounded-lg p-2.5 space-y-0.5" role="alert">
          {errors.map((e) => (
            <li key={e}>• {e}</li>
          ))}
        </ul>
      )}
      {warnings.map((w) => (
        <p key={w} className="text-[11px] text-[#8A6A00] bg-[#FFF1D6] border border-[#F5DEB3] rounded-lg p-2.5">
          {w}
        </p>
      ))}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold text-white bg-[#0E6B66] hover:bg-[#0B5652] rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          Simpan segmen
        </button>
        <button
          type="button"
          onClick={() => {
            setDraftLatLng(null);
            setPickMode(false);
            onClose();
          }}
          className="px-4 py-2 text-xs font-semibold text-[#14201F] bg-white hover:bg-[#F3F5F4] border border-[#DDE3E1] rounded-lg transition-colors cursor-pointer"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
