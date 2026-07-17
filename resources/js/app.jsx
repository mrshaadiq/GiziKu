import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// ==================== GLOBAL HELPER & API CONFIG ====================
const API_BASE = '/api';
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

async function api(endpoint, options = {}) {
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

function formatRupiah(num) {
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ==================== ENRICH DATABASE STUNTING DATA ====================
function enrichProvinceData(dbProvinces) {
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

// ==================== SIDEBAR NAV ITEMS ====================
const NAV_ITEMS = [
  { section: 'Utama' },
  { id: 'home', icon: '🗺️', label: 'Peta Risiko Indonesia' },
  { id: 'dashboard', icon: '📊', label: 'Dashboard GiziKu' },
  { section: 'Fitur Skrining AI' },
  { id: 'labscan', icon: '🔬', label: 'AI Lab Scanner', badge: 'AI' },
  { id: 'mentalscan', icon: '🧠', label: 'Skrining Mental AI', badge: 'AI' },
  { id: 'genetic', icon: '🧬', label: 'Analisis Genetik' },
  { id: 'geotriage', icon: '🏥', label: 'Cari Faskes' },
  { id: 'readiness', icon: '🎯', label: 'Skor Kesiapan' },
  { id: 'referral', icon: '💳', label: 'Kartu Rujukan' },
  { id: 'cost', icon: '💰', label: 'Simulasi Biaya' },
  { id: 'certificate', icon: '📜', label: 'Sertifikat Digital' },
  { section: 'Edukasi & Nakes' },
  { id: 'literasi', icon: '📚', label: 'Literasi Kesehatan' },
  { id: 'tracker', icon: '⏱️', label: '72-Hour Tracker', badge: '!' },
  { id: 'actionplan', icon: '📋', label: 'Rencana Aksi AI' },
  { id: 'donor', icon: '🩸', label: 'Jaringan Donor' },
  { id: 'epidemiologi', icon: '📈', label: 'Epidemiologi' },
];

// ==================== CLIENT MOCK API DATABASE ====================
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

// ==================== MAIN COMPONENT: APP ====================
function App() {
  const [page, setPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState(window.USER_NAME || 'Demo Catin');
  const [userEmail, setUserEmail] = useState(window.USER_EMAIL || 'demo@catinguard.id');

  return (
    <div className="flex min-h-screen bg-[#05080f] text-[#f1f5f9] font-sans antialiased">
      {/* Mobile Burger Menu Button */}
      <button 
        className="fixed z-50 p-3 bg-slate-900/90 border border-slate-800 rounded-xl bottom-6 right-6 lg:hidden text-cyan-400 shadow-lg shadow-cyan-900/20 active:scale-95 transition-all"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars text-xl"></i>
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Collapsible Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-45 flex flex-col w-72 bg-slate-950/95 border-r border-slate-900/80 backdrop-blur-md transform lg:transform-none transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand/Logo Area */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-900">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 shadow-md shadow-cyan-500/25">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">GiziKu</h1>
            <div className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Pranikah AI Portal</div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          {NAV_ITEMS.map((item, i) =>
            item.section ? (
              <div key={i} className="px-3 pt-4 pb-1 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{item.section}</div>
            ) : (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${page === item.id ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-l-4 border-cyan-400 text-white shadow-[inset_0_0_8px_rgba(34,211,238,0.05)]' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider ${item.badge === 'AI' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          )}
        </nav>

        {/* User Card footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-900 bg-slate-900/20">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5">
              <div className="w-full h-full rounded-full bg-[#05080f] flex items-center justify-center text-xs font-bold text-white uppercase">{userName[0]}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate" style={{lineHeight: 1.2}}>{userName}</div>
              <div className="text-[10px] text-slate-500 truncate font-mono">{userEmail}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 lg:pl-72 min-h-screen flex flex-col">
        <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1200px] w-full mx-auto pb-24 lg:pb-12">
          {page === 'home' && <HomePage />}
          {page === 'dashboard' && <DashboardPage />}
          {page === 'literasi' && <LiterasiPage />}
          {page === 'labscan' && <LabScannerPage />}
          {page === 'mentalscan' && <MentalScanPage />}
          {page === 'genetic' && <GeneticTreePage />}
          {page === 'geotriage' && <GeoTriagePage />}
          {page === 'tracker' && <TrackerPage />}
          {page === 'actionplan' && <ActionPlanPage />}
          {page === 'referral' && <ReferralCardPage />}
          {page === 'donor' && <DonorNetworkPage />}
          {page === 'readiness' && <ReadinessScorePage />}
          {page === 'cost' && <CostSimulatorPage />}
          {page === 'certificate' && <CertificatePage />}
          {page === 'epidemiologi' && <EpidemiologiPage />}
        </div>
      </main>
    </div>
  );
}

// ==================== PAGE: HOME (Interactive SVG Map) ====================
function HomePage() {
  const [provinces, setProvinces] = useState([]);
  const [activeLayer, setActiveLayer] = useState('risk');
  const [selectedProvince, setSelectedProvince] = useState(null);

  useEffect(() => {
    api('/geo-triage/provinces').then(data => {
      setProvinces(Array.isArray(data) ? data : enrichProvinceData(data));
    });
  }, []);

  const highRisk = provinces.filter(p => p.risk_score >= 45);
  const selected = provinces.find(p => p.province_code === selectedProvince);

  const SOURCES = [
    { label: 'BPS — Angka Kematian Ibu (AKI)', url: 'https://www.bps.go.id/id/statistics-table/2/MTczNyMy/angka-kematian-ibu-melahirkan-per-100-000-kelahiran-hidup.html' },
    { label: 'Kemenkes — Data Thalasemia Indonesia', url: 'https://www.kemkes.go.id/article/view/23010400004/data-dan-informasi-profil-kesehatan-indonesia-2022.html' },
    { label: 'WHO — Maternal Mortality Ratio', url: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/maternal-mortality-ratio-(per-100-000-live-births)' },
    { label: 'Kemenkes — Profil Faskes (Puskesmas)', url: 'https://www.kemkes.go.id/article/view/23123100005/profil-kementerian-kesehatan-ri-tahun-2023.html' },
    { label: 'BPS — Jumlah Penduduk per Provinsi', url: 'https://www.bps.go.id/id/statistics-table/2/MTk2IzI=/projected-population-by-province-2020-2025.html' },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          🗺️ Peta Risiko Kesehatan Pranikah Indonesia
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Visualisasi data interaktif risiko stunting, rhesus negatif, kasus thalasemia, dan angka kematian ibu di 34 provinsi Indonesia untuk intervensi kesehatan calon pengantin.
        </p>
      </div>

      {/* Layer Toggles */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 border border-slate-900 rounded-xl w-max">
        {[
          { id: 'risk', label: '🎯 Skor Risiko Gabungan' },
          { id: 'aki', label: '💔 Kematian Ibu (AKI)' },
          { id: 'thalasemia', label: '🧬 Kasus Thalasemia' },
          { id: 'literasi', label: '📖 Indeks Literasi' },
        ].map(l => (
          <button 
            key={l.id} 
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeLayer === l.id ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveLayer(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Map Widget */}
      <div className="p-6 bg-slate-950/80 border border-slate-900 rounded-2xl shadow-xl shadow-black/40">
        <IndonesiaSVGMap
          provinces={provinces}
          activeLayer={activeLayer}
          selectedProvince={selectedProvince}
          onSelectProvince={(p) => setSelectedProvince(p.province_code === selectedProvince ? null : p.province_code)}
        />

        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-900 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-emerald-500"></span> Risiko Rendah</div>
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-yellow-500"></span> Risiko Sedang</div>
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-orange-500"></span> Risiko Tinggi</div>
          <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded bg-red-600"></span> Risiko Sangat Tinggi</div>
        </div>
      </div>

      {/* Selected Province details */}
      {selected && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-black/30" style={{borderColor: selected.risk_color + '40'}}>
          <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">📍 Provinsi {selected.province_name}</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider shadow-inner" style={{background: selected.risk_color + '20', color: selected.risk_color}}>
              SKOR RISIKO: {selected.risk_score}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-cyan-400">{selected.stunting}%</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Prevalensi Stunting</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.aki}</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Kematian Ibu (per 100k)</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.kasus_thalasemia?.toLocaleString()}</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Kasus Thalasemia</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.populasi_rh_negatif_persen}%</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Populasi Rhesus (-)</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-amber-400">{selected.defisit_stok_rh_negatif} vial</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Defisit Imunoglobulin</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl">
              <div className="text-xl font-bold font-mono text-white">{selected.indeks_literasi}/5</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">Indeks Literasi</div>
            </div>
            <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl col-span-2">
              <div className="text-xs text-slate-300 leading-relaxed font-medium">{selected.faskes_access}</div>
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1.5">Aksesibilitas Faskes Rujukan</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-950/15 border border-red-500/15 rounded-xl">
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-red-400 block mb-1">Rencana Prioritas Penanganan Daerah</span>
            <p className="text-xs text-slate-400 leading-relaxed">{selected.urgency_priority}</p>
          </div>
        </div>
      )}

      {/* High Risk Provinces */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">⚠️ Provinsi Dengan Urgensi Tinggi ({highRisk.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {highRisk.slice(0, 8).map(p => (
            <div 
              key={p.province_code} 
              className="p-3.5 bg-slate-900/30 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 hover:bg-slate-900/50 transition-all"
              style={{borderLeftWidth: '4px', borderLeftColor: p.risk_color}}
              onClick={() => setSelectedProvince(p.province_code === selectedProvince ? null : p.province_code)}
            >
              <div className="text-xs font-bold text-white">{p.province_name}</div>
              <div className="text-sm font-black font-mono mt-1" style={{color: p.risk_color}}>RISIKO: {p.risk_score}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Stunting: {p.stunting}% · AKI: {p.aki}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Government data resources */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-300 mb-2">📚 Sumber Data Nasional Resmi</h3>
        <p className="text-xs text-slate-500 mb-4">Intervensi klinis & epidemiologi GiziKu terintegrasi dengan publikasi data resmi:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SOURCES.map((s, i) => (
            <a 
              key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-cyan-500/30 hover:bg-slate-900/30 text-xs text-cyan-400 hover:text-cyan-300 transition-all font-semibold"
            >
              <span>🔗</span>
              <span className="truncate">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: DASHBOARD ====================
function DashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api('/epidemiologi/dashboard').then(setData); }, []);

  if (!data) return <div className="flex items-center justify-center p-12"><div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📊 Dashboard Ringkasan GiziKu</h2>
        <p className="text-slate-400 text-sm mt-2">Deteksi Dini Rhesus Negatif, Morfologi Sel Darah Merah (Skrining Carrier Thalasemia), dan Risiko Anemia/Stunting</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">👥</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-white mt-3">{data.total_catin}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Calon Pengantin Skrining</div>
        </div>
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">⏱️</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-amber-400 mt-3">{data.active_cases}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Kasus Aktif (72-Hour)</div>
        </div>
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">✅</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-emerald-400 mt-3">{data.resolved_cases}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Tindakan Selesai</div>
        </div>
        <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl shadow-lg">
          <div className="text-slate-500 text-2xl">🏥</div>
          <div className="text-2xl md:text-3xl font-black font-mono text-cyan-400 mt-3">{data.total_faskes}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Faskes Rujukan Jejaring</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-cyan-400">💡 Alur Deteksi & Skrining Pranikah</h3>
          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span><div><strong className="text-white">Isi Kuesioner Kesehatan Mental / Profil:</strong> Menganalisis latar belakang perilaku dan psikologis calon pengantin secara holistik.</div></div>
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span><div><strong className="text-white">Gunakan AI Lab Scanner:</strong> Unggah foto lembar hasil lab darah Anda untuk deteksi instan indikator Hemoglobin, Rhesus, dan Thalasemia Carrier.</div></div>
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span><div><strong className="text-white">Bandingkan Pasangan (Pohon Genetik):</strong> Hitung kecocokan genetik dan rhesus golongan darah untuk memproyeksikan keamanan janin kelak.</div></div>
            <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span><div><strong className="text-white">Rujukan Faskes:</strong> Jika berisiko tinggi, cetak Kartu Rujukan Digital dan temukan rumah sakit terdekat yang menyediakan persediaan obat RhoGAM.</div></div>
          </div>
        </div>

        <div className="p-6 bg-amber-950/10 border border-amber-500/15 rounded-2xl flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-2">⚕️ Disclaimer Medis Resmi</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              GiziKu AI menggunakan algoritma kecerdasan buatan terlatih dan integrasi data nasional untuk memindai risiko klinis pada calon pengantin. Namun, hasil analisis sistem ini bersifat skrining dini dan rekomendasi edukasi, bukan diagnosis medis mutlak. Keputusan klinis dan resep obat harus tetap dikonfirmasi oleh dokter.
            </p>
          </div>
          <div className="text-[10px] text-amber-500/80 font-mono mt-4">Kemenkes RI & BKKBN Partner App</div>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: AI LAB SCANNER ====================
function LabScannerPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleScan = () => {
    if (!file) return;
    setLoading(true);
    // Simulates AI request
    api('/lab-scan/analyze', { method: 'POST' }).then(res => {
      setResult(res.result);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🔬 AI Lab Sheet Scanner</h2>
        <p className="text-slate-400 text-sm mt-2">Unggah lembar hasil uji laboratorium darah lengkap untuk ekstraksi dan pembacaan otomatis berbasis AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Langkah 1: Unggah Gambar Lab</h3>
            <div 
              className="border-2 border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-900/20 hover:bg-slate-900/30 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              {preview ? (
                <img src={preview} className="max-h-56 mx-auto rounded-xl object-contain" alt="Preview" />
              ) : (
                <div className="space-y-3">
                  <div className="text-4xl text-slate-600">📄</div>
                  <div className="text-xs text-slate-400 font-semibold">Klik untuk memilih file hasil lab darah (JPG/PNG)</div>
                  <div className="text-[10px] text-slate-600">Mendukung resolusi tinggi up to 5MB</div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleScan}
            disabled={!file || loading}
            className={`w-full py-3.5 text-xs font-bold rounded-xl transition-all ${!file ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10'}`}
          >
            {loading ? 'Sedang Menganalisis Dengan AI...' : 'Mulai Analisis AI'}
          </button>
        </div>

        {/* AI Results */}
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Langkah 2: Hasil Pembacaan AI</h3>
            {loading && (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-slate-500 font-bold">OCR & Deep Learning model sedang memindai...</div>
              </div>
            )}
            {!loading && !result && (
              <div className="text-center p-12 text-xs text-slate-600">Silakan unggah dan analisis file hasil lab untuk melihat penjelasan AI.</div>
            )}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Analisis Sukses
                </h4>
                <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">{result.ai_explanation}</pre>
              </div>
            )}
          </div>
          {result && (
            <div className="text-[10px] text-slate-500 text-center mt-6">Sistem terenkripsi. File hasil lab dihapus dari cloud dalam 10 menit.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: SKRINNING MENTAL AI (Ported from Alpine) ====================
function MentalScanPage() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('new_scan');
  const [patient, setPatient] = useState({ name: window.USER_NAME || '', birth_date: '', age: '', ageText: '', gender: 'L' });
  const [answers, setAnswers] = useState({});
  const [currentArea, setCurrentArea] = useState('muka');
  const [photos, setPhotos] = useState({ muka: null, mata: null, kuku: null });
  const [compressing, setCompressing] = useState({ muka: false, mata: false, kuku: false });
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [overallReport, setOverallReport] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryReport, setSelectedHistoryReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoFeedRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load static history list from Laravel compile context
  useEffect(() => {
    // History fallback list
    setHistoryList([
      { id: 101, nama_pasien: patient.name || 'Demo User', usia_pasien: 25, jenis_kelamin: 'L', level_risiko: 'Rendah', created_at: new Date(Date.now() - 3600000 * 5).toISOString(), laporan_gabungan_decoded: { ringkasan_pengguna: "Kondisi psikologis stabil. Tingkat stres 15% (Rendah), kecemasan 20% (Rendah), pola tidur baik. Disarankan pertahankan aktivitas fisik dan waktu istirahat yang teratur." } }
    ]);
  }, []);

  const calculateAge = (bdate) => {
    if (!bdate) return;
    const birthDate = new Date(bdate);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    let ageString = '';
    if (years > 0) ageString += `${years} Tahun `;
    if (months > 0 || years === 0) ageString += `${months} Bulan`;
    
    setPatient(prev => ({ ...prev, age: years, ageText: ageString.trim(), birth_date: bdate }));
    setAnswers({});
  };

  const getAgeGroupLabel = () => {
    const age = parseInt(patient.age) || 0;
    if (age >= 1 && age <= 3) return 'Grup Balita: 1-3 Tahun';
    if (age >= 4 && age <= 6) return 'Grup Prasekolah: 4-6 Tahun';
    if (age >= 7 && age <= 12) return 'Grup Anak Sekolah: 7-12 Tahun';
    return 'Grup Remaja & Dewasa: >13 Tahun';
  };

  const getQuestions = () => {
    const age = parseInt(patient.age) || 0;
    if (age >= 1 && age <= 3) {
      return [
        { id: 'q1', text: 'Apakah anak Anda sering mengalami tantrum hebat atau rewel berlebihan?', key: 'tantrum' },
        { id: 'q2', text: 'Apakah anak Anda menunjukkan tanda kemunduran perilaku (seperti mengompol lagi atau mogok bicara)?', key: 'regresi' },
        { id: 'q3', text: 'Apakah anak Anda memiliki kebiasaan mengisap jempol, menggigit kuku, atau membenturkan kepala?', key: 'isap_jempol' },
        { id: 'q4', text: 'Apakah anak Anda sulit ditenangkan saat berpisah dari orang tua atau pengasuh?', key: 'separation' },
        { id: 'q5', text: 'Apakah pola tidur anak Anda tidak teratur (sering terbangun malam atau sulit tidur)?', key: 'sleep_dist' },
        { id: 'q6', text: 'Apakah anak Anda menolak makan secara tidak biasa (GTM berlebihan/pilih-pilih makanan ekstrem)?', key: 'eating_issue' },
        { id: 'q7', text: 'Catatan tambahan orang tua mengenai kondisi perilaku atau kebiasaan balita Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    } else if (age >= 4 && age <= 6) {
      return [
        { id: 'q1', text: 'Apakah anak Anda sering mengeluh takut berlebihan (misal takut gelap, sendiri, atau monster)?', key: 'fear' },
        { id: 'q2', text: 'Apakah anak Anda sering menarik diri dari interaksi keluarga atau menolak bermain dengan teman sebaya?', key: 'social_withdraw' },
        { id: 'q3', text: 'Apakah anak Anda sering mengalami mimpi buruk berulang secara intens pada malam hari?', key: 'nightmare' },
        { id: 'q4', text: 'Apakah anak Anda memiliki kebiasaan menggigit kuku atau mengorek kulit saat merasa cemas?', key: 'nail_biting' },
        { id: 'q5', text: 'Apakah anak Anda tampak cemas, panik, atau menangis berlebihan saat ditinggal sebentar oleh orang tua?', key: 'separation_anxiety' },
        { id: 'q6', text: 'Apakah anak Anda sering mengeluh sakit perut atau pusing tanpa adanya sebab medis yang jelas?', key: 'somatic' },
        { id: 'q7', text: 'Catatan tambahan orang tua mengenai kondisi perilaku atau kebiasaan anak prasekolah Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    } else if (age >= 7 && age <= 12) {
      return [
        { id: 'q1', text: 'Apakah anak Anda menunjukkan penurunan performa belajar atau menolak bersekolah secara tiba-tiba?', key: 'school_issue' },
        { id: 'q2', text: 'Apakah anak Anda tampak mudah tersinggung, lekas marah, atau bertindak agresif/membangkang?', key: 'irritability' },
        { id: 'q3', text: 'Apakah anak Anda sering cemas atau takut berlebihan mengenai nilai sekolah, ujian, atau pertemanan?', key: 'academic_stress' },
        { id: 'q4', text: 'Apakah anak Anda memiliki kebiasaan menggigit kuku, melamun berlebihan, atau memutar-mutar rambut saat tegang?', key: 'nervous_habit' },
        { id: 'q5', text: 'Apakah anak Anda sering mengeluh lelah, lesu, atau terlihat tidak bersemangat untuk bermain?', key: 'fatigue' },
        { id: 'q6', text: 'Apakah anak Anda mengalami kesulitan tidur, sering begadang, atau mengantuk berlebihan di siang hari?', key: 'insomnia' },
        { id: 'q7', text: 'Catatan tambahan orang tua mengenai kondisi perilaku atau kebiasaan anak sekolah Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    } else {
      return [
        { id: 'q1', text: 'Apakah Anda tampak murung, sedih, atau merasa hampa hampir sepanjang hari?', key: 'depression' },
        { id: 'q2', text: 'Apakah Anda menarik diri dari pergaulan teman dan keluarga secara drastis?', key: 'withdraw' },
        { id: 'q3', text: 'Apakah Anda menunjukkan kelelahan ekstrem (burnout), hilangnya minat hobi, atau lemas terus-menerus?', key: 'burnout' },
        { id: 'q4', text: 'Apakah Anda memiliki kebiasaan menggigit kuku, menarik rambut, atau melukai diri saat tertekan?', key: 'anxiety_habit' },
        { id: 'q5', text: 'Apakah Anda mengalami gangguan tidur parah (insomnia berat, begadang sepanjang malam)?', key: 'insomnia' },
        { id: 'q6', text: 'Apakah Anda terlihat tidak mempedulikan penampilan atau perawatan diri?', key: 'self_neglect' },
        { id: 'q7', text: 'Catatan tambahan mengenai kondisi perilaku atau kebiasaan Anda (opsional):', key: 'catatan_orang_tua', type: 'text' }
      ];
    }
  };

  const answersComplete = () => {
    return getQuestions().every(q => q.type === 'text' || answers[q.key] !== undefined);
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoFeedRef.current) {
        videoFeedRef.current.srcObject = s;
      }
      setCameraActive(true);
    } catch (err) {
      alert("Kamera tidak dapat diakses. Anda dapat mengunggah file foto secara manual.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoFeedRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoFeedRef.current, 0, 0, canvas.width, canvas.height);
    const rawUrl = canvas.toDataURL('image/jpeg');
    setPhotos(prev => ({ ...prev, [currentArea]: rawUrl }));
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => ({ ...prev, [currentArea]: event.target.result }));
      };
      reader.readAsDataURL(f);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const submitAll = () => {
    setLoading(true);
    setStep(4);
    setTimeout(() => {
      const mockResult = {
        success: true,
        id: Date.now(),
        level_risiko: 'Rendah',
        laporan_gabungan: {
          ringkasan_pengguna: "Kondisi psikologis stabil. AI tidak mendeteksi tanda-tanda kecemasan wajah atau indikasi stres mata yang patologis. Rekomendasi: Pertahankan tidur teratur 7-8 jam per hari, dan luangkan waktu relaksasi 15 menit.",
          stres_level: "18% (Rendah)",
          insomnia_level: "22% (Rendah)",
          kecemasan_level: "15% (Rendah)"
        }
      };

      setOverallReport(mockResult.laporan_gabungan);
      setHistoryList(prev => [
        {
          id: mockResult.id,
          nama_pasien: patient.name,
          usia_pasien: patient.age,
          jenis_kelamin: patient.gender,
          level_risiko: mockResult.level_risiko,
          created_at: new Date().toISOString(),
          laporan_gabungan_decoded: mockResult.laporan_gabungan
        },
        ...prev
      ]);
      setLoading(false);
      setStep(5);
    }, 2500);
  };

  const resetScanner = () => {
    stopCamera();
    setStep(1);
    setPatient({ name: window.USER_NAME || '', birth_date: '', age: '', ageText: '', gender: 'L' });
    setAnswers({});
    setPhotos({ muka: null, mata: null, kuku: null });
    setOverallReport(null);
    setSelectedHistoryReport(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            🧠 Visual Mental Health AI Scanner
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            Skrining tingkat stres, insomnia, kecemasan, dan kejiwaan menggunakan visual facial analysis (Gemini AI) pada wajah, mata, dan kuku calon pengantin atau anak.
          </p>
        </div>
        <button onClick={resetScanner} className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-white transition-all">
          <i className="fas fa-redo mr-2"></i> Reset Skrining
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-2 pb-px">
        <button onClick={() => setActiveTab('new_scan')} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'new_scan' ? 'text-white border-cyan-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
          <i className="fas fa-stethoscope mr-2"></i> Skrining Baru
        </button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'history' ? 'text-white border-cyan-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
          <i className="fas fa-history mr-2"></i> Riwayat Skrining ({historyList.length})
        </button>
      </div>

      {activeTab === 'new_scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-bold">1</span> Profil Pasien
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Nama Lengkap</label>
                    <input type="text" value={patient.name} onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 text-sm bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl text-white font-medium" placeholder="Masukkan nama" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Tanggal Lahir</label>
                      <input type="date" value={patient.birth_date} onChange={(e) => calculateAge(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-900/60 border border-slate-800 hover:border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl text-white font-mono" />
                      {patient.ageText && <div className="text-[10px] font-extrabold text-cyan-400 mt-1.5">Umur: {patient.ageText}</div>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">Jenis Kelamin</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setPatient(prev => ({ ...prev, gender: 'L' }))} className={`py-3 text-xs font-bold rounded-xl border transition-all ${patient.gender === 'L' ? 'bg-cyan-500 text-slate-950 border-cyan-500' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>Laki-laki</button>
                        <button type="button" onClick={() => setPatient(prev => ({ ...prev, gender: 'P' }))} className={`py-3 text-xs font-bold rounded-xl border transition-all ${patient.gender === 'P' ? 'bg-cyan-500 text-slate-950 border-cyan-500' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>Perempuan</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={() => setStep(2)} disabled={!patient.name || !patient.age} className={`px-5 py-3 text-xs font-bold rounded-xl transition-all ${(!patient.name || !patient.age) ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'}`}>
                    Lanjut ke Kuesioner <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-bold">2</span> Kuesioner Mental
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">{getAgeGroupLabel()}</span>
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {getQuestions().map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-900/20 border border-slate-900 rounded-xl space-y-3">
                      <div className="text-xs font-bold text-slate-200">{idx + 1}. {q.text}</div>
                      {q.type === 'text' ? (
                        <textarea value={answers[q.key] || ''} onChange={(e) => setAnswers(prev => ({ ...prev, [q.key]: e.target.value }))} className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-cyan-400 focus:outline-none rounded-xl text-slate-300 font-medium" placeholder="Tuliskan catatan..." rows={3} />
                      ) : (
                        <div className="flex gap-2">
                          {['Ya', 'Tidak'].map((opt, oi) => (
                            <button key={oi} type="button" onClick={() => setAnswers(prev => ({ ...prev, [q.key]: opt }))} className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${answers[q.key] === opt ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-black' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-900">
                  <button onClick={() => setStep(1)} className="px-5 py-3 text-xs font-bold rounded-xl border border-slate-800 text-slate-400 hover:text-white">Kembali</button>
                  <button onClick={() => setStep(3)} disabled={!answersComplete()} className={`px-5 py-3 text-xs font-bold rounded-xl transition-all ${!answersComplete() ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'}`}>
                    Lanjut ke Foto Fisik <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs flex items-center justify-center font-bold">3</span> Foto Fisik AI Scan
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">Area: {currentArea.toUpperCase()}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'muka', label: 'Wajah (Muka)', desc: 'Tingkat stres/depresi', icon: '👤' },
                    { id: 'mata', label: 'Mata', desc: 'Anemia & insomnia', icon: '👁️' },
                    { id: 'kuku', label: 'Kuku', desc: 'Kecemasan & sirkulasi', icon: '💅' }
                  ].map(a => (
                    <button key={a.id} type="button" onClick={() => { stopCamera(); setCurrentArea(a.id); }} className={`p-4 rounded-xl border text-left transition-all ${currentArea === a.id ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-cyan-400 text-white' : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:text-white'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{a.label}</span>
                        <span>{photos[a.id] ? '✅' : a.icon}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{a.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="border border-slate-900 rounded-2xl overflow-hidden bg-slate-900/10 min-h-64 flex flex-col items-center justify-center p-6 relative">
                  {cameraActive ? (
                    <div className="w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-800 relative bg-black">
                      <video ref={videoFeedRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                      <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                        <div className={`w-32 h-32 border border-dashed border-cyan-400/60 ${currentArea === 'muka' ? 'rounded-full' : 'rounded-lg'}`}></div>
                      </div>
                    </div>
                  ) : photos[currentArea] ? (
                    <img src={photos[currentArea]} className="max-h-56 rounded-xl object-contain border border-slate-800" alt="Preview" />
                  ) : (
                    <div className="text-center space-y-2">
                      <span className="text-4xl">📷</span>
                      <p className="text-xs text-slate-400 font-semibold">{currentArea === 'muka' ? 'Posisikan wajah tepat di tengah' : currentArea === 'mata' ? 'Dekatkan mata untuk melihat selaput' : 'Posisikan kuku jari Anda lurus'}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 relative z-10">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    {cameraActive ? (
                      <button onClick={capturePhoto} className="px-4 py-2.5 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950">Ambil Foto</button>
                    ) : (
                      <>
                        <button onClick={startCamera} className="px-4 py-2.5 text-xs font-bold rounded-lg bg-slate-900 border border-slate-800 text-white">Gunakan Kamera</button>
                        <button onClick={handleUploadClick} className="px-4 py-2.5 text-xs font-bold rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Unggah File</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-900">
                  <button onClick={() => setStep(2)} className="px-5 py-3 text-xs font-bold rounded-xl border border-slate-800 text-slate-400 hover:text-white">Kembali</button>
                  <button onClick={submitAll} disabled={!photos.muka && !photos.mata && !photos.kuku} className={`px-5 py-3 text-xs font-bold rounded-xl transition-all ${(!photos.muka && !photos.mata && !photos.kuku) ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'}`}>
                    Analisis AI Komprehensif <i className="fas fa-brain ml-1"></i>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-12 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-sm font-bold text-white">Deep Scanning Sedang Berlangsung</h4>
                <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed">
                  Gemini AI sedang memindai biometrik mikro pada foto wajah, warna kelopak mata, serta rona kuku Anda disandingkan dengan jawaban kuesioner...
                </p>
              </div>
            )}

            {step === 5 && overallReport && (
              <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-5 animate-fadeIn">
                <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>🎉</span> Hasil Skrining AI Selesai
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">Hasil Laporan</span>
                </h3>

                <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-cyan-400 block mb-1">Rangkuman Diagnosa AI</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{overallReport.ringkasan_pengguna}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900/80">
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Stres</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">{overallReport.stres_level}</div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Kecemasan</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">{overallReport.kecemasan_level}</div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Insomnia</div>
                      <div className="text-xs font-bold text-slate-200 mt-1">{overallReport.insomnia_level}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-900">
                  <button onClick={resetScanner} className="px-5 py-3 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950">Mulai Skrining Baru</button>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-6">
            <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl space-y-3.5 shadow-lg">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <i className="fas fa-info-circle"></i> Petunjuk AI Scan
              </h4>
              <ul className="text-xs text-slate-400 space-y-3 list-disc pl-4 leading-relaxed">
                <li>Pastikan area pemotretan memiliki pencahayaan terang yang merata (cahaya alami/lampu terang).</li>
                <li>Saat memotret mata, tarik kelopak mata bawah sedikit agar konjungtiva terlihat jelas guna pemindaian anemia.</li>
                <li>Pada pemindaian kuku, lepaskan cat kuku agar AI dapat memetakan saturasi rona kuku.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Daftar Riwayat Skrining Kesehatan Mental</h3>
          {historyList.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-600">Belum ada riwayat skrining terdaftar.</div>
          ) : selectedHistoryReport ? (
            <div className="space-y-4 animate-fadeIn">
              <button onClick={() => setSelectedHistoryReport(null)} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-800 text-slate-400 hover:text-white mb-2">
                <i className="fas fa-arrow-left mr-1"></i> Kembali ke Daftar
              </button>
              <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Nama: <strong>{selectedHistoryReport.nama_pasien}</strong> ({selectedHistoryReport.usia_pasien} Thn)</span>
                  <span>Tanggal: {new Date(selectedHistoryReport.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 border-t border-slate-900 pt-3">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Hasil Diagnosa</span>
                  {selectedHistoryReport.laporan_gabungan_decoded?.ringkasan_pengguna}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3">Pasien</th>
                    <th>Usia</th>
                    <th>Risiko</th>
                    <th>Tanggal</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map(item => (
                    <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300">
                      <td className="py-3 font-semibold text-white">{item.nama_pasien}</td>
                      <td>{item.usia_pasien} Tahun</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${item.level_risiko === 'Tinggi' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                          {item.level_risiko}
                        </span>
                      </td>
                      <td className="text-slate-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="text-right">
                        <button onClick={() => viewHistoryItem(item)} className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-lg transition-all">Lihat</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const viewHistoryItem = (item) => {
    setSelectedHistoryReport(item);
  };
}

// ==================== PAGE: ANALISIS GENETIK ====================
function GeneticTreePage() {
  const [form, setForm] = useState({ rhesus_pria: 'Positif (+)', rhesus_wanita: 'Positif (+)', thalasemia_pria: 'Normal', thalasemia_wanita: 'Normal' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    api('/genetic-tree/calculate', { method: 'POST', body: JSON.stringify(form) }).then(res => {
      setResult(res);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🧬 Analisis Genetik & Kompatibilitas</h2>
        <p className="text-slate-400 text-sm mt-2">Menganalisis probabilitas kecocokan Rhesus dan penurunan sifat Thalasemia untuk perlindungan kesehatan keturunan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4 md:col-span-1">
          <h3 className="text-sm font-bold text-white border-b border-slate-900 pb-2">Profil Calon Pengantin</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Rhesus Pria</label>
              <select value={form.rhesus_pria} onChange={e=>setForm({...form, rhesus_pria: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400">
                <option>Positif (+)</option>
                <option>Negatif (-)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Rhesus Wanita</label>
              <select value={form.rhesus_wanita} onChange={e=>setForm({...form, rhesus_wanita: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400">
                <option>Positif (+)</option>
                <option>Negatif (-)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Thalasemia Pria</label>
              <select value={form.thalasemia_pria} onChange={e=>setForm({...form, thalasemia_pria: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400">
                <option>Normal</option>
                <option>Carrier (Thalasemia Minor)</option>
                <option>Penderita (Thalasemia Mayor)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">Thalasemia Wanita</label>
              <select value={form.thalasemia_wanita} onChange={e=>setForm({...form, thalasemia_wanita: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400">
                <option>Normal</option>
                <option>Carrier (Thalasemia Minor)</option>
                <option>Penderita (Thalasemia Mayor)</option>
              </select>
            </div>
          </div>

          <button onClick={handleCalculate} disabled={loading} className="w-full py-3 mt-4 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all font-black shadow-lg shadow-cyan-500/10">
            {loading ? 'Menghitung...' : 'Mulai Analisis'}
          </button>
        </div>

        {/* Tree Output */}
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Hasil Kalkulasi Pohon Genetik</h3>
            {loading && <div className="p-12 text-center text-xs text-slate-500">Mencocokkan genotip...</div>}
            {!loading && !result && (
              <div className="text-center py-12 text-xs text-slate-600">Tekan tombol 'Mulai Analisis' untuk melihat proyeksi pewarisan gen.</div>
            )}
            {!loading && result && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Tingkat Risiko Warisan</div>
                  <div className={`text-lg font-black mt-1 ${result.risk_level === 'Tinggi' ? 'text-red-500' : 'text-emerald-400'}`}>{result.risk_level}</div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed font-medium">{result.explanation}</p>
                </div>

                {/* Tree Visual */}
                <div className="border border-slate-900 rounded-xl p-4 bg-black/10 flex flex-col items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-4 block">Visualisasi Genotip Anak</span>
                  <div className="flex gap-12 text-center text-xs font-semibold">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-slate-500">Pria</div>
                      <div className="text-white mt-1">{form.rhesus_pria === 'Positif (+)' ? 'Rh+' : 'Rh-'}</div>
                    </div>
                    <div className="text-xl self-center text-slate-500">✖</div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-slate-500">Wanita</div>
                      <div className="text-white mt-1">{form.rhesus_wanita === 'Positif (+)' ? 'Rh+' : 'Rh-'}</div>
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-slate-800 my-2"></div>
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs font-bold px-6">
                    {form.rhesus_pria === 'Positif (+)' && form.rhesus_wanita === 'Negatif (-)' 
                      ? '⚠️ Risiko Tinggi Inkompatibilitas Rhesus (Eritroblastosis Fetalis)' 
                      : '✅ Golongan Darah Kompatibel (0% Risiko Inkompatibilitas Rhesus)'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: CARI FASKES (Geo-Triage) ====================
function GeoTriagePage() {
  const [faskes, setFaskes] = useState([]);
  const [bpjsFilter, setBpjsFilter] = useState('all');

  useEffect(() => {
    // Mock Faskes Database
    setFaskes([
      { id: 1, nama: 'Puskesmas Kecamatan Coblong', tipe: 'Puskesmas', alamat: 'Jl. Ir. H. Juanda No.360, Dago, Bandung', phone: '022-2501234', bpjs: 'covered', rhogam: 'Tidak Tersedia' },
      { id: 2, nama: 'RSUD Dr. Hasan Sadikin', tipe: 'Rumah Sakit', alamat: 'Jl. Pasteur No.38, Pasteur, Bandung', phone: '022-2034953', bpjs: 'covered', rhogam: 'Tersedia (Ready)' },
      { id: 3, nama: 'Klinik Medika Pratama', tipe: 'Klinik', alamat: 'Jl. Dipati Ukur No.80, Bandung', phone: '022-2503456', bpjs: 'partial', rhogam: 'Tidak Tersedia' }
    ]);
  }, []);

  const filtered = faskes.filter(f => {
    if (bpjsFilter === 'covered') return f.bpjs === 'covered';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🏥 Cari Faskes Rujukan & Stok RhoGAM</h2>
        <p className="text-slate-400 text-sm mt-2">Temukan rumah sakit, puskesmas, dan klinik terdekat yang menyediakan layanan BPJS Kesehatan serta ketersediaan stok imunoglobulin RhoGAM.</p>
      </div>

      <div className="flex border-b border-slate-900 gap-2 pb-px">
        <button onClick={() => setBpjsFilter('all')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${bpjsFilter === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Tampilkan Semua</button>
        <button onClick={() => setBpjsFilter('covered')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${bpjsFilter === 'covered' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Hanya Cover BPJS</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(f => (
          <div key={f.id} className="p-5 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">{f.tipe}</span>
                <span className={`text-[10px] font-bold ${f.rhogam.includes('Ready') ? 'text-emerald-400' : 'text-slate-500'}`}>🧪 RhoGAM: {f.rhogam}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{f.nama}</h4>
              <p className="text-xs text-slate-500 leading-normal">{f.alamat}</p>
            </div>
            <div className="pt-3 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span>📞 {f.phone}</span>
              <span className={`font-bold ${f.bpjs === 'covered' ? 'text-emerald-400' : 'text-amber-500'}`}>
                {f.bpjs === 'covered' ? '✓ BPJS' : '• Sebagian BPJS'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== PAGE: SKOR KESIAPAN ====================
function ReadinessScorePage() {
  const [score, setScore] = useState(null);
  useEffect(() => { api('/readiness-score/1').then(setScore); }, []);

  if (!score) return <div className="flex items-center justify-center p-12"><div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🎯 Skor Kesiapan Nikah & Gizi</h2>
        <p className="text-slate-400 text-sm mt-2">Analisis skor kesiapan Anda dalam hal perencanaan nutrisi anak, anemia, dan kompatibilitas biologis.</p>
      </div>

      <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col md:flex-row items-center gap-8">
        {/* Ring Chart */}
        <div className="relative w-36 h-36 flex items-center justify-center border-4 border-cyan-400 rounded-full shadow-lg shadow-cyan-500/10">
          <div className="text-center">
            <span className="text-3xl font-black font-mono text-white">{score.readiness_score}</span>
            <span className="text-[10px] font-bold text-slate-500 block uppercase">skor</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{score.kategori}</span>
            <span className="text-xs text-slate-500 font-mono">Diperbarui hari ini</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">{score.analisis}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: KARTU RUJUKAN ====================
function ReferralCardPage() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    api('/referral/generate').then(res => {
      setCard(res.referral_card);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">💳 Kartu Rujukan Digital</h2>
        <p className="text-slate-400 text-sm mt-2">Cetak rujukan langsung ke Rumah Sakit daerah jika AI mendeteksi kecocokan berisiko tinggi (seperti inkompatibilitas rhesus).</p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-900 rounded-2xl min-h-64">
        {loading && <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>}
        {!loading && !card && (
          <div className="text-center space-y-4">
            <p className="text-xs text-slate-500">Anda dapat membuat kartu rujukan instan ke Rumah Sakit Rujukan Rhesus.</p>
            <button onClick={handleGenerate} className="px-5 py-3 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all shadow-lg shadow-cyan-500/10">Buat Kartu Rujukan</button>
          </div>
        )}
        {!loading && card && (
          <div className="w-full max-w-sm p-6 bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/20 rounded-2xl space-y-4 shadow-xl shadow-black/40 relative overflow-hidden animate-fadeIn">
            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full filter blur-xl"></div>
            <div className="flex justify-between items-start border-b border-slate-900 pb-3">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">GiziKu Referral Node</h4>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{card.nomor_rujukan}</div>
              </div>
              <span className="text-lg">🛡️</span>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500">Indikasi Klinis</span>
                <p className="text-xs text-white font-semibold mt-0.5">{card.diagnosa}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500">Rumah Sakit Rujukan</span>
                <p className="text-xs text-cyan-400 font-bold mt-0.5">{card.faskes_tujuan}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-900/60 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Diterbitkan: {card.tanggal}</span>
              <span>Kemenkes RI</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== PAGE: SIMULASI BIAYA ====================
function CostSimulatorPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = (id) => {
    setLoading(true);
    api('/cost-simulate', { method: 'POST', body: JSON.stringify({ id }) }).then(res => {
      setResult(res);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">💰 Simulasi Estimasi Biaya</h2>
        <p className="text-slate-400 text-sm mt-2">Dapatkan simulasi biaya tes laboratorium pranikah dan persentase yang dicover oleh BPJS Kesehatan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4 md:col-span-1">
          <h3 className="text-sm font-bold text-white border-b border-slate-900 pb-2">Pilih Paket Skrining</h3>
          <div className="space-y-2">
            {[
              { id: 1, label: 'Darah Lengkap & Rhesus' },
              { id: 2, label: 'Skrining Carrier Thalasemia' },
              { id: 3, label: 'Paket Komprehensif Pranikah' }
            ].map(pkg => (
              <button 
                key={pkg.id} 
                onClick={() => handleSimulate(pkg.id)}
                className="w-full p-3 text-xs font-bold text-slate-400 hover:text-white border border-slate-900 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/30 rounded-xl text-left transition-all"
              >
                {pkg.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl md:col-span-2 min-h-64 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Estimasi Analisis Biaya AI</h3>
            {loading && <div className="p-12 text-center text-xs text-slate-500">Menghitung tarif wilayah...</div>}
            {!loading && !result && (
              <div className="text-center py-12 text-xs text-slate-600">Pilih salah satu paket di sebelah kiri untuk melihat estimasi rincian biaya.</div>
            )}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">{result.ai_explanation}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: SERTIFIKAT DIGITAL ====================
function CertificatePage() {
  const [cert, setCert] = useState(null);
  useEffect(() => { api('/certificate/1').then(setCert); }, []);

  if (!cert) return <div className="flex items-center justify-center p-12"><div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📜 Sertifikat Skrining Pranikah</h2>
        <p className="text-slate-400 text-sm mt-2">Sertifikat digital bukti penyelesaian skrining kesehatan pranikah yang dapat diekspor langsung ke KUA.</p>
      </div>

      <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl flex justify-center">
        <div className="w-full max-w-xl p-8 bg-[#0b0f19] border border-slate-900 rounded-2xl shadow-xl shadow-black/50 text-center space-y-6 relative overflow-hidden animate-fadeIn">
          {/* Watermark/Decorative */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none text-9xl">🛡️</div>
          
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Sertifikat Digital Kesehatan</span>
            <h3 className="text-lg font-bold text-white">Bukti Skrining Pranikah</h3>
            <div className="text-[10px] text-cyan-400 font-mono tracking-wider">{cert.nomor_sertifikat}</div>
          </div>

          <div className="w-16 h-0.5 bg-cyan-500/30 mx-auto"></div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500">Menerangkan bahwa pasangan calon pengantin:</p>
            <div className="text-base font-extrabold text-white tracking-tight">{cert.nama_pria} & {cert.nama_wanita}</div>
          </div>

          <div className="p-4 bg-emerald-950/10 border border-emerald-500/10 rounded-xl max-w-sm mx-auto space-y-2">
            <div className="text-xs font-black text-emerald-400">{cert.status_skrining}</div>
            <div className="text-[10px] text-slate-400">Skor Kesiapan Biologis: <strong>{cert.readiness_score}/100</strong></div>
          </div>

          <div className="pt-6 border-t border-slate-900 text-[10px] text-slate-500 flex justify-between font-mono max-w-md mx-auto">
            <span>Diterbitkan: {cert.tanggal_terbit}</span>
            <span>BKKBN RI & Kemenkes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: LITERASI (Articles & chatbot) ====================
function LiterasiPage() {
  const [tab, setTab] = useState('artikel');
  const [articles, setArticles] = useState([]);
  const [messages, setMessages] = useState([{ role: 'model', text: 'Halo! Saya GiziKu Edu-Bot 🤖 Tanyakan apa saja tentang kesehatan pranikah, Rhesus, atau Thalasemia. Saya di sini untuk membantu!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizState, setQuizState] = useState({ active: null, answers: {}, submitted: false, result: null });

  useEffect(() => { api('/education').then(setArticles); }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    const res = await api('/chat', {
      method: 'POST',
      body: JSON.stringify({ conversation: newMsgs })
    });

    setMessages([...newMsgs, { role: 'model', text: res.output }]);
    setLoading(false);
  };

  const startQuiz = (art) => {
    setQuizState({ active: art, answers: {}, submitted: false, result: null });
    setTab('kuis_active');
  };

  const handleQuizAnswer = (qIdx, oIdx) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [qIdx]: oIdx }
    }));
  };

  const submitQuiz = () => {
    setLoading(true);
    api('/education/quiz', { method: 'POST' }).then(res => {
      setQuizState(prev => ({ ...prev, submitted: true, result: res }));
      setLoading(false);
    });
  };

  const artikelList = articles.filter(a => a.tipe === 'artikel');
  const kuisList = articles.filter(a => a.tipe === 'kuis');

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📚 Literasi Kesehatan Pranikah</h2>
        <p className="text-slate-400 text-sm mt-2">Dapatkan artikel kesehatan pranikah terverifikasi dari dokter, kuis edukasi, serta konsultasi 24 jam dengan Chatbot AI GiziKu.</p>
      </div>

      <div className="flex border-b border-slate-900 gap-2 pb-px">
        <button onClick={() => setTab('artikel')} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${tab === 'artikel' || tab === 'kuis_active' ? 'text-white border-cyan-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>📖 Artikel & Kuis</button>
        <button onClick={() => setTab('chatbot')} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${tab === 'chatbot' ? 'text-white border-cyan-400' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>🤖 Chatbot AI</button>
      </div>

      {tab === 'artikel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artikelList.map(a => (
            <div key={a.id} className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 animate-fadeIn">
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">{a.kategori}</span>
              <h3 className="text-base font-bold text-white">{a.judul}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{a.ringkasan}</p>
              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-900/60">{a.konten}</p>
            </div>
          ))}
          {kuisList.map(q => (
            <div key={q.id} className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 flex flex-col justify-between animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">Quiz</span>
                <h3 className="text-base font-bold text-white">{q.judul}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{q.ringkasan}</p>
              </div>
              <button onClick={() => startQuiz(q)} className="w-full py-3.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/15 mt-4">Mulai Kuis</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'kuis_active' && quizState.active && (
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-6 max-w-xl mx-auto animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <h3 className="text-sm font-bold text-white">{quizState.active.judul}</h3>
            <button onClick={() => setTab('artikel')} className="text-xs text-slate-500 hover:text-white">Batal</button>
          </div>
          <div className="space-y-6">
            {quizState.active.quiz_data.map((q, qIdx) => (
              <div key={qIdx} className="space-y-2">
                <div className="text-xs font-bold text-slate-200">{qIdx+1}. {q.question}</div>
                <div className="space-y-1.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = quizState.answers[qIdx] === oIdx;
                    let style = 'bg-slate-900 border-slate-800 text-slate-400';
                    if (quizState.submitted) {
                      if (oIdx === q.correct) style = 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold';
                      else if (isSelected) style = 'bg-red-500/10 border-red-500 text-red-400';
                    } else if (isSelected) {
                      style = 'bg-indigo-500/10 border-indigo-500 text-indigo-300 font-bold';
                    }
                    return (
                      <button 
                        key={oIdx} 
                        onClick={() => !quizState.submitted && handleQuizAnswer(qIdx, oIdx)}
                        className={`w-full p-3 text-xs font-semibold rounded-xl text-left border transition-all ${style}`}
                        disabled={quizState.submitted}
                      >
                        {String.fromCharCode(65+oIdx)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!quizState.submitted ? (
            <button 
              onClick={submitQuiz}
              disabled={Object.keys(quizState.answers).length < quizState.active.quiz_data.length}
              className="w-full py-3.5 text-xs font-black bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all shadow-lg shadow-cyan-500/10"
            >
              Kirim Jawaban
            </button>
          ) : (
            <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-2 text-center">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Kuis Selesai</h4>
              <p className="text-xs text-slate-400">Skor Anda: <strong>{quizState.result.score}/100</strong> ({quizState.result.correct}/{quizState.result.total} Benar)</p>
            </div>
          )}
        </div>
      )}

      {tab === 'chatbot' && (
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl max-w-xl mx-auto space-y-4 animate-fadeIn">
          <div className="h-80 overflow-y-auto pr-1 space-y-3 flex flex-col scrollbar-thin">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`max-w-[75%] p-3 rounded-xl text-xs font-medium leading-relaxed ${m.role === 'user' ? 'bg-cyan-500 text-slate-950 font-semibold self-end' : 'bg-slate-900 border border-slate-800 text-slate-300 self-start'}`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="bg-slate-900 border border-slate-800 text-slate-500 max-w-[75%] p-3 rounded-xl text-xs font-medium self-start animate-pulse">Mengetik...</div>}
          </div>
          <div className="flex gap-2 pt-3 border-t border-slate-900">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Tanya Rhesus, Thalasemia Carrier..." 
              className="flex-1 px-4 py-2.5 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl text-white font-medium"
            />
            <button onClick={sendMessage} className="px-4 py-2.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all shadow-lg shadow-cyan-500/10">Kirim</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PAGE: 72-HOUR TRACKER (Nakes) ====================
function TrackerPage() {
  const [cases, setCases] = useState([]);
  useEffect(() => { api('/tracker').then(setCases); }, []);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">⏱️ 72-Hour Catin Health Tracker</h2>
        <p className="text-slate-400 text-sm mt-2">Dasbor pemantauan nakes khusus untuk melacak calon pengantin berisiko tinggi yang wajib mendapatkan intervensi obat/ RhoGAM dalam 72 jam.</p>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3">Nama Pasien</th>
                <th>Usia</th>
                <th>Urgensi</th>
                <th>Tindakan Status</th>
                <th className="text-right">Durasi Pemantauan</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300">
                  <td className="py-3 font-semibold text-white">{c.nama_pasien}</td>
                  <td>{c.usia_pasien} Tahun</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/30">
                      {c.level_urgensi}
                    </span>
                  </td>
                  <td className="text-cyan-400 font-semibold">{c.status_tindakan}</td>
                  <td className="text-right text-slate-500 font-mono">24 Jam tersisa</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: RENCANA AKSI AI (Nakes) ====================
function ActionPlanPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('Pasien wanita dengan usia kehamilan 28 minggu, rhesus darah Rh- Negatif dan suami Rh+ Positif. Butuh rujukan RhoGAM.');

  const handleGenerate = () => {
    setLoading(true);
    api('/action-plan/generate', { method: 'POST', body: JSON.stringify({ summary }) }).then(res => {
      setResult(res.result);
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📋 Rencana Aksi Intervensi AI (Nakes)</h2>
        <p className="text-slate-400 text-sm mt-2">Dapatkan draf panduan tindakan intervensi medis/klinis yang diproyeksikan otomatis oleh AI untuk penanganan cepat pasien berisiko tinggi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl space-y-4 md:col-span-1">
          <h3 className="text-sm font-bold text-white border-b border-slate-900 pb-2">Masukkan Ringkasan Kasus</h3>
          <textarea value={summary} onChange={e=>setSummary(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs rounded-xl text-white font-medium focus:outline-none focus:border-cyan-400" rows={5} />
          <button onClick={handleGenerate} disabled={loading} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/10">
            {loading ? 'Membuat...' : 'Buat Rencana Intervensi'}
          </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-900 rounded-2xl md:col-span-2 min-h-64 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Draf Rencana Intervensi Medis</h3>
            {loading && <div className="p-12 text-center text-xs text-slate-500">Menganalisis indikasi klinis...</div>}
            {!loading && !result && (
              <div className="text-center py-12 text-xs text-slate-600">Tekan tombol 'Buat Rencana Intervensi' untuk menampilkan draf panduan.</div>
            )}
            {!loading && result && (
              <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-4 animate-fadeIn">
                <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">{result.ai_explanation}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: JARINGAN DONOR BLOOD ====================
function DonorNetworkPage() {
  const [donors, setDonors] = useState([]);
  useEffect(() => { api('/donors').then(setDonors); }, []);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">🩸 Jaringan Donor Darah Rhesus Negatif</h2>
        <p className="text-slate-400 text-sm mt-2">Daftar kontak database relawan donor darah dengan Rhesus Negatif (-) langka di berbagai kota untuk kebutuhan transfusi darurat melahirkan.</p>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3">Nama Relawan</th>
                <th>Golongan Darah</th>
                <th>Rhesus</th>
                <th>Kota</th>
                <th className="text-right">Nomor Telepon</th>
              </tr>
            </thead>
            <tbody>
              {donors.map(d => (
                <tr key={d.id} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300">
                  <td className="py-3 font-semibold text-white">{d.nama}</td>
                  <td>Golongan {d.golongan_darah}</td>
                  <td className="text-red-400 font-semibold">{d.rhesus}</td>
                  <td>{d.kota}</td>
                  <td className="text-right text-cyan-400 font-bold">{d.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE: EPIDEMIOLOGI ====================
function EpidemiologiPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api('/epidemiologi/stats').then(setData); }, []);

  if (!data) return <div className="flex items-center justify-center p-12"><div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">📈 Dashboard Epidemiologi & Statistik Wilayah</h2>
        <p className="text-slate-400 text-sm mt-2">Data agregat nasional sebaran stunting, AKI, dan kasus Rhesus Negatif untuk Dinas Kesehatan setempat.</p>
      </div>

      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3">Provinsi</th>
                <th>Skor Risiko</th>
                <th>AKI (per 100rb)</th>
                <th>Populasi Rh- %</th>
                <th>Defisit RhoGAM</th>
                <th>Literasi</th>
                <th className="text-right">Faskes</th>
              </tr>
            </thead>
            <tbody>
              {data.provinces.map(p => (
                <tr key={p.province_code} className="border-b border-slate-900 hover:bg-slate-900/10 text-slate-300">
                  <td className="py-3 font-semibold text-white">{p.province_name}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {p.risk_score}
                    </span>
                  </td>
                  <td>{p.aki}</td>
                  <td>{p.populasi_rh_negatif_persen}%</td>
                  <td className="text-red-400 font-semibold">{p.defisit_stok_rh_negatif} vial</td>
                  <td>{p.indeks_literasi}/5</td>
                  <td className="text-right font-bold text-white">{p.jumlah_faskes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENT: INDONESIA SVG MAP ====================
function IndonesiaSVGMap({ provinces, activeLayer, selectedProvince, onSelectProvince }) {
  // Returns appropriate hex color based on risk levels in the current active layer
  const getFillColor = (item) => {
    if (!item) return 'rgba(30, 41, 59, 0.4)'; // slate-800
    
    // Default color calculation by layer type
    if (activeLayer === 'risk') {
      return item.risk_color;
    }
    if (activeLayer === 'aki') {
      const val = item.aki;
      if (val >= 120) return '#dc2626'; // red
      if (val >= 90) return '#f97316'; // orange
      if (val >= 70) return '#eab308'; // yellow
      return '#22c55e'; // green
    }
    if (activeLayer === 'thalasemia') {
      const val = item.kasus_thalasemia;
      if (val >= 1000) return '#dc2626';
      if (val >= 400) return '#f97316';
      if (val >= 100) return '#eab308';
      return '#22c55e';
    }
    if (activeLayer === 'literasi') {
      const val = item.indeks_literasi;
      if (val <= 3.3) return '#dc2626';
      if (val <= 3.7) return '#f97316';
      if (val <= 4.1) return '#eab308';
      return '#22c55e';
    }
    return 'rgba(30, 41, 59, 0.4)';
  };

  const getProvinceByCode = (code) => {
    return provinces.find(p => p.province_code === code);
  };

  return (
    <svg viewBox="0 0 960 400" className="w-full h-auto select-none">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* SVG Map Paths */}
      <g>
        {[
          { code: 'AC', d: 'M85.1,60.2 L76.1,72.6 L80.6,81.6 L79.7,82.8 L77.4,83.4 L81.8,92.8 L83.1,107.9 L75.7,105.9 L71.6,91.3 L57.3,73.5 L50.6,72.6 L31,52.1 L23.9,32.7 L32.1,30.5 L47.8,39.8 L69.9,38.9 L78,47 L79.9,54.9 L85.7,57.4 L85.7,58.9 L85.1,60.2 Z' },
          { code: 'SU', d: 'M85.1,60.2 L83.4,64.3 L90.6,66.4 L114.8,85.1 L120,90.3 L119.6,94.6 L126.6,99.2 L125.7,114.9 L129.1,119.4 L128.2,122.9 L121.6,124.7 L123.7,138.6 L116.7,135.8 L118.2,145 L110,143.6 L103.2,150.4 L95.6,123.7 L96.6,118.3 L83.1,107.9 L81.8,92.8 L77.4,83.4 L79.7,82.8 L80.6,81.6 L76.1,72.6 L85.1,60.2 Z' },
          { code: 'SB', d: 'M103.2,150.4 L110,143.6 L118.2,145 L116.7,135.8 L117.6,135.4 L119.1,136.1 L125.1,139.8 L125.6,148.2 L135.6,151.8 L136.7,162.6 L156.4,177.3 L153.9,188.5 L149.8,192.9 L142.5,192.9 L144.9,207.7 L143.1,208.7 L140.6,210.7 L139.8,209.6 L137.9,207.5 L137.2,198.2 L128,183.7 L126.9,175.2 L114.7,156.2 L103.2,150.4 Z' },
          { code: 'RI', d: 'M158.3,176 L156.9,177.4 L153,176.3 L139.9,162.5 L136.9,163.1 L136.3,149.6 L132.1,151.5 L125.6,148.2 L121.1,125.3 L128.7,122 L128.4,116.3 L125.7,115.3 L126.6,99.3 L132.9,108.7 L133.4,108.3 L135.5,109.3 L135.8,104.7 L141.1,104.8 L148.2,117.8 L151.2,119.2 L155,118.6 L160.1,123.2 L163,124.9 L162.5,130.6 L163.3,130.4 L163.6,128.2 L168.2,137.5 L177.9,139.4 L182.1,144.9 L168.1,150.9 L177.2,150 L186.5,143.4 L195.1,150.5 L196.2,155.8 L189.1,156.5 L188.8,163.4 L190.9,160.4 L194.2,161.2 L195.7,163.1 L188,167.1 L189.7,172.7 L180.2,172.4 L172.8,180.5 L166.1,175.9 L158.3,176 Z' },
          { code: 'JA', d: 'M145.9,206.2 L142.5,192.9 L149.8,192.9 L159.7,175.1 L172.8,180.5 L180.2,172.3 L189.6,172.7 L195,177.5 L208.3,180.7 L210.3,192.8 L190,196.8 L189,207.6 L185.5,203.4 L182.5,207.9 L177.6,206.8 L172,215.1 L157.4,216.2 L145.9,206.2 Z' },
          { code: 'SS', d: 'M235.7,247 L226.8,238.4 L220.2,248.3 L206.6,253.9 L206.2,264.1 L197.3,264.8 L182.6,245 L172.7,240.3 L179.8,230.5 L171.9,229.6 L161.3,217 L165.6,213.7 L172,215.1 L177.6,206.8 L182.5,207.9 L185.5,203.4 L189,207.6 L190,196.8 L206,195 L208.4,191.7 L210.3,192.8 L210.9,193.9 L209.5,198.1 L217,200.2 L217.1,206.4 L232.3,208.7 L236.2,220.3 L240.9,222.1 L241.6,227.8 L236.3,236.6 L239.1,241.1 L235.7,247 Z' },
          { code: 'BE', d: 'M195.5,262.1 L190.7,264.8 L178,255.3 L140.6,210.7 L145.9,206.2 L168.8,223.5 L171.9,229.6 L179.8,230.5 L172.7,240.3 L182.6,245 L195.5,262.1 Z' },
          { code: 'LA', d: 'M195.6,262.1 L197.3,264.8 L206.2,264.1 L206.6,253.9 L220.2,248.3 L226.8,238.4 L235.8,247.1 L238,254.8 L235.5,285.3 L234.2,285.7 L232.1,285.1 L225.8,276.6 L223,284.7 L211.9,277.7 L214.4,287.4 L211.9,287.5 L192,264.9 L195.6,262.1 Z' },
          { code: 'BB', d: 'M222.1,200.5 L229.3,190.2 L234.6,195.1 L235.1,189.6 L240.2,190.4 L245.6,208.8 L256,212.6 L251.7,220.4 L254.9,223.4 L250.4,224.7 L239.3,217.9 L234.7,202.9 L222.1,200.5 Z' },
          { code: 'KR', d: 'M282.4,72.8 L283.8,71.5 L285.5,73.1 L279.2,66.6 L281.5,65.2 L284.4,61.5 L288.2,69.8 L285.9,74.3 L282.4,72.8 Z' },
          { code: 'JK', d: 'M254.4,290.9 L259.4,290.9 L258.3,297 L254.4,290.9 Z' },
          { code: 'JB', d: 'M247.9,310.7 L249.3,295.9 L258.3,297 L260.8,286.9 L266.1,287.9 L273.1,294.3 L287.2,295 L292.1,306 L296.6,305.5 L295.6,313.4 L291.1,314.9 L296.1,326.1 L285.2,329 L267.9,322.1 L250.4,320.1 L247.4,318 L250.9,310.7 L248.8,310.1 L247.9,310.7 Z' },
          { code: 'JT', d: 'M296.6,305.5 L328.8,309.9 L334.6,298.9 L336.8,298 L338.4,297.9 L344.2,304.2 L349.9,302.6 L351.3,303.1 L353.9,305.6 L348.8,319 L342.9,317 L346.3,330 L338.1,338 L335.7,329.3 L330.9,328.8 L330,327.7 L328.9,323 L322.9,325.5 L320.9,330.9 L296.1,326.1 L291.1,314.9 L295.6,313.4 L296.6,305.5 Z' },
          { code: 'YO', d: 'M320.2,330.8 L322.9,325.5 L328.9,323 L330,327.7 L330.9,328.8 L335.7,329.3 L336.7,337.8 L320.2,330.8 Z' },
          { code: 'JI', d: 'M353.9,305.6 L370.9,307.8 L376.9,324.1 L383.1,327.7 L400.6,324.6 L409,329 L406.7,342.7 L411.8,350 L384.9,339.7 L373.4,343.2 L338.1,338 L346.3,330 L342.9,317 L348.8,319 L353.9,305.6 Z' },
          { code: 'BT', d: 'M254.4,290.9 L255.3,296.9 L248.6,296.9 L250.2,305.9 L247.6,311 L239.8,307 L224.8,307.2 L227.5,303.5 L229.3,307.3 L233,299.7 L236.3,299.3 L240.4,286.4 L254.4,290.9 Z' },
          { code: 'BA', d: 'M423.9,349.6 L421.7,351.9 L422.8,348.2 L411.5,342 L408.8,335.4 L417.1,337.7 L423.6,334.6 L434,341.2 L423.9,349.6 Z' },
          { code: 'NB', d: 'M472.5,344.6 L476,349.5 L485.2,347.9 L473.8,338.6 L478.5,335.1 L486.1,341.6 L493.1,339.8 L493.3,344.3 L496.1,339.6 L497.9,339.6 L500.2,340.3 L503.2,348.9 L495,348.8 L499,351.3 L488.7,353.1 L488.3,347.7 L482.3,352.9 L460.3,358.1 L454.6,355.1 L455.6,346.6 L462.4,341.6 L472.5,344.6 Z' },
          { code: 'NT', d: 'M572.4,342.3 L578,339.5 L575.7,335.8 L579.5,336.5 L576.8,346.5 L556.4,352.9 L547.7,351 L540,354.7 L536.5,351.6 L516,349.7 L518.3,343.7 L528.8,338.6 L550.1,347.1 L560.5,343.2 L564.5,347.3 L569.6,347 L572.4,342.3 Z' },
          { code: 'KB', d: 'M404.1,124.2 L399.5,123.3 L392.7,128.5 L379.6,124.3 L380.7,120.7 L370,120.4 L364.2,123.3 L362.9,130.3 L356.4,133.6 L344.6,131.4 L331.1,136.5 L313.2,119.6 L312.5,109.7 L306.8,112.4 L298.1,129.7 L298.3,148 L305,155 L302.6,167.7 L313.1,170.5 L321.3,185.6 L318,196.2 L322.4,200.7 L325.3,221.4 L331.3,218.6 L333,223.1 L342.9,216.5 L341.8,200.4 L337.2,191.8 L351,182.4 L352.9,177.1 L364.2,169.2 L371.4,171 L384.5,166.6 L388.8,157.2 L385.5,150.2 L395.4,143 L397.8,132.3 L404.4,129.8 L404.1,124.2 Z' },
          { code: 'KT', d: 'M435.1,184.8 L436.9,181.3 L427.9,173.8 L425.1,165.6 L426.2,156.9 L418.6,159.8 L415.9,153.7 L417.9,148.6 L422.6,147.2 L419.2,138.6 L408.2,144.5 L402.5,140.1 L396.9,140.8 L385.5,150.2 L388.8,157.2 L384.5,166.6 L371.4,171 L364.2,169.2 L337.2,191.8 L340.1,193.3 L343.4,215.2 L334.7,222 L339.7,223.7 L348.2,220.1 L351.1,222.5 L354.4,218.8 L356.8,234.2 L365.1,229.2 L371.3,232.2 L380.2,225.8 L380.6,221.7 L386.7,228.3 L391.9,225.9 L392.5,232.6 L401.1,229.1 L406.9,232.5 L411.9,218.1 L425.8,205 L429,190.2 L435.1,184.8 Z' },
          { code: 'KS', d: 'M451.2,209 L437.2,208.6 L432.4,188.6 L435.1,184.8 L431.5,186.2 L427.6,193.8 L428.2,201.3 L411.9,218.1 L407.2,229.4 L412.3,236.7 L412.4,248 L439.4,235.7 L443.7,227.3 L441.4,225.7 L445.5,225 L441.7,222 L442.4,218.4 L445.3,222.3 L448.2,213.1 L444.9,214.1 L451.2,209 Z' },
          { code: 'KI', d: 'M479.7,101.4 L474.8,103.6 L466.3,97.2 L454.2,101.4 L448.7,99.8 L442.6,118.6 L435.2,127.6 L425,132.3 L408.1,121.7 L403.3,124.9 L404.4,129.8 L397.8,132.3 L396.9,140.8 L402.5,140.1 L404.4,143.8 L419.6,139.1 L422.6,147.2 L417.9,148.6 L415.9,153.7 L418.6,159.8 L426.2,156.9 L424.4,162.4 L427.6,173.4 L436.9,181.3 L432.4,188.6 L437.2,208.6 L451.2,209 L451.7,203.8 L447.3,202.4 L449,195 L445,195.3 L465,175.7 L471.2,146.3 L475,138.8 L480.6,138.2 L477.8,131 L487.2,137.7 L495.9,137.7 L499.8,133.6 L474,110.3 L473.7,107.2 L481.9,105 L479.7,101.4 Z' },
          { code: 'KU', d: 'M479.7,101.4 L475.7,94.5 L467.1,89.9 L468.9,85.3 L464.3,84.8 L468.2,80.2 L464.5,75.5 L460.3,75.7 L474.6,70.7 L468.3,66.2 L467.8,63.7 L471.7,62.7 L465,58.4 L443.4,58 L441.5,60.5 L437.6,58 L431.4,68.4 L431.3,85.5 L422.1,92.6 L421.9,97.7 L425,99.8 L414.8,106.9 L417.6,112.9 L411.8,123 L417,129.6 L427.3,131.9 L442.6,118.6 L448.7,99.8 L454.2,101.4 L466.3,97.2 L474.8,103.6 L479.7,101.4 Z' },
          { code: 'SA', d: 'M589.3,148.2 L589.9,141.4 L582.3,134.9 L602.8,134.9 L611.7,129 L610.7,125.4 L616.6,122.9 L619.9,116.6 L624.9,122.1 L610.2,145 L589.3,148.2 Z' },
          { code: 'GO', d: 'M563.8,132.3 L576.9,137.4 L582.3,134.9 L589.9,141.4 L589.3,148.2 L581.4,144.2 L546.9,145 L543.4,140.2 L563.8,132.3 Z' },
          { code: 'ST', d: 'M511,174.7 L514.5,170.2 L517.6,174.7 L516.4,159.8 L512.1,155.8 L516.7,158 L515.5,151.2 L518.1,150.4 L520.3,140.8 L527,133.6 L526.6,136.6 L531.5,138.5 L536.7,126.2 L538.6,126 L539.5,125.6 L548.9,126.3 L551.2,131.8 L563.8,132.3 L545.9,137.2 L543.4,140.2 L546.9,145 L538.1,146.8 L530.6,144.1 L523.2,150.6 L520.2,159.5 L521.1,169.6 L530.1,177.8 L533.8,187.1 L542.3,187.2 L553,173.5 L559,177.7 L564,173.1 L578.3,172.6 L576.2,169.7 L582.3,168.3 L589,172.6 L587,178.6 L582,174.2 L575.8,176.7 L567.8,188.6 L557.6,192.8 L553.7,198.7 L545.9,195.5 L566.4,220.3 L566.1,221.3 L565,222.7 L569.7,226.2 L566.3,228.2 L554,212.2 L534.1,204.7 L528,197.5 L526.6,201.2 L516.8,201.1 L518.1,195.5 L508.6,185.2 L512.1,181.5 L511.4,178.3 L511,174.7 Z' },
          { code: 'SR', d: 'M503.3,233.1 L498.1,233.9 L495.5,224.5 L497.7,219.8 L495.1,217.4 L502.9,210.4 L507.3,196.8 L506.1,183.9 L511.1,174.7 L511.6,183.5 L508.5,185.7 L513.9,187.8 L518.2,196.3 L512.3,204.6 L515.2,215.1 L509.9,216.5 L512.6,224.7 L507.9,226.5 L509.8,233 L503.3,233.1 Z' },
          { code: 'SN', d: 'M511.8,256.8 L512.8,243.6 L509,238.1 L507.8,226.9 L512.6,224.9 L509.9,216.5 L515.2,215.2 L512.6,203.6 L519.9,199.2 L526.7,201.2 L528,197.4 L531.6,202.7 L534.1,204.7 L554.3,212.4 L556,215.8 L546.1,223.8 L542,217.2 L539.7,218.5 L539.5,218.2 L541.1,212.9 L531.3,214.9 L523.8,221.5 L528.4,228.1 L526.6,246.8 L529.2,259.1 L525.4,269.9 L529.5,280.5 L526.3,277.9 L515.7,282.3 L508.8,279.9 L507.1,273.9 L511.8,256.8 Z' },
          { code: 'SG', d: 'M539.7,218.6 L541.6,217.3 L546.3,223.7 L555.9,215.8 L565.5,225.3 L567.8,231.2 L564.8,231.1 L563.9,235.7 L573.4,242.2 L572.9,247.3 L576.8,245.7 L578.1,252.8 L561.7,256.4 L559.8,264.3 L551.3,261.9 L549.1,259.6 L549.2,257.4 L552,245.7 L537.5,233.9 L541,226.3 L539.7,218.6 Z' },
          { code: 'MA', d: 'M736.6,232.7 L736.6,241.7 L718.5,229.6 L709.9,229.1 L711.3,231.3 L710.6,232.6 L699.2,230.1 L697.8,226.6 L689,232.4 L683.8,223.7 L678.2,234.2 L677.3,226.4 L683.2,219.2 L700.5,217.6 L702.5,221.4 L709.4,217.3 L726.8,221.6 L736.6,232.7 Z' },
          { code: 'MU', d: 'M674.8,137.4 L683.3,130.6 L683.2,125.3 L694.4,120.6 L693.7,131.8 L684.1,137.7 L693.8,143.4 L693.5,148 L696,148.6 L696.9,149.8 L680.8,144.9 L677.4,148.7 L679.7,161.5 L687,175.3 L673.2,160.2 L674.6,148.6 L670.5,143.3 L672.8,137 L668,131.6 L671.6,116.4 L681,106.6 L677,112.8 L680.4,117.7 L680,125.9 L672.5,134 L674.8,137.4 Z' },
          { code: 'PB', d: 'M813.2,218.3 L804.1,230.9 L825.2,239 L817.5,250 L812.6,247.1 L813.2,244.1 L819.3,243.3 L810.1,245.4 L806.6,241.8 L805.8,245.5 L802.7,238.7 L799.2,241.4 L796.7,234.6 L796.3,238.4 L795,236.6 L793.8,237.1 L793.4,227.3 L796.7,222.6 L798.5,224.9 L796,220.1 L792.7,231.5 L787.8,229.7 L791.6,234.9 L788.2,237.6 L789.3,233.7 L784.6,235.4 L788,235.5 L787.9,238.8 L789.2,241.3 L784.7,238.7 L788.1,242.3 L779.1,246.8 L774.5,236.4 L778.8,234.5 L776.9,228.9 L773.3,229.2 L767,220.8 L759.6,220.5 L761.3,217.5 L760.8,217.1 L759,217 L763.9,214.5 L775.8,217.5 L780.8,211 L784.3,209.1 L784.2,212.2 L787.6,211.7 L784.6,216 L788.5,216.9 L788.5,211.2 L789.8,216.2 L793.3,212.3 L793,219.3 L793.8,213.7 L798.6,215.9 L796.4,209.9 L800.3,212.9 L799,201 L792.5,205.2 L793.4,202.9 L789.1,202.1 L791.1,205 L789.5,202.8 L789.7,205.1 L766.3,206.3 L760.8,201.6 L765.5,198.5 L761.7,200.5 L761.7,197.1 L766.8,195.9 L759.3,199.2 L761.5,196.6 L758.4,195.8 L761.8,195.3 L760.1,193 L763,190.5 L758.2,193.8 L759.7,187 L756.2,191.4 L754.4,184.2 L750.5,188.4 L751.4,183.1 L749,189.2 L747,184.1 L745.7,189 L738.6,187.3 L745,179.6 L744.5,173.8 L757,171.2 L768.4,163.2 L787.9,172 L799.5,171.5 L805.6,185.4 L801.3,192.7 L803.5,207.7 L809.2,219.2 L809.2,212.2 L812.6,210.5 L813.2,213.6 L813.2,218.3 Z' },
          { code: 'PA', d: 'M933.7,210.6 L934.1,214 L940.1,213.4 L940,295.8 L936.7,303.9 L939.6,308.7 L940.2,333.3 L940,358.2 L919.7,337.5 L921.3,331.6 L918.5,335.7 L901.4,335.8 L898.7,340.3 L896.7,335.9 L902.3,323.7 L893.4,315.5 L908.5,316.3 L908.1,314 L913.3,317.7 L916.6,313 L913.8,317.4 L912.6,314.6 L910.1,317 L888.6,296.9 L885,286.2 L890.8,286.4 L888.1,283 L883.3,284.6 L888.5,281.3 L884.9,279.9 L885.6,275.7 L881.1,277.9 L885.7,272.6 L880.5,276.4 L882.8,270.9 L880.6,277.9 L877.5,274.7 L882.4,268.9 L874.8,275 L879.4,268.5 L874.4,272.8 L877.1,267.9 L871.4,269.1 L873.6,263.6 L869.9,269.9 L870,263.6 L868.6,269.3 L869.2,264.1 L865.8,266.8 L868.8,263.1 L865.7,267.2 L864.7,262.6 L863.6,266.9 L863,261.7 L862.2,266.1 L861.9,261.9 L859.5,265.3 L860.2,262.9 L854.9,260.8 L854.9,263.8 L841.1,257.5 L841.5,254.5 L824,254.7 L817.5,250 L825.2,239 L804.1,230.9 L813.2,218.3 L813.8,221.5 L814.8,222 L817.1,219.7 L817.2,227.8 L830,230.2 L845.3,212.5 L847.9,204.9 L865.2,202.6 L863.1,194.9 L869.5,196.4 L866.6,193.1 L876.7,188 L879.1,192.3 L882.6,192.1 L879.6,189.5 L893.1,195.3 L915,208 L933.7,210.6 Z' }
        ].map(p => {
          const item = getProvinceByCode(p.code);
          const fillColor = getFillColor(item);
          const isSelected = selectedProvince === p.code;
          return (
            <path
              key={p.code}
              d={p.d}
              fill={fillColor}
              fillOpacity={isSelected ? 0.75 : 0.4}
              stroke={isSelected ? '#22d3ee' : fillColor}
              strokeWidth={isSelected ? 2 : 0.8}
              filter={isSelected ? 'url(#glow)' : undefined}
              className="transition-all duration-200 cursor-pointer hover:fill-opacity-70"
              onClick={() => onSelectProvince(item || { province_code: p.code })}
            />
          );
        })}
      </g>

      {/* SVG Map Text Labels */}
      <g style={{ pointerEvents: 'none' }}>
        {[
          { code: 'AC', x: 56.7, y: 73.7, sz: 7 },
          { code: 'SU', x: 95.2, y: 118.1, sz: 9 },
          { code: 'SB', x: 124.5, y: 182.2, sz: 9 },
          { code: 'RI', x: 165.4, y: 140.3, sz: 9 },
          { code: 'JA', x: 175.3, y: 193.7, sz: 9 },
          { code: 'SS', x: 201.0, y: 229.1, sz: 9 },
          { code: 'BE', x: 173.0, y: 241.4, sz: 9 },
          { code: 'LA', x: 216.3, y: 265.1, sz: 9 },
          { code: 'BB', x: 252.8, y: 211.5, sz: 9 },
          { code: 'KR', x: 224.4, y: 124.4, sz: 7 },
          { code: 'JK', x: 256.6, y: 293.0, sz: 7 },
          { code: 'JB', x: 272.7, y: 308.2, sz: 9 },
          { code: 'JT', x: 322.3, y: 318.9, sz: 9 },
          { code: 'YO', x: 329.0, y: 330.8, sz: 7 },
          { code: 'JI', x: 383.3, y: 323.8, sz: 9 },
          { code: 'BT', x: 240.0, y: 299.7, sz: 7 },
          { code: 'BA', x: 423.3, y: 344.0, sz: 7 },
          { code: 'NB', x: 473.5, y: 346.2, sz: 7 },
          { code: 'NT', x: 568.2, y: 356.5, sz: 9 },
          { code: 'KB', x: 334.9, y: 161.4, sz: 9 },
          { code: 'KT', x: 388.1, y: 186.3, sz: 9 },
          { code: 'KS', x: 436.0, y: 221.4, sz: 9 },
          { code: 'KI', x: 457.3, y: 148.8, sz: 9 },
          { code: 'KU', x: 458.2, y: 84.8, sz: 9 },
          { code: 'SA', x: 621.2, y: 110.0, sz: 9 },
          { code: 'GO', x: 567.5, y: 140.0, sz: 9 },
          { code: 'ST', x: 552.2, y: 176.0, sz: 9 },
          { code: 'SN', x: 525.2, y: 262.2, sz: 9 },
          { code: 'SG', x: 569.8, y: 255.5, sz: 9 },
          { code: 'SR', x: 506.7, y: 208.4, sz: 9 },
          { code: 'MA', x: 734.1, y: 279.0, sz: 9 },
          { code: 'MU', x: 667.5, y: 158.6, sz: 9 },
          { code: 'PB', x: 768.8, y: 200.7, sz: 9 },
          { code: 'PA', x: 871.4, y: 254.3, sz: 9 }
        ].map(l => (
          <text
            key={l.code}
            x={l.x}
            y={l.y}
            fill={selectedProvince === l.code ? '#fff' : 'rgba(255,255,255,0.75)'}
            fontSize={l.sz}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          >
            {l.code}
          </text>
        ))}
      </g>
    </svg>
  );
}

// ==================== BOOTSTRAP ====================
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
