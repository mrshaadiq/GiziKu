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
        window.GIZIKU_PROVINCES = {!! json_encode($provinces) !!};
        window.USER = {!! auth()->check() ? json_encode([
            'id' => auth()->id(),
            'name' => auth()->user()->name,
            'email' => auth()->user()->email,
            'role_id' => auth()->user()->role_id,
            'role_name' => auth()->user()->role->name ?? 'user'
        ]) : 'null' !!};
        window.MENTAL_HISTORY = {!! json_encode($mentalHistory ?? []) !!};
        window.INITIAL_TAB = "{{ $initialTab ?? 'home' }}";
    </script>
</body>
</html>
