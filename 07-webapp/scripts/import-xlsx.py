#!/usr/bin/env python3
import json
import os
import zipfile
import xml.etree.ElementTree as ET

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def extract_xlsx(xlsx_path):
    z = zipfile.ZipFile(xlsx_path, 'r')
    # shared strings
    sst = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('.//m:si', NS):
            texts = [t.text for t in si.findall('.//m:t', NS) if t.text is not None]
            sst.append(''.join(texts))
    
    # sheet names mapping
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = []
    for s in wb.findall('.//m:sheet', NS):
        sheets.append((s.get('name'), s.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')))
    
    # rels
    wb_rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rel_map = {}
    for r in wb_rels.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
        rel_map[r.get('Id')] = r.get('Target')
        
    def read_sheet(sheet_name):
        target_id = None
        for name, r_id in sheets:
            if name.lower() == sheet_name.lower():
                target_id = r_id
                break
        if not target_id:
            raise ValueError(f"Sheet {sheet_name} not found")
        target_rel = rel_map[target_id].lstrip('/')
        if not target_rel.startswith('xl/'):
            target_path = 'xl/' + target_rel
        else:
            target_path = target_rel
        stree = ET.fromstring(z.read(target_path))
        rows = []
        for row in stree.findall('.//m:row', NS):
            r_num = int(row.get('r'))
            row_cells = {}
            for c in row.findall('m:c', NS):
                ref = c.get('r')
                # col letters
                col_letter = ''.join([ch for ch in ref if ch.isalpha()])
                # compute col index (A=0, B=1, etc)
                col_idx = 0
                for ch in col_letter:
                    col_idx = col_idx * 26 + (ord(ch.upper()) - ord('A') + 1)
                col_idx -= 1
                
                t = c.get('t')
                val = None
                if t == 'inlineStr':
                    t_el = c.find('.//m:t', NS)
                    if t_el is not None:
                        val = t_el.text
                elif t == 's':
                    val_el = c.find('m:v', NS)
                    if val_el is not None and val_el.text:
                        val = sst[int(val_el.text)]
                else:
                    val_el = c.find('m:v', NS)
                    if val_el is not None:
                        val = val_el.text
                    else:
                        t_el = c.find('.//m:t', NS)
                        if t_el is not None:
                            val = t_el.text
                row_cells[col_idx] = val
            
            max_c = max(row_cells.keys()) if row_cells else -1
            row_arr = [row_cells.get(i) for i in range(max_c + 1)]
            rows.append((r_num, row_arr))
        rows.sort(key=lambda x: x[0])
        return [r[1] for r in rows]
        
    return read_sheet

def parse_num(v):
    if v is None: return None
    try:
        f = float(v)
        return int(f) if f.is_integer() else f
    except ValueError:
        return v

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    xlsx_path = os.path.join(os.path.dirname(root_dir), 'Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx')
    if not os.path.exists(xlsx_path):
        xlsx_path = os.path.join(root_dir, 'Dataset_Ilustratif_DSS_CCTV_Jatinangor.xlsx')
    
    get_sheet = extract_xlsx(xlsx_path)
    
    # 1. alternatif (koordinat diselaraskan ke lokasi geografis nyata OpenStreetMap Jatinangor)
    REAL_COORDS = {
        'A1': (-6.9335, 107.7733),
        'A2': (-6.9340, 107.7768),
        'A3': (-6.9336, 107.7783),
        'A4': (-6.9428, 107.7622),
        'A5': (-6.9118, 107.7774),
    }
    raw_alt = get_sheet('alternatif')
    header_alt = raw_alt[0]
    alternatives = []
    for r in raw_alt[1:]:
        if not r or r[0] is None: continue
        lat, lng = REAL_COORDS.get(r[0], (float(r[4]), float(r[5])))
        alternatives.append({
            'id': r[0],
            'nama_segmen': r[1],
            'tipe_segmen': r[2],
            'desa': r[3],
            'lat': lat,
            'lng': lng,
            'karakteristik': r[6]
        })
        
    # 2. kriteria
    raw_crit = get_sheet('kriteria')
    criteria = []
    for r in raw_crit[1:]:
        if not r or r[0] is None: continue
        criteria.append({
            'kode': r[0],
            'nama': r[1],
            'klaster': r[2],
            'satuan': r[3],
            'skala': r[4],
            'peran': r[5],
            'sumber_data': r[6] if len(r) > 6 else ''
        })
        
    # 3. nilai_kriteria
    raw_vals = get_sheet('nilai_kriteria')
    header_vals = raw_vals[0]
    values = {}
    for r in raw_vals[1:]:
        if not r or r[0] is None: continue
        alt_id = r[0]
        # C1 to C8
        c_scores = {}
        for idx in range(1, 9):
            c_name = header_vals[idx]
            c_scores[c_name] = float(r[idx])
        c9_score = float(r[9])
        biaya = float(r[10])
        values[alt_id] = {
            'kriteria': c_scores,
            'c9': c9_score,
            'biaya_rp': biaya
        }
        
    # 4. stakeholder_responden
    raw_stk = get_sheet('stakeholder_responden')
    stakeholders = []
    for r in raw_stk[1:]:
        if not r or r[0] is None: continue
        stakeholders.append({
            'responden_id': r[0],
            'kelompok': r[1],
            'instansi': r[2],
            'peran': r[3]
        })
        
    # 5. ahp_pairwise
    raw_pw = get_sheet('ahp_pairwise')
    pairwise = []
    for r in raw_pw[1:]:
        if not r or r[0] is None: continue
        pairwise.append({
            'kelompok': r[0],
            'level': r[1],
            'kriteria_a': r[2],
            'kriteria_b': r[3],
            'nilai_saaty_a_vs_b': float(r[4])
        })
        
    # 6. hasil_ahp benchmark
    raw_hahp = get_sheet('hasil_ahp')
    ahp_benchmarks = {
        'cr_table': [],
        'weights': {}
    }
    in_weights = False
    for r in raw_hahp:
        if not r or r[0] is None: continue
        if r[0] == 'kriteria':
            in_weights = True
            continue
        if not in_weights and len(r) >= 4 and r[0] not in ('kelompok', 'Total'):
            ahp_benchmarks['cr_table'].append({
                'kelompok': r[0],
                'level': r[1],
                'cr': float(r[2]),
                'status': r[3]
            })
        elif in_weights and r[0] != 'Total':
            ahp_benchmarks['weights'][r[0]] = {
                'klaster': r[1],
                'bobot_global': float(r[2]),
                'persen': float(r[3]) if len(r) > 3 and r[3] is not None else float(r[2])*100
            }

    # 7. hasil_topsis benchmark
    raw_htopsis = get_sheet('hasil_topsis')
    topsis_benchmarks = []
    for r in raw_htopsis[1:]:
        if not r or r[0] is None: continue
        topsis_benchmarks.append({
            'alternatif_id': r[0],
            'nama_segmen': r[1],
            'd_plus': float(r[2]),
            'd_minus': float(r[3]),
            'closeness_cc': float(r[4]),
            'ranking': int(float(r[5]))
        })

    # 8. anggaran_alokasi
    raw_alloc = get_sheet('anggaran_alokasi')
    allocation_benchmarks = {
        'items': [],
        'plafon_per_fase': 15000000,
        'c9_min_fase1': 3
    }
    for r in raw_alloc[1:]:
        if not r or r[0] is None: continue
        if r[0].startswith('Plafon'):
            allocation_benchmarks['plafon_per_fase'] = float(r[1])
            continue
        if r[0].startswith('Total') or r[0].startswith('Sisa'):
            continue
        allocation_benchmarks['items'].append({
            'alternatif_id': r[0],
            'nama_segmen': r[1],
            'ranking': int(float(r[2])),
            'cc': float(r[3]),
            'skor_c9': float(r[4]),
            'biaya_rp': float(r[5]),
            'fase': int(float(r[6])),
            'keterangan': r[7],
            'cc_per_juta_rp': float(r[8]) if len(r) > 8 and r[8] is not None else 0.0
        })

    # 9. sensitivitas
    raw_sens = get_sheet('sensitivitas')
    sensitivity_benchmarks = []
    for r in raw_sens[1:]:
        if not r or r[0] is None: continue
        sensitivity_benchmarks.append({
            'kriteria': r[0],
            'perubahan_bobot': r[1],
            'urutan_hasil': r[2],
            'peringkat_1_tetap': r[3] == 'Ya',
            'urutan_penuh_tetap': r[4] == 'Ya'
        })

    out_data = {
        'id': 'ilustratif',
        'nama': 'Dataset Ilustratif (5 Segmen)',
        'deskripsi': 'Data ilustratif hierarki 3 klaster x 3 kelompok responden sesuai xlsx',
        'status': 'SIMULASI',
        'ahp_mode': 'hierarki',
        'plafon_per_fase_rp': 15000000,
        'c9_min_fase1': 3,
        'alternatives': alternatives,
        'criteria': criteria,
        'values': values,
        'stakeholders': stakeholders,
        'pairwise': pairwise,
        'benchmarks': {
            'ahp': ahp_benchmarks,
            'topsis': topsis_benchmarks,
            'allocation': allocation_benchmarks,
            'sensitivity': sensitivity_benchmarks
        }
    }

    out_file = os.path.join(root_dir, 'data', 'ilustratif.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(out_data, f, indent=2, ensure_ascii=False)
    print(f"Successfully generated {out_file} ({len(alternatives)} alternatives, {len(criteria)} criteria)")

if __name__ == '__main__':
    main()
