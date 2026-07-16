<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>talentgroup.id — Raih Ilmu Tanpa Batas</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <style>
        :root {
            --bg: #05080f;
            --bg2: #080d18;
            --bg3: #0c1220;
            --surface: #111827;
            --surface2: #1a2436;
            --php: #7c5cbf;
            --php2: #9b78e0;
            --cyan: #06b6d4;
            --cyan2: #22d3ee;
            --text: #f1f5f9;
            --text2: #94a3b8;
            --text3: #475569;
            --border: #1e2d40;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: var(--bg);
            color: var(--text);
            overflow-x: hidden;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        /* Cyber grid background */
        .grid-bg {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(to right, rgba(30, 45, 64, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(30, 45, 64, 0.2) 1px, transparent 1px);
            background-size: 40px 40px;
            z-index: -2;
        }

        .grid-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, transparent 20%, var(--bg) 80%);
        }

        /* Glowing Orbs */
        .glow-orb {
            position: absolute;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(124,92,191,0.15) 0%, transparent 70%);
            border-radius: 50%;
            filter: blur(40px);
            z-index: -1;
        }

        .glow-1 { top: 10%; left: 10%; }
        .glow-2 { bottom: 10%; right: 10%; background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%); }

        /* Header */
        header {
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5%;
            border-bottom: 1px solid var(--border);
            background: rgba(5, 8, 15, 0.8);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .logo img {
            width: 36px;
            height: 36px;
            object-fit: contain;
            filter: drop-shadow(0 0 6px rgba(6,182,212,0.4));
        }

        .logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
        }

        .logo-title {
            font-size: 16px;
            font-weight: 900;
            color: #fff;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #fff, var(--php2));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .logo-sub {
            font-size: 8px;
            font-weight: 700;
            color: var(--cyan);
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .nav-buttons {
            display: flex;
            gap: 12px;
        }

        .btn {
            padding: 8px 20px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.25s ease;
            font-family: inherit;
        }

        .btn-ghost {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text2);
        }

        .btn-ghost:hover {
            border-color: var(--php);
            color: #fff;
            background: rgba(124, 92, 191, 0.1);
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--php), var(--php2));
            border: none;
            color: #fff;
            box-shadow: 0 0 16px rgba(124, 92, 191, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(124, 92, 191, 0.5);
        }

        /* Main Hero Section */
        main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 5%;
        }

        .hero-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            max-width: 600px;
            width: 100%;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
            position: relative;
        }

        .badge {
            background: rgba(6, 182, 212, 0.1);
            border: 1px solid rgba(6, 182, 212, 0.2);
            color: var(--cyan2);
            padding: 6px 14px;
            font-size: 11px;
            font-weight: 700;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 24px;
            text-transform: uppercase;
            font-family: 'Fira Code', monospace;
        }

        .badge-dot {
            width: 6px;
            height: 6px;
            background: var(--cyan);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }

        h1 {
            font-size: 32px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
        }

        h1 span {
            background: linear-gradient(135deg, #fff, var(--cyan2));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            font-size: 14px;
            color: var(--text2);
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .actions {
            display: flex;
            justify-content: center;
            gap: 16px;
        }

        .actions .btn {
            padding: 12px 28px;
            font-size: 14px;
        }

        /* Footer */
        footer {
            border-top: 1px solid var(--border);
            background: rgba(5, 8, 15, 0.9);
            padding: 20px 0;
            text-align: center;
            font-size: 11px;
            color: var(--text3);
            font-family: 'Fira Code', monospace;
        }
    </style>
</head>
<body>
    <div class="grid-bg"></div>
    <div class="glow-orb glow-1"></div>
    <div class="glow-orb glow-2"></div>

    <!-- Header -->
    <header>
        <a href="{{ route('home') }}" class="logo">
            <img src="{{ asset('assets/images/logo.png') }}" alt="Logo">
            <div class="logo-text">
                <span class="logo-title">talentgroup.id</span>
                <span class="logo-sub">Academy</span>
            </div>
        </a>

        <div class="nav-buttons">
            @auth
                <a href="{{ auth()->user()->isAdmin() ? route('admin.dashboard') : route('user.dashboard') }}" class="btn btn-primary">
                    <i class="fas fa-desktop"></i> Dashboard
                </a>
            @else
                <a href="{{ route('login.user') }}" class="btn btn-ghost">Masuk</a>
                <a href="{{ route('register') }}" class="btn btn-primary">Daftar</a>
            @endauth
        </div>
    </header>

    <!-- Main -->
    <main>
        <div class="hero-card">
            <div class="badge">
                <div class="badge-dot"></div>
                Secure Email Auth Active
            </div>
            
            <h1>Selamat Datang di <span>talentgroup.id</span></h1>
            <p>
                Platform pembelajaran digital interaktif. Silakan daftarkan akun baru Anda atau masuk menggunakan akun terverifikasi untuk melanjutkan ke halaman Dashboard.
            </p>

            <div class="actions">
                @auth
                    <a href="{{ auth()->user()->isAdmin() ? route('admin.dashboard') : route('user.dashboard') }}" class="btn btn-primary">
                        Masuk ke Dashboard
                    </a>
                @else
                    <a href="{{ route('login.user') }}" class="btn btn-ghost" style="flex: 1;">Masuk</a>
                    <a href="{{ route('register') }}" class="btn btn-primary" style="flex: 1;">Daftar Akun</a>
                @endauth
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        &copy; {{ date('Y') }} talentgroup.id. All rights reserved.
    </footer>
</body>
</html>
