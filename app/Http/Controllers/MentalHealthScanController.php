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
        if (!auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        $history = $query->get();
        return view('user.mental-scan', compact('history'));
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
}
