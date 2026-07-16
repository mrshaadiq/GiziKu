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

        /* Main Section */
        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 40px 5%;
            gap: 45px;
            z-index: 10;
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

        /* Map Section Styles */
        .map-section {
            width: 100%;
            max-width: 1100px;
            background: var(--bg2);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 45px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            gap: 25px;
            position: relative;
        }

        .map-header {
            text-align: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 20px;
        }

        .map-header h2 {
            font-size: 22px;
            font-weight: 800;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .map-header p {
            font-size: 12px;
            color: var(--text2);
            margin-bottom: 0;
            margin-top: 5px;
        }

        .map-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 25px;
        }

        @media (min-width: 900px) {
            .map-grid {
                grid-template-columns: 1.8fr 1.2fr;
            }
        }

        /* SVG Map Container */
        .svg-map-wrapper {
            position: relative;
            background: #060a12;
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .prov-path {
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .prov-path:hover {
            fill-opacity: 0.85;
            stroke: #fff;
            stroke-width: 1.8px;
        }

        .prov-path.active {
            fill-opacity: 0.95;
            stroke: #fff;
            stroke-width: 2.2px;
        }

        /* Tooltip style */
        .map-tooltip {
            position: absolute;
            background: rgba(15,23,42,0.95);
            border: 1px solid var(--cyan);
            border-radius: 6px;
            padding: 6px 12px;
            color: #fff;
            font-size: 11px;
            pointer-events: none;
            display: none;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            font-family: inherit;
        }

        /* Detail Panel Card */
        .detail-panel {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 20px;
            min-height: 380px;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
        }

        .detail-header {
            border-bottom: 1px solid var(--border);
            padding-bottom: 14px;
        }

        .detail-prov-title {
            font-size: 20px;
            font-weight: 800;
            color: #fff;
        }

        .detail-row {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .detail-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--text2);
        }

        .detail-val {
            font-size: 13px;
            line-height: 1.5;
            color: var(--text);
            font-weight: 400;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            font-size: 10px;
            font-weight: 700;
            border-radius: 6px;
            text-transform: uppercase;
            margin-top: 5px;
            width: fit-content;
        }

        .status-high {
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .status-low {
            background: rgba(16, 185, 129, 0.15);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .stunting-percentage {
            font-size: 36px;
            font-weight: 900;
            color: var(--cyan2);
            line-height: 1;
            margin-top: 4px;
        }

        .map-legend {
            display: flex;
            gap: 20px;
            justify-content: center;
            font-size: 11px;
            flex-wrap: wrap;
            margin-top: 15px;
            width: 100%;
            border-top: 1px solid var(--border);
            padding-top: 15px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--text2);
        }

        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
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

        <!-- Interactive Map Section -->
        <div class="map-section">
            <div class="map-header">
                <h2>🗺️ Pemetaan Prevalensi Stunting & Akses Kesehatan</h2>
                <p>Klik salah satu provinsi pada peta interaktif untuk melihat analisis detail sebaran dan urgensi penanganan</p>
            </div>

            <div class="map-grid">
                <!-- Left Column: SVG Map -->
                <div class="svg-map-wrapper" id="map-container">
                    <div class="map-tooltip" id="map-tooltip"></div>
                    <svg viewBox="0 0 960 400" id="indonesia-svg" class="w-full h-auto">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <!-- Province Paths -->
                        <path class="prov-path" data-code="AC" d="M85.1,60.2 L76.1,72.6 L80.6,81.6 L79.7,82.8 L77.4,83.4 L81.8,92.8 L83.1,107.9 L75.7,105.9 L71.6,91.3 L57.3,73.5 L50.6,72.6 L31,52.1 L23.9,32.7 L32.1,30.5 L47.8,39.8 L69.9,38.9 L78,47 L79.9,54.9 L85.7,57.4 L85.7,58.9 L85.1,60.2 Z" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="0.8" />
                        <path class="prov-path" data-code="SU" d="M85.1,60.2 L83.4,64.3 L90.6,66.4 L114.8,85.1 L120,90.3 L119.6,94.6 L126.6,99.2 L125.7,114.9 L129.1,119.4 L128.2,122.9 L121.6,124.7 L123.7,138.6 L116.7,135.8 L118.2,145 L110,143.6 L103.2,150.4 L95.6,123.7 L96.6,118.3 L83.1,107.9 L81.8,92.8 L77.4,83.4 L79.7,82.8 L80.6,81.6 L76.1,72.6 L85.1,60.2 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="SB" d="M103.2,150.4 L110,143.6 L118.2,145 L116.7,135.8 L117.6,135.4 L119.1,136.1 L125.1,139.8 L125.6,148.2 L135.6,151.8 L136.7,162.6 L156.4,177.3 L153.9,188.5 L149.8,192.9 L142.5,192.9 L144.9,207.7 L143.1,208.7 L140.6,210.7 L139.8,209.6 L137.9,207.5 L137.2,198.2 L128,183.7 L126.9,175.2 L114.7,156.2 L103.2,150.4 Z" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="0.8" />
                        <path class="prov-path" data-code="RI" d="M158.3,176 L156.9,177.4 L153,176.3 L139.9,162.5 L136.9,163.1 L136.3,149.6 L132.1,151.5 L125.6,148.2 L121.1,125.3 L128.7,122 L128.4,116.3 L125.7,115.3 L126.6,99.3 L132.9,108.7 L133.4,108.3 L135.5,109.3 L135.8,104.7 L141.1,104.8 L148.2,117.8 L151.2,119.2 L155,118.6 L160.1,123.2 L163,124.9 L162.5,130.6 L163.3,130.4 L163.6,128.2 L168.2,137.5 L177.9,139.4 L182.1,144.9 L168.1,150.9 L177.2,150 L186.5,143.4 L195.1,150.5 L196.2,155.8 L189.1,156.5 L188.8,163.4 L190.9,160.4 L194.2,161.2 L195.7,163.1 L188,167.1 L189.7,172.7 L180.2,172.4 L172.8,180.5 L166.1,175.9 L158.3,176 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="JA" d="M145.9,206.2 L142.5,192.9 L149.8,192.9 L159.7,175.1 L172.8,180.5 L180.2,172.3 L189.6,172.7 L195,177.5 L208.3,180.7 L210.3,192.8 L190,196.8 L189,207.6 L185.5,203.4 L182.5,207.9 L177.6,206.8 L172,215.1 L157.4,216.2 L145.9,206.2 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="SS" d="M235.7,247 L226.8,238.4 L220.2,248.3 L206.6,253.9 L206.2,264.1 L197.3,264.8 L182.6,245 L172.7,240.3 L179.8,230.5 L171.9,229.6 L161.3,217 L165.6,213.7 L172,215.1 L177.6,206.8 L182.5,207.9 L185.5,203.4 L189,207.6 L190,196.8 L206,195 L208.4,191.7 L210.3,192.8 L210.9,193.9 L209.5,198.1 L217,200.2 L217.1,206.4 L232.3,208.7 L236.2,220.3 L240.9,222.1 L241.6,227.8 L236.3,236.6 L239.1,241.1 L235.7,247 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="BE" d="M195.5,262.1 L190.7,264.8 L178,255.3 L140.6,210.7 L145.9,206.2 L168.8,223.5 L171.9,229.6 L179.8,230.5 L172.7,240.3 L182.6,245 L195.5,262.1 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="LA" d="M195.6,262.1 L197.3,264.8 L206.2,264.1 L206.6,253.9 L220.2,248.3 L226.8,238.4 L235.8,247.1 L238,254.8 L235.5,285.3 L234.2,285.7 L232.1,285.1 L225.8,276.6 L223,284.7 L211.9,277.7 L214.4,287.4 L211.9,287.5 L192,264.9 L195.6,262.1 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="BB" d="M222.1,200.5 L229.3,190.2 L234.6,195.1 L235.1,189.6 L240.2,190.4 L245.6,208.8 L256,212.6 L251.7,220.4 L254.9,223.4 L250.4,224.7 L239.3,217.9 L234.7,202.9 L222.1,200.5 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="KR" d="M282.4,72.8 L283.8,71.5 L285.5,73.1 L279.2,66.6 L281.5,65.2 L284.4,61.5 L288.2,69.8 L285.9,74.3 L282.4,72.8 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="JK" d="M254.4,290.9 L259.4,290.9 L258.3,297 L254.4,290.9 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="JB" d="M247.9,310.7 L249.3,295.9 L258.3,297 L260.8,286.9 L266.1,287.9 L273.1,294.3 L287.2,295 L292.1,306 L296.6,305.5 L295.6,313.4 L291.1,314.9 L296.1,326.1 L285.2,329 L267.9,322.1 L250.4,320.1 L247.4,318 L250.9,310.7 L248.8,310.1 L247.9,310.7 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="JT" d="M296.6,305.5 L328.8,309.9 L334.6,298.9 L336.8,298 L338.4,297.9 L344.2,304.2 L349.9,302.6 L351.3,303.1 L353.9,305.6 L348.8,319 L342.9,317 L346.3,330 L338.1,338 L335.7,329.3 L330.9,328.8 L330,327.7 L328.9,323 L322.9,325.5 L320.9,330.9 L296.1,326.1 L291.1,314.9 L295.6,313.4 L296.6,305.5 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="YO" d="M320.2,330.8 L322.9,325.5 L328.9,323 L330,327.7 L330.9,328.8 L335.7,329.3 L336.7,337.8 L320.2,330.8 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="JI" d="M353.9,305.6 L370.9,307.8 L376.9,324.1 L383.1,327.7 L400.6,324.6 L409,329 L406.7,342.7 L411.8,350 L384.9,339.7 L373.4,343.2 L338.1,338 L346.3,330 L342.9,317 L348.8,319 L353.9,305.6 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="BT" d="M254.4,290.9 L255.3,296.9 L248.6,296.9 L250.2,305.9 L247.6,311 L239.8,307 L224.8,307.2 L227.5,303.5 L229.3,307.3 L233,299.7 L236.3,299.3 L240.4,286.4 L254.4,290.9 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="BA" d="M423.9,349.6 L421.7,351.9 L422.8,348.2 L411.5,342 L408.8,335.4 L417.1,337.7 L423.6,334.6 L434,341.2 L423.9,349.6 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="NB" d="M472.5,344.6 L476,349.5 L485.2,347.9 L473.8,338.6 L478.5,335.1 L486.1,341.6 L493.1,339.8 L493.3,344.3 L496.1,339.6 L497.9,339.6 L500.2,340.3 L503.2,348.9 L495,348.8 L499,351.3 L488.7,353.1 L488.3,347.7 L482.3,352.9 L460.3,358.1 L454.6,355.1 L455.6,346.6 L462.4,341.6 L472.5,344.6 Z" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="0.8" />
                        <path class="prov-path" data-code="NT" d="M572.4,342.3 L578,339.5 L575.7,335.8 L579.5,336.5 L576.8,346.5 L556.4,352.9 L547.7,351 L540,354.7 L536.5,351.6 L516,349.7 L518.3,343.7 L528.8,338.6 L550.1,347.1 L560.5,343.2 L564.5,347.3 L569.6,347 L572.4,342.3 Z" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="0.8" />
                        <path class="prov-path" data-code="KB" d="M404.1,124.2 L399.5,123.3 L392.7,128.5 L379.6,124.3 L380.7,120.7 L370,120.4 L364.2,123.3 L362.9,130.3 L356.4,133.6 L344.6,131.4 L331.1,136.5 L313.2,119.6 L312.5,109.7 L306.8,112.4 L298.1,129.7 L298.3,148 L305,155 L302.6,167.7 L313.1,170.5 L321.3,185.6 L318,196.2 L322.4,200.7 L325.3,221.4 L331.3,218.6 L333,223.1 L342.9,216.5 L341.8,200.4 L337.2,191.8 L351,182.4 L352.9,177.1 L364.2,169.2 L371.4,171 L384.5,166.6 L388.8,157.2 L385.5,150.2 L395.4,143 L397.8,132.3 L404.4,129.8 L404.1,124.2 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="KT" d="M435.1,184.8 L436.9,181.3 L427.9,173.8 L425.1,165.6 L426.2,156.9 L418.6,159.8 L415.9,153.7 L417.9,148.6 L422.6,147.2 L419.2,138.6 L408.2,144.5 L402.5,140.1 L396.9,140.8 L385.5,150.2 L388.8,157.2 L384.5,166.6 L371.4,171 L364.2,169.2 L337.2,191.8 L340.1,193.3 L343.4,215.2 L334.7,222 L339.7,223.7 L348.2,220.1 L351.1,222.5 L354.4,218.8 L356.8,234.2 L365.1,229.2 L371.3,232.2 L380.2,225.8 L380.6,221.7 L386.7,228.3 L391.9,225.9 L392.5,232.6 L401.1,229.1 L406.9,232.5 L411.9,218.1 L425.8,205 L429,190.2 L435.1,184.8 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="KS" d="M451.2,209 L437.2,208.6 L432.4,188.6 L435.1,184.8 L431.5,186.2 L427.6,193.8 L428.2,201.3 L411.9,218.1 L407.2,229.4 L412.3,236.7 L412.4,248 L439.4,235.7 L443.7,227.3 L441.4,225.7 L445.5,225 L441.7,222 L442.4,218.4 L445.3,222.3 L448.2,213.1 L444.9,214.1 L451.2,209 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="KI" d="M479.7,101.4 L474.8,103.6 L466.3,97.2 L454.2,101.4 L448.7,99.8 L442.6,118.6 L435.2,127.6 L425,132.3 L408.1,121.7 L403.3,124.9 L404.4,129.8 L397.8,132.3 L396.9,140.8 L402.5,140.1 L404.4,143.8 L419.6,139.1 L422.6,147.2 L417.9,148.6 L415.9,153.7 L418.6,159.8 L426.2,156.9 L424.4,162.4 L427.6,173.4 L436.9,181.3 L432.4,188.6 L437.2,208.6 L451.2,209 L451.7,203.8 L447.3,202.4 L449,195 L445,195.3 L465,175.7 L471.2,146.3 L475,138.8 L480.6,138.2 L477.8,131 L487.2,137.7 L495.9,137.7 L499.8,133.6 L474,110.3 L473.7,107.2 L481.9,105 L479.7,101.4 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="KU" d="M479.7,101.4 L475.7,94.5 L467.1,89.9 L468.9,85.3 L464.3,84.8 L468.2,80.2 L464.5,75.5 L460.3,75.7 L474.6,70.7 L468.3,66.2 L467.8,63.7 L471.7,62.7 L465,58.4 L443.4,58 L441.5,60.5 L437.6,58 L431.4,68.4 L431.3,85.5 L422.1,92.6 L421.9,97.7 L425,99.8 L414.8,106.9 L417.6,112.9 L411.8,123 L417,129.6 L427.3,131.9 L442.6,118.6 L448.7,99.8 L454.2,101.4 L466.3,97.2 L474.8,103.6 L479.7,101.4 Z" fill="#10b981" fill-opacity="0.4" stroke="#10b981" stroke-width="0.8" />
                        <path class="prov-path" data-code="SA" d="M589.3,148.2 L589.9,141.4 L582.3,134.9 L602.8,134.9 L611.7,129 L610.7,125.4 L616.6,122.9 L619.9,116.6 L624.9,122.1 L610.2,145 L589.3,148.2 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="GO" d="M563.8,132.3 L576.9,137.4 L582.3,134.9 L589.9,141.4 L589.3,148.2 L581.4,144.2 L546.9,145 L543.4,140.2 L563.8,132.3 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="ST" d="M511,174.7 L514.5,170.2 L517.6,174.7 L516.4,159.8 L512.1,155.8 L516.7,158 L515.5,151.2 L518.1,150.4 L520.3,140.8 L527,133.6 L526.6,136.6 L531.5,138.5 L536.7,126.2 L538.6,126 L539.5,125.6 L548.9,126.3 L551.2,131.8 L563.8,132.3 L545.9,137.2 L543.4,140.2 L546.9,145 L538.1,146.8 L530.6,144.1 L523.2,150.6 L520.2,159.5 L521.1,169.6 L530.1,177.8 L533.8,187.1 L542.3,187.2 L553,173.5 L559,177.7 L564,173.1 L578.3,172.6 L576.2,169.7 L582.3,168.3 L589,172.6 L587,178.6 L582,174.2 L575.8,176.7 L567.8,188.6 L557.6,192.8 L553.7,198.7 L545.9,195.5 L566.4,220.3 L566.1,221.3 L565,222.7 L569.7,226.2 L566.3,228.2 L554,212.2 L534.1,204.7 L528,197.5 L526.6,201.2 L516.8,201.1 L518.1,195.5 L508.6,185.2 L512.1,181.5 L511.4,178.3 L511,174.7 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="SR" d="M503.3,233.1 L498.1,233.9 L495.5,224.5 L497.7,219.8 L495.1,217.4 L502.9,210.4 L507.3,196.8 L506.1,183.9 L511.1,174.7 L511.6,183.5 L508.5,185.7 L513.9,187.8 L518.2,196.3 L512.3,204.6 L515.2,215.1 L509.9,216.5 L512.6,224.7 L507.9,226.5 L509.8,233 L503.3,233.1 Z" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="0.8" />
                        <path class="prov-path" data-code="SN" d="M511.8,256.8 L512.8,243.6 L509,238.1 L507.8,226.9 L512.6,224.9 L509.9,216.5 L515.2,215.2 L512.6,203.6 L519.9,199.2 L526.7,201.2 L528,197.4 L531.6,202.7 L534.1,204.7 L554.3,212.4 L556,215.8 L546.1,223.8 L542,217.2 L539.7,218.5 L539.5,218.2 L541.1,212.9 L531.3,214.9 L523.8,221.5 L528.4,228.1 L526.6,246.8 L529.2,259.1 L525.4,269.9 L529.5,280.5 L526.3,277.9 L515.7,282.3 L508.8,279.9 L507.1,273.9 L511.8,256.8 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="SG" d="M539.7,218.6 L541.6,217.3 L546.3,223.7 L555.9,215.8 L565.5,225.3 L567.8,231.2 L564.8,231.1 L563.9,235.7 L573.4,242.2 L572.9,247.3 L576.8,245.7 L578.1,252.8 L561.7,256.4 L559.8,264.3 L551.3,261.9 L549.1,259.6 L549.2,257.4 L552,245.7 L537.5,233.9 L541,226.3 L539.7,218.6 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="MA" d="M736.6,232.7 L736.6,241.7 L718.5,229.6 L709.9,229.1 L711.3,231.3 L710.6,232.6 L699.2,230.1 L697.8,226.6 L689,232.4 L683.8,223.7 L678.2,234.2 L677.3,226.4 L683.2,219.2 L700.5,217.6 L702.5,221.4 L709.4,217.3 L726.8,221.6 L736.6,232.7 Z" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="0.8" />
                        <path class="prov-path" data-code="MU" d="M674.8,137.4 L683.3,130.6 L683.2,125.3 L694.4,120.6 L693.7,131.8 L684.1,137.7 L693.8,143.4 L693.5,148 L696,148.6 L696.9,149.8 L680.8,144.9 L677.4,148.7 L679.7,161.5 L687,175.3 L673.2,160.2 L674.6,148.6 L670.5,143.3 L672.8,137 L668,131.6 L671.6,116.4 L681,106.6 L677,112.8 L680.4,117.7 L680,125.9 L672.5,134 L674.8,137.4 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />
                        <path class="prov-path" data-code="PB" d="M813.2,218.3 L804.1,230.9 L825.2,239 L817.5,250 L812.6,247.1 L813.2,244.1 L819.3,243.3 L810.1,245.4 L806.6,241.8 L805.8,245.5 L802.7,238.7 L799.2,241.4 L796.7,234.6 L796.3,238.4 L795,236.6 L793.8,237.1 L793.4,227.3 L796.7,222.6 L798.5,224.9 L796,220.1 L792.7,231.5 L787.8,229.7 L791.6,234.9 L788.2,237.6 L789.3,233.7 L784.6,235.4 L788,235.5 L787.9,238.8 L789.2,241.3 L784.7,238.7 L788.1,242.3 L779.1,246.8 L774.5,236.4 L778.8,234.5 L776.9,228.9 L773.3,229.2 L767,220.8 L759.6,220.5 L761.3,217.5 L760.8,217.1 L759,217 L763.9,214.5 L775.8,217.5 L780.8,211 L784.3,209.1 L784.2,212.2 L787.6,211.7 L784.6,216 L788.5,216.9 L788.5,211.2 L789.8,216.2 L793.3,212.3 L793,219.3 L793.8,213.7 L798.6,215.9 L796.4,209.9 L800.3,212.9 L799,201 L792.5,205.2 L793.4,202.9 L789.1,202.1 L791.1,205 L789.5,202.8 L789.7,205.1 L766.3,206.3 L760.8,201.6 L765.5,198.5 L761.7,200.5 L761.7,197.1 L766.8,195.9 L759.3,199.2 L761.5,196.6 L758.4,195.8 L761.8,195.3 L760.1,193 L763,190.5 L758.2,193.8 L759.7,187 L756.2,191.4 L754.4,184.2 L750.5,188.4 L751.4,183.1 L749,189.2 L747,184.1 L745.7,189 L738.6,187.3 L745,179.6 L744.5,173.8 L757,171.2 L768.4,163.2 L787.9,172 L799.5,171.5 L805.6,185.4 L801.3,192.7 L803.5,207.7 L809.2,219.2 L809.2,212.2 L812.6,210.5 L813.2,213.6 L813.2,218.3 Z" fill="#ef4444" fill-opacity="0.4" stroke="#ef4444" stroke-width="0.8" />
                        <path class="prov-path" data-code="PA" d="M933.7,210.6 L934.1,214 L940.1,213.4 L940,295.8 L936.7,303.9 L939.6,308.7 L940.2,333.3 L940,358.2 L919.7,337.5 L921.3,331.6 L918.5,335.7 L901.4,335.8 L898.7,340.3 L896.7,335.9 L902.3,323.7 L893.4,315.5 L908.5,316.3 L908.1,314 L913.3,317.7 L916.6,313 L913.8,317.4 L912.6,314.6 L910.1,317 L888.6,296.9 L885,286.2 L890.8,286.4 L888.1,283 L883.3,284.6 L888.5,281.3 L884.9,279.9 L885.6,275.7 L881.1,277.9 L885.7,272.6 L880.5,276.4 L882.8,270.9 L880.6,277.9 L877.5,274.7 L882.4,268.9 L874.8,275 L879.4,268.5 L874.4,272.8 L877.1,267.9 L871.4,269.1 L873.6,263.6 L869.9,269.9 L870,263.6 L868.6,269.3 L869.2,264.1 L865.8,266.8 L868.8,263.1 L865.7,267.2 L864.7,262.6 L863.6,266.9 L863,261.7 L862.2,266.1 L861.9,261.9 L859.5,265.3 L860.2,262.9 L854.9,260.8 L854.9,263.8 L841.1,257.5 L841.5,254.5 L824,254.7 L817.5,250 L825.2,239 L804.1,230.9 L813.2,218.3 L813.8,221.5 L814.8,222 L817.1,219.7 L817.2,227.8 L830,230.2 L845.3,212.5 L847.9,204.9 L865.2,202.6 L863.1,194.9 L869.5,196.4 L866.6,193.1 L876.7,188 L879.1,192.3 L882.6,192.1 L879.6,189.5 L893.1,195.3 L915,208 L933.7,210.6 Z" fill="#f59e0b" fill-opacity="0.4" stroke="#f59e0b" stroke-width="0.8" />

                        <!-- Province Labels -->
                        <text x="56.7" y="73.7" fill="rgba(255,255,255,0.7)" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">AC</text>
                        <text x="95.2" y="118.1" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">SU</text>
                        <text x="124.5" y="182.2" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">SB</text>
                        <text x="165.4" y="140.3" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">RI</text>
                        <text x="175.3" y="193.7" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">JA</text>
                        <text x="201" y="229.1" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">SS</text>
                        <text x="173" y="241.4" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">BE</text>
                        <text x="216.3" y="265.1" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">LA</text>
                        <text x="252.8" y="211.5" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">BB</text>
                        <text x="224.4" y="124.4" fill="rgba(255,255,255,0.7)" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">KR</text>
                        <text x="256.6" y="293" fill="rgba(255,255,255,0.7)" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">JK</text>
                        <text x="272.7" y="308.2" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">JB</text>
                        <text x="322.3" y="318.9" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">JT</text>
                        <text x="329" y="330.8" fill="rgba(255,255,255,0.7)" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">YO</text>
                        <text x="383.3" y="323.8" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">JI</text>
                        <text x="240" y="299.7" fill="rgba(255,255,255,0.7)" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">BT</text>
                        <text x="423.3" y="344" fill="rgba(255,255,255,0.7)" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">BA</text>
                        <text x="473.5" y="346.2" fill="rgba(255,255,255,0.7)" font-size="7" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">NB</text>
                        <text x="568.2" y="356.5" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">NT</text>
                        <text x="334.9" y="161.4" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">KB</text>
                        <text x="388.1" y="186.3" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">KT</text>
                        <text x="436" y="221.4" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">KS</text>
                        <text x="457.3" y="148.8" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">KI</text>
                        <text x="458.2" y="84.8" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">KU</text>
                        <text x="621.2" y="110" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">SA</text>
                        <text x="567.5" y="140" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">GO</text>
                        <text x="552.2" y="176" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">ST</text>
                        <text x="525.2" y="262.2" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">SN</text>
                        <text x="569.8" y="255.5" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">SG</text>
                        <text x="506.7" y="208.4" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">SR</text>
                        <text x="734.1" y="279" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">MA</text>
                        <text x="667.5" y="158.6" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">MU</text>
                        <text x="768.8" y="200.7" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">PB</text>
                        <text x="871.4" y="254.3" fill="rgba(255,255,255,0.7)" font-size="9" font-weight="600" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 0 3px #000;">PA</text>
                    </svg>

                    <!-- Map Legend -->
                    <div class="map-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #ef4444;"></div>
                            <span>Tinggi (> 30%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #f59e0b;"></div>
                            <span>Sedang (20% - 30%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #10b981;"></div>
                            <span>Rendah (≤ 20%)</span>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Detail Panel Card -->
                <div class="detail-panel">
                    <div class="detail-header">
                        <span class="detail-label" id="detail-label-title">Detail Provinsi</span>
                        <div class="detail-prov-title" id="detail-prov-name">Pilih Provinsi</div>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Prevalensi Stunting (2024)</span>
                        <div class="stunting-percentage" id="detail-stunting">-</div>
                        <span class="status-badge status-low" id="detail-status-badge" style="display: none;">-</span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Akses Fasilitas Kesehatan</span>
                        <div class="detail-val" id="detail-faskes">Silakan klik salah satu wilayah pada peta untuk melihat detail akses faskes.</div>
                    </div>

                    <div class="detail-row" style="margin-bottom: 0;">
                        <span class="detail-label">Urgensi / Prioritas Penanganan</span>
                        <div class="detail-val" id="detail-urgensi">Pilih provinsi untuk menampilkan rencana prioritas penanganan kesehatan daerah.</div>
                    </div>
                    
                    <div style="font-size: 10px; color: var(--text3); border-top: 1px solid var(--border); padding-top: 12px; margin-top: auto; font-family: 'Fira Code', monospace;" id="detail-data-source">
                        Sumber data: stunting_indonesia_final (Rilis Kemenkes 2024)
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        &copy; {{ date('Y') }} talentgroup.id. All rights reserved.
    </footer>

    <!-- Interactive Map Scripts -->
    <script>
        const provinceData = {!! json_encode($provinces) !!};

        const mapContainer = document.getElementById('map-container');
        const tooltip = document.getElementById('map-tooltip');

        // Color paths dynamically on page load based on stunting prevalence
        document.querySelectorAll('.prov-path').forEach(path => {
            const code = path.getAttribute('data-code');
            const data = provinceData[code];
            if (data) {
                const stuntingVal = parseFloat(data.stunting);
                let color = '#475569'; // Default Slate
                if (!isNaN(stuntingVal)) {
                    if (stuntingVal > 30) color = '#ef4444'; // Red
                    else if (stuntingVal > 20) color = '#f59e0b'; // Amber
                    else color = '#10b981'; // Green
                }
                path.setAttribute('fill', color);
                path.setAttribute('stroke', color);
            }
        });

        document.querySelectorAll('.prov-path').forEach(path => {
            // Hover logic
            path.addEventListener('mouseenter', function() {
                const code = this.getAttribute('data-code');
                const data = provinceData[code];
                if (data) {
                    tooltip.style.display = 'block';
                    tooltip.innerHTML = `<strong>${data.name}</strong><br>Stunting: ${data.stunting}%`;
                    this.style.fillOpacity = '0.9';
                }
            });

            path.addEventListener('mousemove', function(e) {
                const rect = mapContainer.getBoundingClientRect();
                tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
                tooltip.style.top = (e.clientY - rect.top - 15) + 'px';
            });

            path.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
                if (!this.classList.contains('active')) {
                    this.style.fillOpacity = '0.4';
                }
            });

            // Click logic
            path.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                const data = provinceData[code];
                if (data) {
                    // Update text values
                    document.getElementById('detail-prov-name').innerText = data.name;
                    document.getElementById('detail-stunting').innerText = data.stunting + '%';
                    document.getElementById('detail-faskes').innerText = data.faskes;
                    document.getElementById('detail-urgensi').innerText = data.urgency;

                    // Update data year source
                    document.getElementById('detail-data-source').innerText = `Sumber data: stunting_indonesia_final (Rilis Kemenkes ${data.year || 2024})`;

                    // Update risk category badge
                    const badge = document.getElementById('detail-status-badge');
                    badge.style.display = 'inline-block';
                    badge.innerText = data.status;
                    if (data.status.toLowerCase().includes('di bawah')) {
                        badge.className = 'status-badge status-low';
                    } else {
                        badge.className = 'status-badge status-high';
                    }

                    // Reset active states on paths
                    document.querySelectorAll('.prov-path').forEach(p => {
                        p.classList.remove('active');
                        p.style.fillOpacity = '0.4';
                    });

                    // Set active path
                    this.classList.add('active');
                    this.style.fillOpacity = '0.95';
                }
            });
        });

        // Trigger default click on Jawa Barat (JB) to populate details on load
        window.addEventListener('DOMContentLoaded', () => {
            const jbPath = document.querySelector('.prov-path[data-code="JB"]');
            if (jbPath) {
                jbPath.dispatchEvent(new Event('click'));
            }
        });
    </script>
</body>
</html>
