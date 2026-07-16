@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="max-w-4xl mx-auto p-6">
    <div class="cyber-card p-8 mb-6" style="border-color: var(--cyan); position: relative;">
        <!-- Glow Effect -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 10% 10%, rgba(6,182,212,0.1), transparent 50%); pointer-events: none; border-radius: 12px;"></div>
        
        <div class="flex items-center gap-6 mb-6">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--cyan), var(--php2)); padding: 3px;">
                <img src="{{ auth()->user()->avatar ? asset('storage/' . auth()->user()->avatar) : 'https://www.gravatar.com/avatar/' . md5(auth()->user()->email) . '?d=mp' }}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid var(--bg);" 
                     alt="Avatar">
            </div>
            <div>
                <span class="text-[10px] uppercase font-extrabold text-[var(--cyan)] tracking-widest font-mono">User Node Active</span>
                <h1 class="text-2xl font-extrabold text-white mt-1">{{ auth()->user()->name }}</h1>
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
                <span class="text-[10px] uppercase font-bold text-[var(--text3)] tracking-wider block">Role</span>
                <span class="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[var(--surface2)] text-[var(--cyan2)] border border-[var(--border)] inline-block mt-1">
                    {{ auth()->user()->role->display_name }}
                </span>
            </div>
            <div>
                <span class="text-[10px] uppercase font-bold text-[var(--text3)] tracking-wider block">Status Email</span>
                <span class="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-[var(--green)] border border-emerald-500/20 inline-block mt-1">
                    <i class="fas fa-check-circle"></i> Terverifikasi pada {{ auth()->user()->email_verified_at->format('d M Y H:i') }}
                </span>
            </div>
        </div>
    </div>

    <!-- Alert / System Welcome -->
    <div class="cyber-card p-6" style="border-color: var(--border); background: rgba(0,0,0,0.2);">
        <h3 class="text-sm font-bold text-white mb-2 font-mono"><i class="fas fa-info-circle text-[var(--cyan)]"></i> System Notice</h3>
        <p class="text-xs text-[var(--text2)] leading-relaxed">
            Selamat datang di talentgroup.id Academy. Sesi login Anda aman dan terenkripsi menggunakan sistem OTP email. Jika Anda ingin keluar, silakan gunakan tombol Power di pojok kiri bawah.
        </p>
    </div>
</div>
@endsection
