<!doctype html>
<html lang="en" data-mode="{{ app(\App\Services\AppSettings::class)->themeMode() }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        @php
            /** @var \App\Services\AppSettings $settings */
            $settings = app(\App\Services\AppSettings::class);
        @endphp
        <title inertia>{{ $settings->brandName() }}</title>
        @php
            $seoTitle = $settings->seoTitle();
            $seoDescription = $settings->seoDescription();
        @endphp
        <meta name="application-name" content="{{ $seoTitle }}" />
        @if($seoDescription !== '')
            <meta name="description" content="{{ $seoDescription }}" />
        @endif
        <link rel="icon" type="image/x-icon" href="{{ $settings->faviconUrl() }}" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&amp;family=Inter:wght@400;500;600;700;800;900&amp;family=Noto+Sans+Bengali:wght@400;600;700&amp;display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @php
            $themeVars = $settings->themeCssVars();
            $themeMode = $settings->themeMode();
            $themeVarsLight = $settings->themeCssVarsForMode('light');
            $themeVarsDark = $settings->themeCssVarsForMode('dark');
        @endphp
        <script>
            (function () {
                try {
                    var m = localStorage.getItem('ui.themeMode');
                    if (m === 'light' || m === 'dark') {
                        document.documentElement.setAttribute('data-mode', m);
                    }
                } catch (e) {}
            })();
        </script>
        <style id="app-theme">
            :root {
                color-scheme: {{ $themeMode }};
                @foreach($themeVars as $key => $value)
                    --{{ $key }}: {{ $value }};
                @endforeach
            }

            :root[data-mode="light"] {
                color-scheme: light;
                @foreach($themeVarsLight as $key => $value)
                    --{{ $key }}: {{ $value }};
                @endforeach
            }

            :root[data-mode="dark"] {
                color-scheme: dark;
                @foreach($themeVarsDark as $key => $value)
                    --{{ $key }}: {{ $value }};
                @endforeach
            }
        </style>
        @inertiaHead
    </head>

    <body class="bg-background text-foreground">
        @inertia
    </body>
</html>
