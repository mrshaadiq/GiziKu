# Gizi Nusantara

Aplikasi web sederhana (HTML + CSS + JS murni, tanpa framework/build step)
untuk membantu orang tua menemukan rekomendasi makanan lokal yang cocok
untuk anaknya, berdasarkan **lokasi (provinsi)** dan **riwayat kesehatan
anak**, menggunakan **DeepSeek AI** sebagai mesin rekomendasi.

## Alur penggunaan

1. **Saat pertama dibuka**, muncul gerbang lokasi (`#location-gate`) yang
   meminta pengguna mengizinkan akses lokasi browser.
   - Jika diizinkan → koordinat GPS diambil lewat `navigator.geolocation`,
     lalu di-*reverse geocode* menjadi nama provinsi lewat API gratis
     [Nominatim OpenStreetMap](https://nominatim.org/).
   - Jika ditolak / tidak didukung → tersedia jalur cadangan: pengguna
     memilih provinsi secara manual dari daftar 34 provinsi.
   - Hasil lokasi disimpan di `localStorage` (`gn_location`) supaya
     gerbang ini tidak muncul lagi di kunjungan berikutnya.
2. **Kelola profil anak** di panel kiri:
   - Tambah anak baru: nama, usia, dan daftar riwayat kesehatan/kondisi
     (dipisah koma, misalnya: `alergi kacang, asma ringan, sulit makan sayur`).
   - Semua profil anak disimpan di `localStorage` (`gn_children`), jadi
     bisa menambahkan banyak anak dan memilih salah satu yang aktif.
3. **Pilih anak yang aktif** dari daftar → detail anak (usia, catatan
   kesehatan) muncul di panel kanan.
4. **Tandai suasana hati anak**: Senang / Netral / **Rewel-Frustrasi**.
   - Jika dipilih **"Rewel / Frustrasi"**, aplikasi otomatis memanggil
     DeepSeek AI untuk meminta rekomendasi makanan.
5. **Rekomendasi AI**: DeepSeek diberi prompt yang berisi provinsi anak,
   usia anak, dan riwayat kesehatannya, lalu diminta mengembalikan
   beberapa makanan/bahan pangan yang:
   - umum diproduksi/ditanam di provinsi tersebut,
   - sesuai usia anak,
   - aman terhadap kondisi kesehatan yang tercatat (menghindari alergen, dll),
   - disertai penjelasan singkat kenapa makanan itu cocok untuk anak
     tersebut secara spesifik.

   Karena prompt selalu menyertakan data anak yang berbeda-beda (usia,
   kondisi kesehatan, provinsi), hasil rekomendasi otomatis berbeda untuk
   tiap anak — misalnya anak usia 5 tahun dengan alergi kacang di Jawa
   Barat akan mendapat saran berbeda dari anak usia 8 tahun dengan asma
   di Sulawesi Selatan.

## Struktur file

```
gizi-nusantara/
├── index.html   # struktur halaman: gerbang lokasi, daftar anak, form, modal pengaturan
├── style.css    # semua styling & desain (token warna/tipografi di bagian atas file)
├── app.js       # seluruh logika: geolokasi, localStorage, panggilan DeepSeek API
└── README.md    # dokumen ini
```

## Penjelasan bagian penting `app.js`

| Fungsi | Tugas |
|---|---|
| `requestGeolocation()` | Meminta izin lokasi browser, memanggil `reverseGeocodeProvince()` |
| `reverseGeocodeProvince(lat, lng)` | Fetch ke Nominatim, ambil field `address.state` sebagai nama provinsi |
| `enterApp()` | Menyembunyikan gerbang lokasi, menampilkan aplikasi utama |
| `renderChildList()` / `selectChild()` | Menampilkan & mengaktifkan profil anak dari `state.children` |
| `bindMoodButtons()` | Menyimpan mood anak; jika `frustrasi` → panggil `requestRecommendations()` |
| `requestRecommendations(child)` | Menyiapkan UI loading/error, memanggil `fetchDeepSeekRecommendations()` |
| `fetchDeepSeekRecommendations(child, province, apiKey)` | Membangun prompt & memanggil endpoint DeepSeek `/chat/completions`, mem-parsing JSON hasil AI |
| `renderRecommendationCards(foods)` | Menampilkan hasil sebagai kartu makanan |

## Menyiapkan DeepSeek API Key

1. Buka aplikasi di browser, klik ikon ⚙ (pengaturan) di kanan atas.
2. Masukkan API key DeepSeek (didapat dari akun DeepSeek Platform),
   lalu klik **Simpan**.
3. Key disimpan di `localStorage` browser (`gn_deepseek_key`) dan dikirim
   sebagai header `Authorization: Bearer <key>` saat memanggil
   `https://api.deepseek.com/chat/completions` dengan model `deepseek-chat`.

> ⚠️ **Catatan keamanan**: Karena ini proyek frontend murni, API key
> tersimpan & dipakai langsung di browser pengguna — siapa pun yang
> membuka DevTools bisa melihatnya. Ini cocok untuk prototipe/pemakaian
> pribadi. Untuk versi produksi/publik, pindahkan pemanggilan
> `fetch("https://api.deepseek.com/chat/completions", ...)` ke sebuah
> backend kecil (mis. Node/Express atau serverless function), simpan
> API key di server (environment variable), dan biarkan frontend hanya
> memanggil endpoint backend Anda sendiri.

## Bagaimana AI menyesuaikan makanan dengan hasil produksi provinsi

Bagian paling penting dari sistem ini bukan sekadar "AI kasih ide makanan",
tapi AI **dipaksa mencari bahan pangan yang benar-benar menjadi hasil
produksi/pertanian/perkebunan/perikanan khas provinsi yang terdeteksi**,
bukan daftar makanan umum yang sama untuk seluruh Indonesia. Caranya:

1. **System prompt** di `fetchDeepSeekRecommendations()` secara eksplisit
   memberi peran ke DeepSeek sebagai *"ahli pangan lokal Indonesia yang
   hafal komoditas pertanian, perkebunan, perikanan, dan hasil bumi khas
   tiap provinsi"*, dan melarangnya menjawab dengan daftar generik yang
   sama untuk semua provinsi.
2. **User prompt** menyisipkan nama provinsi hasil deteksi lokasi
   (`state.location.province`) secara dinamis ke dalam kalimat permintaan,
   sehingga setiap kali provinsi berbeda, konteks yang dikirim ke AI juga
   berbeda — AI diminta mencari komoditas *spesifik* provinsi itu (misalnya
   sagu untuk provinsi penghasil sagu, ikan tertentu untuk provinsi
   pesisir, buah/sayur dataran tinggi untuk provinsi pegunungan, dsb).
3. Field `origin` pada tiap hasil rekomendasi wajib diisi AI dengan
   **komoditas/daerah penghasil spesifik**, bukan sekadar "dari daerah
   sekitar" — ini membuat jawaban bisa diverifikasi masuk akal atau tidak.
4. Karena prompt dibangun ulang setiap kali tombol mood "Rewel/Frustrasi"
   ditekan (lihat `requestRecommendations()`), **rekomendasi otomatis
   menyesuaikan** setiap kali salah satu dari tiga variabel berikut
   berubah: provinsi (lokasi pengguna), usia anak, atau riwayat kesehatan
   anak yang aktif dipilih.

> Catatan: DeepSeek `deepseek-chat` menjawab berdasarkan pengetahuan yang
> dipelajari saat pelatihan model, bukan pencarian web real-time. Untuk
> akurasi komoditas yang lebih terjamin (misalnya musim panen terkini),
> pengembangan lanjut bisa menambahkan tool/function-calling atau
> menyuntikkan data komoditas resmi (mis. dari data Kementerian Pertanian/
> BPS per provinsi) ke dalam prompt sebagai referensi tambahan sebelum AI
> menyusun jawaban akhir.



Prompt system memaksa DeepSeek membalas JSON murni dengan bentuk:

```json
{
  "foods": [
    {
      "name": "Nama makanan/bahan pangan",
      "origin": "Komoditas/daerah penghasil spesifik di provinsi tersebut",
      "why": "1-2 kalimat alasan cocok untuk anak ini"
    }
  ]
}
```

Jika DeepSeek mengembalikan teks di luar format ini, `app.js` akan
menampilkan pesan error yang ramah alih-alih membuat aplikasi crash.

## Cara menjalankan

Karena hanya HTML/CSS/JS statis, tinggal buka `index.html` langsung di
browser, atau jalankan server statis sederhana, misalnya:

```bash
npx serve .
# atau
python3 -m http.server 8080
```

lalu buka `http://localhost:8080` (disarankan lewat server lokal, bukan
`file://`, supaya permintaan lokasi & fetch API berjalan lebih stabil
di beberapa browser).

## Kemungkinan pengembangan lanjutan

- Simpan riwayat mood anak dari waktu ke waktu (grafik tren rewel/senang).
- Tambahkan foto/ilustrasi makanan (misalnya dari API gambar terpisah).
- Pindahkan panggilan DeepSeek ke backend agar API key aman.
- Tambahkan cache rekomendasi per anak+mood supaya tidak memanggil AI
  berulang kali untuk kombinasi yang sama.
- Validasi/normalisasi nama provinsi hasil Nominatim (kadang format
  sedikit berbeda dari daftar resmi 34 provinsi).
