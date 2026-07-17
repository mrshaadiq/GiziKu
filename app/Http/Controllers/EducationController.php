<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    /**
     * Get all educational articles and quizzes
     */
    public function listArticles()
    {
        // Auto-seed if empty
        if (Article::count() === 0) {
            $this->seedDefaultArticles();
        }

        $records = Article::orderBy('created_at', 'desc')->get();
        foreach ($records as $record) {
            if ($record->quiz_data) {
                $record->quiz_data_decoded = json_decode($record->quiz_data, true);
            }
        }

        return response()->json($records);
    }

    /**
     * Create a new article or quiz (Admin only)
     */
    public function store(Request $request)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin privilege required.'], 403);
        }

        $request->validate([
            'judul' => 'required|string|max:255',
            'ringkasan' => 'nullable|string',
            'konten' => 'nullable|string',
            'kategori' => 'nullable|string|max:100',
            'tipe' => 'required|string|in:artikel,kuis',
            'quiz_data' => 'nullable|array'
        ]);

        $article = Article::create([
            'judul' => $request->judul,
            'ringkasan' => $request->ringkasan,
            'konten' => $request->konten,
            'kategori' => $request->kategori,
            'tipe' => $request->tipe,
            'quiz_data' => $request->quiz_data ? json_encode($request->quiz_data) : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materi edukasi berhasil ditambahkan.',
            'article' => $article
        ]);
    }

    /**
     * Update an article or quiz (Admin only)
     */
    public function update(Request $request, $id)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin privilege required.'], 403);
        }

        $article = Article::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'ringkasan' => 'nullable|string',
            'konten' => 'nullable|string',
            'kategori' => 'nullable|string|max:100',
            'tipe' => 'required|string|in:artikel,kuis',
            'quiz_data' => 'nullable|array'
        ]);

        $article->update([
            'judul' => $request->judul,
            'ringkasan' => $request->ringkasan,
            'konten' => $request->konten,
            'kategori' => $request->kategori,
            'tipe' => $request->tipe,
            'quiz_data' => $request->quiz_data ? json_encode($request->quiz_data) : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materi edukasi berhasil diperbarui.',
            'article' => $article
        ]);
    }

    /**
     * Delete an article or quiz (Admin only)
     */
    public function destroy($id)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin privilege required.'], 403);
        }

        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materi edukasi berhasil dihapus.'
        ]);
    }

    /**
     * Private helper to seed defaults
     */
    private function seedDefaultArticles()
    {
        Article::create([
            'judul' => 'Mengenal Anemia dan Stunting pada Balita',
            'ringkasan' => 'Bagaimana anemia kronis dapat memicu stunting pada tumbuh kembang anak?',
            'konten' => 'Anemia defisiensi besi pada balita menghambat pasokan oksigen ke seluruh sel tubuh, termasuk sel otak and organ pertumbuhan. Akibatnya, anak sering lemas, nafsu makan menurun drastis, dan rentan infeksi. Jika dibiarkan dalam jangka panjang, kondisi ini mengganggu hormon pertumbuhan dan memicu stunting (anak lebih pendek dari usianya). Deteksi dini melalui rona kuku, kelopak mata, dan pengukuran tinggi badan sangat penting.',
            'kategori' => 'Gizi & Tumbuh Kembang',
            'tipe' => 'artikel',
        ]);

        Article::create([
            'judul' => 'Pola Makan Sehat Pencegah Kurang Gizi',
            'ringkasan' => 'Asupan nutrisi esensial bagi tumbuh kembang emas anak.',
            'konten' => 'Masa 1000 Hari Pertama Kehidupan (HPK) adalah masa emas pertumbuhan anak. Berikan ASI eksklusif selama 6 bulan pertama, dilanjutkan MPASI kaya zat besi, asam folat, zinc, dan protein hewani (telur, ikan, daging). Hindari pemberian makanan manis berlebihan yang dapat menurunkan nafsu makan anak terhadap makanan bergizi seimbang.',
            'kategori' => 'Nutrisi Anak',
            'tipe' => 'artikel',
        ]);

        Article::create([
            'judul' => 'Kuis Edukasi Kesehatan Anak NURA',
            'ringkasan' => 'Evaluasi pemahaman Anda seputar stunting, anemia, dan nutrisi si kecil.',
            'tipe' => 'kuis',
            'quiz_data' => json_encode([
                [ 'question' => 'Apa dampak utama anemia defisiensi besi kronis pada anak?', 'options' => ['Gigi cepat tumbuh', 'Menurunkan kecerdasan dan memicu stunting', 'Tidak berdampak serius'], 'correct' => 1 ],
                [ 'question' => 'Bahan makanan apa yang paling tinggi kandungan zat besi hewani untuk balita?', 'options' => ['Sayur bayam rebus', 'Hati ayam dan daging sapi', 'Nasi putih hangat'], 'correct' => 1 ],
                [ 'question' => 'Berapa lama periode emas 1000 Hari Pertama Kehidupan (HPK) dihitung?', 'options' => ['Sejak konsepsi di rahim hingga anak usia 2 tahun', 'Sejak bayi lahir hingga usia 1 tahun', 'Usia 2 hingga 5 tahun'], 'correct' => 0 ]
            ])
        ]);
    }
}
