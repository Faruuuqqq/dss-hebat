-- Seed data for SiPrioCCTV Jatinangor

-- 1. Datasets
INSERT INTO public.datasets (id, nama, deskripsi, status, ahp_mode, plafon_per_fase_rp, c9_min_fase1)
VALUES 
  ('ilustratif', 'Dataset Ilustratif (5 Segmen)', 'Data ilustratif hierarki 3 klaster x 3 kelompok responden sesuai xlsx', 'SIMULASI', 'hierarki', 15000000, 3),
  ('naskah_uts', 'Dataset Naskah UTS (AHP 8x8)', 'Model numerik kanonik proposal UTS: AHP datar 8x8, lambda_max 8.1031, CR 0.0104', 'SIMULASI', 'datar', 15000000, 3)
ON CONFLICT (id) DO NOTHING;

-- 2. Alternatives (Ilustratif)
INSERT INTO public.alternatives (id, dataset_id, nama_segmen, tipe_segmen, desa, lat, lng, karakteristik)
VALUES
  ('A1', 'ilustratif', 'Gang Kos Sayang', 'Gang residensial', 'Sayang', -6.9272, 107.7731, 'Gang sempit 1,5–2,5 m, padat indekos, buntu'),
  ('A2', 'ilustratif', 'Ruas Jalan Cikeruh', 'Ruas jalan', 'Cikeruh', -6.9265, 107.7712, 'Koridor 3–4 m dekat kampus, jalur mahasiswa malam'),
  ('A3', 'ilustratif', 'Persimpangan Hegarmanah', 'Persimpangan', 'Hegarmanah', -6.9298, 107.7698, 'Simpul 5 cabang; ATM, minimarket, halte'),
  ('A4', 'ilustratif', 'Gang Cipacing', 'Gang residensial', 'Cipacing', -6.9327, 107.7745, 'Gang panjang berliku, gelap, jauh dari CCTV aktif'),
  ('A5', 'ilustratif', 'Ruas Jalan Cileles', 'Ruas jalan', 'Cileles', -6.9241, 107.7790, 'Ruas sekunder lingkar timur kampus')
ON CONFLICT (id, dataset_id) DO NOTHING;

-- 3. Criteria (Ilustratif)
INSERT INTO public.criteria (kode, dataset_id, nama, klaster, satuan, skala, peran, sumber_data)
VALUES
  ('C1', 'ilustratif', 'Riwayat kerawanan', 'Risiko', 'kejadian/km/th', 'rasio', 'benefit', 'Rekap Polsek/desa; wawancara RT'),
  ('C2', 'ilustratif', 'Volume mobilitas malam', 'Paparan Aktivitas', 'orang/jam', 'rasio', 'benefit', 'Counting manual 18.00–24.00'),
  ('C3', 'ilustratif', 'Defisiensi penerangan', 'Risiko', 'skor 1–5', 'ordinal', 'benefit', 'Survei observasi malam; data Dishub'),
  ('C4', 'ilustratif', 'Efisiensi coverage', 'Karakteristik Spasial', 'm²/titik', 'rasio', 'benefit', 'Geometri OSM; uji pandang'),
  ('C5', 'ilustratif', 'Kepadatan penghuni', 'Paparan Aktivitas', 'kamar/km', 'rasio', 'benefit', 'Pendataan indekos; profil desa'),
  ('C6', 'ilustratif', 'Derajat simpul jalan', 'Karakteristik Spasial', 'cabang', 'rasio', 'benefit', 'Ekstraksi OSM; observasi'),
  ('C7', 'ilustratif', 'Coverage gap CCTV', 'Karakteristik Spasial', 'meter', 'rasio', 'benefit', 'Koordinat GPS kamera eksisting'),
  ('C8', 'ilustratif', 'Kedekatan fasilitas rentan', 'Paparan Aktivitas', 'unit POI/150 m', 'rasio', 'benefit', 'Observasi; POI OSM'),
  ('C9', 'ilustratif', 'Kelayakan implementasi', 'Kendala kelayakan', 'skor 1–5', 'ordinal', 'kendala', 'Survei teknis; estimasi RAB')
ON CONFLICT (kode, dataset_id) DO NOTHING;

-- 4. Alternative Values (Ilustratif)
INSERT INTO public.alternative_values (alternative_id, dataset_id, c1, c2, c3, c4, c5, c6, c7, c8, c9, biaya_rp)
VALUES
  ('A1', 'ilustratif', 12, 120, 4, 180, 410, 2, 260, 9, 4, 7000000),
  ('A2', 'ilustratif', 8, 310, 2, 520, 150, 3, 180, 5, 5, 6500000),
  ('A3', 'ilustratif', 15, 460, 4, 780, 150, 5, 110, 14, 4, 7000000),
  ('A4', 'ilustratif', 9, 60, 5, 210, 220, 2, 520, 3, 2, 6000000),
  ('A5', 'ilustratif', 3, 90, 3, 460, 90, 3, 340, 2, 3, 5500000)
ON CONFLICT (alternative_id, dataset_id) DO NOTHING;
