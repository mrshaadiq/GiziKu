<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProvinceStuntingData;

class ProvinceStuntingDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                "province_code" => "AC",
                "province_name" => "Aceh",
                "stunting_prevalence" => "28.6",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Rumah sakit dan puskesmas tersedia di seluruh kabupaten/kota, namun wilayah kepulauan dan pegunungan masih mengalami keterbatasan akses layanan rujukan.",
                "urgency_priority" => "Prevalensi stunting jauh di atas rata-rata nasional (19,8%). Pemerataan layanan kesehatan ibu-anak dan intervensi gizi masih menjadi prioritas utama.",
                "data_year" => 2024
            ],
            [
                "province_code" => "SU",
                "province_name" => "Sumatera Utara",
                "stunting_prevalence" => "18.9",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Baik. Jaringan pelayanan kesehatan dasar dan rujukan tersedia cukup merata, namun beberapa wilayah perbukitan terpencil masih mengalami kendala akses.",
                "urgency_priority" => "Stunting berada di bawah rata-rata nasional. Fokus pada pemeliharaan program promotif dan preventif serta pendampingan keluarga berisiko stunting.",
                "data_year" => 2024
            ],
            [
                "province_code" => "SB",
                "province_name" => "Sumatera Barat",
                "stunting_prevalence" => "25.2",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Akses pelayanan puskesmas dan rumah sakit daerah terjangkau dengan baik di sebagian besar wilayah, namun distribusi tenaga kesehatan spesialis perlu diperbaiki.",
                "urgency_priority" => "Angka stunting masih tinggi dan berada di atas rata-rata nasional sehingga intervensi gizi spesifik dan sensitif perlu diperkuat.",
                "data_year" => 2024
            ],
            [
                "province_code" => "RI",
                "province_name" => "Riau",
                "stunting_prevalence" => "20.1",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Wilayah perkotaan memiliki fasilitas kesehatan yang memadai, sedangkan daerah pesisir dan terpencil masih memerlukan peningkatan layanan.",
                "urgency_priority" => "Prevalensi sedikit di atas rata-rata nasional sehingga intervensi pencegahan stunting tetap perlu diperkuat.",
                "data_year" => 2024
            ],
            [
                "province_code" => "JA",
                "province_name" => "Jambi",
                "stunting_prevalence" => "20.1",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Jaringan puskesmas menjangkau sebagian besar wilayah, namun distribusi dokter spesialis masih belum merata.",
                "urgency_priority" => "Masih sedikit di atas rata-rata nasional sehingga diperlukan penguatan layanan kesehatan ibu dan anak.",
                "data_year" => 2024
            ],
            [
                "province_code" => "SS",
                "province_name" => "Sumatera Selatan",
                "stunting_prevalence" => "18.6",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Baik. Memiliki fasilitas kesehatan dasar and rujukan yang cukup memadai di seluruh kabupaten/kota.",
                "urgency_priority" => "Stunting berada di bawah rata-rata nasional. Diperlukan penguatan pemantauan tumbuh kembang dan program gizi berbasis masyarakat.",
                "data_year" => 2024
            ],
            [
                "province_code" => "BE",
                "province_name" => "Bengkulu",
                "stunting_prevalence" => "18.8",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Baik. Sebagian besar masyarakat telah terjangkau layanan kesehatan dasar, namun tenaga kesehatan spesialis masih terbatas.",
                "urgency_priority" => "Stunting sudah berada di bawah rata-rata nasional, tetapi program pencegahan perlu dipertahankan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "LA",
                "province_name" => "Lampung",
                "stunting_prevalence" => "17.6",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Baik. Memiliki jaringan puskesmas dan rumah sakit yang cukup merata di seluruh kabupaten/kota.",
                "urgency_priority" => "Prevalensi berada di bawah rata-rata nasional. Fokus utama adalah mempertahankan capaian melalui edukasi gizi dan layanan kesehatan preventif.",
                "data_year" => 2024
            ],
            [
                "province_code" => "BB",
                "province_name" => "Kepulauan Bangka Belitung",
                "stunting_prevalence" => "20.1",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Karakteristik wilayah kepulauan menyebabkan akses menuju rumah sakit rujukan membutuhkan waktu lebih lama.",
                "urgency_priority" => "Masih sedikit di atas rata-rata nasional sehingga pemerataan layanan kesehatan antarpulau perlu ditingkatkan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "KR",
                "province_name" => "Kepulauan Riau",
                "stunting_prevalence" => "15.9",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Sedang. Wilayah kepulauan menyebabkan sebagian masyarakat bergantung pada transportasi laut untuk memperoleh layanan rujukan.",
                "urgency_priority" => "Prevalensi sudah di bawah rata-rata nasional, namun pemerataan akses layanan kesehatan di pulau-pulau kecil masih menjadi tantangan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "JK",
                "province_name" => "DKI Jakarta",
                "stunting_prevalence" => "14.8",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Sangat Baik. Memiliki fasilitas kesehatan terlengkap, sebaran puskesmas dan rumah sakit sangat rapat dan mudah diakses.",
                "urgency_priority" => "Merupakan provinsi dengan prevalensi stunting terendah di Indonesia, namun pemantauan kawasan padat penduduk tetap diperlukan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "JB",
                "province_name" => "Jawa Barat",
                "stunting_prevalence" => "20.2",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Infrastruktur kesehatan sangat memadai, namun kepadatan penduduk tinggi menuntut kapasitas layanan yang lebih besar.",
                "urgency_priority" => "Prevalensi stunting sedikit di atas rata-rata nasional. Karena populasi balita sangat besar, diperlukan intervensi gizi skala luas.",
                "data_year" => 2024
            ],
            [
                "province_code" => "JT",
                "province_name" => "Jawa Tengah",
                "stunting_prevalence" => "20.8",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Rumah sakit rujukan dan puskesmas tersebar luas di seluruh kabupaten/kota dengan jangkauan layanan yang baik.",
                "urgency_priority" => "Masih di atas rata-rata nasional sehingga diperlukan kolaborasi lintas sektor untuk percepatan penurunan stunting.",
                "data_year" => 2024
            ],
            [
                "province_code" => "YO",
                "province_name" => "D.I. Yogyakarta",
                "stunting_prevalence" => "16.4",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Sangat Baik. Fasilitas kesehatan dasar dan rujukan mudah diakses dengan kualitas pelayanan medis yang tinggi.",
                "urgency_priority" => "Prevalensi stunting berada di bawah rata-rata nasional. Diperlukan konsistensi program penyuluhan gizi remaja dan calon pengantin.",
                "data_year" => 2024
            ],
            [
                "province_code" => "JI",
                "province_name" => "Jawa Timur",
                "stunting_prevalence" => "19.2",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Baik. Jaringan puskesmas dan rumah sakit daerah sangat luas, rujukan medis berjalan efektif di sebagian besar daerah.",
                "urgency_priority" => "Sudah berada di bawah rata-rata nasional, namun pengawasan dan edukasi gizi di tingkat desa (posyandu) harus terus diperkuat.",
                "data_year" => 2024
            ],
            [
                "province_code" => "BT",
                "province_name" => "Banten",
                "stunting_prevalence" => "20.0",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Fasilitas kesehatan memadai di wilayah perkotaan, namun akses di wilayah pedesaan/selatan masih perlu ditingkatkan.",
                "urgency_priority" => "Berada sedikit di atas rata-rata nasional sehingga diperlukan percepatan intervensi gizi terpadu di wilayah prioritas.",
                "data_year" => 2024
            ],
            [
                "province_code" => "BA",
                "province_name" => "Bali",
                "stunting_prevalence" => "8.0",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Sangat Baik. Fasilitas kesehatan primer dan sekunder tersebar merata serta mudah dijangkau oleh masyarakat.",
                "urgency_priority" => "Prevalensi stunting sangat rendah dan terbaik secara nasional. Fokus pada mempertahankan capaian dan peningkatan kualitas gizi keluarga.",
                "data_year" => 2024
            ],
            [
                "province_code" => "NB",
                "province_name" => "Nusa Tenggara Barat",
                "stunting_prevalence" => "32.7",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Puskesmas tersedia, namun akses menuju rumah sakit rujukan spesialis di wilayah pelosok dan pulau kecil masih terbatas.",
                "urgency_priority" => "Prevalensi stunting sangat tinggi jauh di atas rata-rata nasional. Diperlukan akselerasi intervensi gizi spesifik dan penguatan faskes.",
                "data_year" => 2024
            ],
            [
                "province_code" => "NT",
                "province_name" => "Nusa Tenggara Timur",
                "stunting_prevalence" => "37.9",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Terbatas. Banyak fasilitas kesehatan kekurangan tenaga dokter spesialis, serta akses geografis di pedalaman dan pulau kecil cukup sulit.",
                "urgency_priority" => "Provinsi dengan prevalensi stunting tertinggi secara nasional. Membutuhkan intervensi darurat, pemenuhan air bersih, dan pasokan pangan bergizi.",
                "data_year" => 2024
            ],
            [
                "province_code" => "KB",
                "province_name" => "Kalimantan Barat",
                "stunting_prevalence" => "26.8",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Wilayah perbatasan dan pedalaman masih menghadapi keterbatasan akses menuju rumah sakit rujukan serta distribusi tenaga kesehatan belum merata.",
                "urgency_priority" => "Prevalensi stunting jauh di atas rata-rata nasional sehingga diperlukan pemerataan layanan kesehatan ibu dan anak serta peningkatan intervensi gizi.",
                "data_year" => 2024
            ],
            [
                "province_code" => "KS",
                "province_name" => "Kalimantan Selatan",
                "stunting_prevalence" => "22.9",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Rumah sakit dan puskesmas tersedia di seluruh kabupaten/kota, namun layanan spesialis masih terpusat di Banjarmasin dan Banjarbaru.",
                "urgency_priority" => "Masih berada di atas rata-rata nasional sehingga diperlukan penguatan layanan kesehatan primer, edukasi gizi, dan pemantauan tumbuh kembang anak.",
                "data_year" => 2024
            ],
            [
                "province_code" => "KT",
                "province_name" => "Kalimantan Tengah",
                "stunting_prevalence" => "22.1",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Sebagian wilayah pedalaman dan daerah aliran sungai membutuhkan waktu tempuh lebih lama menuju fasilitas kesehatan rujukan.",
                "urgency_priority" => "Prevalensi stunting masih berada di atas rata-rata nasional. Hambatan geografis membuat pemerataan layanan kesehatan menjadi tantangan utama.",
                "data_year" => 2024
            ],
            [
                "province_code" => "KI",
                "province_name" => "Kalimantan Timur",
                "stunting_prevalence" => "22.2",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Infrastruktur kesehatan berkembang pesat di kota-kota besar, namun beberapa wilayah pedalaman masih memiliki keterbatasan akses layanan rujukan.",
                "urgency_priority" => "Angka stunting masih berada di atas rata-rata nasional sehingga intervensi gizi dan pemerataan tenaga kesehatan tetap menjadi prioritas.",
                "data_year" => 2024
            ],
            [
                "province_code" => "KU",
                "province_name" => "Kalimantan Utara",
                "stunting_prevalence" => "17.5",
                "status" => "Di bawah rata-rata nasional",
                "faskes_access" => "Sedang. Wilayah perbatasan dan daerah terpencil masih menghadapi keterbatasan akses menuju rumah sakit rujukan akibat kondisi geografis.",
                "urgency_priority" => "Prevalensi stunting sudah berada di bawah rata-rata nasional, namun peningkatan akses layanan kesehatan di wilayah terpencil tetap diperlukan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "GO",
                "province_name" => "Gorontalo",
                "stunting_prevalence" => "23.5",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Layanan kesehatan dasar tersedia, namun akses terhadap dokter spesialis anak dan rumah sakit rujukan masih terbatas di beberapa wilayah.",
                "urgency_priority" => "Prevalensi stunting cukup tinggi sehingga diperlukan peningkatan pelayanan kesehatan ibu dan anak serta edukasi gizi.",
                "data_year" => 2024
            ],
            [
                "province_code" => "SR",
                "province_name" => "Sulawesi Barat",
                "stunting_prevalence" => "35.4",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Fasilitas kesehatan dasar tersedia, namun distribusi tenaga kesehatan spesialis masih terbatas terutama di wilayah pesisir dan pegunungan.",
                "urgency_priority" => "Merupakan salah satu provinsi dengan prevalensi stunting tertinggi di Indonesia sehingga membutuhkan percepatan intervensi gizi dan peningkatan akses layanan kesehatan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "SN",
                "province_name" => "Sulawesi Selatan",
                "stunting_prevalence" => "23.3",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Memiliki jaringan rumah sakit dan puskesmas yang cukup lengkap, namun layanan spesialis masih terkonsentrasi di Kota Makassar.",
                "urgency_priority" => "Prevalensi stunting masih berada di atas rata-rata nasional sehingga diperlukan pemerataan layanan kesehatan dan edukasi gizi.",
                "data_year" => 2024
            ],
            [
                "province_code" => "ST",
                "province_name" => "Sulawesi Tengah",
                "stunting_prevalence" => "24.2",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Kondisi geografis berupa pegunungan dan wilayah yang luas menyebabkan sebagian masyarakat membutuhkan waktu tempuh lebih lama menuju fasilitas kesehatan.",
                "urgency_priority" => "Angka stunting masih tinggi sehingga pemerataan akses layanan kesehatan dan intervensi gizi menjadi prioritas.",
                "data_year" => 2024
            ],
            [
                "province_code" => "SG",
                "province_name" => "Sulawesi Tenggara",
                "stunting_prevalence" => "26.1",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Wilayah kepulauan menyebabkan akses menuju rumah sakit rujukan di beberapa daerah memerlukan waktu tempuh lebih lama.",
                "urgency_priority" => "Angka stunting masih cukup tinggi sehingga perlu penguatan layanan kesehatan ibu dan anak serta pemerataan akses di wilayah kepulauan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "SA",
                "province_name" => "Sulawesi Utara",
                "stunting_prevalence" => "21.1",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Baik. Rumah sakit dan puskesmas relatif merata di wilayah daratan, namun beberapa pulau kecil masih memiliki keterbatasan akses layanan rujukan.",
                "urgency_priority" => "Prevalensi stunting masih di atas rata-rata nasional sehingga diperlukan penguatan intervensi gizi dan pemerataan layanan kesehatan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "MA",
                "province_name" => "Maluku",
                "stunting_prevalence" => "28.3",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Terbatas. Karakteristik wilayah kepulauan menyebabkan distribusi tenaga kesehatan dan layanan rujukan belum merata.",
                "urgency_priority" => "Prevalensi stunting masih jauh di atas rata-rata nasional sehingga pemerataan layanan kesehatan menjadi prioritas.",
                "data_year" => 2024
            ],
            [
                "province_code" => "MU",
                "province_name" => "Maluku Utara",
                "stunting_prevalence" => "23.2",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Sedang. Akses layanan kesehatan cukup baik di wilayah utama, namun pulau-pulau kecil masih menghadapi keterbatasan layanan rujukan.",
                "urgency_priority" => "Masih berada di atas rata-rata nasional sehingga diperlukan peningkatan intervensi gizi dan pemerataan tenaga kesehatan.",
                "data_year" => 2024
            ],
            [
                "province_code" => "PB",
                "province_name" => "Papua Barat",
                "stunting_prevalence" => "26.5",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Terbatas. Sebaran penduduk yang berjauhan menyebabkan akses menuju fasilitas kesehatan membutuhkan waktu lebih lama.",
                "urgency_priority" => "Prevalensi stunting berada di atas rata-rata nasional sehingga diperlukan peningkatan layanan kesehatan dasar dan edukasi gizi.",
                "data_year" => 2024
            ],
            [
                "province_code" => "PA",
                "province_name" => "Papua",
                "stunting_prevalence" => "24.9",
                "status" => "Di atas rata-rata nasional",
                "faskes_access" => "Terbatas. Sebagian wilayah hanya dapat dijangkau melalui jalur udara atau laut sehingga akses menuju rumah sakit rujukan masih menjadi tantangan.",
                "urgency_priority" => "Prevalensi stunting masih tinggi. Pemerataan layanan kesehatan ibu-anak dan distribusi tenaga kesehatan perlu diperkuat.",
                "data_year" => 2024
            ]
        ];

        foreach ($data as $item) {
            ProvinceStuntingData::updateOrCreate(
                ['province_code' => $item['province_code']],
                $item
            );
        }
    }
}
