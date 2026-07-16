@extends('layouts.app')

@section('title', 'Verifikasi Email — talentgroup.id')

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
    background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
    z-index: -1;
    border-radius: 50%;
    filter: blur(20px);
}

.form-group { margin-bottom: 16px; }
.form-group label {
    display: block; font-size: 11.5px; font-weight: 700;
    color: var(--text2); margin-bottom: 6px; letter-spacing: 0.3px;
    text-align: center;
}
</style>

<div class="cyber-login-wrapper">

    <div class="cyber-card" style="padding: 36px; border-color: var(--green);">
        
        <div style="text-align:center; margin-bottom: 24px;">
            <div style="width:64px; height:64px; border-radius:12px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:24px; color:var(--green);">
                <i class="fas fa-envelope-open-text"></i>
            </div>
            <h2 style="font-size:22px;font-weight:800;color:var(--text);margin-bottom:6px;">VERIFIKASI EMAIL</h2>
            <p style="font-size:13px;color:var(--text2);line-height:1.6;">
                Masukkan kode 6 digit yang dikirim ke email Anda 📩
            </p>
        </div>

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
        <form action="{{ route('verify') }}" method="POST">
            @csrf

            <div class="form-group">
                <label>KODE VERIFIKASI (6 DIGIT)</label>
                <input
                    type="text"
                    name="code"
                    maxlength="6"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    autofocus
                    required
                    placeholder="••••••"
                    class="cyber-input"
                    style="border-color: {{ $errors->has('code') ? 'var(--red)' : 'var(--border)' }}; text-align:center; font-size:24px; letter-spacing:0.4em; padding:16px;"
                >
                @error('code')
                    <p style="margin-top:8px;font-size:11px;color:var(--red);text-align:center;"><i class="fas fa-times"></i> {{ $message }}</p>
                @enderror
            </div>

            <button type="submit" class="btn-primary" style="width:100%;padding:12px;font-size:14px;display:block;text-align:center;margin-top:24px;background:linear-gradient(135deg,var(--green),var(--cyan));box-shadow:0 0 16px rgba(16,185,129,0.3);">
                Verifikasi Sekarang
            </button>
        </form>

        {{-- Resend --}}
        <form action="{{ route('verify.resend') }}" method="POST" style="margin-top:16px;text-align:center;">
            @csrf
            <button type="submit" style="background:none;border:none;color:var(--text3);font-size:12px;cursor:pointer;text-decoration:none;transition:color 0.2s;" onmouseover="this.style.color='var(--green)'" onmouseout="this.style.color='var(--text3)'">
                Kirim ulang kode
            </button>
        </form>

    </div>
</div>

@endsection
