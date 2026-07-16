<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'talentgroup.id')</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/images/logo.png') }}">
    
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
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
            --orange: #f97316;
            --orange2: #fb923c;
            --green: #10b981;
            --pink: #ec4899;
            --yellow: #eab308;
            --red: #ef4444;
            --text: #f1f5f9;
            --text2: #94a3b8;
            --text3: #475569;
            --border: #1e2d40;
            --glow-php: 0 0 40px rgba(124,92,191,0.3);
            --glow-cyan: 0 0 40px rgba(6,182,212,0.25);
            --accent: var(--php);
            --accent2: var(--cyan);
            --panel: var(--surface);
            --sidebar-width: 280px;
            --topbar-height: 64px;
        }

        body.light {
            --bg: #f8fafc;
            --bg2: #ffffff;
            --bg3: #f1f5f9;
            --surface: #ffffff;
            --surface2: #f8fafc;
            --text: #1f2a44;
            --text2: #4a5b78;
            --text3: #94a3b8;
            --border: #cbd5e1;
            --php: #0056d2;
            --php2: #1e70eb;
            --cyan: #0073e6;
            --cyan2: #3399ff;
            --accent: var(--php);
            --accent2: var(--cyan);
        }

        body.light .topbar-header {
            background: rgba(255, 255, 255, 0.85) !important;
            border-bottom: 1px solid var(--border) !important;
        }

        body.light .sidebar-container .bg-black\/20 {
            background: rgba(15, 23, 42, 0.04) !important;
            border-color: #cbd5e1 !important;
        }

        body.light .sidebar-container .text-white {
            color: #1f2a44 !important;
        }

        body.light .sidebar-container .border-white\/10 {
            border-color: #cbd5e1 !important;
        }

        body.light .cyber-card:hover {
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06), 0 0 0 1px var(--php) !important;
        }

        body.light .bg-black\/60,
        body.light .bg-black\/50,
        body.light .bg-black\/40,
        body.light .bg-black\/30,
        body.light .bg-black\/20,
        body.light .bg-black\/15,
        body.light .bg-black\/10,
        body.light .bg-black\/5 {
            background: rgba(15, 23, 42, 0.03) !important;
        }

        body.light .text-white {
            color: #1f2a44 !important;
        }

        body.light .border-white\/5,
        body.light .border-white\/10 {
            border-color: #cbd5e1 !important;
        }

        body.light .cyber-btn, 
        body.light .btn-primary {
            box-shadow: 0 4px 14px rgba(0, 86, 210, 0.25) !important;
        }

        body.light .cyber-btn:hover, 
        body.light .btn-primary:hover {
            box-shadow: 0 6px 20px rgba(0, 86, 210, 0.4) !important;
        }

        body.light .cyber-btn.outline, 
        body.light .btn-ghost {
            background: #ffffff !important;
            border-color: #cbd5e1 !important;
            color: #4a5b78 !important;
            box-shadow: none !important;
        }

        body.light .cyber-btn.outline:hover, 
        body.light .btn-ghost:hover {
            border-color: var(--php) !important;
            color: var(--php) !important;
            background: rgba(0, 86, 210, 0.04) !important;
        }

        * {
            -webkit-tap-highlight-color: transparent;
            margin: 0; padding: 0; box-sizing: border-box;
        }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Outfit', sans-serif;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--php); border-radius: 4px; }

        /* Background Grid */
        .grid-bg {
            position: fixed; inset: 0;
            background-image: 
                linear-gradient(rgba(124,92,191,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(124,92,191,0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            animation: gridDrift 30s linear infinite;
            z-index: -2;
        }
        @keyframes gridDrift {
            from { transform: translate(0,0); }
            to { transform: translate(60px, 60px); }
        }

        /* Collapsible Layout System */
        .sidebar-container {
            position: fixed;
            top: 0; bottom: 0; left: 0;
            width: var(--sidebar-width);
            background: var(--bg2);
            border-right: 1px solid var(--border);
            z-index: 1001;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        }
        .main-layout {
            margin-left: var(--sidebar-width);
            transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .topbar-header {
            position: fixed;
            top: 0; right: 0;
            left: var(--sidebar-width);
            height: var(--topbar-height);
            z-index: 1000;
            background: rgba(5, 8, 15, 0.85);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .main-content {
            margin-top: var(--topbar-height);
            flex: 1;
            padding: 24px;
            position: relative;
        }

        /* Collapsed States */
        .sidebar-collapsed .sidebar-container {
            transform: translateX(-100%);
        }
        .sidebar-collapsed .main-layout {
            margin-left: 0;
        }
        .sidebar-collapsed .topbar-header {
            left: 0;
        }

        /* Responsive Settings */
        @media(max-width: 768px) {
            .sidebar-container {
                transform: translateX(-100%);
            }
            .main-layout {
                margin-left: 0;
            }
            .topbar-header {
                left: 0;
            }
            .sidebar-open-mobile .sidebar-container {
                transform: translateX(0);
            }
            .sidebar-open-mobile .sidebar-overlay {
                display: block;
            }
        }

        .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1000;
            backdrop-filter: blur(4px);
        }

        /* Premium Nav Link Styles */
        .nav-menu-link {
            display: flex;
            align-items: center;
            padding: 12px 18px;
            font-size: 13.5px;
            font-weight: 600;
            color: var(--text2);
            border-radius: 8px;
            transition: all 0.2s ease;
            margin: 2px 12px;
            position: relative;
        }
        .nav-menu-link:hover {
            color: var(--text);
            background: rgba(124, 92, 191, 0.08);
            padding-left: 22px;
        }
        .nav-menu-link.active {
            color: var(--text);
            background: linear-gradient(135deg, rgba(124, 92, 191, 0.15), rgba(6, 182, 212, 0.05));
            border-left: 3px solid var(--php);
        }

        /* Theme toggle switch style */
        .switch-theme-btn {
            width: 52px;
            height: 26px;
            border-radius: 9999px;
            background: var(--bg3);
            border: 1.5px solid var(--border);
            position: relative;
            cursor: pointer;
            transition: all 0.3s;
        }
        .switch-theme-indicator {
            position: absolute;
            top: 2px; left: 2px;
            width: 20px; height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--php), var(--cyan));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            transition: transform 0.3s ease;
        }
        body.light .switch-theme-indicator {
            transform: translateX(26px);
        }

        /* Buttons & Cards Compatibility */
        .cyber-btn, .btn-primary {
            background: linear-gradient(135deg, var(--php), var(--php2));
            border: none; color: #fff;
            padding: 8px 20px; border-radius: 8px;
            font-size: 13px; font-weight: 700;
            cursor: pointer; font-family: 'Outfit', sans-serif;
            transition: all 0.25s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
            box-shadow: 0 0 16px rgba(124,92,191,0.35);
        }
        .cyber-btn:hover, .btn-primary:hover { 
            transform: translateY(-2px);
            box-shadow: 0 4px 24px rgba(124,92,191,0.5);
            color: #fff;
        }
        .cyber-btn.outline, .btn-ghost {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.15);
            color: var(--text2);
            box-shadow: none;
        }
        .cyber-btn.outline:hover, .btn-ghost:hover {
            border-color: var(--php);
            color: var(--text);
            background: rgba(124,92,191,0.1);
        }
        .cyber-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.5rem;
            transition: all 0.35s;
            position: relative;
            overflow: hidden;
        }
        .cyber-card::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(124,92,191,0.12), rgba(124,92,191,0.02));
            opacity: 0; transition: opacity 0.35s; border-radius: 16px;
            pointer-events: none;
        }
        .cyber-card:hover::before { opacity: 1; }
        .cyber-card:hover { 
            transform: translateY(-4px);
            border-color: var(--php);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--php);
        }
        .cyber-input {
            width: 100%; padding: 10px 14px;
            background: var(--bg3);
            border: 1.5px solid var(--border);
            border-radius: 9px; font-size: 14px;
            font-family: inherit; color: var(--text); outline: none;
            transition: border-color 0.2s;
        }
        .cyber-input:focus {
            border-color: var(--php);
        }
        .mono { font-family: 'Fira Code', monospace; }

        @guest
        .main-layout {
            margin-left: 0 !important;
        }
        .main-content {
            margin-top: 0 !important;
        }
        @endguest
    </style>
