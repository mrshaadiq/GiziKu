@extends('layouts.app')

@section('title', 'Register — talentgroup.id')

@section('content')

<style>
/* ================= CYBER REGISTER ================= */
.cyber-login-wrapper {
    max-width: 420px;
    margin: 80px auto;
    position: relative;
    padding: 0 16px;
}

/* Glowing orb effect behind the login card */
.cyber-login-wrapper::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%);
    z-index: -1;
    border-radius: 50%;
    filter: blur(20px);
}

.modal-tabs2 {
    display: flex; gap: 0;
    background: var(--bg3);
    border-radius: 10px; padding: 4px; margin-bottom: 28px;
}
.mtab {
    flex: 1; padding: 8px; border-radius: 7px;
    background: none; border: none; text-align: center;
    font-size: 13px; font-weight: 700; color: var(--text3);
    cursor: pointer; font-family: inherit; transition: all 0.2s;
    text-decoration: none; display: block;
}
.mtab.active {
    background: var(--surface2); color: var(--text);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.form-group { margin-bottom: 16px; }
.form-group label {
    display: block; font-size: 11.5px; font-weight: 700;
    color: var(--text2); margin-bottom: 6px; letter-spacing: 0.3px;
}
</style>

<div class="cyber-login-wrapper">

    <div class="cyber-card" style="padding: 36px;">
        
        <div class="modal-tabs2">
            <a href="{{ route('login.user') }}" class="mtab">Masuk</a>
            <a href="{{ route('register') }}" class="mtab active">Daftar Baru</a>
        </div>

        <h2 style="font-size:22px;font-weight:800;margin-bottom:6px;">Mulai Petualanganmu</h2>
        <p style="font-size:13px;color:var(--text2);margin-bottom:24px;">Bergabung dengan 10K+ pelajar lainnya sekarang.</p>

        <!-- ALERTS -->
        @if(session('success'))
            <div style="margin-bottom:24px;padding:12px;border-radius:8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:var(--green);font-size:12px;display:flex;align-items:center;gap:8px;">
                <i class="fas fa-check-circle"></i>
                <div>{{ session('success') }}</div>
            </div>
        @endif

        @if(session('error'))
            <div style="margin-bottom:24px;padding:12px;border-radius:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--red);font-size:12px;display:flex;align-items:center;gap:8px;">
                <i class="fas fa-exclamation-triangle"></i>
                <div>{{ session('error') }}</div>
            </div>
        @endif

        <!-- FORM -->
        <form action="{{ route('register') }}" method="POST">
            @csrf

            <div class="form-group">
                <label>Nama Lengkap</label>
                <input
                    type="text"
                    name="name"
                    value="{{ old('name') }}"
                    required
                    autofocus
                    placeholder="John Doe"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('name') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('name')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value="{{ old('username') }}"
                    required
                    placeholder="johndoe123"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('username') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('username')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label>Nomor Telepon</label>
                <input
                    type="text"
                    name="phone"
                    value="{{ old('phone') }}"
                    required
                    placeholder="0812xxxxxx"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('phone') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('phone')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value="{{ old('email') }}"
                    required
                    placeholder="john@example.com"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('email') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('email')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label>Metode Verifikasi</label>
                <select
                    name="verification_method"
                    required
                    class="cyber-input"
                    style="border-color: var(--border);"
                >
                    <option value="email">EMAIL (Gmail)</option>
                    <option value="whatsapp">WHATSAPP</option>
                </select>
            </div>

            <div class="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="Minimal 8 karakter"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('password') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('password')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label>Konfirmasi Password</label>
                <input
                    type="password"
                    name="password_confirmation"
                    required
                    placeholder="Minimal 8 karakter"
                    class="cyber-input"
                    style="border-color: var(--border);"
                >
            </div>

            <button type="submit" class="btn-primary" style="width:100%;padding:12px;font-size:14px;display:block;text-align:center;margin-top:8px;">
                Buat Akun Gratis
            </button>
        </form>

        <div style="text-align:center;margin-top:18px;font-size:12.5px;color:var(--text3);">
            Sudah punya akun? <a href="{{ route('login.user') }}" style="color:var(--cyan);font-weight:700;text-decoration:none;">Masuk sekarang</a>
        </div>

    </div>
</div>

@endsection
