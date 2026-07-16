@extends('layouts.app')

@section('title', 'Skrining Kesehatan Mental')

@section('content')
<div x-data="mentalScanner()" class="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

    <!-- Header Panel -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--surface)] to-[var(--bg3)] border border-[var(--border)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="relative z-10 space-y-2">
            <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <i class="fas fa-brain text-[var(--php2)] animate-pulse"></i>
                Visual Mental Health AI Scanner
            </h1>
            <p class="text-xs md:text-sm text-[var(--text2)] max-w-xl">
                Skrining awal tingkat stres, insomnia, kecemasan, dan kondisi psikologis menggunakan deteksi visual kecerdasan buatan (Gemini AI) pada wajah (muka), mata, dan kuku Anda atau anak Anda.
            </p>
        </div>
        <div class="relative z-10 flex gap-2">
            <button @click="resetScanner()" class="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] text-white bg-black/30 hover:border-[var(--php)] transition-all">
                <i class="fas fa-redo mr-2"></i> Reset Skrining
            </button>
        </div>
        <!-- Background decorative glows -->
        <div class="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[var(--php)] opacity-10 filter blur-3xl"></div>
        <div class="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[var(--cyan)] opacity-10 filter blur-3xl"></div>
    </div>

    <!-- Navigation Tabs (New Scan vs History) -->
    <div class="flex border-b border-[var(--border)] gap-2 pb-px">
        <button @click="activeTab = 'new_scan'" :class="activeTab === 'new_scan' ? 'text-white border-[var(--php)]' : 'text-[var(--text2)] border-transparent hover:text-white'" class="px-4 py-2.5 text-sm font-bold border-b-2 transition-all">
            <i class="fas fa-stethoscope mr-2"></i> Skrining Baru
        </button>
        <button @click="activeTab = 'history'" :class="activeTab === 'history' ? 'text-white border-[var(--php)]' : 'text-[var(--text2)] border-transparent hover:text-white'" class="px-4 py-2.5 text-sm font-bold border-b-2 transition-all">
            <i class="fas fa-history mr-2"></i> Riwayat Skrining (<span x-text="historyList.length"></span>)
        </button>
    </div>

    <!-- Active Tab: New Scan Flow -->
    <div x-show="activeTab === 'new_scan'" class="grid grid-cols-1 lg:grid-cols-3 gap-6" x-transition>
        
        <!-- Main Form/Scanner Step Box (Left Col, spans 2) -->
        <div class="lg:col-span-2 space-y-6">
            
            <!-- STEP 1: Profil Pasien -->
            <div x-show="step === 1" class="cyber-card space-y-6">
                <div class="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                    <div class="w-8 h-8 rounded-lg bg-[var(--php)]/15 flex items-center justify-center text-[var(--php2)] font-bold">1</div>
                    <h2 class="text-lg font-bold text-white">Profil Pasien / Pengguna</h2>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text2)] mb-2">Nama Pasien / Anak</label>
                        <input type="text" x-model="patient.name" placeholder="Masukkan nama pasien" class="cyber-input">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text2)] mb-2">Tanggal Lahir</label>
                            <input type="date" x-model="patient.birth_date" class="cyber-input" @change="calculateAge()">
                            <p x-show="patient.ageText" class="text-[11px] font-bold text-[var(--cyan2)] mt-2" x-text="'Umur saat ini: ' + patient.ageText"></p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text2)] mb-2">Jenis Kelamin</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" @click="patient.gender = 'L'" :class="patient.gender === 'L' ? 'bg-[var(--php)] border-[var(--php)] text-white' : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text2)]'" class="py-2.5 text-sm font-semibold rounded-lg border transition-all">
                                    Laki-laki
                                </button>
                                <button type="button" @click="patient.gender = 'P'" :class="patient.gender === 'P' ? 'bg-[var(--php)] border-[var(--php)] text-white' : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text2)]'" class="py-2.5 text-sm font-semibold rounded-lg border transition-all">
                                    Perempuan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button @click="nextStep()" :disabled="!patient.name || !patient.age" class="cyber-btn">
                        Lanjut ke Kuesioner <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>

            <!-- STEP 2: Kuesioner Kesehatan Mental (Dynamic by Age Group) -->
            <div x-show="step === 2" class="cyber-card space-y-6" x-cloak>
                <div class="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-[var(--php)]/15 flex items-center justify-center text-[var(--php2)] font-bold">2</div>
                        <h2 class="text-lg font-bold text-white">Kuesioner Mental (<span x-text="getAgeGroupLabel()"></span>)</h2>
                    </div>
                    <span class="text-xs text-[var(--cyan)] font-mono font-bold" x-text="'Usia: ' + patient.age + ' Tahun'"></span>
                </div>

                <!-- Questions List (Dynamic by age) -->
                <div class="space-y-6 max-h-[420px] overflow-y-auto pr-2">
                    <template x-for="(q, idx) in getQuestions()" :key="q.id">
                        <div class="space-y-3 p-3 bg-black/10 border border-[var(--border)]/40 rounded-xl">
                            <p class="text-sm font-semibold text-white">
                                <span x-text="(idx + 1) + '. '"></span x-text>
                                <span x-text="q.text"></span>
                            </p>
                            <div class="grid grid-cols-3 gap-2">
                                <button @click="answers[q.key] = 'sering'" :class="answers[q.key] === 'sering' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white font-semibold' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="py-2 text-xs rounded-lg border hover:border-[var(--php)] transition-all">
                                    Ya, sering
                                </button>
                                <button @click="answers[q.key] = 'kadang'" :class="answers[q.key] === 'kadang' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white font-semibold' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="py-2 text-xs rounded-lg border hover:border-[var(--php)] transition-all">
                                    Kadang-kadang
                                </button>
                                <button @click="answers[q.key] = 'jarang'" :class="answers[q.key] === 'jarang' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white font-semibold' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="py-2 text-xs rounded-lg border hover:border-[var(--php)] transition-all">
                                    Jarang / Tidak
                                </button>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="flex justify-between pt-4 border-t border-[var(--border)]">
                    <button @click="step = 1" class="cyber-btn outline">
                        Kembali
                    </button>
                    <button @click="nextStep()" :disabled="!answersComplete()" class="cyber-btn">
                        Lanjut ke Pengambilan Foto <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>

            <!-- STEP 3: Camera / Photo Capture with compression -->
            <div x-show="step === 3" class="cyber-card space-y-6" x-cloak>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-[var(--php)]/15 flex items-center justify-center text-[var(--php2)] font-bold">3</div>
                        <h2 class="text-lg font-bold text-white">Ambil Foto Area Skrining</h2>
                    </div>
                    <!-- Area Selector Tabs -->
                    <div class="flex bg-[var(--bg3)] p-1 rounded-lg border border-[var(--border)]">
                        <button type="button" @click="switchScanArea('muka')" :class="currentArea === 'muka' ? 'bg-[var(--php)] text-white font-semibold' : 'text-[var(--text2)] hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-all">
                            👤 Muka
                        </button>
                        <button type="button" @click="switchScanArea('mata')" :class="currentArea === 'mata' ? 'bg-[var(--php)] text-white font-semibold' : 'text-[var(--text2)] hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-all">
                            👁️ Mata
                        </button>
                        <button type="button" @click="switchScanArea('kuku')" :class="currentArea === 'kuku' ? 'bg-[var(--php)] text-white font-semibold' : 'text-[var(--text2)] hover:text-white'" class="px-3 py-1.5 text-xs rounded-md transition-all">
                            💅 Kuku
                        </button>
                    </div>
                </div>

                <!-- Camera stream viewer / image preview block -->
                <div class="relative w-full aspect-[4/3] bg-black/60 rounded-xl overflow-hidden border border-[var(--border)] flex items-center justify-center">
                    
                    <!-- 1. Video Live Feed -->
                    <video x-ref="videoFeed" autoplay playsinline muted x-show="cameraActive && !photos[currentArea]" class="w-full h-full object-cover scale-x-[-1]"></video>
                    
                    <!-- Camera Guidance Overlay -->
                    <div class="absolute inset-0 pointer-events-none flex flex-col justify-between items-center p-4 z-10" x-show="cameraActive && !photos[currentArea]">
                        <div></div>
                        <!-- Guideline Circle depending on current area -->
                        <div :class="{
                            'w-56 h-56 rounded-full border-2 border-dashed border-white/60': currentArea === 'muka' || currentArea === 'mata',
                            'w-64 h-48 rounded-xl border-2 border-dashed border-white/60': currentArea === 'kuku'
                        }" class="shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
                        <div class="bg-black/85 border border-white/10 px-4 py-2 rounded-full text-xs text-white">
                            <span x-text="guidelineText()"></span>
                        </div>
                    </div>

                    <!-- 2. Captured Image Preview -->
                    <img :src="photos[currentArea]" x-show="photos[currentArea]" class="w-full h-full object-contain">

                    <!-- Compression background overlay -->
                    <div x-show="compressing[currentArea]" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-30">
                        <div class="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--cyan)] animate-spin rounded-full"></div>
                        <span class="text-xs text-[var(--text2)] font-mono">Mengompresi ke WebP HD...</span>
                    </div>

                    <!-- 3. Camera Disabled/Fallback Upload Area -->
                    <div x-show="!cameraActive && !photos[currentArea]" class="text-center p-6 flex flex-col items-center gap-4">
                        <div class="w-14 h-14 rounded-full bg-[var(--php)]/10 flex items-center justify-center text-[var(--php2)] text-xl border border-[var(--php)]/20">
                            <i class="fas fa-camera"></i>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white">Kamera Belum Aktif</p>
                            <p class="text-xs text-[var(--text2)] mt-1 max-w-sm">Aktifkan kamera untuk foto, atau unggah file. Gambar akan dikompresi di latar belakang.</p>
                        </div>
                        <div class="flex gap-2 justify-center">
                            <button @click="startCamera()" class="px-4 py-2 bg-[var(--php)] hover:bg-[var(--php2)] text-xs font-semibold text-white rounded-lg transition-all">
                                Aktifkan Kamera
                            </button>
                            <button @click="triggerUpload()" class="px-4 py-2 border border-[var(--border)] text-xs font-semibold text-white rounded-lg hover:bg-white/5 transition-all">
                                Unggah File Foto
                            </button>
                        </div>
                    </div>
                </div>

                <input type="file" x-ref="fileInput" accept="image/*" class="hidden" @change="handleFileUpload($event)">

                <!-- Control Buttons for camera -->
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <button x-show="cameraActive" @click="stopCamera()" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] text-white hover:bg-black/20 transition-all">
                            Ganti Mode Upload
                        </button>
                    </div>
                    <div class="flex gap-2">
                        <button x-show="cameraActive && !photos[currentArea]" @click="capturePhoto()" class="px-5 py-2 bg-[var(--php)] hover:bg-[var(--php2)] text-xs font-bold text-white rounded-lg transition-all shadow-md">
                            <i class="fas fa-circle mr-2"></i> Tangkap Foto
                        </button>
                        <button x-show="photos[currentArea]" @click="retakePhoto()" class="px-5 py-2 border border-[var(--border)] text-xs font-semibold text-white rounded-lg hover:bg-white/5 transition-all">
                            <i class="fas fa-redo mr-2"></i> Foto Ulang
                        </button>
                    </div>
                </div>

                <!-- Footer back button -->
                <div class="flex justify-between pt-4 border-t border-[var(--border)]">
                    <button @click="step = 2; stopCamera();" class="cyber-btn outline">
                        Kembali
                    </button>
                    <div></div>
                </div>
            </div>

            <!-- STEP 4: Loader / Submitting to AI -->
            <div x-show="step === 4" class="cyber-card p-12 text-center flex flex-col items-center justify-center gap-6" x-cloak>
                <div class="relative">
                    <div class="w-16 h-16 rounded-full border-4 border-[var(--border)] border-t-[var(--php)] animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center text-[var(--php2)] text-xl">
                        <i class="fas fa-brain animate-pulse"></i>
                    </div>
                </div>
                <div class="space-y-2">
                    <h3 class="text-lg font-bold text-white">Menganalisis Kesehatan Mental...</h3>
                    <p class="text-xs text-[var(--text2)] max-w-sm mx-auto">
                        Gemini AI sedang menginterpretasi visual dan korelasi usia perkembangan anak (<span x-text="patient.age + ' tahun'"></span>) untuk analisis kesehatan mental.
                    </p>
                </div>
            </div>

            <!-- STEP 5: AI Report Results Display -->
            <div x-show="step === 5" class="space-y-6" x-cloak>
                
                <div class="cyber-card space-y-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                        <div>
                            <span class="text-[10px] uppercase font-mono text-[var(--cyan)] font-bold tracking-widest">Laporan Skrining Kesehatan Mental</span>
                            <h2 class="text-xl md:text-2xl font-black text-white mt-1">Hasil Diagnostik AI</h2>
                        </div>
                        <div class="flex items-center gap-2">
                            <a x-show="currentScanId" :href="'/user/mental-scan/' + currentScanId + '/pdf'" class="px-4 py-2 bg-[var(--cyan)] hover:bg-[var(--cyan2)] text-xs font-bold text-white rounded-lg transition-all flex items-center gap-2 shadow-md">
                                <i class="fas fa-file-pdf"></i> Download PDF
                            </a>
                            <span :class="getRiskClass(overallReport?.level_risiko)" class="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white">
                                Risiko: <span x-text="overallReport?.level_risiko || '-'"></span>
                            </span>
                        </div>
                    </div>

                    <!-- Clinical assessment paragraph -->
                    <div class="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-5 space-y-3">
                        <h3 class="text-sm font-bold text-white flex items-center gap-2">
                            <i class="fas fa-quote-left text-[var(--php2)]"></i> Ringkasan Hasil Analisis
                        </h3>
                        <p class="text-xs md:text-sm text-[var(--text2)] leading-relaxed font-light" x-text="overallReport?.ringkasan_pengguna || overallReport?.ringkasan_orang_tua || '-'"></p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Detected mental conditions -->
                        <div class="space-y-4">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text2)]">Kondisi Mental Terdeteksi</h3>
                            <div class="space-y-2">
                                <template x-for="item in overallReport?.kondisi_mental_utama" :key="item.kondisi">
                                    <div class="bg-black/25 border border-[var(--border)] p-3 rounded-lg flex items-start gap-3">
                                        <div class="w-2.5 h-2.5 rounded-full mt-1.5 bg-[var(--php)]"></div>
                                        <div class="flex-1 space-y-1">
                                            <div class="flex justify-between items-center">
                                                <span class="text-xs font-bold text-white capitalize" x-text="item.kondisi"></span>
                                                <span :class="item.keyakinan === 'tinggi' ? 'text-red-400' : 'text-yellow-400'" class="text-[9px] font-mono uppercase font-bold" x-text="'Keyakinan: ' + item.keyakinan"></span>
                                            </div>
                                            <p class="text-[11px] text-[var(--text2)] font-light" x-text="item.penjelasan"></p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- Physical Cross-correlations -->
                        <div class="space-y-4">
                            <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text2)]">Korelasi Indikator Fisik</h3>
                            <div class="space-y-2">
                                <template x-for="item in overallReport?.korelasi_antar_area" :key="item.temuan">
                                    <div class="bg-black/25 border border-[var(--border)] p-3 rounded-lg space-y-2">
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-bold text-white" x-text="item.temuan"></span>
                                            <div class="flex gap-1">
                                                <template x-for="area in item.area_terlibat" :key="area">
                                                    <span class="text-[8px] bg-[var(--php)]/15 border border-[var(--php)]/35 text-[var(--php2)] font-bold px-1.5 py-0.5 rounded capitalize" x-text="area"></span>
                                                </template>
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-[var(--text2)] font-light" x-text="item.kesimpulan"></p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Recommended Actions -->
                    <div class="space-y-4 border-t border-[var(--border)] pt-6">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text2)]">Rekomendasi Tindakan Mandiri</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <template x-for="rec in overallReport?.rekomendasi_tindakan" :key="rec.tindakan">
                                <div class="bg-black/10 border border-[var(--border)] p-3 rounded-xl space-y-2 flex flex-col justify-between">
                                    <div class="space-y-1">
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-bold text-white capitalize" x-text="rec.tindakan"></span>
                                            <span class="text-[8px] bg-[var(--cyan)]/15 text-[var(--cyan2)] px-1.5 py-0.5 rounded font-mono font-bold uppercase" x-text="rec.prioritas"></span>
                                        </div>
                                        <p class="text-[11px] text-[var(--text2)] font-light leading-relaxed" x-text="rec.deskripsi"></p>
                                    </div>
                                    <span class="text-[9px] text-[var(--text3)] font-mono flex items-center gap-1.5 mt-2">
                                        <i class="far fa-clock"></i> <span x-text="rec.frekuensi"></span>
                                    </span>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Relaxation Methods -->
                    <div class="space-y-4 border-t border-[var(--border)] pt-6">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text2)]">Teknik Relaksasi & Meditasi</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <template x-for="rel in overallReport?.rekomendasi_relaksasi" :key="rel.metode">
                                <div class="bg-black/15 border border-[var(--border)] p-4 rounded-xl flex gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-[var(--php)]/15 flex items-center justify-center text-[var(--php2)] shrink-0">
                                        <i class="fas fa-spa"></i>
                                    </div>
                                    <div class="space-y-1">
                                        <h4 class="text-xs font-bold text-white" x-text="rel.metode"></h4>
                                        <p class="text-[11px] text-[var(--text2)] leading-relaxed font-light" x-text="rel.alasan"></p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Professional Warning -->
                    <div x-show="overallReport?.perlu_rujuk_nakes" class="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3">
                        <div class="text-red-400 text-lg mt-0.5"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="space-y-1">
                            <h4 class="text-xs font-bold text-red-300">Peringatan: Perlu Konsultasi Profesional</h4>
                            <p class="text-[11px] text-red-200/70 leading-relaxed" x-text="overallReport?.alasan_rujuk"></p>
                        </div>
                    </div>

                    <div class="text-[10px] text-[var(--text3)] border-t border-[var(--border)] pt-4 leading-relaxed font-light">
                        <strong>Disclaimer:</strong> <span x-text="overallReport?.disclaimer"></span>
                    </div>

                </div>

            </div>

        </div>

        <!-- Sidebar Progress Card (Right Col) -->
        <div class="lg:col-span-1 space-y-6">
            
            <div class="cyber-card space-y-4">
                <h3 class="text-sm font-bold text-white tracking-wide">Status Skrining</h3>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
                        <span class="text-[var(--text2)]">1. Profil Pasien</span>
                        <span :class="step > 1 ? 'text-[var(--green)]' : 'text-red-400'" class="font-bold">
                            <i class="fas" :class="step > 1 ? 'fa-check-circle' : 'fa-times-circle'"></i>
                            <span x-text="step > 1 ? 'Lengkap' : 'Belum'"></span>
                        </span>
                    </div>
                    <div class="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
                        <span class="text-[var(--text2)]">2. Kuesioner Keluhan</span>
                        <span :class="step > 2 ? 'text-[var(--green)]' : 'text-red-400'" class="font-bold">
                            <i class="fas" :class="step > 2 ? 'fa-check-circle' : 'fa-times-circle'"></i>
                            <span x-text="step > 2 ? 'Lengkap' : 'Belum'"></span>
                        </span>
                    </div>
                    <div class="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
                        <span class="text-[var(--text2)]">3. Foto Muka/Wajah</span>
                        <span :class="photos.muka ? 'text-[var(--green)]' : 'text-red-400'" class="font-bold">
                            <i class="fas" :class="photos.muka ? 'fa-check-circle' : 'fa-times-circle'"></i>
                            <span x-text="photos.muka ? 'Siap' : 'Belum'"></span>
                        </span>
                    </div>
                    <div class="flex items-center justify-between text-xs pb-2 border-b border-[var(--border)]">
                        <span class="text-[var(--text2)]">4. Foto Mata</span>
                        <span :class="photos.mata ? 'text-[var(--green)]' : 'text-red-400'" class="font-bold">
                            <i class="fas" :class="photos.mata ? 'fa-check-circle' : 'fa-times-circle'"></i>
                            <span x-text="photos.mata ? 'Siap' : 'Belum'"></span>
                        </span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-[var(--text2)]">5. Foto Kuku</span>
                        <span :class="photos.kuku ? 'text-[var(--green)]' : 'text-red-400'" class="font-bold">
                            <i class="fas" :class="photos.kuku ? 'fa-check-circle' : 'fa-times-circle'"></i>
                            <span x-text="photos.kuku ? 'Siap' : 'Belum'"></span>
                        </span>
                    </div>
                </div>

                <div class="pt-4 border-t border-[var(--border)]">
                    <button @click="submitAll()" :disabled="!isReadyToAnalyze() || step >= 4" class="w-full py-3 bg-[var(--php)] disabled:opacity-50 text-white rounded-lg text-xs font-bold tracking-wider hover:bg-[var(--php2)] transition-all shadow-md">
                        <i class="fas fa-brain mr-2 animate-bounce"></i> KIRIM ANALISIS AI
                    </button>
                </div>
            </div>

            <!-- Instructions guide card -->
            <div class="cyber-card space-y-4">
                <h3 class="text-sm font-bold text-white tracking-wide">Panduan Foto</h3>
                <ul class="space-y-3 text-xs text-[var(--text2)] list-disc pl-4 font-light leading-relaxed">
                    <li><strong>Muka:</strong> Wajah tegak menghadap kamera, pencahayaan terang, dan ekspresi netral/rileks.</li>
                    <li><strong>Mata:</strong> Ambil foto close-up area mata, pastikan kantung mata bawah terlihat.</li>
                    <li><strong>Kuku:</strong> Ambil foto close-up ujung kuku tangan Anda dengan fokus yang tajam.</li>
                </ul>
            </div>

        </div>

    </div>

    <!-- Active Tab: Scan History List -->
    <div x-show="activeTab === 'history'" class="space-y-6" x-cloak x-transition>
        
        <!-- Detailed Report overlay if one is selected -->
        <div x-show="selectedHistoryReport" class="cyber-card space-y-6" x-transition>
            <div class="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                    <button @click="selectedHistoryReport = null" class="text-xs text-[var(--cyan)] hover:text-white transition-colors mb-2 block">
                        <i class="fas fa-arrow-left mr-1"></i> Kembali ke Daftar Riwayat
                    </button>
                    <h2 class="text-xl font-bold text-white" x-text="'Laporan Riwayat: ' + selectedHistoryReport?.nama_pasien"></h2>
                    <p class="text-[10px] text-[var(--text2)] mt-0.5" x-text="'Tanggal Skrining: ' + formatDate(selectedHistoryReport?.created_at)"></p>
                </div>
                <div class="flex items-center gap-2">
                    <a :href="'/user/mental-scan/' + selectedHistoryReport?.id + '/pdf'" class="px-4 py-2 bg-[var(--cyan)] hover:bg-[var(--cyan2)] text-xs font-bold text-white rounded-lg transition-all flex items-center gap-2 shadow-md">
                        <i class="fas fa-file-pdf"></i> Download PDF
                    </a>
                    <span :class="getRiskClass(selectedHistoryReport?.laporan_gabungan_decoded?.level_risiko || selectedHistoryReport?.level_risiko)" class="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white" x-text="'Risiko: ' + (selectedHistoryReport?.laporan_gabungan_decoded?.level_risiko || selectedHistoryReport?.level_risiko)"></span>
                </div>
            </div>

            <!-- Diagnostic summaries -->
            <div class="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-5 space-y-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                    <i class="fas fa-quote-left text-[var(--php2)]"></i> Ringkasan Hasil Analisis
                </h3>
                <p class="text-xs md:text-sm text-[var(--text2)] leading-relaxed font-light" x-text="selectedHistoryReport?.laporan_gabungan_decoded?.ringkasan_pengguna || selectedHistoryReport?.analisis_gabungan || '-'"></p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Conditions -->
                <div class="space-y-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text2)]">Kondisi Mental Terdeteksi</h3>
                    <div class="space-y-2">
                        <template x-for="item in selectedHistoryReport?.laporan_gabungan_decoded?.kondisi_mental_utama" :key="item.kondisi">
                            <div class="bg-black/25 border border-[var(--border)] p-3 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs font-bold text-white capitalize" x-text="item.kondisi"></span>
                                    <span class="text-[9px] font-mono text-[var(--cyan)] uppercase font-bold" x-text="'Keyakinan: ' + item.keyakinan"></span>
                                </div>
                                <p class="text-[11px] text-[var(--text2)] mt-1 font-light" x-text="item.penjelasan"></p>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Physical correlations -->
                <div class="space-y-3">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text2)]">Korelasi Indikator Fisik</h3>
                    <div class="space-y-2">
                        <template x-for="item in selectedHistoryReport?.laporan_gabungan_decoded?.korelasi_antar_area" :key="item.temuan">
                            <div class="bg-black/25 border border-[var(--border)] p-3 rounded-lg">
                                <span class="text-xs font-bold text-white" x-text="item.temuan"></span>
                                <p class="text-[11px] text-[var(--text2)] mt-1 font-light" x-text="item.kes помощью"></p>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="space-y-3 border-t border-[var(--border)] pt-6">
                <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--text2)]">Rekomendasi Tindakan</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <template x-for="rec in selectedHistoryReport?.laporan_gabungan_decoded?.rekomendasi_tindakan" :key="rec.tindakan">
                        <div class="bg-black/15 border border-[var(--border)] p-3 rounded-xl">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-white capitalize" x-text="rec.tindakan"></span>
                                <span class="text-[8px] bg-[var(--cyan)]/15 text-[var(--cyan2)] px-1.5 py-0.5 rounded font-mono font-bold" x-text="rec.prioritas"></span>
                            </div>
                            <p class="text-[11px] text-[var(--text2)] mt-1 font-light leading-relaxed" x-text="rec.deskripsi"></p>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- Grid of past scans -->
        <div x-show="!selectedHistoryReport" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <template x-for="item in historyList" :key="item.id">
                <div @click="viewHistoryItem(item)" class="cyber-card cursor-pointer hover:border-[var(--cyan)] transition-all flex flex-col justify-between gap-4">
                    <div>
                        <div class="flex justify-between items-start gap-2">
                            <div>
                                <h4 class="text-sm font-bold text-white" x-text="item.nama_pasien"></h4>
                                <span class="text-[10px] text-[var(--text2)] font-mono" x-text="'Usia: ' + item.usia_pasien + ' Th | ' + (item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan')"></span>
                            </div>
                            <span :class="getRiskClass(item.level_risiko)" class="px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold text-white" x-text="item.level_risiko"></span>
                        </div>
                        <p class="text-xs text-[var(--text3)] mt-3 leading-relaxed line-clamp-3 font-light" x-text="item.analisis_gabungan || '-'"></p>
                    </div>
                    <div class="flex justify-between items-center pt-3 border-t border-[var(--border)]/65">
                        <span class="text-[9px] text-[var(--text3)] font-mono" x-text="formatDate(item.created_at)"></span x-text>
                        <span class="text-[9px] text-[var(--cyan)] hover:text-white transition-all font-bold">Lihat Laporan →</span>
                    </div>
                </div>
            </template>
            
            <div x-show="historyList.length === 0" class="col-span-full text-center py-12 border border-dashed border-[var(--border)] rounded-2xl bg-black/5">
                <p class="text-xs text-[var(--text2)]">Belum ada riwayat pemeriksaan kesehatan mental.</p>
            </div>
        </div>

    </div>

