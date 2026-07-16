@extends('layouts/app')

@section('title', 'Bank Login')

@section('content')

<style>
/* ================= PIXEL BANK LOGIN ================= */
.pixel-login-wrapper {
    max-width: 420px;
    margin: 80px auto;
}

.pixel-login-card {
    background: var(--card);
    border: 3px solid var(--border);
    box-shadow: 6px 6px 0 var(--shadow);
    padding: 28px 26px;
}

/* HEADER */
.pixel-login-header {
    text-align: center;
    margin-bottom: 26px;
}

.pixel-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    border: 3px solid var(--accent);
    color: var(--accent);
    box-shadow: 4px 4px 0 var(--shadow);
}

.pixel-login-header h2 {
    font-size: 14px;
    color: var(--accent);
    margin-bottom: 6px;
}

.pixel-login-header p {
    font-size: 9px;
    color: var(--muted);
}

/* INPUT */
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
    color: var(--text);
    font-size: 10px;
    outline: none;
}

.pixel-input:focus {
    border-color: var(--accent);
}

/* BUTTON */
.pixel-submit {
    width: 100%;
    background: var(--accent);
    border: 3px solid var(--accent);
    color: #fff;
    padding: 12px;
    font-size: 10px;
    box-shadow: 4px 4px 0 var(--shadow);
    transition: .2s;
}

.pixel-submit:hover {
    transform: translate(-2px,-2px);
    box-shadow: 6px 6px 0 var(--shadow);
}

/* ERROR */
.pixel-error {
    background: #2a0000;
    border: 2px solid #ff4444;
    padding: 12px;
    font-size: 9px;
    color: #ffaaaa;
    margin-bottom: 16px;
}

/* INFO */
.pixel-info {
    margin-top: 20px;
    background: var(--bg);
    border: 2px dashed var(--border);
    padding: 14px;
    font-size: 9px;
    color: var(--muted);
}

.pixel-info strong {
    color: var(--accent);
}

/* BACK LINK */
.pixel-back {
    margin-top: 18px;
    text-align: center;
    font-size: 9px;
}

.pixel-back a {
    color: var(--accent);
}

/* RESPONSIVE */
@media (max-width: 480px) {
    .pixel-login-wrapper {
        margin: 40px 16px;
    }
}
</style>

<div class="pixel-login-wrapper">

    <div class="pixel-login-card">

        <!-- HEADER -->
        <div class="pixel-login-header">
            <div class="pixel-icon">
                <!-- BANK ICON -->
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                          d="M3 21h18M4 10h16M5 6l7-4 7 4M6 10v7M10 10v7M14 10v7M18 10v7"/>
                </svg>
            </div>

            <h2>BANK ACCESS</h2>
            <p>Secure Banking Management Terminal</p>
        </div>

        <!-- ERRORS -->
        @if ($errors->any())
            <div class="pixel-error">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>• {{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- FORM -->
        <form method="POST" action="{{ route('login') }}">
            @csrf

            <div class="pixel-field">
                <label>EMAIL ID</label>
                <input
                    type="email"
                    name="email"
                    value="{{ old('email') }}"
                    required
                    placeholder="bank@secure.com"
                    class="pixel-input"
                >
            </div>

            <div class="pixel-field">
                <label>PASSWORD</label>
                <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    class="pixel-input"
                >
            </div>

            <button type="submit" class="pixel-submit">
                ▶ ACCESS SYSTEM
            </button>
        </form>

        <!-- DEMO INFO -->
        <div class="pixel-info">
            <strong>DEMO ACCOUNT</strong><br><br>
            Bank Officer : bank@example.com<br>
            Bank Manager : manager@example.com<br>
            Password : password
        </div>

        <!-- BACK -->
        <div class="pixel-back">
            <a href="{{ route('login') }}">← Back to User Login</a>
        </div>

    </div>

</div>

@endsection
