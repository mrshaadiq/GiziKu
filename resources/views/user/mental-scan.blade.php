@extends('layouts.app')

@section('title', 'Skrining Kesehatan Mental')

@section('content')
<div x-data="mentalScanner()" class="p-6 max-w-6xl mx-auto space-y-6">

    <!-- Header Panel -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--surface)] to-[var(--bg3)] border border-[var(--border)] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="relative z-10 space-y-2">
            <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <i class="fas fa-brain text-[var(--php2)] animate-pulse"></i>
                Visual Mental Health AI Scanner
            </h1>
            <p class="text-sm text-[var(--text2)] max-w-xl">
                Skrining awal tingkat stres, insomnia, kecemasan, dan kondisi psikologis menggunakan deteksi visual kecerdasan buatan (Gemini AI) pada wajah (muka), mata, dan kuku Anda.
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

    <!-- Active Step Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Main Form/Scanner Step Box (Left Col, spans 2) -->
        <div class="lg:col-span-2 space-y-6">
            
            <!-- STEP 1: Profil Pasien -->
            <div x-show="step === 1" class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 transition-all">
                <div class="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                    <div class="w-8 h-8 rounded-lg bg-[var(--php)]/15 flex items-center justify-center text-[var(--php2)] font-bold">1</div>
                    <h2 class="text-lg font-bold text-white">Profil Pasien / Pengguna</h2>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text2)] mb-2">Nama Pasien</label>
                        <input type="text" x-model="patient.name" placeholder="Masukkan nama Anda" class="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--php)] transition-all">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text2)] mb-2">Usia (Tahun)</label>
                            <input type="number" x-model.number="patient.age" min="1" max="120" placeholder="Contoh: 25" class="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--php)] transition-all">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold uppercase tracking-wider text-[var(--text2)] mb-2">Jenis Kelamin</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" @click="patient.gender = 'L'" :class="patient.gender === 'L' ? 'bg-[var(--php)] border-[var(--php)] text-white' : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text2)]'" class="py-3 text-sm font-semibold rounded-lg border transition-all">
                                    Laki-laki
                                </button>
                                <button type="button" @click="patient.gender = 'P'" :class="patient.gender === 'P' ? 'bg-[var(--php)] border-[var(--php)] text-white' : 'bg-[var(--bg3)] border-[var(--border)] text-[var(--text2)]'" class="py-3 text-sm font-semibold rounded-lg border transition-all">
                                    Perempuan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button @click="nextStep()" :disabled="!patient.name || !patient.age" class="px-6 py-2.5 rounded-lg bg-[var(--php)] hover:bg-[var(--php2)] disabled:opacity-50 text-white text-sm font-semibold shadow-lg hover:shadow-[var(--php)]/20 transition-all">
                        Lanjut ke Kuesioner <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>

            <!-- STEP 2: Kuesioner Kesehatan Mental -->
            <div x-show="step === 2" class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 transition-all" x-cloak>
                <div class="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                    <div class="w-8 h-8 rounded-lg bg-[var(--php)]/15 flex items-center justify-center text-[var(--php2)] font-bold">2</div>
                    <h2 class="text-lg font-bold text-white">Kuesioner Indikator Psikologis</h2>
                </div>

                <!-- Questions List -->
                <div class="space-y-6">
                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-white">1. Berapa jam rata-rata Anda tidur dalam semalam akhir-akhir ini?</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <button @click="answers.sleep = 'kurang_5_jam'" :class="answers.sleep === 'kurang_5_jam' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Kurang dari 5 jam (Sangat Kurang)</button>
                            <button @click="answers.sleep = '5_6_jam'" :class="answers.sleep === '5_6_jam' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">5–6 jam (Kurang)</button>
                            <button @click="answers.sleep = '7_8_jam'" :class="answers.sleep === '7_8_jam' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">7–8 jam (Cukup / Normal)</button>
                            <button @click="answers.sleep = 'lebih_8_jam'" :class="answers.sleep === 'lebih_8_jam' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Lebih dari 8 jam</button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-white">2. Apakah Anda sering merasa cemas, gelisah, tegang, atau khawatir berlebihan?</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <button @click="answers.anxiety = 'sangat_sering'" :class="answers.anxiety === 'sangat_sering' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Sangat Sering</button>
                            <button @click="answers.anxiety = 'sering'" :class="answers.anxiety === 'sering' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Sering</button>
                            <button @click="answers.anxiety = 'jarang'" :class="answers.anxiety === 'jarang' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Jarang</button>
                            <button @click="answers.anxiety = 'tidak_pernah'" :class="answers.anxiety === 'tidak_pernah' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Tidak Pernah</button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-white">3. Seberapa sulit bagi Anda berkonsentrasi pada pekerjaan atau aktivitas harian?</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <button @click="answers.focus = 'sangat_sulit'" :class="answers.focus === 'sangat_sulit' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Sangat Sulit</button>
                            <button @click="answers.focus = 'sulit'" :class="answers.focus === 'sulit' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Sulit</button>
                            <button @click="answers.focus = 'sedang'" :class="answers.focus === 'sedang' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Sedang</button>
                            <button @click="answers.focus = 'mudah'" :class="answers.focus === 'mudah' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-left border rounded-lg hover:border-[var(--php)] transition-all">Sangat Mudah / Normal</button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-white">4. Apakah Anda kehilangan minat pada hobi atau aktivitas yang biasanya disukai?</p>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="answers.interest = 'ya'" :class="answers.interest === 'ya' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-center border rounded-lg hover:border-[var(--php)] transition-all">Ya</button>
                            <button @click="answers.interest = 'tidak'" :class="answers.interest === 'tidak' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-center border rounded-lg hover:border-[var(--php)] transition-all">Tidak</button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-white">5. Apakah Anda sering merasa sangat lelah atau kekurangan energi sepanjang hari?</p>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="answers.fatigue = 'ya'" :class="answers.fatigue === 'ya' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-center border rounded-lg hover:border-[var(--php)] transition-all">Ya</button>
                            <button @click="answers.fatigue = 'tidak'" :class="answers.fatigue === 'tidak' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-center border rounded-lg hover:border-[var(--php)] transition-all">Tidak</button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-white">6. Apakah Anda menyadari adanya kebiasaan menggigit kuku saat tertekan?</p>
                        <div class="grid grid-cols-2 gap-2">
                            <button @click="answers.nail_biting = 'ya'" :class="answers.nail_biting === 'ya' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-center border rounded-lg hover:border-[var(--php)] transition-all">Ya</button>
                            <button @click="answers.nail_biting = 'tidak'" :class="answers.nail_biting === 'tidak' ? 'border-[var(--php)] bg-[var(--php)]/10 text-white' : 'border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]'" class="p-3 text-xs text-center border rounded-lg hover:border-[var(--php)] transition-all">Tidak</button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between pt-4 border-t border-[var(--border)]">
                    <button @click="step = 1" class="px-5 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] text-white hover:bg-black/30 transition-all">
                        Kembali
                    </button>
                    <button @click="nextStep()" :disabled="!answersComplete()" class="px-6 py-2.5 rounded-lg bg-[var(--php)] hover:bg-[var(--php2)] disabled:opacity-50 text-white text-sm font-semibold shadow-lg hover:shadow-[var(--php)]/20 transition-all">
                        Lanjut ke Pengambilan Foto <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>

            <!-- STEP 3: Camera / Photo Capture -->
            <div x-show="step === 3" class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6 transition-all" x-cloak>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-[var(--php)]/15 flex items-center justify-center text-[var(--php2)] font-bold">3</div>
                        <h2 class="text-lg font-bold text-white">Ambil Foto Area Skrining</h2>
                    </div>
                    <!-- Area Selector Tabs -->
                    <div class="flex bg-[var(--bg3)] p-1 rounded-lg border border-[var(--border)]">
                        <button type="button" @click="switchScanArea('muka')" :class="currentArea === 'muka' ? 'bg-[var(--php)] text-white font-semibold' : 'text-[var(--text2)] hover:text-white'" class="px-4 py-1.5 text-xs rounded-md transition-all">
                            👤 Wajah/Muka
                        </button>
                        <button type="button" @click="switchScanArea('mata')" :class="currentArea === 'mata' ? 'bg-[var(--php)] text-white font-semibold' : 'text-[var(--text2)] hover:text-white'" class="px-4 py-1.5 text-xs rounded-md transition-all">
                            👁️ Mata
                        </button>
                        <button type="button" @click="switchScanArea('kuku')" :class="currentArea === 'kuku' ? 'bg-[var(--php)] text-white font-semibold' : 'text-[var(--text2)] hover:text-white'" class="px-4 py-1.5 text-xs rounded-md transition-all">
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

                    <!-- 3. Camera Disabled/Fallback Upload Area -->
                    <div x-show="!cameraActive && !photos[currentArea]" class="text-center p-8 flex flex-col items-center gap-4">
                        <div class="w-16 h-16 rounded-full bg-[var(--php)]/10 flex items-center justify-center text-[var(--php2)] text-2xl shadow-lg border border-[var(--php)]/20">
                            <i class="fas fa-camera"></i>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white">Kamera Belum Aktif</p>
                            <p class="text-xs text-[var(--text2)] mt-1 max-w-sm">Aktifkan kamera untuk mengambil foto secara instan, atau unggah foto yang ada.</p>
                        </div>
                        <div class="flex gap-2">
                            <button @click="startCamera()" class="px-4 py-2 bg-[var(--php)] hover:bg-[var(--php2)] text-xs font-semibold text-white rounded-lg transition-all">
                                Aktifkan Kamera
                            </button>
                            <button @click="triggerUpload()" class="px-4 py-2 border border-[var(--border)] text-xs font-semibold text-white rounded-lg hover:bg-white/5 transition-all">
                                Pilih File Foto
                            </button>
                        </div>
                    </div>
                </div>

                <input type="file" x-ref="fileInput" accept="image/*" class="hidden" @change="handleFileUpload($event)">

                <!-- Control Buttons for camera -->
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <button x-show="cameraActive" @click="stopCamera()" class="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] text-white hover:bg-black/20 transition-all">
                            Ganti Mode Upload
                        </button>
                    </div>
                    <div class="flex gap-2">
                        <button x-show="cameraActive && !photos[currentArea]" @click="capturePhoto()" class="px-6 py-2.5 bg-[var(--php)] hover:bg-[var(--php2)] text-xs font-bold text-white rounded-lg shadow-lg shadow-[var(--php)]/20 transition-all">
                            <i class="fas fa-circle mr-2"></i> Tangkap Foto
                        </button>
                        <button x-show="photos[currentArea]" @click="retakePhoto()" class="px-5 py-2.5 border border-[var(--border)] text-xs font-semibold text-white rounded-lg hover:bg-white/5 transition-all">
                            <i class="fas fa-redo mr-2"></i> Foto Ulang
                        </button>
                    </div>
                </div>

                <!-- Footer back button -->
                <div class="flex justify-between pt-4 border-t border-[var(--border)]">
                    <button @click="step = 2; stopCamera();" class="px-5 py-2 text-sm font-semibold rounded-lg border border-[var(--border)] text-white hover:bg-black/30 transition-all">
                        Kembali
                    </button>
                    <div></div>
                </div>
            </div>

            <!-- STEP 4: Loader / Submitting to AI -->
            <div x-show="step === 4" class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center flex flex-col items-center justify-center gap-6" x-cloak>
                <div class="relative">
                    <div class="w-16 h-16 rounded-full border-4 border-[var(--border)] border-t-[var(--php)] animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center text-[var(--php2)] text-xl">
                        <i class="fas fa-brain animate-pulse"></i>
                    </div>
                </div>
                <div class="space-y-2">
                    <h3 class="text-lg font-bold text-white">Menganalisis Kesehatan Mental...</h3>
                    <p class="text-xs text-[var(--text2)] max-w-sm mx-auto">
                        Gemini AI sedang memproses foto draf visual (muka, mata, kuku) dan jawaban kuesioner Anda untuk menghasilkan penilaian terintegrasi.
                    </p>
                </div>
            </div>

            <!-- RESULT DISPLAY: AI Dashboard Report -->
            <div x-show="step === 5" class="space-y-6" x-cloak>
                
                <!-- Main Report Card -->
                <div class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                        <div>
                            <span class="text-[10px] uppercase font-mono text-[var(--cyan)] font-bold tracking-widest">Laporan Skrining Kesehatan Mental</span>
                            <h2 class="text-2xl font-black text-white mt-1">Hasil Diagnostik AI</h2>
                        </div>
                        <div>
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
                        <p class="text-sm text-[var(--text2)] leading-relaxed font-light" x-text="overallReport?.ringkasan_pengguna || overallReport?.ringkasan_orang_tua || '-'"></p>
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
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        <i class="far fa-clock"></i> Frekuensi: <span x-text="rec.frekuensi"></span>
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

                    <!-- Referal Warning / Disclaimer -->
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
            
            <div class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
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

                <div class="pt-4">
                    <button @click="submitAll()" :disabled="!isReadyToAnalyze() || step >= 4" class="w-full py-3 bg-[var(--php)] disabled:opacity-50 text-white rounded-lg text-xs font-bold tracking-wider hover:bg-[var(--php2)] transition-all shadow-lg hover:shadow-[var(--php)]/15">
                        <i class="fas fa-brain mr-2 animate-bounce"></i> KIRIM ANALISIS AI GABUNGAN
                    </button>
                </div>
            </div>

            <!-- Instructions guide card -->
            <div class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
                <h3 class="text-sm font-bold text-white tracking-wide">Panduan Foto</h3>
                <ul class="space-y-3 text-xs text-[var(--text2)] list-disc pl-4 font-light leading-relaxed">
                    <li><strong>Muka:</strong> Pastikan seluruh wajah tegak menghadap kamera dengan pencahayaan terang dan ekspresi rileks.</li>
                    <li><strong>Mata:</strong> Ambil foto dekat area mata dengan kelopak mata terbuka lebar.</li>
                    <li><strong>Kuku:</strong> Ambil foto dekat ujung jari kuku tangan Anda dengan jelas.</li>
                </ul>
            </div>

        </div>

    </div>

