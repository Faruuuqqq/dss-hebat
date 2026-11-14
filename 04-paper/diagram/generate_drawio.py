# STATUS HISTORIS (14 Nov 2026): skrip ini menghasilkan diagram dengan AHP hierarki
# 3 kluster dan angka CC 0,6441 (bukan model final). Model final = dss_revisi.md
# (AHP datar 8x8; CC A3=0,6445). Perbarui angka sebelum regenerate untuk luaran final.
import xml.etree.ElementTree as ET
import os

def create_drawio_file(filename, diagram_name, cells, page_width=1400, page_height=1000):
    root = ET.Element('mxfile', {
        'host': 'app.diagrams.net',
        'modified': '2026-10-17T14:50:00.000Z',
        'agent': 'Antigravity IDE',
        'version': '24.0.0',
        'type': 'device'
    })
    
    diagram = ET.SubElement(root, 'diagram', {
        'id': 'diag_' + diagram_name.lower().replace(' ', '_'),
        'name': diagram_name
    })
    
    graph_model = ET.SubElement(diagram, 'mxGraphModel', {
        'dx': '1400',
        'dy': '900',
        'grid': '1',
        'gridSize': '10',
        'guides': '1',
        'tooltips': '1',
        'connect': '1',
        'arrows': '1',
        'fold': '1',
        'page': '1',
        'pageScale': '1',
        'pageWidth': str(page_width),
        'pageHeight': str(page_height),
        'math': '0',
        'shadow': '0'
    })
    
    root_cell = ET.SubElement(graph_model, 'root')
    ET.SubElement(root_cell, 'mxCell', {'id': '0'})
    ET.SubElement(root_cell, 'mxCell', {'id': '1', 'parent': '0'})
    
    for cell in cells:
        root_cell.append(cell)
        
    tree = ET.ElementTree(root)
    ET.indent(tree, space='  ', level=0)
    tree.write(filename, encoding='utf-8', xml_declaration=True)
    print(f'Successfully wrote {filename}')

def make_vertex(cell_id, value, style, x, y, width, height, parent='1'):
    cell = ET.Element('mxCell', {
        'id': str(cell_id),
        'value': value,
        'style': style,
        'vertex': '1',
        'parent': str(parent)
    })
    ET.SubElement(cell, 'mxGeometry', {
        'x': str(x),
        'y': str(y),
        'width': str(width),
        'height': str(height),
        'as': 'geometry'
    })
    return cell

def make_edge(cell_id, style, source_id, target_id, value='', parent='1', exitX='0.5', exitY='1', entryX='0.5', entryY='0'):
    edge_style = style
    if 'exitX=' not in edge_style:
        edge_style += f';exitX={exitX};exitY={exitY};entryX={entryX};entryY={entryY};'
    cell = ET.Element('mxCell', {
        'id': str(cell_id),
        'value': value,
        'style': edge_style,
        'edge': '1',
        'parent': str(parent),
        'source': str(source_id),
        'target': str(target_id)
    })
    ET.SubElement(cell, 'mxGeometry', {
        'relative': '1',
        'as': 'geometry'
    })
    return cell

