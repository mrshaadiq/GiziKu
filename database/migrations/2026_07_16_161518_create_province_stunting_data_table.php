<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function run(): void
    {
        Schema::create('province_stunting_data', function (Blueprint $table) {
            $table->id();
            $table->string('province_code', 10)->unique();
            $table->string('province_name');
            $table->string('stunting_prevalence')->nullable();
            $table->string('status')->nullable();
            $table->text('faskes_access')->nullable();
            $table->text('urgency_priority')->nullable();
            $table->integer('data_year')->default(2024);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('province_stunting_data');
    }
};
