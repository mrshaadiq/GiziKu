@extends('layouts.app')

@section('title', 'Admin Dashboard')

@section('content')
<div class="max-w-4xl mx-auto p-6">
    <div class="cyber-card p-8 mb-6" style="border-color: var(--red); position: relative;">
        <!-- Glow Effect -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 10% 10%, rgba(239,68,68,0.1), transparent 50%); pointer-events: none; border-radius: 12px;"></div>
        
        <div class="flex items-center gap-6 mb-6">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--red), var(--orange)); padding: 3px;">
                <img src="{{ auth()->user()->avatar ? asset('storage/' . auth()->user()->avatar) : 'https://www.gravatar.com/avatar/' . md5(auth()->user()->email) . '?d=mp' }}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid var(--bg);" 
                     alt="Avatar">
            </div>
            <div>
                <span class="text-[10px] uppercase font-extrabold text-[var(--red)] tracking-widest font-mono">Terminal Root Access</span>
                <h1 class="text-2xl font-extrabold text-white mt-1">{{ auth()->user()->name }} (ADMIN)</h1>
                <p class="text-xs text-[var(--text2)] font-mono mt-0.5">{{ auth()->user()->email }}</p>
            </div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 24px;" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <span class="text-[10px] uppercase font-bold text-[var(--text3)] tracking-wider block">Username</span>
                <span class="text-sm font-semibold text-white font-mono">{{ auth()->user()->username }}</span>
            </div>
            <div>
                <span class="text-[10px] uppercase font-bold text-[var(--text3)] tracking-wider block">Nomor Telepon</span>
                <span class="text-sm font-semibold text-white font-mono">{{ auth()->user()->phone }}</span>
            </div>
            <div>
                <span class="text-[10px] uppercase font-bold text-[var(--text3)] tracking-wider block">Role Privilege</span>
                <span class="text-xs font-bold font-mono px-2 py-0.5 rounded bg-red-950/50 text-[var(--red)] border border-red-500/20 inline-block mt-1">
                    {{ auth()->user()->role->display_name }}
                </span>
            </div>
            <div>
                <span class="text-[10px] uppercase font-bold text-[var(--text3)] tracking-wider block">System Access</span>
                <span class="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-[var(--green)] border border-emerald-500/20 inline-block mt-1">
                    <i class="fas fa-shield-alt"></i> Full Console Access
                </span>
            </div>
        </div>
    </div>
 
    <!-- Import Stunting Data Card -->
    <div class="cyber-card p-8 mb-6" style="border-color: var(--php); position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 90% 10%, rgba(124,92,191,0.1), transparent 50%); pointer-events: none; border-radius: 12px;"></div>
        
        <h2 class="text-lg font-extrabold text-white mb-2 font-mono">
            <i class="fas fa-file-excel text-[var(--php2)]"></i> Perbarui Data Stunting Indonesia
        </h2>
        <p class="text-xs text-[var(--text2)] mb-6">
            Unggah file spreadsheet baru berformat <strong>.xlsx</strong> atau <strong>.csv</strong> untuk memperbarui data prevalensi stunting, akses faskes, dan rencana prioritas penanganan di seluruh provinsi Indonesia secara real-time.
        </p>
 
        @if(session('success'))
            <div class="p-3 mb-4 text-xs font-mono rounded border bg-emerald-950/40 text-[var(--green)] border-emerald-500/20">
                <i class="fas fa-check-circle"></i> {{ session('success') }}
            </div>
        @endif
 
        @if(session('error'))
            <div class="p-3 mb-4 text-xs font-mono rounded border bg-red-950/40 text-[var(--red)] border-red-500/20">
                <i class="fas fa-exclamation-triangle"></i> {{ session('error') }}
            </div>
        @endif
 
        @if($errors->any())
            <div class="p-3 mb-4 text-xs font-mono rounded border bg-red-950/40 text-[var(--red)] border-red-500/20">
                <ul class="list-disc list-inside">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
 
        <form action="{{ route('admin.stunting.import') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
            @csrf
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] uppercase font-bold text-[var(--text2)] tracking-wider font-mono">Pilih File (.xlsx, .csv)</label>
                    <input type="file" name="file" required class="p-2.5 bg-[var(--bg3)] text-white text-xs border border-1 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--php)] transition-all">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] uppercase font-bold text-[var(--text2)] tracking-wider font-mono">Tahun Data</label>
                    <input type="number" name="data_year" value="{{ date('Y') }}" min="2000" max="2100" required class="p-2.5 bg-[var(--bg3)] text-white text-xs border border-1 border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--php)] transition-all font-mono">
                </div>
            </div>
 
            <div class="flex justify-end pt-2">
                <button type="submit" class="btn btn-primary text-xs py-2 px-6">
                    <i class="fas fa-cloud-upload-alt"></i> Proses & Unggah Data
                </button>
            </div>
        </form>
 
        <div style="border-top: 1px dashed var(--border); margin-top: 24px; padding-top: 16px;">
            <span class="text-[10px] uppercase font-extrabold text-[var(--text3)] tracking-widest block mb-2 font-mono">Petunjuk Format File</span>
            <ul class="text-[11px] text-[var(--text2)] space-y-1.5 list-disc list-inside">
                <li>Sistem otomatis mencocokkan kolom berdasarkan nama header (misal: <strong>Provinsi</strong>, <strong>Stunting</strong>, <strong>Fasilitas Kesehatan</strong>, <strong>Urgensi / Prioritas</strong>).</li>
                <li>Baris judul di bagian atas file akan diabaikan secara cerdas.</li>
                <li>Nama provinsi akan otomatis disinkronkan ke 34 kode wilayah geografis pada peta SVG.</li>
            </ul>
        </div>
    </div>
 
    <!-- Alert / System Welcome -->
    <div class="cyber-card p-6" style="border-color: var(--border); background: rgba(0,0,0,0.2);">
        <h3 class="text-sm font-bold text-white mb-2 font-mono"><i class="fas fa-terminal text-[var(--red)]"></i> Core System Nodes</h3>
        <p class="text-xs text-[var(--text2)] leading-relaxed">
            Anda masuk sebagai Administrator Sistem. Fitur inti autentikasi (login, register, reset password, dan OTP verifikasi) telah diaktifkan sepenuhnya. Semua sesi terminal terpantau secara aman.
        </p>
    </div>
</div>
@endsection
