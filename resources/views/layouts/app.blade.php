<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Apps Bangla' }}</title>
    <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; background: #0b1220; color: #e5e7eb; }
        a { color: #93c5fd; text-decoration: none; }
        a:hover { text-decoration: underline; }
        header { padding: 16px 20px; border-bottom: 1px solid #1f2937; background: #0b1220; position: sticky; top: 0; }
        .wrap { max-width: 980px; margin: 0 auto; padding: 0 20px; }
        nav { display: flex; gap: 14px; align-items: center; justify-content: space-between; }
        .nav-left { display:flex; gap:14px; align-items:center; }
        .badge { font-size: 12px; padding: 4px 10px; border: 1px solid #1f2937; border-radius: 999px; color: #d1d5db; }
        main { padding: 24px 0; }
        .card { background: #0f172a; border: 1px solid #1f2937; border-radius: 12px; padding: 16px; }
        .grid { display: grid; gap: 16px; }
        .grid-2 { grid-template-columns: 1fr; }
        @media (min-width: 900px) { .grid-2 { grid-template-columns: 2fr 1fr; } }
        .muted { color: #94a3b8; }
        .btn { display:inline-block; padding: 10px 14px; border-radius: 10px; background:#2563eb; color:white; border: 0; cursor: pointer; }
        .btn.secondary { background:#111827; border:1px solid #1f2937; }
        input { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid #1f2937; background: #0b1220; color: #e5e7eb; }
        .flash { margin-bottom: 14px; padding: 10px 12px; border-radius: 10px; background: #0b3b2e; border: 1px solid #14532d; }
        .flash.error { background:#3b0b12; border-color:#7f1d1d; }
        footer { padding: 28px 0; border-top: 1px solid #1f2937; color:#94a3b8; }
    </style>
</head>
<body>
<header>
    <div class="wrap">
        <nav>
            <div class="nav-left">
                <a href="{{ route('home') }}"><strong>Apps Bangla</strong></a>
                <span class="badge">Subscriber-only</span>
                <a href="{{ route('articles.index') }}">Articles</a>
                <a href="{{ route('profile') }}">Profile</a>
            </div>
            <div class="muted">
                @if(session('msisdn'))
                    Phone: {{ session('msisdn') }}
                @else
                    Not identified
                @endif
            </div>
        </nav>
    </div>
</header>

<main>
    <div class="wrap">
        @if(session('status'))
            <div class="flash">{{ session('status') }}</div>
        @endif
        @if(session('error'))
            <div class="flash error">{{ session('error') }}</div>
        @endif
        @if($errors->any())
            <div class="flash error">
                {{ $errors->first() }}
            </div>
        @endif

        {{ $slot ?? '' }}
        @yield('content')
    </div>
</main>

<footer>
    <div class="wrap">
        &copy; {{ date('Y') }} Apps Bangla. All rights reserved.
    </div>
</footer>
</body>
</html>
