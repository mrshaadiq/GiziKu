<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;
    private string $model;
    private string $groqKey;
    private string $groqModel;

    public function __construct()
    {
        $this->apiKey    = env('GEMINI_API_KEY', '');
        $this->model     = env('GEMINI_MODEL', 'gemini-3.5-flash');
        $this->groqKey   = env('GROQ_API_KEY', '');
        $this->groqModel = env('GROQ_MODEL', 'llama-3.3-70b-versatile');
    }

    /**
     * Get ordered list of models to try (primary + fallbacks)
     */
    private function getModelChain(): array
    {
        $primary = $this->model;
        $all = ['gemini-3.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-pro-latest'];

        $chain = [$primary];
        foreach ($all as $m) {
            if ($m !== $primary) {
                $chain[] = $m;
            }
        }
        return $chain;
    }

    /**
     * Call Gemini API with model fallback + retry on 503
     */
    private function callWithFallback(array $body, int $timeoutSec = 90): ?\Illuminate\Http\Client\Response
    {
        $models = $this->getModelChain();

        foreach ($models as $modelName) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:generateContent?key={$this->apiKey}";

            for ($attempt = 1; $attempt <= 2; $attempt++) {
                Log::info("Gemini: trying {$modelName} (attempt {$attempt})");

                try {
                    $response = Http::timeout($timeoutSec)->post($url, $body);

                    if ($response->successful()) {
                        Log::info("Gemini: success with {$modelName}");
                        return $response;
                    }

                    $status = $response->status();

                    if ($status === 503 && $attempt === 1) {
                        Log::warning("Gemini {$modelName} 503 overload — retrying in 8s");
                        sleep(8);
                        continue;
                    }

                    Log::warning("Gemini {$modelName} failed with status {$status} — trying next model");
                    break;
                } catch (\Exception $e) {
                    Log::error("Gemini {$modelName} request exception: " . $e->getMessage());
                    break;
                }
            }
        }

        return $response ?? null;
    }

    /**
     * Call Groq API for text completions
     */
    private function callGroq(array $groqMessages, float $temperature = 0.4): ?string
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => "Bearer {$this->groqKey}",
                    'Content-Type'  => 'application/json',
                ])
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'       => $this->groqModel,
                    'messages'    => $groqMessages,
                    'temperature' => $temperature,
                ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content');
            }

            Log::error('Groq API error', ['status' => $response->status(), 'body' => $response->body()]);
            return null;
        } catch (\Exception $e) {
            Log::error('Groq API exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Send a chat request to Groq (primary) or Gemini API (fallback)
     */
    public function chat(array $messages, string $systemPrompt = '', float $temperature = 0.4): ?string
    {
        if (!empty($this->groqKey)) {
            $groqMessages = [];
            if ($systemPrompt) {
                $groqMessages[] = ['role' => 'system', 'content' => $systemPrompt];
            }
            foreach ($messages as $msg) {
                $role = ($msg['role'] === 'model') ? 'assistant' : $msg['role'];
                $text = $msg['text'] ?? $msg['content'] ?? '';
                $groqMessages[] = ['role' => $role, 'content' => $text];
            }

            $groqOutput = $this->callGroq($groqMessages, $temperature);
            if ($groqOutput !== null) {
                Log::info("Using Groq API response");
                return $groqOutput;
            }
            Log::warning('Groq failed, falling back to Gemini.');
        }

        if (empty($this->apiKey)) {
            return 'Error: API key belum diatur di file .env.';
        }

        $contents = collect($messages)->map(fn($msg) => [
            'role' => $msg['role'],
            'parts' => [['text' => $msg['text']]],
        ])->values()->all();

        $body = ['contents' => $contents];

        if ($systemPrompt) {
            $body['systemInstruction'] = [
                'parts' => [['text' => $systemPrompt]],
            ];
        }

        $body['generationConfig'] = [
            'temperature' => $temperature,
        ];

        try {
            $response = $this->callWithFallback($body, 60);

            if ($response === null || $response->failed()) {
                $status = $response ? $response->status() : 500;
                Log::error('Gemini API error', ['status' => $status, 'body' => $response ? $response->body() : 'No response']);
                if ($status === 429) {
                    return 'AI sedang sibuk. Tunggu 1 menit lalu coba lagi.';
                }
                return 'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.';
            }

            return $response->json('candidates.0.content.parts.0.text') ?? '';
        } catch (\Exception $e) {
            Log::error('Gemini API exception', ['message' => $e->getMessage()]);
            return 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.';
        }
    }

    /**
     * Analyze a photo (base64) for mental health signs
     * $bagian: 'muka' | 'mata' | 'kuku'
     */
    public function analyzeImageStructured(string $base64Image, string $mimeType, string $bagian): ?array
    {
        if (empty($this->apiKey)) {
            return ['error' => 'GEMINI_API_KEY belum diatur.'];
        }

        $bagianPrompts = [
            'muka' => "Kamu adalah psikolog klinis dan neuropsikolog AI. Analisis foto MUKA/WAJAH orang ini untuk mendeteksi tanda-tanda stres kronis, kelelahan mental, kecemasan, atau depresi. Perhatikan: kerutan dahi/ekspresi tegang (stres kronis/cortisol tinggi), wajah kusam atau lingkaran hitam bawah mata (insomnia/burnout), otot rahang tegang (anxietas), kurangnya ekspresi (flat affect/depresi).",
            'mata' => "Kamu adalah psikolog klinis dan pakar gangguan tidur AI. Analisis foto MATA orang ini untuk mendeteksi tanda-tanda stres, kurang tidur (insomnia), depresi, atau kecemasan. Perhatikan: mata merah/iritasi (kurang tidur/lelah), kantung mata hitam/bengkak (kurang tidur kronis/stres tinggi), tatapan layu/kosong (indikasi depresi/kelelahan mental).",
            'kuku' => "Kamu adalah psikolog klinis dan pakar gangguan anxietas AI. Analisis foto KUKU orang ini untuk mendeteksi tanda-tanda stres fisik dan psikologis. Perhatikan: kuku digigit/cacat (onychophagia/indikasi anxietas/kebiasaan stres), kuku tidak terawat/kotor (self-neglect/indikasi depresi klinis), garis melintang/garis Beau (stres psikologis berat beberapa bulan lalu).",
        ];

        $systemPrompt = ($bagianPrompts[$bagian] ?? "Analisis foto ini untuk tanda stres dan kesehatan mental.")
            . "\n\nINSTRUKSI PENTING:\n"
            . "1. Analisis foto dengan teliti, identifikasi tanda visual yang relevan.\n"
            . "2. Tentukan indikasi kondisi mental (stres kronis, anxietas, insomnia, burnout, depresi, self-neglect) dan tingkat keyakinannya.\n"
            . "3. Jika terindikasi kondisi berat (potensi bahaya diri sendiri, self-neglect ekstrem), tandai perlu_rujuk = true.\n"
            . "4. Ini adalah SKRINING AWAL berbasis tanda fisik, bukan diagnosis formal.\n\n"
            . "WAJIB JAWAB DALAM FORMAT JSON BERIKUT (tanpa markdown code block, langsung JSON):\n"
            . "{\n"
            . "  \"area\": \"{$bagian}\",\n"
            . "  \"status\": \"normal\" | \"terindikasi\",\n"
            . "  \"temuan_visual\": [\n"
            . "    {\n"
            . "      \"tanda\": \"nama tanda yang terdeteksi\",\n"
            . "      \"deskripsi\": \"apa yang terlihat pada foto\",\n"
            . "      \"area_highlight\": \"deskripsi lokasi pada foto\"\n"
            . "    }\n"
            . "  ],\n"
            . "  \"indikasi_mental\": [\n"
            . "    {\n"
            . "      \"kondisi\": \"stres kronis / anxietas / insomnia / burnout / depresi / self-neglect\",\n"
            . "      \"alasan\": \"alasan singkat berdasarkan tanda visual\",\n"
            . "      \"keyakinan\": \"rendah\" | \"sedang\" | \"tinggi\"\n"
            . "    }\n"
            . "  ],\n"
            . "  \"confidence_score\": 0.0-1.0,\n"
            . "  \"perlu_rujuk\": false,\n"
            . "  \"alasan_rujuk\": \"alasan jika perlu_rujuk true, kosong jika false\",\n"
            . "  \"penjelasan_awam\": \"penjelasan singkat 1-2 kalimat dalam bahasa sederhana\"\n"
            . "}";

        $body = [
            'contents' => [[
                'role'  => 'user',
                'parts' => [
                    ['text' => "Tolong analisis foto {$bagian} orang ini:"],
                    [
                        'inlineData' => [
                            'mimeType' => $mimeType,
                            'data'     => $base64Image,
                        ],
                    ],
                ],
            ]],
            'systemInstruction' => [
                'parts' => [['text' => $systemPrompt]],
            ],
            'generationConfig' => [
                'temperature'    => 0.05,
                'responseMimeType' => 'application/json',
            ],
        ];

        try {
            $response = $this->callWithFallback($body, 120);

            if ($response === null || $response->failed()) {
                $status = $response ? $response->status() : 500;
                Log::error('Gemini Vision error', ['status' => $status]);
                return [
                    'error'   => true,
                    'message' => 'Gagal menganalisis foto. Silakan coba lagi.',
                ];
            }

            $rawText = $response->json('candidates.0.content.parts.0.text') ?? '';
            $rawText = preg_replace('/^```(?:json)?\s*/i', '', trim($rawText));
            $rawText = preg_replace('/\s*```$/', '', $rawText);

            $parsed = json_decode($rawText, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return [
                    'area'            => $bagian,
                    'status'          => 'terindikasi',
                    'temuan_visual'   => [],
                    'indikasi_mental' => [],
                    'confidence_score'=> 0.5,
                    'perlu_rujuk'     => false,
                    'alasan_rujuk'    => '',
                    'penjelasan_awam' => $rawText,
                ];
            }

            return $parsed;
        } catch (\Exception $e) {
            Log::error('Gemini Vision Exception', ['message' => $e->getMessage()]);
            return [
                'error'   => true,
                'message' => 'Terjadi kesalahan saat menganalisis foto.',
            ];
        }
    }

    /**
     * Compare follow-up photos.
     */
    public function compareBeforeAfter(
        string $base64Before,
        string $base64After,
        string $mimeType,
        string $bagian,
        array  $previousResult = []
    ): ?array {
        if (empty($this->apiKey)) {
            return ['error' => 'GEMINI_API_KEY belum diatur.'];
        }

        $prevSummary = json_encode($previousResult, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        $systemPrompt = <<<PROMPT
Kamu adalah sistem AI klinis yang membandingkan 2 foto {$bagian} orang untuk monitoring kesehatan mental/stres: SEBELUM (skrining awal) dan SESUDAH (follow-up setelah terapi/konseling/relaksasi).

HASIL ANALISIS AWAL:
{$prevSummary}

TUGAS:
Bandingkan kedua foto dan tentukan apakah kondisi MEMBAIK (stres mereda, mata segar, kuku terawat/tidak digigit), BELUM_MEMBAIK, atau MEMBURUK.

WAJIB JAWAB DALAM FORMAT JSON (tanpa markdown code block):
{
  "status_perbandingan": "membaik" | "belum_membaik" | "memburuk",
  "perubahan_visual": [
    {
      "aspek": "aspek yang berubah (misal: tegangan otot wajah)",
      "sebelum": "kondisi di foto sebelum",
      "sesudah": "kondisi di foto sesudah",
      "arah": "membaik" | "tetap" | "memburuk"
    }
  ],
  "confidence_score": 0.0-1.0,
  "kesimpulan": "penjelasan singkat untuk pengguna",
  "rekomendasi_lanjutan": "saran tindak lanjut"
}
PROMPT;

        $body = [
            'contents' => [[
                'role'  => 'user',
                'parts' => [
                    ['text' => "Foto SEBELUM ({$bagian}):"],
                    ['inlineData' => ['mimeType' => $mimeType, 'data' => $base64Before]],
                    ['text' => "Foto SESUDAH ({$bagian}):"],
                    ['inlineData' => ['mimeType' => $mimeType, 'data' => $base64After]],
                    ['text' => 'Bandingkan kedua foto ini.'],
                ],
            ]],
            'systemInstruction' => [
                'parts' => [['text' => $systemPrompt]],
            ],
            'generationConfig' => [
                'temperature'      => 0.05,
                'responseMimeType' => 'application/json',
            ],
        ];

        try {
            $response = $this->callWithFallback($body, 120);

            if ($response === null || $response->failed()) {
                return ['error' => true, 'message' => 'Gagal membandingkan foto.'];
            }

            $rawText = $response->json('candidates.0.content.parts.0.text') ?? '';
            $rawText = preg_replace('/^```(?:json)?\s*/i', '', trim($rawText));
            $rawText = preg_replace('/\s*```$/', '', $rawText);

            $parsed = json_decode($rawText, true);
            return json_last_error() === JSON_ERROR_NONE ? $parsed : [
                'status_perbandingan' => 'belum_membaik',
                'kesimpulan'          => $rawText,
            ];
        } catch (\Exception $e) {
            Log::error('Gemini Compare exception', ['message' => $e->getMessage()]);
            return ['error' => true, 'message' => 'Terjadi kesalahan saat membandingkan foto.'];
        }
    }

    /**
     * Generate a combined/cross-correlated mental health report.
     */
    public function generateCombinedReport(
        array $hasilMuka  = [],
        array $hasilMata  = [],
        array $hasilKuku  = [],
        array $kuesioner  = []
    ): ?array {
        $dataGabungan = json_encode([
            'analisis_muka'  => $hasilMuka,
            'analisis_mata'  => $hasilMata,
            'analisis_kuku'  => $hasilKuku,
            'kuesioner'      => $kuesioner,
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        $systemPrompt = <<<PROMPT
Kamu adalah psikolog klinis, neuropsikolog, dan ahli kesehatan mental AI. Analisis hasil skrining gabungan dari 3 area tubuh (muka, mata, kuku) serta kuesioner keluhan psikologis pengguna.

DATA ANALISIS PER AREA & JAWABAN KUESIONER:
{$dataGabungan}

TUGAS UTAMA:
1. CROSS-CORRELATE: Korelasikan temuan fisik (misal: dahi keriput/otot tegang + lingkaran hitam mata + kuku digigit) dengan kuesioner stres untuk menyimpulkan kondisi kesehatan mental yang paling mungkin (stres kronis, kecemasan/anxietas, insomnia berat, burnout, depresi, atau self-neglect).
2. Berikan kesimpulan level risiko kesehatan mental secara keseluruhan.
3. Berikan rekomendasi relaksasi (mindfulness, teknik pernapasan, olahraga) dan tindakan penanganan lainnya.
4. Tentukan apakah pengguna membutuhkan rujukan medis ke psikolog/psikiater (terutama jika ada indikasi depresi berat atau risiko menyakiti diri).

WAJIB JAWAB DALAM FORMAT JSON (tanpa markdown code block, langsung JSON):
{
  "status_keseluruhan": "normal" | "terindikasi_ringan" | "terindikasi_sedang" | "terindikasi_berat",
  "level_risiko": "rendah" | "sedang" | "tinggi",
  "kondisi_mental_utama": [
    {
      "kondisi": "nama kondisi (stres kronis / anxietas / insomnia / burnout / depresi / self-neglect)",
      "keyakinan": "rendah" | "sedang" | "tinggi",
      "sumber_bukti": ["muka", "mata", "kuku", "kuesioner"],
      "penjelasan": "alasan klinis ringkas penyimpulan kondisi ini"
    }
  ],
  "korelasi_antar_area": [
    {
      "temuan": "deskripsi korelasi temuan visual",
      "area_terlibat": ["muka", "mata", "kuku"],
      "kesimpulan": "kesimpulan atas korelasi tersebut"
    }
  ],
  "rekomendasi_tindakan": [
    {
      "tindakan": "nama tindakan/aktivitas rekomendasi",
      "deskripsi": "bagaimana melakukannya",
      "frekuensi": "frekuensi pelaksanaan",
      "prioritas": "tinggi" | "sedang" | "rendah"
    }
  ],
  "rekomendasi_relaksasi": [
    {
      "metode": "nama teknik relaksasi (misal: Pernapasan Kotak 4-4-4, Meditasi Guided)",
      "alasan": "kenapa ini cocok untuk kondisi pengguna"
    }
  ],
  "perlu_rujuk_nakes": true | false,
  "alasan_rujuk": "alasan jika perlu dirujuk ke psikolog/psikiater",
  "ringkasan_pengguna": "2-3 kalimat penjelasan sederhana, menenangkan, penuh empati untuk dibaca pengguna",
  "disclaimer": "Skrining ini adalah analisis awal berbasis AI dan bukan pengganti diagnosis medis/psikologis formal. Selalu konsultasikan dengan psikolog atau psikiater berlisensi."
}
PROMPT;

        try {
            $body = [
                'contents' => [[
                    'role'  => 'user',
                    'parts' => [['text' => 'Analisis gabungan hasil skrining kesehatan mental dan berikan laporan komprehensif.']],
                ]],
                'systemInstruction' => [
                    'parts' => [['text' => $systemPrompt]],
                ],
                'generationConfig' => [
                    'temperature'      => 0.1,
                    'responseMimeType' => 'application/json',
                ],
            ];

            $response = $this->callWithFallback($body, 120);

            if ($response === null || $response->failed()) {
                return ['error' => true, 'message' => 'Gagal menghasilkan laporan gabungan.'];
            }

            $rawText = $response->json('candidates.0.content.parts.0.text') ?? '';
            $rawText = preg_replace('/^```(?:json)?\s*/i', '', trim($rawText));
            $rawText = preg_replace('/\s*```$/', '', $rawText);

            $parsed = json_decode($rawText, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return [
                    'status_keseluruhan'  => 'terindikasi_sedang',
                    'level_risiko'        => 'sedang',
                    'ringkasan_pengguna'  => $rawText,
                ];
            }

            return $parsed;
        } catch (\Exception $e) {
            Log::error('Combined report exception', ['message' => $e->getMessage()]);
            return ['error' => true, 'message' => 'Terjadi kesalahan saat menghasilkan laporan.'];
        }
    }
}