</head>

<body x-data="{ sidebarOpen: localStorage.getItem('sidebarOpen') !== 'false', mobileSidebarOpen: false }" 
      :class="{ 'sidebar-collapsed': !sidebarOpen || !{{ Auth::check() ? 'true' : 'false' }}, 'sidebar-open-mobile': mobileSidebarOpen }">
    <div class="grid-bg"></div>

    @auth
    <!-- Mobile Sidebar Overlay -->
    <div class="sidebar-overlay" @click="mobileSidebarOpen = false"></div>

    <!-- Navigation Sidebar Container -->
    <aside class="sidebar-container">
        <!-- Logo Branding Header -->
        <div class="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <a href="{{ route('home') }}" class="flex items-center gap-3">
                <img src="{{ asset('assets/images/logo.png') }}" class="w-9 h-9 object-contain" alt="Logo" style="filter: drop-shadow(0 0 6px rgba(6,182,212,0.4));">
                <div class="flex flex-col line-height-1">
                    <span class="text-sm font-extrabold text-white tracking-tight" style="background: linear-gradient(135deg, #fff, var(--php2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">talentgroup.id</span>
                    <span class="text-[9px] uppercase tracking-[0.2em] text-[var(--cyan)] font-bold">Academy</span>
                </div>
            </a>
            
            <!-- Mobile Close Button -->
            <button @click="mobileSidebarOpen = false" class="md:hidden text-[var(--text2)] hover:text-white text-lg">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Navigation Menus -->
        <nav class="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
            @auth
                @if (auth()->user()->isAdmin())
                    <!-- Admin Panel Menus -->
                    <div class="px-5 py-2 text-[9px] uppercase tracking-widest text-[var(--text3)] font-bold">Menu Admin</div>
                    <a href="{{ route('admin.dashboard') }}" class="nav-menu-link {{ Route::is('admin.dashboard') ? 'active' : '' }}">
                        <i class="fas fa-chart-line w-5 text-sm text-[var(--cyan)]"></i> Dashboard Admin
                    </a>
                @else
                    <!-- User Panel Menus -->
                    <div class="px-5 py-2 text-[9px] uppercase tracking-widest text-[var(--text3)] font-bold">Menu Pengguna</div>
                    <a href="{{ route('user.dashboard') }}" class="nav-menu-link {{ Route::is('user.dashboard') ? 'active' : '' }}">
                        <i class="fas fa-chart-line w-5 text-sm text-[var(--cyan)]"></i> Dashboard
                    </a>
                @endif
            @endauth
        </nav>

        <!-- Bottom Sidebar Block (Theme Switcher & Profile avatar card) -->
        <div class="p-4 border-t border-[var(--border)] mt-auto flex flex-col gap-4 bg-black/10">
            <!-- Theme Mode Toggle -->
            <div class="flex items-center justify-between px-2">
                <span class="text-[10px] uppercase text-[var(--text2)] font-semibold tracking-wider">Mode Tampilan</span>
                <button id="themeToggle" class="switch-theme-btn" aria-label="Toggle Theme">
                    <div class="switch-theme-indicator" id="toggleCircle">
                        <i class="fas fa-sun" id="sunIcon"></i>
                        <i class="fas fa-moon hidden" id="moonIcon"></i>
                    </div>
                </button>
            </div>

            <!-- Profile Info Badge -->
            @auth
                <div class="flex items-center gap-3 p-2.5 rounded-xl bg-black/20 border border-white/5">
                    <img src="{{ auth()->user()->avatar ? asset('storage/' . auth()->user()->avatar) : 'https://www.gravatar.com/avatar/' . md5(auth()->user()->email) . '?d=mp' }}" 
                         class="w-9 h-9 rounded-full object-cover border border-white/10" 
                         alt="Avatar">
                    <div class="flex-1 min-w-0">
                        <div class="text-xs font-bold text-white truncate" style="line-height:1.2;">{{ auth()->user()->name }}</div>
                        <div class="text-[9px] text-[var(--text2)] truncate font-mono">{{ auth()->user()->email }}</div>
                    </div>
                    <form method="POST" action="{{ route('logout') }}" class="flex">
                        @csrf
                        <button type="submit" class="text-[var(--text3)] hover:text-red-500 transition-colors p-1" title="Logout">
                            <i class="fas fa-power-off text-xs"></i>
                        </button>
                    </form>
                </div>
            @endauth
        </div>
    </aside>
    @endauth

    <!-- Main Content Layout System -->
    <div class="main-layout">
        @auth
        <!-- Top Sticky Header -->
        <header class="topbar-header">
            <!-- Sidebar Collapse Buttons -->
            <div class="flex items-center gap-4">
                <!-- Desktop Sidebar Toggle Button -->
                <button @click="sidebarOpen = !sidebarOpen; localStorage.setItem('sidebarOpen', sidebarOpen)" 
                        class="hidden md:flex w-9 h-9 items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--php)] hover:text-[var(--cyan)] text-white transition-colors bg-[var(--bg3)]"
                        title="Toggle Sidebar">
                    <i class="fas" :class="sidebarOpen ? 'fa-angle-double-left' : 'fa-angle-double-right'"></i>
                </button>
                
                <!-- Mobile Burger Menu Button -->
                <button @click="mobileSidebarOpen = true" 
                        class="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-white bg-[var(--bg3)]"
                        title="Open Sidebar">
                    <i class="fas fa-bars"></i>
                </button>
                
                <h2 class="text-xs font-semibold uppercase tracking-widest text-[var(--text2)] font-mono">
                    System Node: @yield('title', 'Academy')
                </h2>
            </div>

            <!-- Topbar Right section -->
            <div class="flex items-center gap-4">
                @auth
                    <div class="flex items-center gap-2">
                        <img src="{{ auth()->user()->avatar ? asset('storage/' . auth()->user()->avatar) : 'https://www.gravatar.com/avatar/' . md5(auth()->user()->email) . '?d=mp' }}" 
                             class="w-7 h-7 rounded-full object-cover border border-[var(--border)]" 
                             alt="Avatar">
                    </div>
                @endauth
            </div>
        </header>
        @endauth

        <!-- Main Workspace Pane -->
        <main class="main-content">
            @yield('content')
        </main>

        <!-- Premium Footer -->
        <footer style="background: var(--bg2); border-top: 1px solid var(--border); padding: 30px 0 20px; text-align: center; margin-top: auto;">
            <div class="max-w-[1260px] mx-auto px-6">
                <a href="{{ route('home') }}" class="inline-flex items-center gap-3 text-decoration-none mb-4">
                    <img src="{{ asset('assets/images/logo.png') }}" class="w-7 h-7 object-contain" alt="Logo">
                    <div class="text-left line-height-1">
                        <span class="text-sm font-extrabold text-white">talentgroup.id</span><br>
                        <span class="text-[8px] uppercase tracking-[0.2em] text-[var(--cyan)] font-bold">Academy</span>
                    </div>
                </a>
                <div class="credits" style="font-size: 11px; color: var(--text3); line-height: 1.8; margin-bottom: 16px;">
                    <p>Powered by <span>talentgroup.id</span></p>
                </div>
                <p style="font-size: 10px; color: var(--text3); font-family: 'Fira Code', monospace; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.03);">
                    &copy; {{ date('Y') }} talentgroup.id. All rights reserved.
                </p>
            </div>
        </footer>
    </div>

    <!-- Theme Mode Switching Script -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('themeToggle');
            const sunIcon = document.getElementById('sunIcon');
            const moonIcon = document.getElementById('moonIcon');
            const body = document.body;
            
            const savedTheme = localStorage.getItem('theme') || 'dark';
            
            if (savedTheme === 'light') {
                body.classList.add('light');
                if (sunIcon) sunIcon.classList.add('hidden');
                if (moonIcon) moonIcon.classList.remove('hidden');
            }
            
            if (themeToggle) {
                themeToggle.addEventListener('click', function() {
                    body.classList.toggle('light');
                    
                    if (body.classList.contains('light')) {
                        if (sunIcon) sunIcon.classList.add('hidden');
                        if (moonIcon) moonIcon.classList.remove('hidden');
                        localStorage.setItem('theme', 'light');
                    } else {
                        if (sunIcon) sunIcon.classList.remove('hidden');
                        if (moonIcon) moonIcon.classList.add('hidden');
                        localStorage.setItem('theme', 'dark');
                    }
                });
            }
        });
    </script>
</body>

</html>
