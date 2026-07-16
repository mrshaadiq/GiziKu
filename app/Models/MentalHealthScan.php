<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MentalHealthScan extends Model
{
    protected $fillable = [
        'nama_pasien',
        'usia_pasien',
        'tanggal_lahir',
        'jenis_kelamin',
        'foto_muka',
        'foto_mata',
        'foto_kuku',
        'analisis_muka',
        'analisis_mata',
        'analisis_kuku',
        'analisis_gabungan',
        'analisis_gabungan_ai',
        'jawaban_kuesioner',
        'analisis_mental',
        'kondisi_terdeteksi',
        'rekomendasi',
        'level_risiko',
        // DL / Gemini structured predictions
        'dl_prediksi_muka',
        'dl_prediksi_mata',
        'dl_prediksi_kuku',
        'dl_confidence_muka',
        'dl_confidence_mata',
        'dl_confidence_kuku',
        'highlight_areas',
        // Session tracking
        'sesi_tipe',
        'sesi_sebelumnya_id',
        'status_perbandingan',
    ];

    protected $casts = [
        'jawaban_kuesioner'  => 'array',
        'kondisi_terdeteksi' => 'array',
        'dl_prediksi_muka'   => 'array',
        'dl_prediksi_mata'   => 'array',
        'dl_prediksi_kuku'   => 'array',
        'highlight_areas'    => 'array',
    ];

    /**
     * The previous screening session (for before/after comparison)
     */
    public function previousSession()
    {
        return $this->belongsTo(MentalHealthScan::class, 'sesi_sebelumnya_id');
    }

    /**
     * Follow-up screening sessions referencing this one
     */
    public function followUpSessions()
    {
        return $this->hasMany(MentalHealthScan::class, 'sesi_sebelumnya_id');
    }

    /**
     * Scope: filter by session type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('sesi_tipe', $type);
    }

    /**
     * Get overall confidence as average of non-null area confidences
     */
    public function getOverallConfidenceAttribute(): ?float
    {
        $scores = array_filter([
            $this->dl_confidence_muka,
            $this->dl_confidence_mata,
            $this->dl_confidence_kuku,
        ], fn($v) => $v !== null);

        return count($scores) > 0 ? round(array_sum($scores) / count($scores), 2) : null;
    }
}
