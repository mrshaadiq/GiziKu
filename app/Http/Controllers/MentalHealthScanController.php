<?php

namespace App\Http\Controllers;

use App\Models\MentalHealthScan;
use App\Services\MentalHealthScanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MentalHealthScanController extends Controller
{
    private MentalHealthScanService $scanService;

    public function __construct(MentalHealthScanService $scanService)
    {
        $this->scanService = $scanService;
    }

    /**
     * View the scanner interface page (webpage)
     */
    public function index()
    {
        $query = MentalHealthScan::orderBy('created_at', 'desc');
        if (auth()->check() && !auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        $history = $query->get();

        $provinces = [];
        try {
            if (\Schema::hasTable('province_stunting_data')) {
                $dbData = \App\Models\ProvinceStuntingData::all();
                if ($dbData->count() > 0) {
                    foreach ($dbData as $row) {
                        $provinces[$row->province_code] = [
                            'name' => $row->province_name,
                            'stunting' => $row->stunting_prevalence,
                            'status' => $row->status,
                            'faskes' => $row->faskes_access,
                            'urgency' => $row->urgency_priority,
                            'year' => $row->data_year ?? 2024
                        ];
                    }
                }
            }
        } catch (\Exception $e) {
            // Fallback
        }

        if (empty($provinces)) {
            // Static fallback
            $provinces = [
                "AC" => [ "name" => "Aceh", "stunting" => "28.6", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Rumah sakit dan puskesmas tersedia di seluruh kabupaten/kota, namun wilayah kepulauan dan pegunungan masih mengalami keterbatasan akses layanan rujukan.", "urgency" => "Prevalensi stunting jauh di atas rata-rata nasional (19,8%). Pemerataan layanan kesehatan ibu-anak dan intervensi gizi masih menjadi prioritas utama.", "year" => 2024 ],
                "SU" => [ "name" => "Sumatera Utara", "stunting" => "18.9", "status" => "Di bawah rata-rata nasional", "faskes" => "Baik. Jaringan pelayanan kesehatan dasar dan rujukan tersedia cukup merata, namun beberapa wilayah perbukitan terpencil masih mengalami kendala akses.", "urgency" => "Stunting berada di bawah rata-rata nasional. Fokus pada pemeliharaan program promotif dan preventif serta pendampingan keluarga berisiko stunting.", "year" => 2024 ],
                "SB" => [ "name" => "Sumatera Barat", "stunting" => "25.2", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Akses pelayanan puskesmas dan rumah sakit daerah terjangkau dengan baik di sebagian besar wilayah, namun distribusi tenaga kesehatan spesialis perlu diperbaiki.", "urgency" => "Angka stunting masih tinggi dan berada di atas rata-rata nasional sehingga intervensi gizi spesifik dan sensitif perlu diperkuat.", "year" => 2024 ],
                "RI" => [ "name" => "Riau", "stunting" => "20.1", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Wilayah perkotaan memiliki fasilitas kesehatan yang memadai, sedangkan daerah pesisir dan terpencil masih memerlukan peningkatan layanan.", "urgency" => "Prevalensi sedikit di atas rata-rata nasional sehingga intervensi pencegahan stunting tetap perlu diperkuat.", "year" => 2024 ],
                "JA" => [ "name" => "Jambi", "stunting" => "20.1", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Jaringan puskesmas menjangkau sebagian besar wilayah, namun distribusi dokter spesialis masih belum merata.", "urgency" => "Masih sedikit di atas rata-rata nasional sehingga diperlukan penguatan layanan kesehatan ibu dan anak.", "year" => 2024 ],
                "SS" => [ "name" => "Sumatera Selatan", "stunting" => "18.6", "status" => "Di bawah rata-rata nasional", "faskes" => "Baik. Memiliki fasilitas kesehatan dasar dan rujukan yang cukup memadai di seluruh kabupaten/kota.", "urgency" => "Stunting berada di bawah rata-rata nasional. Diperlukan penguatan pemantauan tumbuh kembang dan program gizi berbasis masyarakat.", "year" => 2024 ],
                "BE" => [ "name" => "Bengkulu", "stunting" => "18.8", "status" => "Di bawah rata-rata nasional", "faskes" => "Baik. Sebagian besar masyarakat telah terjangkau layanan kesehatan dasar, namun tenaga kesehatan spesialis masih terbatas.", "urgency" => "Stunting sudah berada di bawah rata-rata nasional, tetapi program pencegahan perlu dipertahankan.", "year" => 2024 ],
                "LA" => [ "name" => "Lampung", "stunting" => "17.6", "status" => "Di bawah rata-rata nasional", "faskes" => "Baik. Memiliki jaringan puskesmas dan rumah sakit yang cukup merata di seluruh kabupaten/kota.", "urgency" => "Prevalensi berada di bawah rata-rata nasional. Fokus utama adalah mempertahankan capaian melalui edukasi gizi dan layanan kesehatan preventif.", "year" => 2024 ],
                "BB" => [ "name" => "Kepulauan Bangka Belitung", "stunting" => "20.1", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Karakteristik wilayah kepulauan menyebabkan akses menuju rumah sakit rujukan membutuhkan waktu lebih lama.", "urgency" => "Masih sedikit di atas rata-rata nasional sehingga pemerataan layanan kesehatan antarpulau perlu ditingkatkan.", "year" => 2024 ],
                "KR" => [ "name" => "Kepulauan Riau", "stunting" => "15.9", "status" => "Di bawah rata-rata nasional", "faskes" => "Sedang. Wilayah kepulauan menyebabkan sebagian masyarakat bergantung pada transportasi laut untuk memperoleh layanan rujukan.", "urgency" => "Prevalensi sudah di bawah rata-rata nasional, namun pemerataan akses layanan kesehatan di pulau-pulau kecil masih menjadi tantangan.", "year" => 2024 ],
                "JK" => [ "name" => "DKI Jakarta", "stunting" => "14.8", "status" => "Di bawah rata-rata nasional", "faskes" => "Sangat Baik. Memiliki fasilitas kesehatan terlengkap, sebaran puskesmas dan rumah sakit sangat rapat dan mudah diakses.", "urgency" => "Merupakan provinsi dengan prevalensi stunting terendah di Indonesia, namun pemantauan kawasan padat penduduk tetap diperlukan.", "year" => 2024 ],
                "JB" => [ "name" => "Jawa Barat", "stunting" => "20.2", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Infrastruktur kesehatan sangat memadai, namun kepadatan penduduk tinggi menuntut kapasitas layanan yang lebih besar.", "urgency" => "Prevalensi stunting sedikit di atas rata-rata nasional. Karena populasi balita sangat besar, diperlukan intervensi gizi skala luas.", "year" => 2024 ],
                "JT" => [ "name" => "Jawa Tengah", "stunting" => "20.8", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Jaringan puskesmas dan rumah sakit daerah terjangkau dengan baik di sebagian besar wilayah, namun distribusi tenaga kesehatan spesialis perlu diperbaiki.", "urgency" => "Angka stunting masih tinggi dan berada di atas rata-rata nasional sehingga intervensi gizi spesifik dan sensitif perlu diperkuat.", "year" => 2024 ],
                "YO" => [ "name" => "D.I. Yogyakarta", "stunting" => "16.4", "status" => "Di bawah rata-rata nasional", "faskes" => "Sangat Baik. Fasilitas kesehatan dasar dan rujukan mudah diakses dengan kualitas pelayanan medis yang tinggi.", "urgency" => "Prevalensi stunting berada di bawah rata-rata nasional. Diperlukan konsistensi program penyuluhan gizi remaja dan calon pengantin.", "year" => 2024 ],
                "JI" => [ "name" => "Jawa Timur", "stunting" => "19.2", "status" => "Di bawah rata-rata nasional", "faskes" => "Baik. Jaringan puskesmas dan rumah sakit daerah sangat luas, rujukan medis berjalan efektif di sebagian besar daerah.", "urgency" => "Sudah berada di bawah rata-rata nasional, namun pengawasan dan edukasi gizi di tingkat desa (posyandu) harus terus diperkuat.", "year" => 2024 ],
                "BT" => [ "name" => "Banten", "stunting" => "20.0", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Fasilitas kesehatan memadai di wilayah perkotaan, namun akses di wilayah pedesaan/selatan masih perlu ditingkatkan.", "urgency" => "Berada sedikit di atas rata-rata nasional sehingga diperlukan percepatan intervensi gizi terpadu di wilayah prioritas.", "year" => 2024 ],
                "BA" => [ "name" => "Bali", "stunting" => "8.0", "status" => "Di bawah rata-rata nasional", "faskes" => "Sangat Baik. Fasilitas kesehatan primer dan sekunder tersebar merata serta mudah dijangkau oleh masyarakat.", "urgency" => "Prevalensi stunting sangat rendah dan terbaik secara nasional. Fokus pada mempertahankan capaian dan peningkatan kualitas gizi keluarga.", "year" => 2024 ],
                "NB" => [ "name" => "Nusa Tenggara Barat", "stunting" => "32.7", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Puskesmas tersedia, namun akses menuju rumah sakit rujukan spesialis di wilayah pelosok dan pulau kecil masih terbatas.", "urgency" => "Prevalensi stunting sangat tinggi jauh di atas rata-rata nasional. Diperlukan akselerasi intervensi gizi spesifik dan penguatan faskes.", "year" => 2024 ],
                "NT" => [ "name" => "Nusa Tenggara Timur", "stunting" => "37.9", "status" => "Di atas rata-rata nasional", "faskes" => "Terbatas. Banyak fasilitas kesehatan kekurangan tenaga dokter spesialis, serta akses geografis di pedalaman dan pulau kecil cukup sulit.", "urgency" => "Provinsi dengan prevalensi stunting tertinggi secara nasional. Membutuhkan intervensi darurat, pemenuhan air bersih, dan pasokan pangan bergizi.", "year" => 2024 ],
                "KB" => [ "name" => "Kalimantan Barat", "stunting" => "26.8", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Wilayah perbatasan dan pedalaman masih menghadapi keterbatasan akses menuju rumah sakit rujukan serta distribusi tenaga kesehatan belum merata.", "urgency" => "Prevalensi stunting jauh di atas rata-rata nasional sehingga diperlukan pemerataan layanan kesehatan ibu dan anak serta peningkatan intervensi gizi.", "year" => 2024 ],
                "KS" => [ "name" => "Kalimantan Selatan", "stunting" => "22.9", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Rumah sakit dan puskesmas tersedia di seluruh kabupaten/kota, namun layanan spesialis masih terpusat di Banjarmasin dan Banjarbaru.", "urgency" => "Masih berada di atas rata-rata nasional sehingga diperlukan penguatan layanan kesehatan primer, edukasi gizi, dan pemantauan tumbuh kembang anak.", "year" => 2024 ],
                "KT" => [ "name" => "Kalimantan Tengah", "stunting" => "22.1", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Sebagian wilayah pedalaman dan daerah aliran sungai membutuhkan waktu tempuh lebih lama menuju fasilitas kesehatan rujukan.", "urgency" => "Prevalensi stunting masih berada di atas rata-rata nasional. Hambatan geografis membuat pemerataan layanan kesehatan menjadi tantangan utama.", "year" => 2024 ],
                "KI" => [ "name" => "Kalimantan Timur", "stunting" => "22.2", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Infrastruktur kesehatan berkembang pesat di kota-kota besar, namun beberapa wilayah pedalaman masih memiliki keterbatasan akses layanan rujukan.", "urgency" => "Angka stunting masih berada di atas rata-rata nasional sehingga intervensi gizi dan pemerataan tenaga kesehatan tetap menjadi prioritas.", "year" => 2024 ],
                "KU" => [ "name" => "Kalimantan Utara", "stunting" => "17.5", "status" => "Di bawah rata-rata nasional", "faskes" => "Sedang. Wilayah perbatasan dan daerah terpencil masih menghadapi keterbatasan akses menuju rumah sakit rujukan akibat kondisi geografis.", "urgency" => "Prevalensi stunting sudah berada di bawah rata-rata nasional, namun peningkatan akses layanan kesehatan di wilayah terpencil tetap diperlukan.", "year" => 2024 ],
                "GO" => [ "name" => "Gorontalo", "stunting" => "23.5", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Layanan kesehatan dasar tersedia, namun akses terhadap dokter spesialis anak dan rumah sakit rujukan masih terbatas di beberapa wilayah.", "urgency" => "Prevalensi stunting cukup tinggi sehingga diperlukan peningkatan pelayanan kesehatan ibu dan anak serta edukasi gizi.", "year" => 2024 ],
                "SR" => [ "name" => "Sulawesi Barat", "stunting" => "35.4", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Fasilitas kesehatan dasar tersedia, namun distribusi tenaga kesehatan spesialis masih terbatas terutama di wilayah pesisir dan pegunungan.", "urgency" => "Merupakan salah satu provinsi dengan prevalensi stunting tertinggi di Indonesia sehingga membutuhkan percepatan intervensi gizi dan peningkatan akses layanan kesehatan.", "year" => 2024 ],
                "SN" => [ "name" => "Sulawesi Selatan", "stunting" => "23.3", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Memiliki jaringan rumah sakit dan puskesmas yang cukup lengkap, namun layanan spesialis masih terkonsentrasi di Kota Makassar.", "urgency" => "Prevalensi stunting masih berada di atas rata-rata nasional sehingga diperlukan pemerataan layanan kesehatan dan edukasi gizi.", "year" => 2024 ],
                "ST" => [ "name" => "Sulawesi Tengah", "stunting" => "24.2", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Kondisi geografis berupa pegunungan dan wilayah yang luas menyebabkan sebagian masyarakat membutuhkan waktu tempuh lebih lama menuju fasilitas kesehatan.", "urgency" => "Angka stunting masih tinggi sehingga pemerataan akses layanan kesehatan dan intervensi gizi menjadi prioritas.", "year" => 2024 ],
                "SG" => [ "name" => "Sulawesi Tenggara", "stunting" => "26.1", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Wilayah kepulauan menyebabkan akses menuju rumah sakit rujukan di beberapa daerah memerlukan waktu tempuh lebih lama.", "urgency" => "Angka stunting masih cukup tinggi sehingga perlu penguatan layanan kesehatan ibu dan anak serta pemerataan akses di wilayah kepulauan.", "year" => 2024 ],
                "SA" => [ "name" => "Sulawesi Utara", "stunting" => "21.1", "status" => "Di atas rata-rata nasional", "faskes" => "Baik. Rumah sakit dan puskesmas relatif merata di wilayah daratan, namun beberapa pulau kecil masih memiliki keterbatasan akses layanan rujukan.", "urgency" => "Prevalensi stunting masih di atas rata-rata nasional sehingga diperlukan penguatan intervensi gizi dan pemerataan layanan kesehatan.", "year" => 2024 ],
                "MA" => [ "name" => "Maluku", "stunting" => "28.3", "status" => "Di atas rata-rata nasional", "faskes" => "Terbatas. Karakteristik wilayah kepulauan menyebabkan distribusi tenaga kesehatan dan layanan rujukan belum merata.", "urgency" => "Prevalensi stunting masih jauh di atas rata-rata nasional sehingga pemerataan layanan kesehatan menjadi prioritas.", "year" => 2024 ],
                "MU" => [ "name" => "Maluku Utara", "stunting" => "23.2", "status" => "Di atas rata-rata nasional", "faskes" => "Sedang. Akses layanan kesehatan cukup baik di wilayah utama, namun pulau-pulau kecil masih menghadapi keterbatasan layanan rujukan.", "urgency" => "Masih berada di atas rata-rata nasional sehingga diperlukan peningkatan intervensi gizi dan pemerataan tenaga kesehatan.", "year" => 2024 ],
                "PB" => [ "name" => "Papua Barat", "stunting" => "26.5", "status" => "Di atas rata-rata nasional", "faskes" => "Terbatas. Sebaran penduduk yang berjauhan menyebabkan akses menuju fasilitas kesehatan membutuhkan waktu lebih lama.", "urgency" => "Prevalensi stunting berada di atas rata-rata nasional sehingga diperlukan peningkatan layanan kesehatan dasar dan edukasi gizi.", "year" => 2024 ],
                "PA" => [ "name" => "Papua", "stunting" => "24.9", "status" => "Di atas rata-rata nasional", "faskes" => "Terbatas. Sebagian wilayah hanya dapat dijangkau melalui jalur udara atau laut sehingga akses menuju rumah sakit rujukan masih menjadi tantangan.", "urgency" => "Prevalensi stunting masih tinggi. Pemerataan layanan kesehatan ibu-anak dan distribusi tenaga kesehatan perlu diperkuat.", "year" => 2024 ]
            ];
        }

        return view('home.index', [
            'provinces' => $provinces,
            'mentalHistory' => $history,
            'initialTab' => 'mental_scan'
        ]);
    }

    /**
     * Analyze a single photo (real-time prediction)
     */
    public function analyzeSingle(Request $request)
    {
        $request->validate([
            'foto'   => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'bagian' => 'required|in:muka,mata,kuku',
        ]);

        try {
            $result = $this->scanService->analyzeSinglePhoto(
                $request->file('foto'),
                $request->bagian
            );

            return response()->json([
                'success' => true,
                'result'  => $result
            ]);
        } catch (\Exception $e) {
            Log::error('MentalHealthScanController single analysis error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menganalisis foto.'
            ], 500);
        }
    }

    /**
     * Submit all photos + questionnaire for a full scan
     */
    public function analyzeFull(Request $request)
    {
        if (is_string($request->input('jawaban_kuesioner'))) {
            $request->merge([
                'jawaban_kuesioner' => json_decode($request->input('jawaban_kuesioner'), true)
            ]);
        }

        $request->validate([
            'nama_pasien'         => 'required|string|max:100',
            'usia_pasien'         => 'required|integer|min:0|max:120', // in years
            'tanggal_lahir'       => 'nullable|date',
            'jenis_kelamin'       => 'required|in:L,P',
            'foto_muka'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'foto_mata'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'foto_kuku'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'jawaban_kuesioner'   => 'required|array',
            'previous_session_id' => 'nullable|exists:mental_health_scans,id',
        ]);

        try {
            // If follow-up session is requested, ensure the previous session belongs to this user or user is admin
            if ($request->previous_session_id && !auth()->user()->isAdmin()) {
                $prevScan = MentalHealthScan::where('id', $request->previous_session_id)
                    ->where('user_id', auth()->id())
                    ->first();
                if (!$prevScan) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Sesi sebelumnya tidak valid atau tidak dimiliki oleh akun ini.'
                    ], 403);
                }
            }

            $result = $this->scanService->analyzeFullScan(
                $request->file('foto_muka'),
                $request->file('foto_mata'),
                $request->file('foto_kuku'),
                $request->input('jawaban_kuesioner'),
                [
                    'user_id'       => auth()->id(),
                    'nama_pasien'   => $request->nama_pasien,
                    'usia_pasien'   => $request->usia_pasien,
                    'tanggal_lahir' => $request->tanggal_lahir,
                    'jenis_kelamin' => $request->jenis_kelamin,
                ],
                $request->previous_session_id
            );

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('MentalHealthScanController full analysis error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses analisis lengkap kesehatan mental.'
            ], 500);
        }
    }

    /**
     * Get details of a scan session
     */
    public function show(int $id)
    {
        $query = MentalHealthScan::with('previousSession');
        if (!auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        $record = $query->findOrFail($id);
        
        if ($record->analisis_gabungan_ai) {
            $record->laporan_gabungan_decoded = json_decode($record->analisis_gabungan_ai, true);
        }

        return response()->json($record);
    }

    /**
     * Compare follow-up photos for H+7 tracking
     */
    public function compare(Request $request, int $id)
    {
        $query = MentalHealthScan::query();
        if (!auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        $record = $query->findOrFail($id);

        $request->validate([
            'foto_muka' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'foto_mata' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'foto_kuku' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        try {
            $comparison = $this->scanService->compareWithPrevious(
                $id,
                $request->file('foto_muka'),
                $request->file('foto_mata'),
                $request->file('foto_kuku')
            );

            $record->update([
                'status_perbandingan' => $comparison['status_keseluruhan'],
                'sesi_tipe'           => 'checkpoint_h7',
            ]);

            return response()->json($comparison);
        } catch (\Exception $e) {
            Log::error('MentalHealthScanController compare error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal membandingkan foto monitoring.'
            ], 500);
        }
    }

    /**
     * Get timeline history of scans for a patient
     */
    public function history(string $patientName)
    {
        $query = MentalHealthScan::where('nama_pasien', 'like', "%{$patientName}%");
        if (!auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        $records = $query->orderBy('created_at', 'asc')->get();

        return response()->json([
            'success' => true,
            'records' => $records
        ]);
    }

    /**
     * Download clinical PDF report
     */
    public function downloadPdf($id)
    {
        $query = MentalHealthScan::query();
        if (!auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        $scan = $query->findOrFail($id);
        
        $laporan = [];
        if ($scan->analisis_gabungan_ai) {
            $laporan = json_decode($scan->analisis_gabungan_ai, true);
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('user.pdf-report', [
            'scan' => $scan,
            'laporan' => $laporan
        ]);

        $safeName = str_replace(' ', '_', $scan->nama_pasien);
        return $pdf->download("Laporan_Mental_Scan_{$safeName}_{$scan->created_at->format('Ymd_His')}.pdf");
    }

    /**
     * Get list of mental health scan records as JSON
     */
    public function listScans()
    {
        $query = MentalHealthScan::orderBy('created_at', 'desc');
        if (auth()->check() && !auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        $records = $query->get();

        foreach ($records as $record) {
            if ($record->analisis_gabungan_ai) {
                $record->laporan_gabungan_decoded = json_decode($record->analisis_gabungan_ai, true);
            }
        }

        return response()->json($records);
    }
}
