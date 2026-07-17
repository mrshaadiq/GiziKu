<?php

namespace App\Http\Controllers;

use App\Models\ChildScreening;
use Illuminate\Http\Request;

class ChildScreeningController extends Controller
{
    /**
     * Get list of child screenings for logged-in user
     */
    public function listScreenings()
    {
        if (auth()->check()) {
            $records = ChildScreening::where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get();
            
            // If empty, return mock data for demo consistency
            if ($records->count() === 0) {
                return response()->json($this->getMockHistory());
            }

            return response()->json($records);
        }

        // Return mock data for guests
        return response()->json($this->getMockHistory());
    }

    /**
     * Store new screening record
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_anak' => 'required|string|max:255',
            'usia_bulan' => 'required|integer',
            'jenis_kelamin' => 'required|string|in:L,P',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'status_stunting' => 'required|string',
            'status_anemia' => 'required|string',
            'level_urgensi' => 'required|string',
            'catatan' => 'nullable|string',
            'foto_muka' => 'nullable|string',
            'foto_mata' => 'nullable|string',
            'foto_kuku' => 'nullable|string',
        ]);

        $record = ChildScreening::create([
            'user_id' => auth()->check() ? auth()->id() : null,
            'nama_anak' => $request->nama_anak,
            'usia_bulan' => $request->usia_bulan,
            'jenis_kelamin' => $request->jenis_kelamin,
            'berat_badan' => $request->berat_badan,
            'tinggi_badan' => $request->tinggi_badan,
            'status_stunting' => $request->status_stunting,
            'status_anemia' => $request->status_anemia,
            'level_urgensi' => $request->level_urgensi,
            'catatan' => $request->catatan,
            'foto_muka' => $request->foto_muka,
            'foto_mata' => $request->foto_mata,
            'foto_kuku' => $request->foto_kuku,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Riwayat pemeriksaan berhasil disimpan.',
            'record' => $record
        ]);
    }

    /**
     * Get mock data
     */
    private function getMockHistory()
    {
        return [
            [ 'id' => 1001, 'nama_anak' => 'Siti Aulia', 'usia_bulan' => 24, 'berat_badan' => 11.2, 'tinggi_badan' => 85, 'status_stunting' => 'Normal', 'status_anemia' => 'Anemia Ringan', 'tanggal' => '16 Jul 2026', 'created_at' => '2026-07-16T10:00:00Z', 'catatan' => 'Anak tampak lemas dan nafsu makan menurun. Disarankan suplemen zat besi.' ],
            [ 'id' => 1002, 'nama_anak' => 'Bima Saputra', 'usia_bulan' => 18, 'berat_badan' => 10.5, 'tinggi_badan' => 80, 'status_stunting' => 'Normal', 'status_anemia' => 'Normal', 'tanggal' => '15 Jul 2026', 'created_at' => '2026-07-15T09:00:00Z', 'catatan' => 'Tumbuh kembang sangat baik, pertahankan ASI dan MPASI seimbang.' ],
            [ 'id' => 1003, 'nama_anak' => 'Rara Putri', 'usia_bulan' => 30, 'berat_badan' => 10.8, 'tinggi_badan' => 84, 'status_stunting' => 'Stunting', 'status_anemia' => 'Anemia Berat', 'tanggal' => '14 Jul 2026', 'created_at' => '2026-07-14T08:00:00Z', 'catatan' => 'Rujukan segera ke spesialis anak di RSUD Dr. Hasan Sadikin.' ],
            [ 'id' => 1004, 'nama_anak' => 'Dafa Ramadhan', 'usia_bulan' => 12, 'berat_badan' => 9.6, 'tinggi_badan' => 74, 'status_stunting' => 'Normal', 'status_anemia' => 'Normal', 'tanggal' => '12 Jul 2026', 'created_at' => '2026-07-12T07:00:00Z', 'catatan' => 'Status gizi baik. Pastikan jadwal imunisasi dasar lengkap diikuti.' ],
            [ 'id' => 1005, 'nama_anak' => 'Naila Putri', 'usia_bulan' => 36, 'berat_badan' => 12.8, 'tinggi_badan' => 92, 'status_stunting' => 'Normal', 'status_anemia' => 'Anemia Ringan', 'tanggal' => '10 Jul 2026', 'created_at' => '2026-07-10T06:00:00Z', 'catatan' => 'Tingkatkan asupan protein hewani dan sayuran hijau seperti bayam.' ]
        ];
    }
}
