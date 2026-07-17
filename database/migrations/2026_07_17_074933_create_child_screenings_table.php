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
        Schema::create('child_screenings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('nama_anak');
            $table->integer('usia_bulan');
            $table->string('jenis_kelamin')->default('L');
            $table->float('berat_badan');
            $table->float('tinggi_badan');
            $table->string('status_stunting');
            $table->string('status_anemia');
            $table->string('level_urgensi');
            $table->text('catatan')->nullable();
            $table->text('foto_muka')->nullable(); // base64 or path
            $table->text('foto_mata')->nullable();
            $table->text('foto_kuku')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_screenings');
    }
};
