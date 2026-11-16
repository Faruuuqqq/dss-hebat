# Mockup & Tampilan Antarmuka Aplikasi SiPrioCCTV

Folder ini mendokumentasikan desain antarmuka, *wireframe*, dan tangkapan layar visual untuk aplikasi DSS Prioritisasi Penempatan CCTV Jatinangor.

Dokumentasi visual mencakup tiga artefak penting:
1. **Mockup Desain Referensi:** [`../../SiPrioCCTV Jatinangor.html`](../../SiPrioCCTV%20Jatinangor.html) (Mockup 5 layar interaktif yang menjadi acuan desain UI).
2. **Implementasi Aplikasi Modern:** [`../../07-webapp/`](../../07-webapp/) (Next.js 16 + Tailwind CSS 4 + Three.js dengan 5 halaman terdedikasi).
3. **Prototipe Mandiri (Offline):** [`../../05-aplikasi/index.html`](../../05-aplikasi/index.html) (Aplikasi satu-berkas offline).

---

## 1. Artefak Tangkapan Layar Tersedia

| Berkas | Viewport | Isi yang Terlihat |
|---|---:|---|
| `mockup-desktop.png` | 1440 × 2200 px | Header, KPI, matriks keputusan, bobot AHP, hasil TOPSIS, dan awal peta prioritas. |
| `mockup-mobile.png` | 430 × 1600 px | Tampilan responsif pada perangkat mobile: kartu KPI, formulir matriks, dan AHP. |

---

## 2. Struktur 5 Layar Aplikasi Modern (`07-webapp/`)

Aplikasi modern mengorganisasikan tata letak menjadi 5 rute independen dengan navigasi sidebar terpadu:

1. **Dashboard (`/`):**
   - 4 Kartu KPI: Jumlah segmen dievaluasi, Segmen urgensi tertinggi ($A_3$), Rasio konsistensi Saaty ($CR$), dan Anggaran terpakai Fase 1.
   - Kanvas Peta 3D Interaktif (Three.js): Pilar tinggi proporsional terhadap skor $CC$, kubus kamera eksisting, dan kontrol layer (Urgensi, Kesiapan $C_9$, Gap $C_7$).
   - Bar Peringkat TOPSIS & Kartu Alokasi Fase Anggaran 1–3.
2. **Data Kriteria (`/kriteria`):**
   - Matriks keputusan terkelompok berdasarkan 3 klaster (Risiko, Paparan, Spasial) serta Biaya dan $C_9$.
   - Formulir aman edit alternatif (`NumberCell.tsx`) dengan proteksi anti-blur bug.
   - Panel transparansi sumber data lapangan vs estimasi.
3. **Pembobotan AHP (`/ahp`):**
   - Matriks perbandingan klaster dan badge konsistensi ($CR$, $\lambda_{\max}$, $RI$).
   - Kuesioner slider Saaty terpandu (skala 1–9) untuk responden pakar/stakeholder.
   - Rincian kartu bobot global kriteria hasil perkalian bobot klaster $\times$ bobot lokal.
4. **Hasil TOPSIS & Alokasi Anggaran (`/hasil`):**
   - Tabel komprehensif TOPSIS ($D^+$, $D^-$, $CC$).
   - Progress bar alokasi bertahap dan daftar segmen terpilih per fase.
   - Formulir dinamis pengaturan plafon biaya per fase dan ambang $C_9$ minimum Fase 1.
   - Tombol ekspor laporan lengkap ke CSV.
5. **Uji Sensitivitas (`/sensitivitas`):**
   - Pilihan kriteria interaktif dan variasi bobot ($-20\%$, $0\%$, $+20\%$).
   - Visualisasi pergeseran peringkat (*rank shift indicator*) dan deteksi pembalikan peringkat (*rank reversal*).
   - Tabel matriks ringkasan 16 skenario *one-at-a-time* (OAT).

---

## 3. Instruksi Reproduksi Tangkapan Layar Headless

Tangkapan layar dapat diperbarui kapan saja menggunakan Chromium/Chrome secara headless:

### Dari Aplikasi Modern `07-webapp/`:
```bash
# Jalankan server Next.js di latar belakang
cd 07-webapp && npm start -p 3111 &
sleep 2

# Ambil screenshot desktop 1440px
CHROME="$(ls -1 "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux64/chrome | tail -1)"
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1440,1080 \
  --screenshot="$PWD/../08-docs/mockup/mockup-desktop.png" \
  "http://127.0.0.1:3111/"

# Ambil screenshot mobile 390px
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=390,844 \
  --screenshot="$PWD/../08-docs/mockup/mockup-mobile.png" \
  "http://127.0.0.1:3111/"
```

### Dari Prototipe Offline `05-aplikasi/`:
```bash
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1440,2200 \
  --screenshot="$PWD/08-docs/mockup/mockup-desktop.png" \
  "file://$PWD/05-aplikasi/index.html"
```
