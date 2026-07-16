@extends('layouts/app')

@section('title', 'Login Admin')

@section('content')

<style>
/* ================= PIXEL ADMIN LOGIN ================= */
.pixel-admin-wrapper {
    max-width: 420px;
    margin: 80px auto;
}

.pixel-admin-card {
    background: var(--card);
    border: 3px solid var(--border);
    box-shadow: 6px 6px 0 var(--shadow);
    padding: 28px 26px;
}

/* HEADER */
.pixel-admin-header {
    text-align: center;
    margin-bottom: 22px;
}

.pixel-admin-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    border: 3px solid #ff5555;
    color: #ff5555;
    box-shadow: 4px 4px 0 var(--shadow);
}

.pixel-admin-header h2 {
    font-size: 14px;
    color: #ff5555;
    margin-bottom: 6px;
}

.pixel-admin-header p {
    font-size: 9px;
    color: var(--muted);
}

/* ALERT */
.pixel-alert {
    border: 2px solid;
    padding: 12px;
    font-size: 9px;
    margin-bottom: 16px;
}

.pixel-alert.success {
    background: #002a12;
    border-color: #22c55e;
    color: #86efac;
}

.pixel-alert.error {
    background: #2a0000;
    border-color: #ff5555;
    color: #ffb3b3;
}

/* FIELD */
.pixel-field {
    margin-bottom: 14px;
}

.pixel-field label {
    display: block;
    font-size: 9px;
    margin-bottom: 6px;
    color: var(--muted);
}

.pixel-input {
    width: 100%;
    background: var(--bg);
    border: 3px solid var(--border);
    padding: 12px;
    font-size: 10px;
    color: var(--text);
    outline: none;
}

.pixel-input:focus {
    border-color: #ff5555;
}

/* BUTTON */
.pixel-admin-btn {
    width: 100%;
    background: #ff5555;
    border: 3px solid #ff5555;
    color: #fff;
    padding: 12px;
    font-size: 10px;
    box-shadow: 4px 4px 0 var(--shadow);
    transition: .2s;
}

.pixel-admin-btn:hover {
    transform: translate(-2px,-2px);
    box-shadow: 6px 6px 0 var(--shadow);
}

/* SWITCH */
.pixel-switch {
    margin-top: 18px;
    text-align: center;
    font-size: 9px;
}

.pixel-switch a {
    color: var(--accent);
}

/* RESPONSIVE */
@media (max-width: 480px) {
    .pixel-admin-wrapper {
        margin: 40px 16px;
    }
}
</style>

<div class="pixel-admin-wrapper">

    <div class="pixel-admin-card">

        <!-- HEADER -->
        <div class="pixel-admin-header">
            <div class="pixel-admin-icon">
                <!-- SHIELD ICON -->
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
            </div>

            <h2>ADMIN ACCESS</h2>
            <p>Masuk sebagai administrator sistem</p>
        </div>

        <!-- SUCCESS -->
        @if(session('success'))
            <div class="pixel-alert success">
                {{ session('success') }}
            </div>
        @endif

        <!-- ERROR -->
        @if(session('error'))
            <div class="pixel-alert error">
                {{ session('error') }}
            </div>
        @endif

        <!-- FORM -->
        <form action="{{ route('login.admin') }}" method="POST">
            @csrf

            <div class="pixel-field">
                <label>USERNAME / EMAIL</label>
                <input
                    type="text"
                    name="login"
                    value="{{ old('login') }}"
                    required
                    autofocus
                    class="pixel-input
                        @error('login') border-red-500 @enderror"
                >
                @error('login')
                    <div class="pixel-alert error" style="margin-top:8px">
                        {{ $message }}
                    </div>
                @enderror
            </div>

            <div class="pixel-field">
                <label>PASSWORD</label>
                <input
                    type="password"
                    name="password"
                    required
                    class="pixel-input
                        @error('password') border-red-500 @enderror"
                >
                @error('password')
                    <div class="pixel-alert error" style="margin-top:8px">
                        {{ $message }}
                    </div>
                @enderror
            </div>

            <button type="submit" class="pixel-admin-btn">
                ▶ LOGIN ADMIN
            </button>
        </form>

        <!-- SWITCH -->
        <div class="pixel-switch">
            <a href="{{ route('login.user') }}">Login sebagai User</a>
        </div>

    </div>

</div>

@endsection