# =========================================================================
# 1. BUILD PRISMA-ScR DIAGRAM
# =========================================================================
def build_prisma_diagram():
    cells = []
    
    # Title
    cells.append(make_vertex('title',
        '<div style="text-align: center;"><font style="font-size: 16px;" color="#1e3a8a"><b>DIAGRAM ALIR PROTOKOL PRISMA-ScR</b></font><br><font style="font-size: 12px;" color="#4b5563">Tahapan Seleksi Studi Literatur Decision Support System (DSS) untuk Smart Living and Urban Public Safety</font></div>',
        'text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;',
        240, 15, 600, 40))
        
    # Phase Column Boxes (Left)
    phase_style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#1E3A8A;strokeColor=#1E3A8A;fontColor=#FFFFFF;fontStyle=1;fontSize=13;align=center;verticalAlign=middle;shadow=1;'
    cells.append(make_vertex('ph1', 'IDENTIFIKASI<br><span style="font-size:10px;font-weight:normal;opacity:0.9;">(Identification)</span>', phase_style, 40, 70, 160, 130))
    cells.append(make_vertex('ph2', 'PENJARINGAN<br><span style="font-size:10px;font-weight:normal;opacity:0.9;">(Screening)</span>', phase_style, 40, 230, 160, 120))
    cells.append(make_vertex('ph3', 'KELAYAKAN<br><span style="font-size:10px;font-weight:normal;opacity:0.9;">(Eligibility)</span>', phase_style, 40, 380, 160, 210))
    cells.append(make_vertex('ph4', 'TERMASUK<br><span style="font-size:10px;font-weight:normal;opacity:0.9;">(Included)</span>', phase_style, 40, 620, 160, 130))

    # Flow Central Boxes (Blue/Teal)
    flow_style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#3B82F6;strokeWidth=2;fontColor=#1E293B;fontSize=12;align=left;spacingLeft=12;spacingRight=12;verticalAlign=middle;shadow=1;'
    
    # Box 1: Identification
    val1 = '<b>Pencarian Sistematis Basis Data Scopus</b><br>' \
           '<font color="#475569" style="font-size:11px;">• Bidang: TITLE-ABS-KEY | Rentang: 2021–2026<br>' \
           '• Konsep: Smart City AND DSS/MCDM AND Safety/CCTV<br>' \
           '• Tanggal Eksekusi: 28 Maret 2026</font><br>' \
           '<font color="#1D4ED8"><b>Total Rekaman Teridentifikasi (n = 582)</b></font>'
    cells.append(make_vertex('box1', val1, flow_style, 240, 70, 350, 130))

    # Exclude 1: Automation Tools
    ex_style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#EF4444;strokeWidth=2;fontColor=#7F1D1D;fontSize=11;align=left;spacingLeft=12;spacingRight=12;verticalAlign=middle;shadow=1;'
    val_ex1 = '<b>Rekaman Dieliminasi Filter Otomatis (n = 401)</b><br>' \
              '<font color="#991B1B">• Terbit sebelum tahun 2021 (n = 166)<br>' \
              '• Tipe dokumen non-artikel jurnal (n = 233)<br>' \
              '• Naskah berbahasa non-Inggris (n = 2)</font>'
    cells.append(make_vertex('ex1', val_ex1, ex_style, 640, 70, 370, 130))

    # Box 2: Screening
    val2 = '<b>Pencarian Naskah Teks Lengkap</b><br>' \
           '<font color="#475569" style="font-size:11px;">(Reports sought for retrieval)</font><br><br>' \
           '<font color="#1D4ED8"><b>Laporan Dicari Teks Lengkapnya (n = 181)</b></font>'
    cells.append(make_vertex('box2', val2, flow_style, 240, 230, 350, 120))

    # Exclude 2: Paywall
    val_ex2 = '<b>Laporan Tidak Dapat Diunduh (n = 60)</b><br>' \
              '<font color="#991B1B">• Batasan akses hak langganan institusi / paywall<br>' \
              '(Dicatat jujur & transparan sebagai limitasi scoping review)</font>'
    cells.append(make_vertex('ex2', val_ex2, ex_style, 640, 230, 370, 120))

    # Box 3: Eligibility
    val3 = '<b>Penilaian Kelayakan Teks Lengkap</b><br>' \
           '<font color="#475569" style="font-size:11px;">(Reports assessed for full-text eligibility)<br>' \
           '• Telaah independen oleh 5 penelaah (A1–A5)<br>' \
           '• Diskusi konsensus untuk resolusi interpretasi</font><br>' \
           '<font color="#1D4ED8"><b>Laporan Dinilai Kelayakan Substantif (n = 121)</b></font>'
    cells.append(make_vertex('box3', val3, flow_style, 240, 380, 350, 210))

    # Exclude 3: Substantive Exclusion
    val_ex3 = '<b>Laporan Teks Lengkap Dieksklusi (n = 109)</b><br>' \
              '<font color="#991B1B">• Tanpa model keputusan / CV murni tanpa alokasi (n = 63)<br>' \
              '• Di luar domain keselamatan publik permukiman (n = 28)<br>' \
              '• Indeks makro komparasi antar-kota (n = 10)<br>' \
              '• Naskah tinjauan pustaka sekunder / review (n = 5)<br>' \
              '• Konteks spesifik non-transferable ke permukiman (n = 3)</font>'
    cells.append(make_vertex('ex3', val_ex3, ex_style, 640, 380, 370, 210))

    # Box 4: Included (Green/Emerald)
    inc_style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#16A34A;strokeWidth=2;fontColor=#14532D;fontSize=12;align=left;spacingLeft=14;spacingRight=14;verticalAlign=middle;shadow=1;'
    val4 = '<div style="text-align: center;"><font style="font-size: 13px;" color="#15803D"><b>STUDI PRIMER DISERTAKAN DALAM SINTESIS (n = 12)</b></font></div>' \
           '<font style="font-size: 11px;" color="#166534">' \
           '• <b>GIS-MCDM:</b> Feizizadeh & Omarzadeh (2025), Kabashkin et al. (2025), Zheng et al. (2025)<br>' \
           '• <b>Coverage Optimization:</b> Wang et al. (2025), Yuhang et al. (2025)<br>' \
           '• <b>Expert-Driven:</b> Ahmed et al. (2022), Choi et al. (2025), Baddour et al. (2026)<br>' \
           '• <b>Policy-MCDA:</b> Almassawa et al. (2024), Shiddiqy et al. (2025)<br>' \
           '• <b>Fuzzy AHP-TOPSIS:</b> Kanj et al. (2024) | <b>Simulation-DSS:</b> Gonzalez-Villa et al. (2024)' \
           '</font>'
    cells.append(make_vertex('box4', val4, inc_style, 240, 620, 770, 130))

    # Connectors
    arr_down = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#3B82F6;strokeWidth=2;endArrow=classic;endFill=1;'
    arr_side = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#EF4444;strokeWidth=2;endArrow=classic;endFill=1;'
    
    cells.append(make_edge('e1', arr_down, 'box1', 'box2', exitX='0.5', exitY='1', entryX='0.5', entryY='0'))
    cells.append(make_edge('e2', arr_down, 'box2', 'box3', exitX='0.5', exitY='1', entryX='0.5', entryY='0'))
    cells.append(make_edge('e3', arr_down, 'box3', 'box4', exitX='0.5', exitY='1', entryX='0.22', entryY='0'))
    
    cells.append(make_edge('ex_e1', arr_side, 'box1', 'ex1', exitX='1', exitY='0.5', entryX='0', entryY='0.5'))
    cells.append(make_edge('ex_e2', arr_side, 'box2', 'ex2', exitX='1', exitY='0.5', entryX='0', entryY='0.5'))
    cells.append(make_edge('ex_e3', arr_side, 'box3', 'ex3', exitX='1', exitY='0.5', entryX='0', entryY='0.5'))
    
    create_drawio_file('d:/project/dss/04-paper/diagram/prisma-diagram.drawio', 'Diagram Alir PRISMA-ScR', cells, 1080, 800)