</div>

<!-- Alpine Script definitions -->
<script>
    function mentalScanner() {
        return {
            step: 1,
            patient: {
                name: '{{ auth()->user()->name ?? "" }}',
                age: '',
                gender: 'L'
            },
            answers: {
                sleep: '',
                anxiety: '',
                focus: '',
                interest: '',
                fatigue: '',
                nail_biting: ''
            },
            currentArea: 'muka',
            photos: {
                muka: null,
                mata: null,
                kuku: null
            },
            cameraActive: false,
            stream: null,
            overallReport: null,

            nextStep() {
                if (this.step < 3) {
                    this.step++;
                }
            },

            answersComplete() {
                return this.answers.sleep && 
                       this.answers.anxiety && 
                       this.answers.focus && 
                       this.answers.interest && 
                       this.answers.fatigue && 
                       this.answers.nail_biting;
            },

            switchScanArea(area) {
                this.stopCamera();
                this.currentArea = area;
            },

            guidelineText() {
                if (this.currentArea === 'muka') return 'Posisikan wajah Anda tepat di dalam lingkaran';
                if (this.currentArea === 'mata') return 'Dekatkan kamera ke mata agar pupil & selaput terlihat jelas';
                if (this.currentArea === 'kuku') return 'Tunjukkan kuku tangan tepat di dalam area panduan';
                return '';
            },

            async startCamera() {
                try {
                    this.stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'user', width: 640, height: 480 } 
                    });
                    this.$refs.videoFeed.srcObject = this.stream;
                    this.cameraActive = true;
                } catch (err) {
                    console.error("Webcam error:", err);
                    alert("Kamera tidak dapat diakses. Anda dapat menggunakan tombol 'Pilih File Foto' untuk mengunggah file foto dari perangkat Anda.");
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

            capturePhoto() {
                const video = this.$refs.videoFeed;
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                const ctx = canvas.getContext('2d');
                
                // Mirror effect
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                this.photos[this.currentArea] = dataUrl;
                this.stopCamera();
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
                    reader.onload = (e) => {
                        this.photos[this.currentArea] = e.target.result;
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

                if (this.photos.muka && this.photos.muka.startsWith('data:')) {
                    formData.append('foto_muka', this.dataURLtoBlob(this.photos.muka), 'muka.jpg');
                }
                if (this.photos.mata && this.photos.mata.startsWith('data:')) {
                    formData.append('foto_mata', this.dataURLtoBlob(this.photos.mata), 'mata.jpg');
                }
                if (this.photos.kuku && this.photos.kuku.startsWith('data:')) {
                    formData.append('foto_kuku', this.dataURLtoBlob(this.photos.kuku), 'kuku.jpg');
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
                this.patient.age = '';
                this.patient.gender = 'L';
                this.answers = {
                    sleep: '',
                    anxiety: '',
                    focus: '',
                    interest: '',
                    fatigue: '',
                    nail_biting: ''
                };
                this.photos = {
                    muka: null,
                    mata: null,
                    kuku: null
                };
                this.overallReport = null;
            },

            getRiskClass(risk) {
                const r = String(risk).toLowerCase();
                if (r === 'rendah') return 'bg-[var(--green)]';
                if (r === 'sedang') return 'bg-[var(--yellow)] text-black';
                if (r === 'tinggi') return 'bg-[var(--red)]';
                return 'bg-[var(--text3)]';
            }
        };
    }
</script>
@endsection
