<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GiziKu — Skrining Pranikah AI & Pemetaan Kesehatan</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="bg-[#05080f] text-[#f1f5f9] min-h-screen overflow-x-hidden">
    <div id="root"></div>

    <script>
        window.GIZIKU_PROVINCES = @json($provinces);
        window.USER_NAME = "{{ auth()->user()->name ?? 'Demo Catin' }}";
        window.USER_EMAIL = "{{ auth()->user()->email ?? 'demo@catinguard.id' }}";
    </script>
</body>
</html>
