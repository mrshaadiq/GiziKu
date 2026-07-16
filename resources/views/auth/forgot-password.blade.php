@extends('layouts.app')

@section('title', 'Lupa Password — talentgroup.id')

@section('content')

<style>
/* ================= CYBER AUTH ================= */
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
    background: radial-gradient(circle, rgba(234,179,8,0.15) 0%, transparent 70%);
    z-index: -1;
    border-radius: 50%;
    filter: blur(20px);
}

.form-group { margin-bottom: 16px; }
.form-group label {
    display: block; font-size: 11.5px; font-weight: 700;
    color: var(--text2); margin-bottom: 6px; letter-spacing: 0.3px;
}
</style>

<div class="cyber-login-wrapper">

    <div class="cyber-card" style="padding: 36px; border-color: var(--yellow);">
        
        <div style="text-align:center; margin-bottom: 24px;">
            <div style="width:64px; height:64px; border-radius:12px; background:rgba(234,179,8,0.1); border:1px solid rgba(234,179,8,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:24px; color:var(--yellow);">
                <i class="fas fa-key"></i>
            </div>
            <h2 style="font-size:22px;font-weight:800;color:var(--text);margin-bottom:6px;">RESET ACCESS</h2>
            <p style="font-size:13px;color:var(--text2);line-height:1.6;">
                Masukkan nomor telepon terdaftar<br>
                untuk menerima kode pemulihan
            </p>
        </div>

        <!-- ALERTS -->
        @if(session('error'))
            <div style="margin-bottom:24px;padding:12px;border-radius:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--red);font-size:12px;display:flex;align-items:center;gap:8px;">
                <i class="fas fa-exclamation-triangle"></i>
                <div>{{ session('error') }}</div>
            </div>
        @endif

        <!-- FORM -->
        <form action="{{ route('forgot.password') }}" method="POST">
            @csrf

            <div class="form-group">
                <label>NOMOR TELEPON</label>
                <input
                    type="text"
                    name="phone"
                    value="{{ old('phone') }}"
                    placeholder="+628123456789"
                    required
                    class="cyber-input"
                    style="border-color: {{ $errors->has('phone') ? 'var(--red)' : 'var(--border)' }};"
                >
                @error('phone')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <div class="form-group">
                <label>METODE PENGIRIMAN</label>
                <select
                    name="method"
                    required
                    class="cyber-input"
                    style="border-color: {{ $errors->has('method') ? 'var(--red)' : 'var(--border)' }};"
                >
                    <option value="email">EMAIL</option>
                    <option value="whatsapp">WHATSAPP</option>
                </select>
                @error('method')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <button type="submit" class="btn-primary" style="width:100%;padding:12px;font-size:14px;display:block;text-align:center;margin-top:24px;background:linear-gradient(135deg,var(--orange),var(--yellow));box-shadow:0 0 16px rgba(234,179,8,0.3);">
                ▶ KIRIM KODE
            </button>
        </form>

        <div style="text-align:center;margin-top:24px;font-size:12px;">
            <a href="{{ route('login.user') }}" style="color:var(--text3);text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--yellow)'" onmouseout="this.style.color='var(--text3)'">
                ← Kembali ke Login
            </a>
        </div>

    </div>
</div>

@endsection
