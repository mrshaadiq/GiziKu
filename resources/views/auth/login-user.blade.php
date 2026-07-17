@extends('layouts.app')

@section('title', 'Masuk ke Dashboard')

@section('content')
<style>
.cyber-login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 160px);
    padding: 20px 0;
}
.cyber-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
    width: 100%;
    max-width: 420px;
    position: relative;
    overflow: hidden;
}
.cyber-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--php) 0%, var(--cyan) 100%);
}
.cyber-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    padding: 12px 16px;
    border-radius: 8px;
    color: var(--text);
    font-size: 13.5px;
    transition: all 0.2s ease-in-out;
    outline: none;
}
.cyber-input:focus {
    border-color: var(--php);
    box-shadow: 0 0 0 2px rgba(124, 92, 191, 0.15);
}
.btn-primary {
    background: linear-gradient(135deg, var(--php) 0%, var(--php2) 100%);
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.2s;
    box-shadow: 0 4px 12px rgba(124, 92, 191, 0.3);
}
.btn-primary:hover {
    opacity: 0.95;
}
.btn-primary:active {
    transform: scale(0.98);
}
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    color: var(--text2);
    margin-bottom: 6px;
    letter-spacing: 0.3px;
}
</style>

<div class="cyber-login-wrapper">

    <div class="cyber-card" style="padding: 36px;">

        <h2 style="font-size:22px;font-weight:800;margin-bottom:6px;">Masuk ke GiziKu</h2>
        <p style="font-size:13px;color:var(--text2);margin-bottom:24px;">Gunakan akun Anda atau masuk secara instan.</p>

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
                    placeholder="Masukkan email atau username"
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

        <div style="text-align:center;margin-top:18px;font-size:12px;color:var(--text3);line-height:1.5;">
            Belum punya akun? Masuk secara instan menggunakan tombol <strong>Google</strong> di atas untuk registrasi otomatis.
        </div>

    </div>
</div>

@endsection
