<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mental_health_scans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pasien')->nullable();
            $table->integer('usia_pasien')->nullable(); // in years/months
            $table->date('tanggal_lahir')->nullable();
            $table->string('jenis_kelamin')->nullable(); // L/P

            // Photo paths
            $table->string('foto_muka')->nullable();
            $table->string('foto_mata')->nullable();
            $table->string('foto_kuku')->nullable();

            // AI photo analysis results
            $table->text('analisis_muka')->nullable();
            $table->text('analisis_mata')->nullable();
            $table->text('analisis_kuku')->nullable();
            
            // Deep Learning predictions per area (JSON)
            $table->json('dl_prediksi_muka')->nullable();
            $table->json('dl_prediksi_mata')->nullable();
            $table->json('dl_prediksi_kuku')->nullable();

            // Confidence scores (0.0 - 1.0)
            $table->float('dl_confidence_muka')->nullable();
            $table->float('dl_confidence_mata')->nullable();
            $table->float('dl_confidence_kuku')->nullable();

            $table->text('analisis_gabungan')->nullable();
            $table->text('analisis_gabungan_ai')->nullable();
            $table->json('highlight_areas')->nullable();

            // Mental health questionnaire answers (JSON)
            $table->json('jawaban_kuesioner')->nullable();
            $table->text('analisis_mental')->nullable();

            // Detected conditions (JSON array)
            $table->json('kondisi_terdeteksi')->nullable();

            // Final recommendation
            $table->text('rekomendasi')->nullable();

            // Risk level: rendah, sedang, tinggi
            $table->string('level_risiko')->nullable();

            // Session type for follow-up tracking
            $table->string('sesi_tipe')->default('awal'); // 'awal' | 'checkpoint_h7'

            // Self-referencing FK for before/after comparison
            $table->unsignedBigInteger('sesi_sebelumnya_id')->nullable();
            $table->foreign('sesi_sebelumnya_id')
                  ->references('id')
                  ->on('mental_health_scans')
                  ->onDelete('set null');

            // Comparison result when this is a follow-up session
            $table->string('status_perbandingan')->nullable(); // 'membaik' | 'belum_membaik' | 'memburuk' | null

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mental_health_scans');
    }
};
