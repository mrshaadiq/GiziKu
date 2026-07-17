// ==================== GLOBAL HELPER & API CONFIG ====================
export const API_BASE = '/api';
export const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

export async function api(endpoint, options = {}) {
  try {
    const config = {
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'X-CSRF-TOKEN': csrfToken 
      },
      ...options,
    };
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (!res.ok) throw new Error("Status " + res.status);
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${endpoint} failed, falling back to client mock data.`, err);
    return getMockDataFor(endpoint, options);
  }
}

export function formatRupiah(num) {
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function enrichProvinceData(dbProvinces) {
  const mockEnrichment = {
    "AC": { aki: 120, kasus_thalasemia: 340, populasi_rh_negatif_persen: 0.8, defisit_stok_rh_negatif: 12, indeks_literasi: 3.5, jumlah_faskes: 45, jumlah_penduduk: 5400000 },
    "SU": { aki: 95, kasus_thalasemia: 680, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 5, indeks_literasi: 4.0, jumlah_faskes: 82, jumlah_penduduk: 15100000 },
    "SB": { aki: 110, kasus_thalasemia: 290, populasi_rh_negatif_persen: 0.6, defisit_stok_rh_negatif: 8, indeks_literasi: 3.8, jumlah_faskes: 55, jumlah_penduduk: 5600000 },
    "RI": { aki: 80, kasus_thalasemia: 120, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 3, indeks_literasi: 4.1, jumlah_faskes: 48, jumlah_penduduk: 6700000 },
    "JA": { aki: 85, kasus_thalasemia: 90, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 4, indeks_literasi: 3.7, jumlah_faskes: 34, jumlah_penduduk: 3600000 },
    "SS": { aki: 90, kasus_thalasemia: 210, populasi_rh_negatif_persen: 0.7, defisit_stok_rh_negatif: 6, indeks_literasi: 3.9, jumlah_faskes: 62, jumlah_penduduk: 8800000 },
    "BE": { aki: 105, kasus_thalasemia: 50, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 2, indeks_literasi: 3.6, jumlah_faskes: 22, jumlah_penduduk: 2000000 },
    "LA": { aki: 75, kasus_thalasemia: 180, populasi_rh_negatif_persen: 0.6, defisit_stok_rh_negatif: 5, indeks_literasi: 4.0, jumlah_faskes: 70, jumlah_penduduk: 9200000 },
    "BB": { aki: 95, kasus_thalasemia: 40, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 3, indeks_literasi: 3.8, jumlah_faskes: 18, jumlah_penduduk: 1500000 },
    "KR": { aki: 65, kasus_thalasemia: 30, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 1, indeks_literasi: 4.2, jumlah_faskes: 25, jumlah_penduduk: 2100000 },
    "JK": { aki: 45, kasus_thalasemia: 1520, populasi_rh_negatif_persen: 1.2, defisit_stok_rh_negatif: 25, indeks_literasi: 4.7, jumlah_faskes: 150, jumlah_penduduk: 10600000 },
    "JB": { aki: 85, kasus_thalasemia: 2850, populasi_rh_negatif_persen: 0.9, defisit_stok_rh_negatif: 18, indeks_literasi: 4.2, jumlah_faskes: 210, jumlah_penduduk: 49400000 },
    "JT": { aki: 90, kasus_thalasemia: 1980, populasi_rh_negatif_persen: 0.7, defisit_stok_rh_negatif: 11, indeks_literasi: 4.1, jumlah_faskes: 180, jumlah_penduduk: 37300000 },
    "YO": { aki: 50, kasus_thalasemia: 410, populasi_rh_negatif_persen: 0.8, defisit_stok_rh_negatif: 4, indeks_literasi: 4.5, jumlah_faskes: 42, jumlah_penduduk: 3700000 },
    "JI": { aki: 80, kasus_thalasemia: 2240, populasi_rh_negatif_persen: 0.8, defisit_stok_rh_negatif: 14, indeks_literasi: 4.3, jumlah_faskes: 220, jumlah_penduduk: 41100000 },
    "BT": { aki: 78, kasus_thalasemia: 490, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 7, indeks_literasi: 4.0, jumlah_faskes: 65, jumlah_penduduk: 12200000 },
    "BA": { aki: 55, kasus_thalasemia: 150, populasi_rh_negatif_persen: 0.6, defisit_stok_rh_negatif: 3, indeks_literasi: 4.4, jumlah_faskes: 58, jumlah_penduduk: 4300000 },
    "NB": { aki: 130, kasus_thalasemia: 310, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 9, indeks_literasi: 3.4, jumlah_faskes: 44, jumlah_penduduk: 5500000 },
    "NT": { aki: 160, kasus_thalasemia: 480, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 15, indeks_literasi: 3.1, jumlah_faskes: 38, jumlah_penduduk: 5500000 },
    "KB": { aki: 115, kasus_thalasemia: 180, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 8, indeks_literasi: 3.6, jumlah_faskes: 49, jumlah_penduduk: 5500000 },
    "KT": { aki: 105, kasus_thalasemia: 120, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 6, indeks_literasi: 3.7, jumlah_faskes: 38, jumlah_penduduk: 2700000 },
    "KS": { aki: 98, kasus_thalasemia: 140, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 5, indeks_literasi: 3.8, jumlah_faskes: 42, jumlah_penduduk: 4200000 },
    "KI": { aki: 88, kasus_thalasemia: 200, populasi_rh_negatif_persen: 0.6, defisit_stok_rh_negatif: 6, indeks_literasi: 4.1, jumlah_faskes: 55, jumlah_penduduk: 3900000 },
    "KU": { aki: 75, kasus_thalasemia: 20, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 2, indeks_literasi: 3.9, jumlah_faskes: 15, jumlah_penduduk: 700000 },
    "SA": { aki: 82, kasus_thalasemia: 80, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 4, indeks_literasi: 4.2, jumlah_faskes: 38, jumlah_penduduk: 2600000 },
    "GO": { aki: 110, kasus_thalasemia: 40, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 3, indeks_literasi: 3.5, jumlah_faskes: 20, jumlah_penduduk: 1200000 },
    "ST": { aki: 105, kasus_thalasemia: 110, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 5, indeks_literasi: 3.7, jumlah_faskes: 36, jumlah_penduduk: 3000000 },
    "SN": { aki: 88, kasus_thalasemia: 340, populasi_rh_negatif_persen: 0.6, defisit_stok_rh_negatif: 8, indeks_literasi: 4.0, jumlah_faskes: 92, jumlah_penduduk: 9100000 },
    "SG": { aki: 95, kasus_thalasemia: 90, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 4, indeks_literasi: 3.8, jumlah_faskes: 34, jumlah_penduduk: 2600000 },
    "SR": { aki: 125, kasus_thalasemia: 50, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 6, indeks_literasi: 3.6, jumlah_faskes: 24, jumlah_penduduk: 1400000 },
    "MA": { aki: 135, kasus_thalasemia: 80, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 8, indeks_literasi: 3.5, jumlah_faskes: 28, jumlah_penduduk: 1900000 },
    "MU": { aki: 115, kasus_thalasemia: 30, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 3, indeks_literasi: 3.6, jumlah_faskes: 18, jumlah_penduduk: 1300000 },
    "PB": { aki: 120, kasus_thalasemia: 40, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 7, indeks_literasi: 3.4, jumlah_faskes: 20, jumlah_penduduk: 1100000 },
    "PA": { aki: 145, kasus_thalasemia: 110, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 12, indeks_literasi: 3.2, jumlah_faskes: 32, jumlah_penduduk: 4300000 }
  };

  const normalized = Array.isArray(dbProvinces) 
    ? dbProvinces 
    : Object.entries(dbProvinces || {}).map(([code, data]) => ({ province_code: code, ...data }));
  
  return normalized.map(item => {
    const code = item.province_code;
    const base = mockEnrichment[code] || { aki: 90, kasus_thalasemia: 100, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 5, indeks_literasi: 3.8, jumlah_faskes: 30, jumlah_penduduk: 3000000 };
    const stuntingVal = parseFloat(item.stunting_prevalence || item.stunting || 20);
    const riskScore = Math.min(99, Math.round((stuntingVal * 1.6) + (base.aki / 12) + (base.populasi_rh_negatif_persen * 10)));
    
    let riskColor = '#22c55e'; // green
    if (riskScore >= 50) riskColor = '#dc2626'; // red
    else if (riskScore >= 35) riskColor = '#f97316'; // orange
    else if (riskScore >= 20) riskColor = '#eab308'; // yellow

    return {
      province_code: code,
      province_name: item.province_name || item.name,
      stunting: stuntingVal,
      status: item.status || (stuntingVal > 21.6 ? 'Di atas rata-rata nasional' : 'Di bawah rata-rata nasional'),
      faskes_access: item.faskes_access || item.faskes,
      urgency_priority: item.urgency_priority || item.urgency,
      data_year: item.data_year || item.year || 2024,
      risk_score: riskScore,
      risk_color: riskColor,
      ...base
    };
  });
}

function getMockDataFor(endpoint, options) {
  if (endpoint.startsWith('/geo-triage/provinces')) {
    return enrichProvinceData(window.GIZIKU_PROVINCES || []);
  }
  if (endpoint.startsWith('/epidemiologi/dashboard')) {
    return {
      total_catin: 1842,
      active_cases: 56,
      resolved_cases: 1786,
      total_faskes: 124,
      faskes_with_rhogam: 42
    };
  }
  if (endpoint.startsWith('/education')) {
    return [
      { id: 1, judul: 'Mengenal Rhesus Negatif pada Kehamilan', ringkasan: 'Mengapa rhesus darah penting dipahami calon ibu?', konten: 'Rhesus darah negatif (Rh-) adalah kondisi langka pada orang Indonesia. Jika seorang ibu dengan Rh- hamil anak dengan Rh+ dari ayah Rh+, tubuh ibu akan memproduksi antibodi yang menyerang sel darah merah bayi (inkompatibilitas rhesus). Pemeriksaan pranikah sangat krusial untuk mendeteksi rhesus ini agar suntikan RhoGAM dapat diberikan pasca persalinan.', kategori: 'Rhesus', tipe: 'artikel' },
      { id: 2, judul: 'Skrining Thalasemia Sebelum Menikah', ringkasan: 'Mencegah Thalasemia Mayor pada anak melalui skrining dini.', konten: 'Thalasemia merupakan penyakit kelainan sel darah merah bawaan. Pasangan sesama pembawa sifat (carrier) Thalasemia Minor memiliki risiko 25% melahirkan anak dengan Thalasemia Mayor yang membutuhkan transfusi darah seumur hidup. Skrining pranikah mendeteksi hemoglobin patologis melalui analisa Hb dan elektroforesis.', kategori: 'Thalasemia', tipe: 'artikel' },
      { id: 3, judul: 'Kuis Kesiapan Kesehatan Pranikah', ringkasan: 'Evaluasi singkat pemahaman kesehatan pranikah Anda.', tipe: 'kuis', quiz_data: [
        { question: 'Apakah rhesus negatif berbahaya bagi kehamilan pertama?', options: ['Sangat berbahaya', 'Umumnya aman, namun antibodi terbentuk pasca-persalinan', 'Tidak berpengaruh sama sekali'], correct: 1 },
        { question: 'Berapa persen peluang anak menderita Thalasemia Mayor jika kedua orang tua adalah carrier?', options: ['0%', '25%', '50%', '100%'], correct: 1 },
        { question: 'Kapan waktu terbaik melakukan skrining pranikah?', options: ['1 minggu sebelum nikah', '3-6 bulan sebelum nikah', 'Setelah menikah'], correct: 1 }
      ]}
    ];
  }
  if (endpoint.startsWith('/chat')) {
    const query = (options.body ? JSON.parse(options.body).conversation?.slice(-1)[0]?.text : '') || '';
    let response = "Saya adalah GiziKu AI. Calon pengantin sebaiknya melakukan tes darah lengkap, Rhesus, dan Thalasemia minimal 3 bulan sebelum pernikahan untuk deteksi dini risiko inkompatibilitas atau penyakit keturunan.";
    const qLower = query.toLowerCase();
    if (qLower.includes('rhesus') || qLower.includes('golongan darah')) {
      response = "Rhesus darah sangat penting untuk calon ibu. Jika Ibu Rhesus Negatif (-) dan Ayah Rhesus Positif (+), anak berisiko mengalami penyakit hemolitik bayi baru lahir. Hal ini bisa dicegah dengan pemberian imunoglobulin Rho(D) (RhoGAM) di faskes terdekat.";
    } else if (qLower.includes('thalasemia') || qLower.includes('talasemia')) {
      response = "Thalasemia adalah kelainan darah bawaan. Skrining pranikah membantu mendeteksi apakah Anda pembawa sifat (Thalasemia Minor). Jika kedua calon pengantin adalah pembawa sifat, ada risiko 25% anak mengalami Thalasemia Mayor yang membutuhkan transfusi darah seumur hidup.";
    } else if (qLower.includes('stunting') || qLower.includes('gizi')) {
      response = "Untuk mencegah stunting pada anak di masa depan, calon pengantin wanita disarankan menjaga kadar Hemoglobin (Hb) di atas 12 g/dL agar terhindar dari anemia, serta mengonsumsi asam folat secara teratur.";
    }
    return { output: response };
  }
  if (endpoint.startsWith('/education/quiz')) {
    return { passed: true, score: 100, correct: 3, total: 3 };
  }
  if (endpoint.startsWith('/lab-scan/analyze')) {
    return {
      success: true,
      result: {
        ai_explanation: "Hasil Analisis AI Lab:\n\n- Hemoglobin (Hb): 12.8 g/dL (Normal). Status nutrisi sel darah merah baik, tidak terindikasi anemia.\n- Rhesus: Terdeteksi Positif (+). Sangat umum di Indonesia.\n- Indikasi Thalasemia: Tidak ada tanda-tanda abnormal pada morfologi eritrosit (MCV: 85 fl, MCH: 28 pg).\n\nRekomendasi AI: Jaga pola makan kaya zat besi dan asam folat. Calon pengantin dalam kondisi kesehatan prima untuk perencanaan kehamilan."
      }
    };
  }
  if (endpoint.startsWith('/genetic-tree/calculate')) {
    return {
      success: true,
      risk_level: 'Rendah',
      explanation: 'Berdasarkan data golongan darah dan riwayat keluarga Anda berdua, pohon genetik menunjukkan peluang 0% mewarisi kelainan inkompatibilitas rhesus mayor dan risiko thalasemia di bawah 5%. Kehamilan aman diproyeksikan.'
    };
  }
  if (endpoint.startsWith('/tracker')) {
    return [
      { id: 1, nama_pasien: 'Laili Rahmawati', usia_pasien: 24, level_urgensi: 'Tinggi', status_tindakan: 'Dirujuk', created_at: new Date(Date.now() - 3600000 * 20).toISOString() },
      { id: 2, nama_pasien: 'Budi Santoso', usia_pasien: 27, level_urgensi: 'Sedang', status_tindakan: 'Kunjungan Rumah', created_at: new Date(Date.now() - 3600000 * 48).toISOString() }
    ];
  }
  if (endpoint.startsWith('/action-plan/generate')) {
    return {
      success: true,
      result: {
        ai_explanation: "Rencana Intervensi AI GiziKu:\n\n1. Rujukan segera ke RSUD terdekat untuk konsultasi Dokter Spesialis Obgyn.\n2. Jadwalkan suntikan imunoglobulin anti-D (RhoGAM) saat usia kehamilan mencapai 28 minggu dan dalam waktu 72 jam pasca melahirkan.\n3. Lakukan monitoring Hb berkala di Puskesmas setiap bulan.\n4. Berikan suplemen zat besi 60mg per hari beserta vitamin C."
      }
    };
  }
  if (endpoint.startsWith('/referral/generate')) {
    return {
      success: true,
      referral_card: {
        nomor_rujukan: "REF/GIZIKU/2026/00912",
        diagnosa: "Inkompatibilitas Rhesus (Ibu Rh- / Ayah Rh+)",
        faskes_tujuan: "RSUD Dr. Hasan Sadikin Bandung",
        tanggal: new Date().toLocaleDateString('id-ID')
      }
    };
  }
  if (endpoint.startsWith('/donors')) {
    return [
      { id: 1, nama: 'Achmad Fauzi', golongan_darah: 'O', rhesus: 'Negatif (-)', phone: '0812-3456-7890', kota: 'Bandung' },
      { id: 2, nama: 'Jessica Wijaya', golongan_darah: 'A', rhesus: 'Negatif (-)', phone: '0857-9912-3344', kota: 'Jakarta' },
      { id: 3, nama: 'Rian Hidayat', golongan_darah: 'B', rhesus: 'Negatif (-)', phone: '0813-8899-0022', kota: 'Surabaya' }
    ];
  }
  if (endpoint.startsWith('/readiness-score')) {
    return {
      readiness_score: 88,
      kategori: 'Sangat Siap',
      analisis: 'Sistem nutrisi tubuh optimal. Calon pengantin wanita bebas anemia, rhesus kompatibel, dan tidak memiliki pembawa gen thalasemia. Siap melanjutkan ke pendaftaran KUA.'
    };
  }
  if (endpoint.startsWith('/cost-simulate')) {
    return {
      success: true,
      ai_explanation: "Simulasi Estimasi Biaya Skrining:\n\n- Darah Rutin + Urin Lengkap: Rp 120.000 (Dicover BPJS Kesehatan di Faskes 1)\n- Pemeriksaan Golongan Darah & Rhesus: Rp 45.000 (Dicover BPJS)\n- Skrining Carrier Thalasemia (MCV/MCH): Rp 80.000 (Covered)\n- Suntik Imunoglobulin RhoGAM (Jika diperlukan bagi Rh-): Rp 1.800.000 - Rp 2.500.000 (Subsidi BPJS sebagian di Faskes Rujukan).\n\nTotal Biaya Mandiri: ~Rp 0 - Rp 2.500.000 tergantung kecocokan Rhesus."
    };
  }
  if (endpoint.startsWith('/certificate/1')) {
    return {
      nomor_sertifikat: "SRT/GIZIKU/2026/XI/8812",
      nama_pria: "Rian Hermawan",
      nama_wanita: "Siti Aminah",
      golongan_darah_pria: "B Rhesus (+)",
      golongan_darah_wanita: "A Rhesus (+)",
      status_skrining: "SELESAI & KOMPATIBEL",
      readiness_score: 95,
      tanggal_terbit: new Date().toLocaleDateString('id-ID')
    };
  }
  if (endpoint.startsWith('/epidemiologi/stats')) {
    return {
      summary: {
        total_provinces: 34,
        high_risk_provinces: 6,
        avg_aki: 112,
        total_thalasemia: 14890
      },
      provinces: [
        { province_code: 'NT', province_name: 'Nusa Tenggara Timur', risk_score: 82, aki: 160, populasi_rh_negatif_persen: 0.4, defisit_stok_rh_negatif: 15, indeks_literasi: 3.1, kasus_thalasemia: 480, jumlah_faskes: 38 },
        { province_code: 'SR', province_name: 'Sulawesi Barat', risk_score: 75, aki: 125, populasi_rh_negatif_persen: 0.3, defisit_stok_rh_negatif: 6, indeks_literasi: 3.6, kasus_thalasemia: 50, jumlah_faskes: 24 },
        { province_code: 'NB', province_name: 'Nusa Tenggara Barat', risk_score: 72, aki: 130, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 9, indeks_literasi: 3.4, kasus_thalasemia: 310, jumlah_faskes: 44 },
        { province_code: 'AC', province_name: 'Aceh', risk_score: 68, aki: 120, populasi_rh_negatif_persen: 0.8, defisit_stok_rh_negatif: 12, indeks_literasi: 3.5, kasus_thalasemia: 340, jumlah_faskes: 45 },
        { province_code: 'KB', province_name: 'Kalimantan Barat', risk_score: 65, aki: 115, populasi_rh_negatif_persen: 0.5, defisit_stok_rh_negatif: 8, indeks_literasi: 3.6, kasus_thalasemia: 180, jumlah_faskes: 49 },
        { province_code: 'JB', province_name: 'Jawa Barat', risk_score: 55, aki: 85, populasi_rh_negatif_persen: 0.9, defisit_stok_rh_negatif: 18, indeks_literasi: 4.2, kasus_thalasemia: 2850, jumlah_faskes: 210 }
      ]
    };
  }
  return {};
}
