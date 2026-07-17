<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GeminiService;
use Illuminate\Support\Facades\Log;

class FoodRecommendationController extends Controller
{
    protected GeminiService $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    /**
     * Get food recommendations based on child profile and local province commodities.
     */
    public function getRecommendations(Request $request)
    {
        $request->validate([
            'nama_anak'       => 'required|string|max:100',
            'usia_bulan'      => 'required|integer|min:0|max:120',
            'provinsi'        => 'required|string|max:100',
            'status_stunting' => 'nullable|string|max:50',
            'status_anemia'   => 'nullable|string|max:50',
            'alergi'          => 'nullable|string|max:255',
            'mood'            => 'nullable|string|max:50',
        ]);

        $namaAnak = $request->nama_anak;
        $usiaBulan = $request->usia_bulan;
        $provinsi = $request->provinsi;
        $statusStunting = $request->status_stunting ?? 'Normal';
        $statusAnemia = $request->status_anemia ?? 'Normal';
        $alergi = $request->alergi ?? 'Tidak ada alergi';
        $mood = $request->mood ?? 'Rewel / Frustrasi';

        // Construct System Prompt to instruct AI
        $systemPrompt = "Anda adalah ahli pangan lokal Indonesia yang sangat hafal komoditas pertanian, perkebunan, perikanan, peternakan, dan hasil bumi khas tiap provinsi di Indonesia.\n"
            . "Tugas Anda adalah memberikan beberapa rekomendasi makanan lokal khas atau bahan pangan lokal dari provinsi yang dituju untuk anak balita.\n"
            . "Rekomendasi Anda harus menyesuaikan dengan usia anak (dalam bulan), status stunting, status anemia, dan aman dari alergi yang dimiliki.\n\n"
            . "ATURAN PENTING:\n"
            . "1. Rekomendasikan bahan pangan atau masakan lokal khas dari provinsi tersebut (jangan beri masakan generik yang sama untuk setiap provinsi).\n"
            . "2. Hindari bahan pemicu alergi yang disebutkan oleh pengguna.\n"
            . "3. Sesuaikan tekstur dan kecocokan nutrisi dengan usia anak.\n"
            . "4. Jika anak stunting, fokuskan pada bahan tinggi protein hewani, kalsium, zinc. Jika anak anemia, fokuskan pada zat besi tinggi dan vitamin C penunjang.\n"
            . "5. Berikan penjelasan singkat (1-2 kalimat) yang dipersonalisasi menyebutkan nama anak dan alasan mengapa makanan ini cocok.\n\n"
            . "WAJIB BALAS HANYA DALAM FORMAT JSON BERIKUT (tanpa markdown code block, tanpa teks lain, langsung JSON objek):\n"
            . "{\n"
            . "  \"foods\": [\n"
            . "    {\n"
            . "      \"name\": \"Nama makanan/bahan pangan\",\n"
            . "      \"origin\": \"Komoditas/daerah penghasil spesifik di provinsi tersebut\",\n"
            . "      \"why\": \"Alasan kecocokan untuk anak ini\"\n"
            . "    }\n"
            . "  ]\n"
            . "}";

        // Construct User Prompt
        $userPrompt = "Berikan rekomendasi makanan lokal untuk anak berikut:\n"
            . "- Nama Anak: {$namaAnak}\n"
            . "- Usia: {$usiaBulan} bulan\n"
            . "- Provinsi (Lokasi): {$provinsi}\n"
            . "- Status Stunting: {$statusStunting}\n"
            . "- Status Anemia: {$statusAnemia}\n"
            . "- Catatan Kesehatan / Alergi: {$alergi}\n"
            . "- Suasana Hati / Mood: {$mood}\n\n"
            . "Ingat, kembalikan JSON yang valid sesuai struktur yang diminta.";

        $messages = [
            ['role' => 'user', 'text' => $userPrompt]
        ];

        try {
            $responseContent = $this->gemini->chat($messages, $systemPrompt, 0.4);

            // Clean the response from markdown code blocks if any
            $cleaned = trim($responseContent);
            if (strpos($cleaned, '```json') === 0) {
                $cleaned = substr($cleaned, 7);
            }
            if (substr($cleaned, -3) === '```') {
                $cleaned = substr($cleaned, 0, -3);
            }
            $cleaned = trim($cleaned);

            $decoded = json_decode($cleaned, true);

            if (json_last_error() !== JSON_ERROR_NONE || !isset($decoded['foods'])) {
                Log::warning("Food AI: Failed to parse JSON from AI: " . $cleaned);
                // Return fallback mock foods if AI failed to return correct structure
                return response()->json([
                    'success' => false,
                    'message' => 'Format rekomendasi AI tidak valid, menggunakan rekomendasi lokal standar.',
                    'result'  => $this->getLocalFallbackRecommendations($provinsi, $usiaBulan, $statusStunting, $statusAnemia, $alergi, $namaAnak)
                ]);
            }

            return response()->json([
                'success' => true,
                'result'  => $decoded
            ]);
        } catch (\Exception $e) {
            Log::error('FoodRecommendationController error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghubungi server AI.',
                'result'  => $this->getLocalFallbackRecommendations($provinsi, $usiaBulan, $statusStunting, $statusAnemia, $alergi, $namaAnak)
            ]);
        }
    }

    /**
     * Local fallback recommendations when AI API is unavailable.
     */
    private function getLocalFallbackRecommendations($provinsi, $usiaBulan, $statusStunting, $statusAnemia, $alergi, $namaAnak)
    {
        // Simple heuristic rules to generate robust, nice looking recommendations
        $foods = [];

        // Check allergies
        $hasFishAllergy = (stripos($alergi, 'ikan') !== false || stripos($alergi, 'seafood') !== false || stripos($alergi, 'udang') !== false);
        $hasEggAllergy = (stripos($alergi, 'telur') !== false);
        $hasNutAllergy = (stripos($alergi, 'kacang') !== false);

        // Standard provincial commodities fallback mapping
        $provLower = strtolower($provinsi);

        if (strpos($provLower, 'jawa') !== false) {
            if (!$hasEggAllergy && !$hasFishAllergy) {
                $foods[] = [
                    'name' => 'Pepes Ikan Kembung dan Telur Puyuh Rebus',
                    'origin' => 'Hasil perikanan budidaya dan peternakan lokal Jawa Barat/Tengah',
                    'why' => "Sangat baik untuk {$namaAnak} karena kaya zat besi dan asam lemak omega-3 untuk mendukung tinggi badan serta mencegah anemia."
                ];
            }
            if (!$hasNutAllergy) {
                $foods[] = [
                    'name' => 'Bubur Beras Merah Kacang Hijau',
                    'origin' => 'Komoditas pertanian dataran tinggi Jawa',
                    'why' => "Sumber serat, seng (zinc), dan vitamin B kompleks yang mudah dicerna untuk menaikkan berat badan {$namaAnak}."
                ];
            }
            $foods[] = [
                'name' => 'Puree Wortel dan Labu Siam',
                'origin' => 'Sayuran lokal pegunungan Jawa',
                'why' => "Kaya vitamin A dan mineral penting yang mendukung daya tahan tubuh {$namaAnak}."
            ];
        } elseif (strpos($provLower, 'papua') !== false || strpos($provLower, 'maluku') !== false) {
            if (!$hasFishAllergy) {
                $foods[] = [
                    'name' => 'Bubur Sagu Ikan Kuah Kuning',
                    'origin' => 'Komoditas sagu pesisir dan ikan laut tangkapan lokal',
                    'why' => "Sagu adalah sumber energi yang lembut untuk {$namaAnak}, berpadu protein ikan berkualitas tinggi mencegah stunting."
                ];
            }
            $foods[] = [
                'name' => 'Sop Daun Kelor dan Ubi Merah Lumat',
                'origin' => 'Tanaman pangan lokal pekarangan Maluku/Papua',
                'why' => "Kelor kaya zat besi nabati yang mencegah anemia, dikombinasikan ubi merah sebagai sumber kalori bagi {$namaAnak}."
            ];
        } elseif (strpos($provLower, 'sulawesi') !== false) {
            if (!$hasFishAllergy) {
                $foods[] = [
                    'name' => 'Bubur Manado (Tinuutuan) Halus dengan Ikan Cakalang',
                    'origin' => 'Sayuran hijau dan komoditas laut Sulawesi Utara/Selatan',
                    'why' => "Kaya protein, zat besi, dan vitamin A dari bayam/labu kuning untuk mencukupi kebutuhan gizi {$namaAnak}."
                ];
            }
            $foods[] = [
                'name' => 'Sop Jagung Madu Cincang Singkong',
                'origin' => 'Hasil pertanian jagung Gorontalo dan Sulawesi Tengah',
                'why' => "Sumber karbohidrat kompleks dan serat lembut yang ramah untuk pencernaan {$namaAnak}."
            ];
        } else {
            // General national fallback
            if (!$hasFishAllergy) {
                $foods[] = [
                    'name' => 'Bubur Beras Ikan Kembung Suwir',
                    'origin' => 'Kekayaan laut tangkap nusantara',
                    'why' => "Protein hewani terbaik dengan kandungan zat besi tinggi yang mudah diserap untuk mengatasi lesu pada {$namaAnak}."
                ];
            }
            if (!$hasEggAllergy) {
                $foods[] = [
                    'name' => 'Puree Kentang Hati Ayam Lumat',
                    'origin' => 'Hasil bumi lokal perkebunan dan peternakan rakyat',
                    'why' => "Hati ayam sangat kaya zat besi aktif yang secara cepat membantu pemulihan anemia pada {$namaAnak}."
                ];
            }
            $foods[] = [
                'name' => 'Bubur Jagung Manis dan Pisang Ambon',
                'origin' => 'Hasil kebun petani lokal',
                'why' => "Lembut dan manis alami untuk memancing nafsu makan {$namaAnak} saat ia rewel atau sulit makan."
            ];
        }

        // Filter out empty foods if any
        if (count($foods) === 0) {
            $foods[] = [
                'name' => 'Bubur Beras Hati Ayam dan Wortel',
                'origin' => 'Bahan pokok hewani lokal terjangkau',
                'why' => "Sangat kaya zat besi dan protein yang dibutuhkan tumbuh kembang {$namaAnak} sehari-hari."
            ];
        }

        return ['foods' => $foods];
    }
}
