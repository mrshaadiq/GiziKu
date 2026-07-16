@extends('layouts.app')

@section('title', 'Login — talentgroup.id')

@section('content')

<style>
/* ================= CYBER LOGIN ================= */
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
    background: radial-gradient(circle, rgba(124,92,191,0.15) 0%, transparent 70%);
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
            <a href="{{ route('login.user') }}" class="mtab active">Masuk</a>
            <a href="{{ route('register') }}" class="mtab">Daftar Baru</a>
        </div>

        <h2 style="font-size:22px;font-weight:800;margin-bottom:6px;">Selamat Datang Kembali</h2>
        <p style="font-size:13px;color:var(--text2);margin-bottom:24px;">Lanjutkan perjalanan belajarmu hari ini.</p>

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
        <form action="{{ route('login.user') }}" method="POST">
            @csrf

            <div class="form-group">
                <label>Email / Username</label>
                <input
                    type="text"
                    name="login"
                    value="{{ old('login') }}"
                    required
                    autofocus
                    placeholder="Masukkan email"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('login') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('login')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('password') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('password')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div style="text-align:right;margin-bottom:16px;">
                <a href="{{ route('forgot.password') }}" style="font-size:11.5px;color:var(--text3);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--php2)'" onmouseout="this.style.color='var(--text3)'">Lupa password?</a>
            </div>

            <button type="submit" class="btn-primary" style="width:100%;padding:12px;font-size:14px;display:block;text-align:center;">
                Masuk ke Dashboard
            </button>
        </form>

        <div style="margin-top:16px;">
            <a href="{{ route('auth.google') }}" style="width:100%;padding:12px;font-size:14px;display:flex;align-items:center;justify-content:center;gap:10px;text-align:center;text-decoration:none;border:1px solid var(--border);background:rgba(255,255,255,0.02);border-radius:8px;color:var(--text);font-weight:700;transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.06)';this.style.borderColor='var(--php)';" onmouseout="this.style.background='rgba(255,255,255,0.02)';this.style.borderColor='var(--border)';">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" style="width:18px;height:18px;" alt="Google">
                <span>Masuk dengan Google</span>
            </a>
        </div>

        <div style="text-align:center;margin-top:18px;font-size:12.5px;color:var(--text3);">
            Belum punya akun? <a href="{{ route('register') }}" style="color:var(--php2);font-weight:700;text-decoration:none;">Daftar di sini</a>
        </div>

        <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);text-align:center;">
            <a href="{{ route('login.admin') }}" style="font-size:11px;font-family:'Fira Code',monospace;color:var(--text3);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--text3)'">
                <i class="fas fa-shield-alt"></i> Admin Terminal Access
            </a>
        </div>

    </div>
</div>

@endsection