</div>

<!-- Alpine Script definitions -->
<script>
    function mentalScanner() {
        return {
            activeTab: 'new_scan',
            step: 1,
            patient: {
                name: '{{ auth()->user()->name ?? "" }}',
                birth_date: '',
                age: '',
                ageText: '',
                gender: 'L'
            },
            answers: {},
            currentArea: 'muka',
            photos: {
                muka: null,
                mata: null,
                kuku: null
            },
            compressing: {
                muka: false,
                mata: false,
                kuku: false
            },
            cameraActive: false,
            stream: null,
            overallReport: null,
            currentScanId: null,
            historyList: @json($history),
            selectedHistoryReport: null,

            nextStep() {
                if (this.step < 3) {
                    this.step++;
                }
            },

            calculateAge() {
                if (!this.patient.birth_date) {
                    this.patient.age = '';
                    this.patient.ageText = '';
                    return;
                }
                const birthDate = new Date(this.patient.birth_date);
                const today = new Date();
                
                let years = today.getFullYear() - birthDate.getFullYear();
                let months = today.getMonth() - birthDate.getMonth();
                
                if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
                    years--;
                    months += 12;
                }
                
                if (today.getDate() < birthDate.getDate()) {
                    months--;
                    if (months < 0) {
                        months = 11;
                        years--;
                    }
                }
                
                if (years < 0) {
                    this.patient.age = 0;
                    this.patient.ageText = '0 Bulan';
                    return;
                }

                let ageString = '';
                if (years > 0) {
                    ageString += `${years} Tahun `;
                }
                if (months > 0 || years === 0) {
                    ageString += `${months} Bulan`;
                }
                
                this.patient.age = years;
                this.patient.ageText = ageString.trim();
                this.resetAnswers();
            },

            // Dynamic age group definitions
            getAgeGroupLabel() {
                const age = parseInt(this.patient.age) || 0;
                if (age >= 1 && age <= 3) return 'Grup Balita: 1-3 Tahun';
                if (age >= 4 && age <= 6) return 'Grup Prasekolah: 4-6 Tahun';
                if (age >= 7 && age <= 12) return 'Grup Anak Sekolah: 7-12 Tahun';
                return 'Grup Remaja & Dewasa: >13 Tahun';
            },

            getQuestions() {
                const age = parseInt(this.patient.age) || 0;
                if (age >= 1 && age <= 3) {
                    return [
                        { id: 'q1', text: 'Apakah anak sering mengalami tantrum hebat atau rewel berlebihan?', key: 'tantrum' },
                        { id: 'q2', text: 'Apakah anak menunjukkan tanda kemunduran perilaku (seperti mengompol lagi)?', key: 'regresi' },
                        { id: 'q3', text: 'Apakah anak memiliki kebiasaan mengisap jempol atau menggigit kuku?', key: 'isap_jempol' },
                        { id: 'q4', text: 'Apakah anak sulit ditenangkan saat berpisah dari orang tua?', key: 'separation' },
                        { id: 'q5', text: 'Apakah pola tidur anak tidak teratur (sulit tidur malam)?', key: 'sleep_dist' },
                        { id: 'q6', text: 'Apakah anak menolak makan secara tidak biasa (GTM berlebihan)?', key: 'eating_issue' }
                    ];
                } else if (age >= 4 && age <= 6) {
                    return [
                        { id: 'q1', text: 'Apakah anak sering mengeluh takut berlebihan (misal takut gelap/sendiri)?', key: 'fear' },
                        { id: 'q2', text: 'Apakah anak sering mengisolasi diri atau menolak bermain dengan teman?', key: 'social_withdraw' },
                        { id: 'q3', text: 'Apakah anak mengalami mimpi buruk berulang secara intens?', key: 'nightmare' },
                        { id: 'q4', text: 'Apakah anak sering menggigit kuku atau mengorek kulit saat cemas?', key: 'nail_biting' },
                        { id: 'q5', text: 'Apakah anak tampak cemas berlebihan saat ditinggal sebentar?', key: 'separation_anxiety' },
                        { id: 'q6', text: 'Apakah anak sering mengeluh sakit perut atau pusing tanpa sebab medis?', key: 'somatic' }
                    ];
                } else if (age >= 7 && age <= 12) {
                    return [
                        { id: 'q1', text: 'Apakah anak menunjukkan penurunan performa akademis atau malas sekolah mendadak?', key: 'school_issue' },
                        { id: 'q2', text: 'Apakah anak tampak mudah tersinggung, lekas marah, atau sensitif?', key: 'irritability' },
                        { id: 'q3', text: 'Apakah anak sering cemas berlebihan mengenai nilai sekolah atau ujian?', key: 'academic_stress' },
                        { id: 'q4', text: 'Apakah anak memiliki kebiasaan menggigit kuku atau mengetuk-ngetuk jari saat tegang?', key: 'nervous_habit' },
                        { id: 'q5', text: 'Apakah anak sering mengeluh lelah atau tidak bersemangat beraktivitas?', key: 'fatigue' },
                        { id: 'q6', text: 'Apakah anak mengalami kesulitan tidur atau sering terbangun malam?', key: 'insomnia' }
                    ];
                } else {
                    return [
                        { id: 'q1', text: 'Apakah Anda tampak murung, sedih, atau merasa hampa sepanjang hari?', key: 'depression' },
                        { id: 'q2', text: 'Apakah Anda menarik diri dari pergaulan teman dan keluarga secara drastis?', key: 'withdraw' },
                        { id: 'q3', text: 'Apakah ada tanda kelelahan ekstrem/burnout akibat tekanan akademis/sosial?', key: 'burnout' },
                        { id: 'q4', text: 'Apakah Anda memiliki kebiasaan menggigit kuku atau melukai diri saat tertekan?', key: 'anxiety_habit' },
                        { id: 'q5', text: 'Apakah Anda mengalami insomnia parah (sering begadang/tidur larut)?', key: 'insomnia' },
                        { id: 'q6', text: 'Apakah Anda merasa tidak peduli dengan penampilan atau kebersihan diri?', key: 'self_neglect' }
                    ];
                }
            },

            answersComplete() {
                const currentQs = this.getQuestions();
                return currentQs.every(q => this.answers[q.key]);
            },

            resetAnswers() {
                this.answers = {};
            },

            switchScanArea(area) {
                this.stopCamera();
                this.currentArea = area;
            },

            guidelineText() {
                if (this.currentArea === 'muka') return 'Posisikan wajah tepat di tengah lingkaran';
                if (this.currentArea === 'mata') return 'Dekatkan kamera ke mata untuk menganalisis konjungtiva/pupil';
                if (this.currentArea === 'kuku') return 'Posisikan jari kuku lurus di dalam area panduan';
                return '';
            },

            async startCamera() {
                try {
                    this.stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'user', width: 1280, height: 720 } 
                    });
                    this.$refs.videoFeed.srcObject = this.stream;
                    this.cameraActive = true;
                } catch (err) {
                    console.error("Webcam error:", err);
                    alert("Kamera tidak dapat diakses. Anda dapat menggunakan tombol 'Unggah File Foto' untuk mengunggah file foto.");
                    this.cameraActive = false;
                }
            },

            stopCamera() {
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                    this.stream = null;
                }
                this.cameraActive = false;
            },

            // Asynchronous GPU-accelerated client-side image compression with high-fidelity interpolation
            async compressImage(base64Str, quality = 0.85) {
                if (window.createImageBitmap) {
                    try {
                        const blob = this.dataURLtoBlob(base64Str);
                        const maxDim = 1200; // high-resolution limit for AI reading
                        
                        const tempImg = await new Promise((resolve, reject) => {
                            const img = new Image();
                            img.src = base64Str;
                            img.onload = () => resolve(img);
                            img.onerror = reject;
                        });
                        
                        let width = tempImg.width;
                        let height = tempImg.height;
                        if (width > maxDim || height > maxDim) {
                            if (width > height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }
                        
                        // Async hardware-accelerated decode & resize with high-quality interpolation to preserve fine clinical details
                        const bitmap = await createImageBitmap(blob, {
                            resizeWidth: width,
                            resizeHeight: height,
                            resizeQuality: 'high'
                        });
                        
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(bitmap, 0, 0);
                        
                        const compressedDataUrl = canvas.toDataURL('image/webp', quality);
                        return compressedDataUrl;
                    } catch (e) {
                        console.warn("createImageBitmap failed, falling back to standard canvas resize", e);
                    }
                }
                
                // Fallback for older browsers
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = base64Str;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        const maxDim = 1200;
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > maxDim || height > maxDim) {
                            if (width > height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        const compressedDataUrl = canvas.toDataURL('image/webp', quality);
                        resolve(compressedDataUrl);
                    };
                });
            },

            async capturePhoto() {
                const video = this.$refs.videoFeed;
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                const ctx = canvas.getContext('2d');
                
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const rawUrl = canvas.toDataURL('image/jpeg');
                this.stopCamera();

                this.compressing[this.currentArea] = true;
                const compressed = await this.compressImage(rawUrl);
                this.photos[this.currentArea] = compressed;
                this.compressing[this.currentArea] = false;
            },

            retakePhoto() {
                this.photos[this.currentArea] = null;
                this.startCamera();
            },

            triggerUpload() {
                this.$refs.fileInput.click();
            },

            handleFileUpload(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const rawUrl = e.target.result;
                        this.compressing[this.currentArea] = true;
                        const compressed = await this.compressImage(rawUrl);
                        this.photos[this.currentArea] = compressed;
                        this.compressing[this.currentArea] = false;
                    };
                    reader.readAsDataURL(file);
                }
            },

            isReadyToAnalyze() {
                return this.patient.name && 
                       this.patient.age && 
                       this.answersComplete() && 
                       (this.photos.muka || this.photos.mata || this.photos.kuku);
            },

            dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type:mime});
            },

            async submitAll() {
                this.step = 4;
                const formData = new FormData();
                formData.append('nama_pasien', this.patient.name);
                formData.append('usia_pasien', this.patient.age);
                formData.append('jenis_kelamin', this.patient.gender);
                formData.append('jawaban_kuesioner', JSON.stringify(this.answers));
                if (this.patient.birth_date) {
                    formData.append('tanggal_lahir', this.patient.birth_date);
                }

                if (this.photos.muka && this.photos.muka.startsWith('data:')) {
                    formData.append('foto_muka', this.dataURLtoBlob(this.photos.muka), 'muka.webp');
                }
                if (this.photos.mata && this.photos.mata.startsWith('data:')) {
                    formData.append('foto_mata', this.dataURLtoBlob(this.photos.mata), 'mata.webp');
                }
                if (this.photos.kuku && this.photos.kuku.startsWith('data:')) {
                    formData.append('foto_kuku', this.dataURLtoBlob(this.photos.kuku), 'kuku.webp');
                }

                try {
                    const response = await fetch('{{ route("api.mental-scan.full") }}', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        }
                    });

                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                        this.overallReport = data.laporan_gabungan;
                        this.step = 5;
                        
                        // Add newly created scan to history list in client memory
                        const newHistoryItem = {
                            id: data.id,
                            nama_pasien: this.patient.name,
                            usia_pasien: this.patient.age,
                            jenis_kelamin: this.patient.gender,
                            level_risiko: data.level_risiko,
                            analisis_gabungan: data.laporan_gabungan.ringkasan_pengguna || data.laporan_gabungan.ringkasan_orang_tua,
                            created_at: new Date().toISOString(),
                            laporan_gabungan_decoded: data.laporan_gabungan
                        };
                        this.historyList.unshift(newHistoryItem);
                    } else {
                        alert(data.message || "Gagal melakukan skrining AI.");
                        this.step = 3;
                    }
                } catch (err) {
                    console.error("Submission failed:", err);
                    alert("Terjadi kesalahan koneksi saat mengirim data ke AI.");
                    this.step = 3;
                }
            },

            resetScanner() {
                this.stopCamera();
                this.step = 1;
                this.patient.name = '{{ auth()->user()->name ?? "" }}';
                this.patient.birth_date = '';
                this.patient.age = '';
                this.patient.ageText = '';
                this.patient.gender = 'L';
                this.answers = {};
                this.photos = {
                    muka: null,
                    mata: null,
                    kuku: null
                };
                this.overallReport = null;
                this.selectedHistoryReport = null;
            },

            viewHistoryItem(item) {
                if (typeof item.laporan_gabungan_decoded === 'string') {
                    item.laporan_gabungan_decoded = JSON.parse(item.laporan_gabungan_decoded);
                } else if (!item.laporan_gabungan_decoded && item.analisis_gabungan_ai) {
                    item.laporan_gabungan_decoded = JSON.parse(item.analisis_gabungan_ai);
                }
                this.selectedHistoryReport = item;
            },

            getRiskClass(risk) {
                const r = String(risk).toLowerCase();
                if (r === 'rendah') return 'bg-[var(--green)]';
                if (r === 'sedang') return 'bg-[var(--yellow)] text-black';
                if (r === 'tinggi') return 'bg-[var(--red)]';
                return 'bg-[var(--text3)]';
            },

            formatDate(isoString) {
                if (!isoString) return '-';
                const date = new Date(isoString);
                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        };
    }
</script>
@endsection
