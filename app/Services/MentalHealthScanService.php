<?php

namespace App\Services;

use App\Models\MentalHealthScan;
use App\Services\GeminiService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MentalHealthScanService
{
    private GeminiService $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    /**
     * Analyze a single photo (real-time prediction)
     */
    public function analyzeSinglePhoto(UploadedFile $file, string $bagian): array
    {
        $mimeType = $file->getMimeType();
        $base64   = base64_encode(file_get_contents($file->getRealPath()));

        $result = $this->gemini->analyzeImageStructured($base64, $mimeType, $bagian);

        if ($result === null) {
            return [
                'error'   => true,
                'message' => 'AI gagal menganalisis foto. Silakan coba lagi.',
            ];
        }

        return $result;
    }

    /**
     * Full scan: analyze all 3 photos + questionnaire, generate combined report, save to DB.
     */
    public function analyzeFullScan(
        ?UploadedFile $fotoMuka,
        ?UploadedFile $fotoMata,
        ?UploadedFile $fotoKuku,
        array $kuesioner = [],
        array $patientData = [],
        ?int $previousSessionId = null
    ): array {
        $storedPaths = [];
        $analyses    = [];
        $confidences = [];
        $highlights  = [];

        $photos = [
            'muka' => $fotoMuka,
            'mata' => $fotoMata,
            'kuku' => $fotoKuku,
        ];

        $usiaPasien = $patientData['usia_pasien'] ?? null;

        $imagesData = [];
        foreach ($photos as $bagian => $file) {
            if ($file !== null) {
                // Store the photo
                $path = $file->store("mental_scans/{$bagian}", 'public');
                $storedPaths[$bagian] = $path;

                $imagesData[$bagian] = [
                    'base64' => base64_encode(file_get_contents($file->getRealPath())),
                    'mime'   => $file->getMimeType(),
                ];
            }
        }

        // Analyze all active photos concurrently via HTTP Pool
        $analyses = $this->gemini->analyzeImagesParallel($imagesData, $usiaPasien);

        foreach ($analyses as $bagian => $result) {
            $confidences[$bagian] = $result['confidence_score'] ?? null;

            if (!empty($result['temuan_visual'])) {
                foreach ($result['temuan_visual'] as $temuan) {
                    $highlights[] = [
                        'area'      => $bagian,
                        'tanda'     => $temuan['tanda'] ?? '',
                        'highlight' => $temuan['area_highlight'] ?? '',
                    ];
                }
            }
        }

        // Generate combined report
        $combinedReport = $this->gemini->generateCombinedReport(
            $analyses['muka'] ?? [],
            $analyses['mata'] ?? [],
            $analyses['kuku'] ?? [],
            $kuesioner,
            $usiaPasien
        );

        $levelRisiko = $combinedReport['level_risiko'] ?? 'sedang';

        $kondisi = [];
        if (!empty($combinedReport['kondisi_mental_utama'])) {
            foreach ($combinedReport['kondisi_mental_utama'] as $k) {
                $kondisi[] = $k['kondisi'] ?? '';
            }
        }

        // Build text summaries
        $analisisTexts = [];
        foreach (['muka', 'mata', 'kuku'] as $bagian) {
            if (!empty($analyses[$bagian])) {
                $a = $analyses[$bagian];
                $text = "Status: " . ($a['status'] ?? 'unknown');
                if (!empty($a['penjelasan_awam'])) {
                    $text .= "\n" . $a['penjelasan_awam'];
                }
                if (!empty($a['indikasi_mental'])) {
                    $text .= "\nIndikasi: ";
                    $parts = [];
                    foreach ($a['indikasi_mental'] as $im) {
                        $parts[] = ($im['kondisi'] ?? '') . ' (' . ($im['keyakinan'] ?? '') . ')';
                    }
                    $text .= implode(', ', $parts);
                }
                $analisisTexts[$bagian] = $text;
            }
        }

        $sesiTipe = 'awal';
        $statusPerbandingan = null;
        if ($previousSessionId) {
            $sesiTipe = 'checkpoint_h7';
        }

        // Save to database
        $record = MentalHealthScan::create([
            'user_id'              => $patientData['user_id'] ?? null,
            'nama_pasien'          => $patientData['nama_pasien'] ?? null,
            'usia_pasien'          => $patientData['usia_pasien'] ?? null,
            'tanggal_lahir'        => $patientData['tanggal_lahir'] ?? null,
            'jenis_kelamin'        => $patientData['jenis_kelamin'] ?? null,
            'foto_muka'            => $storedPaths['muka'] ?? null,
            'foto_mata'            => $storedPaths['mata'] ?? null,
            'foto_kuku'            => $storedPaths['kuku'] ?? null,
            // Legacy text field support
            'analisis_muka'        => $analisisTexts['muka'] ?? null,
            'analisis_mata'        => $analisisTexts['mata'] ?? null,
            'analisis_kuku'        => $analisisTexts['kuku'] ?? null,
            // DL structured prediction
            'dl_prediksi_muka'     => $analyses['muka'] ?? null,
            'dl_prediksi_mata'     => $analyses['mata'] ?? null,
            'dl_prediksi_kuku'     => $analyses['kuku'] ?? null,
            'dl_confidence_muka'   => $confidences['muka'] ?? null,
            'dl_confidence_mata'   => $confidences['mata'] ?? null,
            'dl_confidence_kuku'   => $confidences['kuku'] ?? null,
            // Combined report
            'analisis_gabungan'    => $combinedReport['ringkasan_pengguna'] ?? null,
            'analisis_gabungan_ai' => json_encode($combinedReport, JSON_UNESCAPED_UNICODE),
            'highlight_areas'      => $highlights,
            // Questionnaire
            'jawaban_kuesioner'    => $kuesioner,
            'analisis_mental'      => $combinedReport['ringkasan_pengguna'] ?? null,
            'kondisi_terdeteksi'   => $kondisi,
            'rekomendasi'          => $this->formatRecommendations($combinedReport),
            'level_risiko'         => $levelRisiko,
            // Session tracking
            'sesi_tipe'            => $sesiTipe,
            'sesi_sebelumnya_id'   => $previousSessionId,
            'status_perbandingan'  => $statusPerbandingan,
        ]);

        return [
            'success'          => true,
            'id'               => $record->id,
            'analisis_muka'    => $analyses['muka'] ?? null,
            'analisis_mata'    => $analyses['mata'] ?? null,
            'analisis_kuku'    => $analyses['kuku'] ?? null,
            'laporan_gabungan' => $combinedReport,
            'level_risiko'     => $levelRisiko,
            'kondisi'          => $kondisi,
            'highlights'       => $highlights,
        ];
    }

    /**
     * Compare follow-up photos with previous session.
     */
    public function compareWithPrevious(
        int $previousId,
        ?UploadedFile $fotoMuka,
        ?UploadedFile $fotoMata,
        ?UploadedFile $fotoKuku
    ): array {
        $previous = MentalHealthScan::findOrFail($previousId);
        $comparisons = [];

        $photos = [
            'muka' => $fotoMuka,
            'mata' => $fotoMata,
            'kuku' => $fotoKuku,
        ];

        foreach ($photos as $bagian => $file) {
            $prevFotoField = "foto_{$bagian}";
            $prevPredField = "dl_prediksi_{$bagian}";

            if ($file !== null && $previous->$prevFotoField) {
                $prevPath = Storage::disk('public')->path($previous->$prevFotoField);
                if (file_exists($prevPath)) {
                    $base64Before = base64_encode(file_get_contents($prevPath));
                    $base64After  = base64_encode(file_get_contents($file->getRealPath()));
                    $mimeType     = $file->getMimeType();

                    $comparisons[$bagian] = $this->gemini->compareBeforeAfter(
                        $base64Before,
                        $base64After,
                        $mimeType,
                        $bagian,
                        $previous->$prevPredField ?? []
                    );
                }
            }
        }

        $statuses = array_map(fn($c) => $c['status_perbandingan'] ?? 'belum_membaik', $comparisons);
        $overallStatus = 'membaik';
        if (in_array('memburuk', $statuses)) {
            $overallStatus = 'memburuk';
        } elseif (in_array('belum_membaik', $statuses)) {
            $overallStatus = 'belum_membaik';
        }

        return [
            'success'            => true,
            'previous_id'        => $previousId,
            'comparisons'        => $comparisons,
            'status_keseluruhan' => $overallStatus,
        ];
    }

    /**
     * Format recommendations.
     */
    private function formatRecommendations(array $report): string
    {
        $lines = [];

        if (!empty($report['rekomendasi_tindakan'])) {
            $lines[] = "📋 TINDAKAN YANG DIANJURKAN:";
            foreach ($report['rekomendasi_tindakan'] as $t) {
                $prioritas = strtoupper($t['prioritas'] ?? 'sedang');
                $lines[] = "• [{$prioritas}] {$t['tindakan']} — {$t['deskripsi']} ({$t['frekuensi']})";
            }
        }

        if (!empty($report['rekomendasi_relaksasi'])) {
            $lines[] = "\n🧘 TEKNIK RELAKSASI & MINDFULNESS:";
            foreach ($report['rekomendasi_relaksasi'] as $r) {
                $lines[] = "• {$r['metode']} — {$r['alasan']}";
            }
        }

        if (!empty($report['perlu_rujuk_nakes']) && !empty($report['alasan_rujuk'])) {
            $lines[] = "\n⚠️ PERINGATAN: {$report['alasan_rujuk']}";
        }

        return implode("\n", $lines);
    }
}
