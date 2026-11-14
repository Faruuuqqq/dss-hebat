"use client";

import { useId, useState } from "react";
import { compact, parseNumber } from "@/lib/format";

/**
 * Sel angka yang aman untuk diedit.
 *
 * Kenapa komponen ini ada: input angka yang dikendalikan langsung oleh state
 * numerik (pola `value={n} onChange={e => setN(Number(e.target.value))}`)
 * merusak pengetikan normal. Saat pengguna mengosongkan sel, `Number("")`
 * bernilai 0, React mengisi ulang "0", lalu karakter berikutnya menempel:
 * "7.5" berubah menjadi "75" dan "1250" menjadi "01250".
 *
 * Kontrak komponen ini:
 *  - Saat fokus, teks yang diketik ditampilkan apa adanya (draft), sehingga
 *    titik/koma dan angka parsial tidak dibuang oleh re-render.
 *  - Koma diterima sebagai pemisah desimal dan dinormalkan menjadi titik.
 *  - Nilai sah langsung diteruskan ke induk agar hasil menghitung ulang live.
 *  - Penjepitan min/max dan pemformatan ulang dilakukan saat blur.
 *  - Blur dengan teks kosong/tidak valid mengembalikan nilai sah terakhir.
 */

type Props = {
  value: number;
  onCommit: (v: number) => void;
  label: string;
  min?: number;
  max?: number;
  /** Jumlah desimal tetap saat tidak fokus. Kosong = tampilan ringkas. */
  decimals?: number;
  className?: string;
  /** Lebar kelas tambahan, mis. "w-[62px]". */
  widthClass?: string;
};

export function NumberCell({
  value,
  onCommit,
  label,
  min,
  max,
  decimals,
  className = "",
  widthClass = "",
}: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const id = useId();

  const clamp = (v: number): number => {
    let out = v;
    if (min !== undefined) out = Math.max(min, out);
    if (max !== undefined) out = Math.min(max, out);
    return out;
  };

  const shown = draft ?? compact(value, decimals);

  function handleChange(next: string) {
    // Pertahankan teks apa adanya selama mengedit, tetapi normalkan koma.
    const normalised = next.replace(/,/g, ".");
    setDraft(normalised);
    const parsed = parseNumber(normalised);
    if (parsed !== null) onCommit(clamp(parsed));
  }

  function handleBlur() {
    // Kembali ke nilai kanonik dari induk: sekaligus menjepit dan memformat.
    setDraft(null);
  }

  return (
    <input
      id={id}
      aria-label={label}
      className={`cell ${widthClass} ${className}`}
      // type="text" + inputMode: type="number" menolak koma dan membuang
      // teks parsial seperti "7." di sebagian peramban.
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      value={shown}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(null);
          e.currentTarget.blur();
        }
      }}
    />
  );
}