# =========================================================================
# 2. BUILD TAKSONOMI 5 POLA DIAGRAM
# =========================================================================
def build_taksonomi_diagram():
    cells = []
    
    # Title
    cells.append(make_vertex('title',
        '<div style="text-align: center;"><font style="font-size: 16px;" color="#1e3a8a"><b>TAKSONOMI LIMA POLA ARSITEKTUR DSS KESELAMATAN PERKOTAAN</b></font><br>' \
        '<font style="font-size: 12px;" color="#4b5563">Sintesis Komparatif 12 Studi Primer Scopus (2021–2026) Berbasis Kebutuhan Data dan Status Adopsi di Jatinangor</font></div>',
        'text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;',
        300, 15, 750, 40))
        
    card_adopted = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#16A34A;strokeWidth=2;fontColor=#1E293B;fontSize=11;align=left;spacingLeft=10;spacingRight=10;verticalAlign=top;shadow=1;'
    card_rejected = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#DC2626;strokeWidth=2;fontColor=#1E293B;fontSize=11;align=left;spacingLeft=10;spacingRight=10;verticalAlign=top;shadow=1;'
    
    col_w = 230
    col_h = 510
    start_x = 40
    gap = 20
    top_y = 75
    
    patterns = [
        {
            'id': 'p1',
            'name': 'POLA 1: GIS-MCDM',
            'sub': 'Evaluasi Skenario Spasial',
            'status': 'DIADOPSI (Core Engine)',
            'style': card_adopted,
            'badge_bg': '#DCFCE7', 'badge_fg': '#15803D',
            'authors': 'Feizizadeh (2025), Kabashkin (2025), Zheng (2025)',
            'input': 'Data spasial jalan, crowd-sensor, DEMATEL-Bayesian, video UAV',
            'engine': 'Spatial-MCDA, analisis multikriteria berbasis SIG',
            'output': 'Peta zonasi risiko segmen gang & indeks keselamatan spasial',
            'role': 'Menjadi arsitektur inti model keputusan penempatan CCTV di gang permukiman.'
        },
        {
            'id': 'p2',
            'name': 'POLA 2: COVERAGE',
            'sub': 'Optimasi Liputan Graf Jalan',
            'status': 'DIADOPSI (Logika Liputan)',
            'style': card_adopted,
            'badge_bg': '#DCFCE7', 'badge_fg': '#15803D',
            'authors': 'Wang et al. (2025), Yuhang et al. (2025)',
            'input': 'Topologi simpul jalan, radius coverage, data kepadatan penduduk (EWM)',
            'engine': 'Minimum Weighted Vertex Cover (MWVC), BCSLP + Genetic Algorithm',
            'output': 'Lokasi simpul kamera optimal & pemotongan jumlah tiang/kamera',
            'role': 'Diserap ke dalam kriteria C4 (efisiensi coverage), C6 (simpul), dan C7 (gap).'
        },
        {
            'id': 'p3',
            'name': 'POLA 3: EXPERT-DRIVEN',
            'sub': 'Survei Multistakeholder & AHP',
            'status': 'DIADOPSI (Skema Bobot)',
            'style': card_adopted,
            'badge_bg': '#DCFCE7', 'badge_fg': '#15803D',
            'authors': 'Ahmed (2022), Choi (2025), Baddour (2026)',
            'input': 'Kuesioner preferensi pakar (Pemda, Kampus, Komunitas Warga/RT)',
            'engine': 'AHP Hierarki 3 Kluster (10 perbandingan) & Uji Konsistensi (CR < 0,10)',
            'output': 'Vektor bobot kriteria urgensi objektif (C1–C8) yang teraudit',
            'role': 'Menghindari kejenuhan responden dan menjaga konsistensi rasio konsensus.'
        },
        {
            'id': 'p4',
            'name': 'POLA 4: POLICY-MCDA',
            'sub': 'Kerangka Rekomendasi Kebijakan',
            'status': 'DIADOPSI (Alokasi Bertahap)',
            'style': card_adopted,
            'badge_bg': '#DCFCE7', 'badge_fg': '#15803D',
            'authors': 'Almassawa (2024), Shiddiqy (2025)',
            'input': 'Indikator keamanan publik, dokumen kebijakan tata ruang & regulasi',
            'engine': 'PROMETHEE, SWOT + AHP pembobotan strategis',
            'output': 'Rekomendasi alokasi bertahap & rencana belanja implementasi',
            'role': 'Landasan modul alokasi tahunan (Fase 1, 2, 3) di bawah pagu Dana Desa.'
        },
        {
            'id': 'p5',
            'name': 'POLA 5: SIMULASI OPERASIONAL',
            'sub': 'Prediktif-Probabilistik Real-Time',
            'status': 'DITOLAK (Non-Transferable)',
            'style': card_rejected,
            'badge_bg': '#FEE2E2', 'badge_fg': '#B91C1C',
            'authors': 'Gonzalez-Villa et al. (2024) [S4AllCities]',
            'input': 'Sensor pergerakan kontinu, estimasi korban, ancaman terorisme',
            'engine': 'Prediktif-probabilistik, simulasi egress & respons insiden taktis',
            'output': 'Rute evakuasi darurat dinamis & manajemen kerumunan real-time',
            'role': 'DITOLAK karena membutuhkan kalibrasi sensor dinamis berbiaya tinggi yang tidak realistis untuk Jatinangor.'
        }
    ]
    
    for i, p in enumerate(patterns):
        x = start_x + i * (col_w + gap)
        val = f'<div style="text-align: center; margin-bottom: 6px;">' \
              f'<font style="font-size:12px; font-weight:bold;">{p["name"]}</font><br>' \
              f'<font color="#64748B" style="font-size:10px;">{p["sub"]}</font><br><br>' \
              f'<span style="background-color:{p["badge_bg"]}; color:{p["badge_fg"]}; padding:3px 8px; border-radius:10px; font-weight:bold; font-size:10px;">{p["status"]}</span>' \
              f'</div><hr style="border:0.5px solid #CBD5E1; margin:6px 0;">' \
              f'<b>Studi Primer:</b><br><font color="#334155" style="font-size:10px;">{p["authors"]}</font><br><br>' \
              f'<b>Karakteristik Input:</b><br><font color="#475569" style="font-size:10px;">{p["input"]}</font><br><br>' \
              f'<b>Decision Engine:</b><br><font color="#475569" style="font-size:10px;">{p["engine"]}</font><br><br>' \
              f'<b>Format Output:</b><br><font color="#475569" style="font-size:10px;">{p["output"]}</font><br><br>' \
              f'<b>Perlakuan di Jatinangor:</b><br><font color="#0F172A" style="font-size:10px;">{p["role"]}</font>'
        cells.append(make_vertex(p['id'], val, p['style'], x, top_y, col_w, col_h))

    # Bottom Synthesis Box
    synth_style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#2563EB;strokeWidth=2;fontColor=#1E293B;fontSize=11;align=left;spacingLeft=14;spacingRight=14;verticalAlign=middle;shadow=1;'
    val_synth = '<div style="text-align:center;"><font style="font-size:13px;" color="#1D4ED8"><b>SINTESIS KONSEPTUAL MODEL KEPUTUSAN JATINANGOR (RQ3)</b></font></div>' \
                '<table width="100%" style="font-size:11px; margin-top:6px;">' \
                '<tr>' \
                '<td width="50%" valign="top">' \
                '<b>1. Integrasi 4 Pola Teradopsi:</b> Mengombinasikan <i>GIS-MCDM</i> (lapisan spasial gang), <i>Optimasi Coverage</i> (simpul kritis C6 & gap C7), <i>Expert-Driven</i> (AHP konsensus pakar), dan <i>Policy Framework</i> (alokasi fase anggaran).<br>' \
                '<b>2. Penolakan Sadar Pola Simulasi:</b> Pola 5 ditolak demi kepraktisan karena permukiman mahasiswa tidak memiliki sensor kontinu.' \
                '</td>' \
                '<td width="50%" valign="top">' \
                '<b>3. Kelayakan di Atas Data Diskrit:</b> Beroperasi 100% menggunakan data lokal non-streaming (rekap Polsek C1, counting C2, survei lux C3, OpenStreetMap C4/C6/C8, profil kos C5, GPS kamera C7, dan RAB C9).<br>' \
                '<b>4. Output Terukur:</b> Menghasilkan skor kedekatan TOPSIS ($CC_i$), zonasi WebGIS, dan jadwal pengadaan bertahap di bawah plafon Rp 15 Juta.' \
                '</td>' \
                '</tr>' \
                '</table>'
    cells.append(make_vertex('synth_box', val_synth, synth_style, start_x, 610, 5 * col_w + 4 * gap, 150))
    
    # Edges from patterns to synthesis box
    arr_style = 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#3B82F6;strokeWidth=1.5;endArrow=classic;endFill=1;'
    for p in patterns[:4]:
        cells.append(make_edge('e_' + p['id'], arr_style, p['id'], 'synth_box', exitX='0.5', exitY='1', entryX='0.5', entryY='0'))

    create_drawio_file('d:/project/dss/04-paper/diagram/taksonomi-5-pola.drawio', 'Taksonomi 5 Pola DSS', cells, 1320, 800)

