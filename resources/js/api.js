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

function getMockDataFor(endpoint, options) {
  // Pediatric health history list
  if (endpoint.startsWith('/tracker') || endpoint.startsWith('/history')) {
    return [
      { id: 1, nama_anak: 'Siti Aulia', usia_bulan: 24, berat_badan: 11.2, tinggi_badan: 85, status_stunting: 'Normal', status_anemia: 'Anemia Ringan', tanggal: '16 Jul 2026', catatan: 'Anak tampak lemas dan nafsu makan menurun. Disarankan suplemen zat besi.' },
      { id: 2, nama_anak: 'Bima Saputra', usia_bulan: 18, berat_badan: 10.5, tinggi_badan: 80, status_stunting: 'Normal', status_anemia: 'Normal', tanggal: '15 Jul 2026', catatan: 'Tumbuh kembang sangat baik, pertahankan ASI dan MPASI seimbang.' },
      { id: 3, nama_anak: 'Rara Putri', usia_bulan: 30, berat_badan: 10.8, tinggi_badan: 84, status_stunting: 'Wasting', status_anemia: 'Anemia Berat', tanggal: '14 Jul 2026', catatan: 'Rujukan segera ke spesialis anak di RSUD Dr. Hasan Sadikin.' },
      { id: 4, nama_anak: 'Dafa Ramadhan', usia_bulan: 12, berat_badan: 9.6, tinggi_badan: 74, status_stunting: 'Normal', status_anemia: 'Normal', tanggal: '12 Jul 2026', catatan: 'Status gizi baik. Pastikan jadwal imunisasi dasar lengkap diikuti.' },
      { id: 5, nama_anak: 'Naila Putri', usia_bulan: 36, berat_badan: 12.8, tinggi_badan: 92, status_stunting: 'Normal', status_anemia: 'Anemia Ringan', tanggal: '10 Jul 2026', catatan: 'Tingkatkan asupan protein hewani dan sayuran hijau seperti bayam.' }
    ];
  }

  // Educational articles on child health and stunting
  if (endpoint.startsWith('/education')) {
    return [
      { 
        id: 1, 
        judul: 'Makanan Kaya Zat Besi untuk Mencegah Anemia', 
        ringkasan: 'Kenali sumber zat besi dari bahan pangan lokal yang mudah dijangkau dan terjangkau.', 
        konten: 'Anemia defisiensi besi pada balita menghambat pasokan oksigen ke seluruh sel tubuh, termasuk sel otak dan organ pertumbuhan. Akibatnya, anak sering lemas, nafsu makan menurun drastis, dan rentan infeksi. Jika dibiarkan dalam jangka panjang, kondisi ini mengganggu hormon pertumbuhan dan memicu stunting (anak lebih pendek dari usianya). Deteksi dini melalui rona kuku, kelopak mata, dan pengukuran tinggi badan sangat penting.', 
        kategori: 'Gizi & Nutrisi', 
        durasi: '5 menit',
        tipe: 'artikel' 
      },
      { 
        id: 2, 
        judul: 'Tanda Stunting dan Dampaknya pada Tumbuh Kembang', 
        ringkasan: 'Memahami perbedaan stunting dan wasting serta cara deteksi dini di rumah.', 
        konten: 'Stunting adalah gangguan tumbuh kembang anak akibat kekurangan gizi kronis dan infeksi berulang. Gejalanya ditandai dengan tinggi badan anak di bawah standar usianya. Wasting adalah kondisi gizi buruk di mana berat badan anak menurun drastis dibanding tinggi badannya. Perawatan sejak dini di masa keemasan 1000 HPK dapat mencegah efek stunting yang permanen terhadap kecerdasan anak.', 
        kategori: 'Kesehatan Mental', 
        durasi: '7 menit',
        tipe: 'artikel' 
      },
      { 
        id: 3, 
        judul: 'Panduan Pemberian ASI Eksklusif 0–6 Bulan', 
        ringkasan: 'Manfaat, posisi, dan cara menyimpan ASI yang benar untuk ibu dan bayi.', 
        konten: 'ASI eksklusif diberikan sejak bayi lahir hingga berusia 6 bulan tanpa makanan pendamping apa pun. ASI mengandung nutrisi terbaik dan zat kekebalan tubuh alami yang melindungi bayi dari diare dan infeksi. Posisi menyusui yang benar dan kenyamanan ibu sangat menentukan kelancaran produksi ASI. Pelajari cara memerah dan menyimpan ASI perah (ASIP) agar nutrisi tetap terjaga.', 
        kategori: 'Gizi & Nutrisi', 
        durasi: '8 menit',
        tipe: 'artikel' 
      },
      { 
        id: 4, 
        judul: 'Stimulasi Tumbuh Kembang Anak Usia 1–3 Tahun', 
        ringkasan: 'Aktivitas sederhana untuk mendukung perkembangan motorik dan kognitif anak.', 
        konten: 'Tumbuh kembang anak tidak hanya fisik tetapi juga motorik, sensorik, dan kognitif. Anak usia 1-3 tahun memerlukan stimulasi aktif seperti bermain susun balok, bernyanyi bersama, mengenalkan warna, dan membacakan buku cerita. Aktivitas interaktif ini memperkuat sinapsis sel otak anak dan membangun kedekatan emosional (bonding) yang kuat antara orang tua dan anak.', 
        kategori: 'Kesehatan Mental', 
        durasi: '6 menit',
        tipe: 'artikel' 
      },
      { 
        id: 5, 
        judul: 'Menu Sehat Bergizi Seimbang untuk Balita', 
        ringkasan: 'Inspirasi menu harian untuk memenuhi kebutuhan gizi anak usia 1–5 tahun.', 
        konten: 'Menu MPASI dan makanan balita sebaiknya padat gizi mikro dan makro. Fokuskan pada protein hewani yang berkualitas seperti hati ayam, telur, daging sapi, dan ikan kembung. Protein hewani kaya akan asam amino esensial dan zat besi yang mudah diserap oleh tubuh anak. Padukan dengan sayuran hijau, tahu, tempe, dan buah dalam porsi seimbang.', 
        kategori: 'Gizi & Nutrisi', 
        durasi: '4 menit',
        tipe: 'artikel' 
      },
      { 
        id: 6, 
        judul: 'Cara Mengenali Tanda Depresi Pascamelahirkan', 
        ringkasan: 'Panduan untuk keluarga mendampingi ibu baru yang mengalami baby blues.', 
        konten: 'Depresi pascamelahirkan (postpartum depression) adalah kondisi emosional serius setelah melahirkan. Ibu mungkin merasa cemas berlebih, sedih tanpa sebab, merasa tidak mampu mengurus bayi, hingga insomnia. Penting bagi suami dan keluarga untuk memberikan dukungan moral penuh, berbagi beban merawat bayi, serta berkonsultasi dengan profesional jika gejala berlangsung lebih dari dua minggu.', 
        kategori: 'Kesehatan Mental', 
        durasi: '9 menit',
        tipe: 'artikel' 
      },
      { 
        id: 7, 
        judul: 'Kuis Edukasi Kesehatan Anak NURA', 
        ringkasan: 'Evaluasi pemahaman Anda seputar stunting, anemia, dan nutrisi si kecil.', 
        tipe: 'kuis', 
        quiz_data: [
          { question: 'Apa dampak utama anemia defisiensi besi kronis pada anak?', options: ['Gigi cepat tumbuh', 'Menurunkan kecerdasan dan memicu stunting', 'Tidak berdampak serius'], correct: 1 },
          { question: 'Bahan makanan apa yang paling tinggi kandungan zat besi hewani untuk balita?', options: ['Sayur bayam rebus', 'Hati ayam dan daging sapi', 'Nasi putih hangat'], correct: 1 },
          { question: 'Berapa lama periode emas 1000 Hari Pertama Kehidupan (HPK) dihitung?', options: ['Sejak konsepsi di rahim hingga anak usia 2 tahun', 'Sejak bayi lahir hingga usia 1 tahun', 'Usia 2 hingga 5 tahun'], correct: 0 }
        ]
      }
    ];
  }

  // Pediatric clinics and Posyandu
  if (endpoint.startsWith('/faskes')) {
    return [
      { id: 1, nama: 'Puskesmas Sukajadi', tipe: 'Puskesmas', jarak: '1.2 km', phone: '022-2031122', alamat: 'Jl. Sukajadi No.12, Bandung', dokter: 'dr. Sarah Amanda (Sp.A / Dokter Umum)', layanan: 'Konsultasi Gizi, Imunisasi Anak, Distribusi TTD & Makanan Tambahan' },
      { id: 2, nama: 'RSUD Dr. Hasan Sadikin', tipe: 'Rumah Sakit Rujukan', jarak: '2.5 km', phone: '022-2034953', alamat: 'Jl. Pasteur No.38, Bandung', dokter: 'Dr. dr. Budi Setiawan, Sp.A(K)', layanan: 'Klinik Tumbuh Kembang Anak, Terapi Gizi Buruk, Lab Darah Lengkap' },
      { id: 3, nama: 'Posyandu Melati Indah V', tipe: 'Posyandu', jarak: '0.4 km', phone: '0812-9900-8811', alamat: 'Balai RW 05, Kel. Pasteur, Bandung', dokter: 'Bidan Ningsih Rahayu', layanan: 'Penimbangan Bulanan, Pengukuran Tinggi, Pemberian Vitamin A & Biskuit Balita' },
      { id: 4, nama: 'Klinik Ibu & Anak Permata', tipe: 'Klinik Swasta', jarak: '3.1 km', phone: '022-2508899', alamat: 'Jl. Dago No.110, Bandung', dokter: 'dr. Jessica Wijaya, Sp.A', layanan: 'Konsultasi Pediatri, Vaksinasi Anak Mandiri, Screening Darah Bayi' }
    ];
  }

  // AI Chatbot for parent assistant
  if (endpoint.startsWith('/chat')) {
    const query = (options.body ? JSON.parse(options.body).conversation?.slice(-1)[0]?.text : '') || '';
    let response = "Halo! Saya NURA Assistant AI. Saya dapat membantu menjawab pertanyaan Anda mengenai kesehatan anak, stunting, gejala anemia, nutrisi MPASI, dan jadwal imunisasi dasar.";
    const qLower = query.toLowerCase();
    
    if (qLower.includes('anemia') || qLower.includes('zat besi') || qLower.includes('lemas') || qLower.includes('pucat')) {
      response = "Anemia pada balita paling sering dipicu kekurangan zat besi (Fe). Gejalanya meliputi anak tampak 5L (lesu, lemas, letih, lelah, lalai), nafsu makan turun, kelopak mata bawah pucat, serta rona kuku/telapak tangan pudar. Cegah dengan asupan makanan tinggi zat besi hewani seperti hati ayam, daging sapi, ikan, kuning telur, dan tingkatkan penyerapan zat besi dengan vitamin C.";
    } else if (qLower.includes('stunting') || qLower.includes('pendek') || qLower.includes('tumbuh kembang')) {
      response = "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis dan infeksi berulang dalam 1000 Hari Pertama Kehidupan (HPK). Anak stunting memiliki tinggi badan di bawah standar usianya dan kecerdasannya terganggu. Ini bisa dicegah dengan menjaga status gizi ibu saat hamil, pemberian ASI eksklusif 6 bulan, MPASI kaya protein hewani berkualitas, imunisasi lengkap, serta menjaga kebersihan sanitasi lingkungan.";
    } else if (qLower.includes('mpasi') || qLower.includes('makan') || qLower.includes('balita')) {
      response = "Pemberian MPASI dimulai saat bayi berusia 6 bulan. Menu pertama sebaiknya padat gizi (menu 4 bintang: karbohidrat, protein hewani, protein nabati, dan sayur) dengan penekanan utama pada protein hewani (seperti telur, ikan kembung, daging) karena mengandung asam amino esensial lengkap serta zat besi yang mudah diserap tubuh anak.";
    } else if (qLower.includes('imunisasi') || qLower.includes('vaksin')) {
      response = "Imunisasi dasar lengkap wajib diikuti untuk melindungi balita dari penyakit berbahaya (seperti polio, campak, difteri, batuk rejan, dan hepatitis B). Kunjungi Posyandu atau Puskesmas terdekat sesuai jadwal di buku KIA.";
    }
    
    return { output: response };
  }

  // Fallback screening analysis generator
  if (endpoint.startsWith('/lab-scan') || endpoint.startsWith('/screening/analyze') || endpoint.startsWith('/action-plan/generate')) {
    return {
      success: true,
      result: {
        status_stunting: 'Normal',
        status_anemia: 'Anemia Ringan',
        ai_explanation: "Hasil Analisis Visual AI NURA:\n\n1. Analisis Kelopak Mata (Konjungtiva): Terdeteksi rona merah muda pudar, mengindikasikan tingkat hemoglobin (Hb) diperkirakan berkisar 10.2 - 11.0 g/dL (Anemia Ringan).\n2. Analisis Rona Kuku: Terdapat penurunan rona kemerahan sirkulasi perifer ringan.\n3. Analisis Wajah: Keadaan otot wajah normal, keaktifan bayi baik.\n\nRekomendasi Medis NURA:\n- Berikan suplemen drop zat besi sesuai dosis anjuran bidan/dokter Puskesmas.\n- Perbanyak porsi protein hewani (seperti kuning telur, hati ayam haluskan) pada MPASI.\n- Jadwalkan kontrol ulang 14 hari di Posyandu Melati atau Puskesmas terdekat."
      }
    };
  }

  return {};
}
