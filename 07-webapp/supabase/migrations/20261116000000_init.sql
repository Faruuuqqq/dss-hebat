-- Supabase Schema for SiPrioCCTV Jatinangor

-- 1. Profiles Table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'pakar' CHECK (role IN ('admin', 'pakar')),
  kelompok TEXT CHECK (kelompok IN ('G1 Pemda', 'G2 Kampus', 'G3 Warga')),
  nama TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Datasets Table
CREATE TABLE IF NOT EXISTS public.datasets (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  status TEXT NOT NULL DEFAULT 'SIMULASI',
  ahp_mode TEXT NOT NULL DEFAULT 'hierarki' CHECK (ahp_mode IN ('hierarki', 'datar')),
  plafon_per_fase_rp NUMERIC NOT NULL DEFAULT 15000000,
  c9_min_fase1 NUMERIC NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Alternatives Table
CREATE TABLE IF NOT EXISTS public.alternatives (
  id TEXT NOT NULL,
  dataset_id TEXT NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  nama_segmen TEXT NOT NULL,
  tipe_segmen TEXT,
  desa TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  karakteristik TEXT,
  PRIMARY KEY (id, dataset_id)
);

-- 4. Criteria Table
CREATE TABLE IF NOT EXISTS public.criteria (
  kode TEXT NOT NULL,
  dataset_id TEXT NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  klaster TEXT,
  satuan TEXT,
  skala TEXT,
  peran TEXT NOT NULL DEFAULT 'benefit',
  sumber_data TEXT,
  PRIMARY KEY (kode, dataset_id)
);

-- 5. Alternative Values
CREATE TABLE IF NOT EXISTS public.alternative_values (
  alternative_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  c1 NUMERIC NOT NULL DEFAULT 0,
  c2 NUMERIC NOT NULL DEFAULT 0,
  c3 NUMERIC NOT NULL DEFAULT 0,
  c4 NUMERIC NOT NULL DEFAULT 0,
  c5 NUMERIC NOT NULL DEFAULT 0,
  c6 NUMERIC NOT NULL DEFAULT 0,
  c7 NUMERIC NOT NULL DEFAULT 0,
  c8 NUMERIC NOT NULL DEFAULT 0,
  c9 NUMERIC NOT NULL DEFAULT 3,
  biaya_rp NUMERIC NOT NULL DEFAULT 6000000,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (alternative_id, dataset_id),
  FOREIGN KEY (alternative_id, dataset_id) REFERENCES public.alternatives(id, dataset_id) ON DELETE CASCADE
);

-- 6. AHP Judgments Table (Respondent Pairwise Matrix Entries)
CREATE TABLE IF NOT EXISTS public.ahp_judgments (
  id BIGSERIAL PRIMARY KEY,
  dataset_id TEXT NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  kelompok TEXT NOT NULL,
  level TEXT NOT NULL,
  kriteria_a TEXT NOT NULL,
  kriteria_b TEXT NOT NULL,
  nilai NUMERIC NOT NULL,
  responden_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Audit Log Table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternative_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ahp_judgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- Anonymous and all users can READ public data
CREATE POLICY "Public read datasets" ON public.datasets FOR SELECT USING (true);
CREATE POLICY "Public read alternatives" ON public.alternatives FOR SELECT USING (true);
CREATE POLICY "Public read criteria" ON public.criteria FOR SELECT USING (true);
CREATE POLICY "Public read alternative_values" ON public.alternative_values FOR SELECT USING (true);
CREATE POLICY "Public read ahp_judgments" ON public.ahp_judgments FOR SELECT USING (true);

-- Profiles: Users can view their own profile; admins can view all
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Write Permissions:
-- Admin full control
CREATE POLICY "Admin write datasets" ON public.datasets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin write alternatives" ON public.alternatives FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin write criteria" ON public.criteria FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin write alternative_values" ON public.alternative_values FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pakar users can insert their own AHP judgments
CREATE POLICY "Pakar insert judgments" ON public.ahp_judgments FOR INSERT WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

-- Audit Trigger on alternative_values
CREATE OR REPLACE FUNCTION log_alternative_values_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (table_name, record_id, old_data, new_data, user_id)
  VALUES (
    'alternative_values',
    NEW.alternative_id,
    row_to_json(OLD)::jsonb,
    row_to_json(NEW)::jsonb,
    NEW.updated_by
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_audit_alternative_values
AFTER UPDATE ON public.alternative_values
FOR EACH ROW EXECUTE FUNCTION log_alternative_values_change();