# =========================================================================
# 3. BUILD ARSITEKTUR 4 LAPISAN DIAGRAM
# =========================================================================
def build_arsitektur_diagram():
    cells = []
    
    # Title
    cells.append(make_vertex('title',
        '<div style="text-align: center;"><font style="font-size: 16px;" color="#1e3a8a"><b>ARSITEKTUR KONSEPTUAL EMPAT LAPISAN DSS PRIORITISASI CCTV JATINANGOR</b></font><br>' \
        '<font style="font-size: 12px;" color="#4b5563">Pemisahan Tegas Antara Kriteria Urgensi Risiko (C1–C8) dan Kendala Kelayakan Fisik & Anggaran Belanja (C9 & RAB)</font></div>',
        'text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;',
        250, 15, 800, 40))

    layer_w = 1120
    x_pos = 40
    
    # ----------------------------------------------------
    # LAYER 1: INPUT DATA DISKRIT LOKAL
    # ----------------------------------------------------
    l1_bg = make_vertex('l1_container', '',
        'rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#94A3B8;strokeWidth=1.5;shadow=1;',
        x_pos, 70, layer_w, 175)
    cells.append(l1_bg)
    cells.append(make_vertex('l1_badge', 'LAPISAN 1: INPUT DATA DISKRIT LOKAL',
        'text;html=1;fontStyle=1;fontSize=12;fontColor=#0F172A;', x_pos + 15, 78, 300, 25))
        
    val_c1_c8 = '<b>Modul Kriteria Urgensi Risiko (C1–C8) [Benefit-Oriented]</b><br>' \
                '<font color="#334155" style="font-size:10.5px;">' \
                '• <b>C1: Riwayat Kerawanan</b> (kejadian/km/th) [Rekap Polsek / Ketua RT]<br>' \
                '• <b>C2: Volume Mobilitas Malam</b> (orang & motor/jam) [Counting manual malam]<br>' \
                '• <b>C3: Defisiensi Penerangan</b> (skor lux 1–5: makin gelap makin butuh) [Survei visibilitas]<br>' \
                '• <b>C4: Efisiensi Coverage</b> (m²/titik: luas pandang terawasi) [OpenStreetMap & geometri]<br>' \
                '• <b>C5: Kepadatan Kos</b> (kamar aktif/km) [Data desa & paguyuban kos]<br>' \
                '• <b>C6: Derajat Simpul</b> (jumlah cabang persimpangan gang) [Graf jalan OpenStreetMap]<br>' \
                '• <b>C7: Coverage Gap CCTV</b> (jarak meter ke kamera aktif terdekat) [Survei GPS kamera]<br>' \
                '• <b>C8: Fasilitas Rentan</b> (unit POI indekos, ATM, halte radius 150m) [OSM POI]' \
                '</font>'
    cells.append(make_vertex('l1_urgensi', val_c1_c8,
        'rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#3B82F6;strokeWidth=1.5;align=left;spacingLeft=10;spacingRight=10;verticalAlign=middle;',
        x_pos + 15, 105, 680, 125))

    val_c9_rab = '<b>Modul Kelayakan & Anggaran Fisik</b><br>' \
                 '<font color="#334155" style="font-size:10.5px;">' \
                 '• <b>C9: Kelayakan Implementasi Teknis</b><br>' \
                 '  (skor 1–5: kesiapan tiang fisik, pasokan listrik PLN, dan sinyal internet)<br>' \
                 '• <b>Estimasi Biaya Pengadaan (RAB):</b><br>' \
                 '  (Rp 5–8 Juta/titik: kamera IP outdoor, braket tiang PJU/PLN, kabel daya & adaptor)<br>' \
                 '• <b>Pagu Plafon Anggaran Belanja Tahunan:</b><br>' \
                 '  ($B_k \\le \\text{Rp } 15.000.000$,- per tahun alokasi)' \
                 '</font>'
    cells.append(make_vertex('l1_kelayakan', val_c9_rab,
        'rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFBEB;strokeColor=#F59E0B;strokeWidth=1.5;align=left;spacingLeft=10;spacingRight=10;verticalAlign=middle;',
        x_pos + 710, 105, 395, 125))

    # ----------------------------------------------------
    # LAYER 2: PREPROCESSING
    # ----------------------------------------------------
    l2_bg = make_vertex('l2_container', '',
        'rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#94A3B8;strokeWidth=1.5;shadow=1;',
        x_pos, 275, layer_w, 140)
    cells.append(l2_bg)
    cells.append(make_vertex('l2_badge', 'LAPISAN 2: PREPROCESSING & KODIFIKASI DATA',
        'text;html=1;fontStyle=1;fontSize=12;fontColor=#0F172A;', x_pos + 15, 283, 350, 25))

    pbox_style = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;strokeWidth=1.2;align=center;verticalAlign=middle;fontSize=10.5;fontColor=#1E293B;shadow=0;'
    cells.append(make_vertex('l2_p1', '<b>Kodifikasi Alternatif</b><br>5 Tipologi Spasial Gang<br>(Sayang, Cikeruh, Hegarmanah,<br>Cipacing, Cileles / A1–A5)', pbox_style, x_pos + 15, 310, 255, 90))
    cells.append(make_vertex('l2_p2', '<b>Pembersihan & Validasi</b><br>Penyeragaman satuan rasio,<br>agregasi koordinat GPS,<br>& validasi silang data Polsek/RT', pbox_style, x_pos + 290, 310, 255, 90))
    cells.append(make_vertex('l2_p3', '<b>Normalisasi Vektor Euclidean</b><br>Transformasi nir-dimensi C1–C8:<br><font color="#2563EB">$r_{ij} = x_{ij} / \\sqrt{\\sum_{k=1}^m x_{kj}^2}$</font>', pbox_style, x_pos + 565, 310, 265, 90))
    cells.append(make_vertex('l2_p4', '<b>Filter Batas Kelayakan Teknis</b><br>Eliminasi segmen dengan daya/tiang nihil:<br><font color="#D97706">Ambang batas $C9_i \\ge 3$</font>', pbox_style, x_pos + 850, 310, 255, 90))

    # ----------------------------------------------------
    # LAYER 3: DECISION ENGINE
    # ----------------------------------------------------
    l3_bg = make_vertex('l3_container', '',
        'rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#94A3B8;strokeWidth=1.5;shadow=1;',
        x_pos, 445, layer_w, 230)
    cells.append(l3_bg)
    cells.append(make_vertex('l3_badge', 'LAPISAN 3: DECISION ENGINE (MCDM HYBRID & ANGGARAN)',
        'text;html=1;fontStyle=1;fontSize=12;fontColor=#0F172A;', x_pos + 15, 453, 400, 25))

    eng_style1 = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#F5F3FF;strokeColor=#7C3AED;strokeWidth=1.5;align=left;spacingLeft=10;spacingRight=10;verticalAlign=middle;fontSize=10.5;fontColor=#1E293B;'
    val_ahp = '<b>Engine 1: AHP Hierarki 3 Kluster</b><br>' \
              '<font color="#4C1D95">• <b>Kluster Risiko:</b> C1 (24,31%), C3 (14,58%)<br>' \
              '• <b>Kluster Paparan:</b> C2 (14,20%), C5 (12,35%), C8 (12,35%)<br>' \
              '• <b>Kluster Spasial:</b> C7 (9,56%), C4 (7,61%), C6 (5,05%)<br>' \
              '• 10 Perbandingan berpasangan (hemat dari 28 pasang)<br>' \
              '• Konsensus Geometric Mean 3 Kelompok (Pemda, Kampus, RT)<br>' \
              '• Teruji konsisten per matriks: <b>CR = 0,0000 &lt; 0,10</b><br>' \
              '• Formula Bobot Global: $w_j = W_k \\times w_{j|k}$</font>'
    cells.append(make_vertex('l3_ahp', val_ahp, eng_style1, x_pos + 15, 480, 370, 180))

    eng_style2 = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#2563EB;strokeWidth=1.5;align=left;spacingLeft=10;spacingRight=10;verticalAlign=middle;fontSize=10.5;fontColor=#1E293B;'
    val_topsis = '<b>Engine 2: Perankingan TOPSIS</b><br>' \
                 '<font color="#1E40AF">• Pembobotan Matriks: $v_{ij} = w_j \\cdot r_{ij}$<br>' \
                 '• Solusi Ideal Positif: $A^+ = \\{\\max_i(v_{ij})\\}$<br>' \
                 '• Solusi Ideal Negatif: $A^- = \\{\\min_i(v_{ij})\\}$<br>' \
                 '• Jarak Euclidean: $D_i^+$ dan $D_i^-$<br>' \
                 '• Skor Kedekatan Relatif: <font color="#2563EB"><b>$CC_i = \\frac{D_i^-}{D_i^+ + D_i^-}$</b></font><br>' \
                 '• Hasil: A3 (0,6441) &gt; A1 (0,5809) &gt; A4 (0,5036) &gt; A2 (0,4608) &gt; A5 (0,1819)</font>'
    cells.append(make_vertex('l3_topsis', val_topsis, eng_style2, x_pos + 405, 480, 360, 180))

    eng_style3 = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFBEB;strokeColor=#D97706;strokeWidth=1.5;align=left;spacingLeft=10;spacingRight=10;verticalAlign=middle;fontSize=10.5;fontColor=#1E293B;'
    val_budget = '<b>Engine 3: Kendala Anggaran & OAT</b><br>' \
                 '<font color="#78350F">• <b>Partisi Fase Anggaran:</b> $\\sum \\text{Cost}_i \\le B_k$<br>' \
                 '• Plafon belanja Rp 15 Jt/tahun (Dana Desa / Swadaya RW)<br>' \
                 '• <b>Rasio Efisiensi Urgensi-Biaya:</b> $CC_i / \\text{Cost}_i$<br>' \
                 '  (Panduan pendukung keputusan bila ada selisih biaya tajam)<br>' \
                 '• <b>Uji Sensitivitas OAT $\\pm 20\\%$ (16 Run):</b><br>' \
                 '  Peringkat A3 & A1 kokoh di posisi 1 & 2;<br>' \
                 '  Dinamika A4 vs A2 memvalidasi penggabungan di Fase 2</font>'
    cells.append(make_vertex('l3_budget', val_budget, eng_style3, x_pos + 785, 480, 320, 180))

    # ----------------------------------------------------
    # LAYER 4: ACTIONABLE OUTPUT
    # ----------------------------------------------------
    l4_bg = make_vertex('l4_container', '',
        'rounded=1;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#94A3B8;strokeWidth=1.5;shadow=1;',
        x_pos, 705, layer_w, 150)
    cells.append(l4_bg)
    cells.append(make_vertex('l4_badge', 'LAPISAN 4: KELUARAN TINDAKAN (ACTIONABLE OUTPUT)',
        'text;html=1;fontStyle=1;fontSize=12;fontColor=#0F172A;', x_pos + 15, 713, 400, 25))

    out_style1 = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#16A34A;strokeWidth=1.5;align=center;verticalAlign=middle;fontSize=11;fontColor=#14532D;'
    val_out1 = '<b>Peringkat Urgensi CCTV</b><br>' \
               '<font size="2" color="#15803D">' \
               '1. A3 (Persimpangan Hegarmanah): $CC=0,6441$<br>' \
               '2. A1 (Gang Kos Sayang): $CC=0,5809$<br>' \
               '3. A4 (Gang Cipacing): $CC=0,5036$<br>' \
               '4. A2 (Ruas Jalan Cikeruh): $CC=0,4608$<br>' \
               '5. A5 (Ruas Jalan Cileles): $CC=0,1819$' \
               '</font>'
    cells.append(make_vertex('l4_rank', val_out1, out_style1, x_pos + 15, 740, 340, 100))

    out_style2 = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#2563EB;strokeWidth=1.5;align=center;verticalAlign=middle;fontSize=11;fontColor=#1E40AF;'
    val_out2 = '<b>Peta Zonasi Spasial GIS</b><br>' \
               '<font size="2" color="#1D4ED8">' \
               '• WebGIS / QGIS Layer Prioritas Gang<br>' \
               '• Penandaan Titik Pasang Kamera Eksisting & Baru<br>' \
               '• Visualisasi Blind Zone & Area Pengawasan CPTED<br>' \
               '• Papan Peringatan Fisik Sesuai UU PDP No. 27/2022' \
               '</font>'
    cells.append(make_vertex('l4_gis', val_out2, out_style2, x_pos + 375, 740, 360, 100))

    out_style3 = 'rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;strokeWidth=1.5;align=center;verticalAlign=middle;fontSize=11;fontColor=#78350F;'
    val_out3 = '<b>Rencana Alokasi Belanja Bertahap</b><br>' \
               '<font size="2" color="#92400E">' \
               '• <b>Fase 1 (Tahun 1):</b> A3 (Rp 7,5 Jt) + A1 (Rp 6,5 Jt) = Rp 14 Jt<br>' \
               '• <b>Fase 2 (Tahun 2):</b> A4 (Rp 8,0 Jt) + A2 (Rp 5,0 Jt) = Rp 13 Jt<br>' \
               '• <b>Fase 3 (Tahun 3):</b> A5 (Rp 5,5 Jt) = Rp 5,5 Jt<br>' \
               '<b>Status: Terlaksana di bawah pagu Rp 15 Juta/tahun</b>' \
               '</font>'
    cells.append(make_vertex('l4_phase', val_out3, out_style3, x_pos + 755, 740, 350, 100))

    # Inter-layer Connectors
    arr_down = 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#475569;strokeWidth=2;endArrow=classic;endFill=1;'
    cells.append(make_edge('el1_l2', arr_down, 'l1_container', 'l2_container', exitX='0.5', exitY='1', entryX='0.5', entryY='0'))
    cells.append(make_edge('el2_l3', arr_down, 'l2_container', 'l3_container', exitX='0.5', exitY='1', entryX='0.5', entryY='0'))
    cells.append(make_edge('el3_l4', arr_down, 'l3_container', 'l4_container', exitX='0.5', exitY='1', entryX='0.5', entryY='0'))

    # Intra-engine connector (AHP -> TOPSIS -> Budget)
    arr_engine = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#7C3AED;strokeWidth=1.5;dashed=1;endArrow=classic;endFill=1;'
    cells.append(make_edge('e_eng1', arr_engine, 'l3_ahp', 'l3_topsis', value='Bobot w_j', exitX='1', exitY='0.5', entryX='0', entryY='0.5'))
    cells.append(make_edge('e_eng2', arr_engine, 'l3_topsis', 'l3_budget', value='Skor CC_i', exitX='1', exitY='0.5', entryX='0', entryY='0.5'))

    create_drawio_file('d:/project/dss/04-paper/diagram/arsitektur-4-lapis.drawio', 'Arsitektur 4 Lapisan DSS', cells, 1200, 920)

if __name__ == '__main__':
    print('Generating draw.io files...')
    build_prisma_diagram()
    build_taksonomi_diagram()
    build_arsitektur_diagram()
    print('All draw.io files generated successfully!')
