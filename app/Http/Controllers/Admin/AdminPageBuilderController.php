<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\PostType;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPageBuilderController extends Controller
{
    public function index()
    {
        $pages = Page::query()
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'slug', 'is_published', 'use_builder', 'updated_at']);

        return Inertia::render('Admin/PageBuilder/Index', [
            'pages' => $pages,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/PageBuilder/Builder', [
            'mode' => 'create',
            'page' => [
                'title' => '',
                'slug' => '',
                'is_published' => false,
                'visibility' => 'public',
                'builder_data' => null,
            ],
            'postTypes'  => PostType::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
            'categories' => Category::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'taxonomy_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:200'],
            'is_published' => ['required', 'boolean'],
            'builder_data' => ['nullable', 'array'],
            'visibility' => ['nullable', 'string', 'in:public,private,premium,draft'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['title']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (Page::query()->where('slug', $slug)->exists()) {
            return back()->with('error', 'Slug already exists.');
        }

        $html = $this->renderBuilderHtml($validated['builder_data'] ?? []);

        $page = Page::query()->create([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $html,
            'builder_data' => $validated['builder_data'] ?? null,
            'use_builder' => true,
            'is_published' => (bool) $validated['is_published'],
            'visibility' => $validated['visibility'] ?? 'public',
        ]);

        return redirect()->route('admin.page-builder.edit', $page)->with('status', 'Page saved.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/PageBuilder/Builder', [
            'mode' => 'edit',
            'page' => $page->only(['id', 'title', 'slug', 'is_published', 'visibility', 'builder_data', 'use_builder']),
            'postTypes'  => PostType::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
            'categories' => Category::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'taxonomy_id']),
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:200'],
            'is_published' => ['required', 'boolean'],
            'builder_data' => ['nullable', 'array'],
            'visibility' => ['nullable', 'string', 'in:public,private,premium,draft'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['title']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (Page::query()->where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
            return back()->with('error', 'Slug already exists.');
        }

        $html = $this->renderBuilderHtml($validated['builder_data'] ?? []);

        $page->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $html,
            'builder_data' => $validated['builder_data'] ?? null,
            'use_builder' => true,
            'is_published' => (bool) $validated['is_published'],
            'visibility' => $validated['visibility'] ?? 'public',
        ]);

        return back()->with('status', 'Page saved.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.page-builder.index')->with('status', 'Page deleted.');
    }

    /**
     * Public proxy for PageController to re-render builder pages at view time.
     */
    public function renderBuilderHtmlPublic(array $blocks): string
    {
        return $this->renderBuilderHtml($blocks);
    }

    /**
     * Convert builder JSON blocks to HTML string with Tailwind classes.
     */
    private function renderBuilderHtml(array $blocks): string
    {
        $html = '';
        foreach ($blocks as $block) {
            $html .= $this->renderBlock($block);
        }
        return $html;
    }

    /** Build background CSS class + inline style from SBuilder bgType props (or legacy bg/background). */
    private function buildBgAttrs(array $p): array
    {
        $bgType = $p['bgType'] ?? (isset($p['background']) || isset($p['bg']) ? 'legacy' : 'none');

        if ($bgType === 'none') {
            return ['cls' => '', 'style' => ''];
        }
        if ($bgType === 'legacy') {
            return ['cls' => $p['background'] ?? $p['bg'] ?? '', 'style' => ''];
        }
        if ($bgType === 'color') {
            $c = $p['bgColor'] ?? '';
            if (!$c) return ['cls' => '', 'style' => ''];
            if ($c[0] === '#' || str_starts_with($c, 'rgb')) {
                return ['cls' => '', 'style' => 'background-color:' . htmlspecialchars($c, ENT_QUOTES)];
            }
            return ['cls' => $c, 'style' => ''];
        }
        if ($bgType === 'gradient') {
            $dirMap = [
                'to-r' => 'to right', 'to-l' => 'to left',
                'to-t' => 'to top',   'to-b' => 'to bottom',
                'to-br' => 'to bottom right', 'to-bl' => 'to bottom left',
                'to-tr' => 'to top right',    'to-tl' => 'to top left',
            ];
            $dir  = $dirMap[$p['bgGradientDir'] ?? 'to-br'] ?? 'to bottom right';
            $from = htmlspecialchars($p['bgGradientFrom'] ?? '#3b82f6', ENT_QUOTES);
            $to   = htmlspecialchars($p['bgGradientTo']   ?? '#8b5cf6', ENT_QUOTES);
            return ['cls' => '', 'style' => "background:linear-gradient({$dir},{$from},{$to})"];
        }
        if ($bgType === 'image' && !empty($p['bgImage'])) {
            $img  = htmlspecialchars($p['bgImage'], ENT_QUOTES);
            $pos  = htmlspecialchars($p['bgPosition'] ?? 'center', ENT_QUOTES);
            $size = htmlspecialchars($p['bgSize'] ?? 'cover', ENT_QUOTES);
            $bgPart = "url('{$img}')";
            $hex = $p['bgOverlayColor'] ?? '';
            if ($hex && strlen($hex) >= 7 && $hex[0] === '#') {
                $r = hexdec(substr($hex, 1, 2));
                $g = hexdec(substr($hex, 3, 2));
                $b = hexdec(substr($hex, 5, 2));
                $a = ((int) ($p['bgOverlayOpacity'] ?? 50)) / 100;
                $bgPart = "linear-gradient(rgba({$r},{$g},{$b},{$a}),rgba({$r},{$g},{$b},{$a})),url('{$img}')";
            }
            return ['cls' => '', 'style' => "background-image:{$bgPart};background-position:{$pos};background-size:{$size};background-repeat:no-repeat"];
        }
        return ['cls' => '', 'style' => ''];
    }

    private function styleAttr(string $style): string
    {
        return $style ? " style=\"{$style}\"" : '';
    }

    private function clsStr(array $parts): string
    {
        return implode(' ', array_filter(array_map('trim', $parts)));
    }

    private function renderBlock(array $block): string
    {
        $type     = $block['type'] ?? '';
        $props    = $block['props'] ?? [];
        $children = $block['children'] ?? [];
        $responsive = $block['responsive'] ?? [];

        $extraClasses = $this->buildResponsiveClasses($responsive);

        switch ($type) {

            // ── Layout ────────────────────────────────────────────────────────────

            case 'section': {
                $bg       = $this->buildBgAttrs($props);
                $paddingY = $props['paddingY'] ?? $props['padding'] ?? 'py-12';
                $paddingX = $props['paddingX'] ?? 'px-4';
                $maxWidth = $props['maxWidth'] ?? '';
                $cc       = $props['customCss'] ?? '';
                $cls = $this->clsStr([$bg['cls'], $paddingY, $paddingX, $cc, $extraClasses]);
                $inner = '';
                foreach ($children as $child) { $inner .= $this->renderBlock($child); }
                $innerHtml = $maxWidth ? "<div class=\"{$maxWidth}\">{$inner}</div>" : $inner;
                return "<section class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$innerHtml}</section>\n";
            }

            case 'container': {
                $maxWidth = $props['maxWidth'] ?? 'max-w-5xl';
                $centered = (bool) ($props['centered'] ?? true);
                $mx = $centered ? 'mx-auto px-4' : 'px-4';
                $inner = '';
                foreach ($children as $child) { $inner .= $this->renderBlock($child); }
                return "<div class=\"{$maxWidth} {$mx} {$extraClasses}\">{$inner}</div>\n";
            }

            case 'grid': {
                $cols = $props['cols'] ?? '2';
                $colClass = is_numeric($cols) ? "grid-cols-{$cols}" : $cols;
                $gap = $props['gap'] ?? 'gap-4';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr(['grid', $colClass, $gap, $bg['cls'], $cc, $extraClasses]);
                $inner = '';
                foreach ($children as $child) { $inner .= $this->renderBlock($child); }
                return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$inner}</div>\n";
            }

            case 'columns': {
                $gap      = $props['gap'] ?? 'gap-6';
                $align    = $props['align'] ?? 'items-start';
                $paddingY = $props['paddingY'] ?? '';
                $paddingX = $props['paddingX'] ?? '';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr(['flex flex-wrap', $gap, $align, $paddingY, $paddingX, $bg['cls'], $cc, $extraClasses]);
                $inner = '';
                foreach ($children as $child) { $inner .= $this->renderBlock($child); }
                return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$inner}</div>\n";
            }

            case 'spacer': {
                $height = $props['height'] ?? 'h-8';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$height, $bg['cls'], $cc, $extraClasses]);
                return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . "></div>\n";
            }

            case 'divider': {
                $color  = $props['color']  ?? 'border-[hsl(var(--border))]';
                $margin = $props['margin'] ?? 'my-6';
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$color, $margin, 'border-t', $cc, $extraClasses]);
                return "<hr class=\"{$cls}\" />\n";
            }

            // ── Content ───────────────────────────────────────────────────────────

            case 'heading': {
                $level  = $props['level'] ?? 'h2';
                if (!in_array($level, ['h1','h2','h3','h4','h5','h6'], true)) $level = 'h2';
                $text   = htmlspecialchars($props['text'] ?? '', ENT_QUOTES);
                $align  = $props['align']  ?? 'text-left';
                $color  = $props['color']  ?? '';
                $size   = $props['size']   ?? 'text-3xl';
                $weight = $props['weight'] ?? 'font-bold';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$size, $weight, $align, $color, $bg['cls'], $cc, $extraClasses]);
                return "<{$level} class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$text}</{$level}>\n";
            }

            case 'paragraph': {
                $text       = htmlspecialchars($props['text'] ?? '', ENT_QUOTES);
                $text       = str_replace("\n", '<br>', $text);
                $align      = $props['align']      ?? 'text-left';
                $color      = $props['color']      ?? '';
                $size       = $props['size']       ?? 'text-base';
                $lineHeight = $props['lineHeight'] ?? 'leading-relaxed';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$size, $align, $color, $lineHeight, $bg['cls'], $cc, $extraClasses]);
                return "<p class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$text}</p>\n";
            }

            case 'richtext': {
                $html = $props['html'] ?? '';
                $bg   = $this->buildBgAttrs($props);
                $cc   = $props['customCss'] ?? '';
                $cls  = $this->clsStr([$bg['cls'], $cc, $extraClasses]);
                if ($cls || $bg['style']) {
                    return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$html}</div>\n";
                }
                return $html . "\n";
            }

            case 'list': {
                $items     = $props['items'] ?? [];
                $ordered   = (bool) ($props['ordered'] ?? false);
                $size      = $props['size']    ?? 'text-base';
                $color     = $props['color']   ?? '';
                $spacing   = $props['spacing'] ?? '';
                $listStyle = $ordered ? 'list-decimal' : 'list-disc';
                $tag       = $ordered ? 'ol' : 'ul';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$listStyle, 'pl-5', $size, $color, $spacing, $bg['cls'], $cc, $extraClasses]);
                $liHtml = implode('', array_map(fn ($item) => '<li>' . htmlspecialchars($item, ENT_QUOTES) . '</li>', $items));
                return "<{$tag} class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$liHtml}</{$tag}>\n";
            }

            case 'quote': {
                $text        = htmlspecialchars($props['text']   ?? '', ENT_QUOTES);
                $author      = htmlspecialchars($props['author'] ?? '', ENT_QUOTES);
                $role        = htmlspecialchars($props['role']   ?? '', ENT_QUOTES);
                $borderColor = $props['borderColor'] ?? 'border-[hsl(var(--primary))]';
                $bgColor     = $props['bgColor']     ?? 'bg-[hsl(var(--muted))]';
                $textSize    = $props['textSize']    ?? 'text-lg';
                $padding     = $props['padding']     ?? 'p-6';
                $rounded     = $props['rounded']     ?? 'rounded-2xl';
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$bgColor, $padding, $rounded, 'border-l-4', $borderColor, $cc, $extraClasses]);
                $roleHtml   = $role ? "<span class=\"font-normal text-[hsl(var(--muted-foreground))]\"> — {$role}</span>" : '';
                $authorHtml = $author ? "<figcaption class=\"text-sm font-semibold text-[hsl(var(--foreground))]\">{$author}{$roleHtml}</figcaption>" : '';
                return "<figure class=\"{$cls}\"><blockquote class=\"{$textSize} leading-relaxed italic mb-3\">\"{$text}\"</blockquote>{$authorHtml}</figure>\n";
            }

            case 'badge': {
                $text    = htmlspecialchars($props['text'] ?? '', ENT_QUOTES);
                $variant = $props['variant'] ?? 'bg-primary text-primary-foreground';
                $size    = $props['size']    ?? 'text-xs';
                $padding = $props['padding'] ?? 'px-3 py-1';
                $rounded = $props['rounded'] ?? 'rounded-full';
                $align   = $props['align']   ?? '';
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$variant, $size, $padding, $rounded, 'inline-block font-medium', $cc, $extraClasses]);
                $span = "<span class=\"{$cls}\">{$text}</span>";
                if ($align && $align !== 'text-left') {
                    return "<div class=\"{$align}\">{$span}</div>\n";
                }
                return $span . "\n";
            }

            case 'alert': {
                $alertStyles = [
                    'info'    => ['wrap' => 'bg-blue-50 text-blue-800 border border-blue-200',    'icon' => 'ℹ️'],
                    'success' => ['wrap' => 'bg-green-50 text-green-800 border border-green-200', 'icon' => '✅'],
                    'warning' => ['wrap' => 'bg-amber-50 text-amber-800 border border-amber-200', 'icon' => '⚠️'],
                    'error'   => ['wrap' => 'bg-red-50 text-red-800 border border-red-200',       'icon' => '❌'],
                ];
                $type    = $props['type'] ?? 'info';
                $style   = $alertStyles[$type] ?? $alertStyles['info'];
                $icon    = htmlspecialchars($props['icon'] ?? $style['icon'], ENT_QUOTES);
                $title   = htmlspecialchars($props['title']   ?? '', ENT_QUOTES);
                $message = htmlspecialchars($props['message'] ?? '', ENT_QUOTES);
                $rounded = $props['rounded'] ?? 'rounded-xl';
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$style['wrap'], $rounded, 'p-4 flex gap-3', $cc, $extraClasses]);
                $titleHtml = $title ? "<strong class=\"block font-semibold mb-1\">{$title}</strong>" : '';
                return "<div class=\"{$cls}\"><span class=\"text-lg shrink-0\">{$icon}</span><div>{$titleHtml}<span class=\"text-sm\">{$message}</span></div></div>\n";
            }

            case 'button': {
                $text    = htmlspecialchars($props['text'] ?? 'Button', ENT_QUOTES);
                $href    = htmlspecialchars($props['href'] ?? '#', ENT_QUOTES);
                $variant = $props['variant'] ?? ($props['style'] === 'secondary'
                    ? 'border border-[hsl(var(--border))] text-[hsl(var(--foreground))]'
                    : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]');
                $padding = $props['padding'] ?? $props['size'] ?? 'px-6 py-3';
                $rounded = $props['rounded'] ?? 'rounded-xl';
                $weight  = $props['weight']  ?? 'font-medium';
                $align   = $props['align']   ?? '';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$variant, $padding, $rounded, $weight, 'inline-block transition hover:opacity-90', $bg['cls'], $cc, $extraClasses]);
                $link = "<a href=\"{$href}\" class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$text}</a>";
                if ($align) {
                    return "<div class=\"{$align}\">{$link}</div>\n";
                }
                return $link . "\n";
            }

            // ── Media ─────────────────────────────────────────────────────────────

            case 'image': {
                $src    = htmlspecialchars($props['src'] ?? '', ENT_QUOTES);
                if (!$src) return '';
                $alt       = htmlspecialchars($props['alt'] ?? '', ENT_QUOTES);
                $rounded   = $props['rounded']   ?? 'rounded-lg';
                $width     = $props['width']     ?? 'w-full';
                $height    = $props['height']    ?? '';
                $objectFit = $props['objectFit'] ?? 'object-cover';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$width, $height, $objectFit, $rounded, $bg['cls'], $cc, $extraClasses]);
                return "<img src=\"{$src}\" alt=\"{$alt}\" class=\"{$cls}\"" . $this->styleAttr($bg['style']) . " />\n";
            }

            case 'video': {
                $url         = $props['url'] ?? '';
                $aspectRatio = $props['aspectRatio'] ?? 'aspect-video';
                $rounded     = $props['rounded']     ?? 'rounded-xl';
                $caption     = htmlspecialchars($props['caption'] ?? '', ENT_QUOTES);
                $cc  = $props['customCss'] ?? '';
                if (!$url) {
                    $cls = $this->clsStr([$aspectRatio, $rounded, 'bg-[hsl(var(--muted))] flex items-center justify-center text-sm text-[hsl(var(--muted-foreground))]', $cc, $extraClasses]);
                    return "<div class=\"{$cls}\">🎬 Video placeholder</div>\n";
                }
                $embedSrc = $url;
                if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $url, $m)) {
                    $embedSrc = 'https://www.youtube.com/embed/' . $m[1];
                } elseif (preg_match('/vimeo\.com\/(\d+)/', $url, $m)) {
                    $embedSrc = 'https://player.vimeo.com/video/' . $m[1];
                }
                $embedSrc   = htmlspecialchars($embedSrc, ENT_QUOTES);
                $wrapCls    = $this->clsStr([$aspectRatio, $rounded, 'overflow-hidden', $cc, $extraClasses]);
                $captionHtml = $caption ? "<figcaption class=\"mt-2 text-xs text-center text-[hsl(var(--muted-foreground))]\">{$caption}</figcaption>" : '';
                return "<figure><div class=\"{$wrapCls}\"><iframe src=\"{$embedSrc}\" class=\"w-full h-full\" frameborder=\"0\" allowfullscreen loading=\"lazy\"></iframe></div>{$captionHtml}</figure>\n";
            }

            case 'gallery': {
                $images    = $props['images']    ?? [];
                $cols      = $props['cols']      ?? 'grid-cols-3';
                $gap       = $props['gap']       ?? 'gap-3';
                $height    = $props['height']    ?? 'h-40';
                $objectFit = $props['objectFit'] ?? 'object-cover';
                $rounded   = $props['rounded']   ?? 'rounded-lg';
                $cc  = $props['customCss'] ?? '';
                $imgs = array_filter($images, fn ($img) => !empty($img['src']));
                if (empty($imgs)) {
                    return "<div class=\"text-xs text-[hsl(var(--muted-foreground))] p-4\">No gallery images.</div>\n";
                }
                $cls = $this->clsStr(['grid', $cols, $gap, $cc, $extraClasses]);
                $imgHtml = '';
                foreach ($imgs as $img) {
                    $src = htmlspecialchars($img['src'] ?? '', ENT_QUOTES);
                    $alt = htmlspecialchars($img['alt'] ?? '', ENT_QUOTES);
                    $imgHtml .= "<div class=\"{$height} overflow-hidden {$rounded}\"><img src=\"{$src}\" alt=\"{$alt}\" class=\"w-full h-full {$objectFit}\" loading=\"lazy\" /></div>\n";
                }
                return "<div class=\"{$cls}\">{$imgHtml}</div>\n";
            }

            // ── Composite ─────────────────────────────────────────────────────────

            case 'hero': {
                $title    = htmlspecialchars($props['title']    ?? '', ENT_QUOTES);
                $subtitle = htmlspecialchars($props['subtitle'] ?? '', ENT_QUOTES);
                $textColor = $props['textColor'] ?? 'text-primary-foreground';
                $paddingY  = $props['paddingY']  ?? 'py-20';
                $align     = $props['align']     ?? 'text-center';
                $btnText   = htmlspecialchars($props['btnText'] ?? '', ENT_QUOTES);
                $btnHref   = htmlspecialchars($props['btnHref'] ?? '#', ENT_QUOTES);
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$bg['cls'], $paddingY, 'px-4', $align, $cc, $extraClasses]);
                $btnHtml = $btnText
                    ? "<div class=\"mt-6\"><a href=\"{$btnHref}\" class=\"inline-block bg-white text-[hsl(var(--primary))] px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition\">{$btnText}</a></div>"
                    : '';
                return "<section class=\"{$cls}\"" . $this->styleAttr($bg['style']) . "><div class=\"max-w-3xl mx-auto\"><h1 class=\"text-4xl font-bold mb-4 {$textColor}\">{$title}</h1><p class=\"text-lg opacity-90 {$textColor}\">{$subtitle}</p>{$btnHtml}</div></section>\n";
            }

            case 'card': {
                $title   = htmlspecialchars($props['title'] ?? '', ENT_QUOTES);
                $body    = htmlspecialchars($props['body']  ?? '', ENT_QUOTES);
                $body    = str_replace("\n", '<br>', $body);
                $padding = $props['padding'] ?? 'p-6';
                $rounded = $props['rounded'] ?? 'rounded-2xl';
                $shadow  = $props['shadow']  ?? '';
                $border  = $props['border']  ?? $props['ring'] ?? 'ring-1 ring-[hsl(var(--border))]';
                $bg  = $this->buildBgAttrs($props);
                if ($bg['cls'] === '' && $bg['style'] === '') {
                    $bg['cls'] = $props['bg'] ?? $props['background'] ?? 'bg-[hsl(var(--card))]';
                }
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$bg['cls'], $padding, $rounded, $shadow, $border, $cc, $extraClasses]);
                $titleHtml = $title ? "<h3 class=\"font-semibold text-lg mb-2\">{$title}</h3>" : '';
                return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$titleHtml}<p class=\"text-[hsl(var(--muted-foreground))] text-sm leading-relaxed\">{$body}</p></div>\n";
            }

            case 'stats': {
                $items       = $props['items']       ?? [];
                $cols        = $props['cols']        ?? 'grid-cols-2';
                $gap         = $props['gap']         ?? 'gap-4';
                $padding     = $props['padding']     ?? 'p-4';
                $cardBg      = $props['cardBg']      ?? 'bg-card';
                $cardRounded = $props['cardRounded'] ?? 'rounded-xl';
                $cardBorder  = $props['cardBorder']  ?? 'border border-border';
                $align       = $props['align']       ?? 'text-center';
                $valueSize   = $props['valueSize']   ?? 'text-3xl';
                $valueWeight = $props['valueWeight'] ?? 'font-bold';
                $valueColor  = $props['valueColor']  ?? 'text-primary';
                $labelSize   = $props['labelSize']   ?? 'text-sm';
                $labelColor  = $props['labelColor']  ?? 'text-muted-foreground';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr(['grid', $cols, $gap, $bg['cls'], $cc, $extraClasses]);
                $itemsHtml = '';
                foreach ($items as $item) {
                    $value = htmlspecialchars($item['value'] ?? '', ENT_QUOTES);
                    $label = htmlspecialchars($item['label'] ?? '', ENT_QUOTES);
                    $ic    = $this->clsStr([$cardBg, $cardRounded, $cardBorder, $padding, $align]);
                    $itemsHtml .= "<div class=\"{$ic}\"><div class=\"{$valueSize} {$valueWeight} {$valueColor}\">{$value}</div><div class=\"{$labelSize} {$labelColor} mt-1\">{$label}</div></div>\n";
                }
                return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$itemsHtml}</div>\n";
            }

            case 'testimonial': {
                $quote   = htmlspecialchars($props['quote']  ?? '', ENT_QUOTES);
                $name    = htmlspecialchars($props['name']   ?? '', ENT_QUOTES);
                $role    = htmlspecialchars($props['role']   ?? '', ENT_QUOTES);
                $avatar  = htmlspecialchars($props['avatar'] ?? '', ENT_QUOTES);
                $padding = $props['padding'] ?? 'p-6';
                $rounded = $props['rounded'] ?? 'rounded-2xl';
                $border  = $props['border']  ?? 'ring-1 ring-[hsl(var(--border))]';
                $bg  = $this->buildBgAttrs($props);
                if ($bg['cls'] === '' && $bg['style'] === '') {
                    $bg['cls'] = 'bg-[hsl(var(--card))]';
                }
                $cc      = $props['customCss'] ?? '';
                $cls     = $this->clsStr([$bg['cls'], $padding, $rounded, $border, $cc, $extraClasses]);
                $initial = mb_strtoupper(mb_substr($name ?: '?', 0, 1));
                $avatarHtml = $avatar
                    ? "<img src=\"{$avatar}\" alt=\"{$name}\" class=\"size-12 rounded-full object-cover ring-2 ring-[hsl(var(--primary))]/30\" />"
                    : "<div class=\"size-12 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center text-lg font-bold text-[hsl(var(--primary))]\">{$initial}</div>";
                $roleHtml = $role ? "<div class=\"text-xs text-[hsl(var(--muted-foreground))]\">{$role}</div>" : '';
                return "<figure class=\"{$cls}\"" . $this->styleAttr($bg['style']) . "><blockquote class=\"leading-relaxed mb-4 italic\">\"{$quote}\"</blockquote><figcaption class=\"flex items-center gap-3\">{$avatarHtml}<div><div class=\"font-semibold text-sm\">{$name}</div>{$roleHtml}</div></figcaption></figure>\n";
            }

            case 'accordion': {
                $items   = $props['items']   ?? [];
                $bgColor = $props['bgColor'] ?? 'bg-card';
                $rounded = $props['rounded'] ?? 'rounded-xl';
                $cc      = $props['customCss'] ?? '';
                $cls     = $this->clsStr([$rounded, 'overflow-hidden divide-y divide-[hsl(var(--border))] ring-1 ring-[hsl(var(--border))]', $cc, $extraClasses]);
                $itemsHtml = '';
                foreach ($items as $i => $item) {
                    $question  = htmlspecialchars($item['question'] ?? '', ENT_QUOTES);
                    $answer    = htmlspecialchars($item['answer']   ?? '', ENT_QUOTES);
                    $open      = $i === 0 ? ' open' : '';
                    $itemsHtml .= "<details class=\"{$bgColor} group overflow-hidden\"{$open}>";
                    $itemsHtml .= "<summary class=\"flex items-center justify-between gap-3 px-4 py-3 font-medium text-sm cursor-pointer list-none select-none hover:bg-[hsl(var(--muted))] transition-colors\">{$question}<span class=\"shrink-0 transition-transform group-open:rotate-180 text-[hsl(var(--muted-foreground))]\">▾</span></summary>";
                    $itemsHtml .= "<div class=\"px-4 pb-4 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed\">{$answer}</div></details>\n";
                }
                return "<div class=\"{$cls}\">{$itemsHtml}</div>\n";
            }

            case 'tabs': {
                $items     = $props['items']     ?? [];
                $activeTab = max(0, min((int) ($props['activeTab'] ?? 0), count($items) - 1));
                $tabBg     = $props['tabBg']     ?? 'bg-muted';
                $activeBg  = $props['activeBg']  ?? 'bg-background';
                $contentBg = $props['contentBg'] ?? 'bg-card';
                $rounded   = $props['rounded']   ?? 'rounded-xl';
                $cc        = $props['customCss'] ?? '';
                $cls       = $cc || $extraClasses ? ' class="' . $this->clsStr([$cc, $extraClasses]) . '"' : '';
                $tabs = '';
                foreach ($items as $i => $item) {
                    $label    = htmlspecialchars($item['label'] ?? '', ENT_QUOTES);
                    $tabClass = $i === $activeTab ? $activeBg : 'hover:bg-[hsl(var(--background))]/50';
                    $tabs    .= "<button class=\"{$tabClass} px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap\">{$label}</button>";
                }
                $content = isset($items[$activeTab])
                    ? "<div class=\"{$contentBg} p-4 text-sm leading-relaxed text-[hsl(var(--foreground))]\">" . htmlspecialchars($items[$activeTab]['content'] ?? '', ENT_QUOTES) . "</div>"
                    : '';
                return "<div{$cls}><div class=\"{$tabBg} {$rounded} flex flex-wrap gap-1 p-1 mb-1\">{$tabs}</div>{$content}</div>\n";
            }

            case 'cta': {
                $title          = htmlspecialchars($props['title']          ?? '', ENT_QUOTES);
                $subtitle       = htmlspecialchars($props['subtitle']       ?? '', ENT_QUOTES);
                $btnText        = htmlspecialchars($props['btnText']        ?? '', ENT_QUOTES);
                $btnHref        = htmlspecialchars($props['btnHref']        ?? '#', ENT_QUOTES);
                $btnVariant     = $props['btnVariant']     ?? 'bg-primary text-primary-foreground';
                $secondBtnText  = htmlspecialchars($props['secondBtnText']  ?? '', ENT_QUOTES);
                $secondBtnHref  = htmlspecialchars($props['secondBtnHref']  ?? '#', ENT_QUOTES);
                $secondBtnVariant = $props['secondBtnVariant'] ?? 'bg-card text-foreground ring-1 ring-[hsl(var(--border))]';
                $paddingY       = $props['paddingY'] ?? 'py-16';
                $align          = $props['align']    ?? 'text-center';
                $rounded        = $props['rounded']  ?? '';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr([$bg['cls'], $paddingY, 'px-4', $align, $rounded, $cc, $extraClasses]);
                $btn  = $btnText ? "<a href=\"{$btnHref}\" class=\"{$btnVariant} inline-block px-6 py-3 rounded-xl font-semibold transition hover:opacity-90\">{$btnText}</a>" : '';
                $btn2 = $secondBtnText ? "<a href=\"{$secondBtnHref}\" class=\"{$secondBtnVariant} inline-block px-6 py-3 rounded-xl font-semibold transition hover:opacity-90\">{$secondBtnText}</a>" : '';
                $btns = ($btn || $btn2) ? "<div class=\"mt-6 flex flex-wrap gap-3 justify-center\">{$btn}{$btn2}</div>" : '';
                return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . "><h2 class=\"text-3xl font-bold mb-3\">{$title}</h2><p class=\"text-lg opacity-80 max-w-xl mx-auto\">{$subtitle}</p>{$btns}</div>\n";
            }

            case 'featureGrid': {
                $items       = $props['items']       ?? [];
                $cols        = $props['cols']        ?? 'grid-cols-2';
                $gap         = $props['gap']         ?? 'gap-3';
                $padding     = $props['padding']     ?? 'px-4';
                $cardBg      = $props['cardBg']      ?? 'bg-card';
                $cardRounded = $props['cardRounded'] ?? 'rounded-xl';
                $cardPadding = $props['cardPadding'] ?? 'p-4';
                $cardBorder  = $props['cardBorder']  ?? 'border border-border';
                $bg  = $this->buildBgAttrs($props);
                $cc  = $props['customCss'] ?? '';
                $cls = $this->clsStr(['grid', $cols, $gap, $padding, $bg['cls'], $cc, $extraClasses]);
                $itemsHtml = '';
                foreach ($items as $item) {
                    $icon  = $item['icon'] ?? '';
                    $ititle = htmlspecialchars($item['title'] ?? '', ENT_QUOTES);
                    $idesc  = htmlspecialchars($item['desc']  ?? '', ENT_QUOTES);
                    $ihref  = htmlspecialchars($item['href']  ?? '', ENT_QUOTES);
                    $ic     = $this->clsStr([$cardBg, $cardRounded, $cardPadding, $cardBorder, 'block']);
                    $inner  = "<div class=\"text-2xl mb-3\">{$icon}</div><h3 class=\"font-semibold text-sm\">{$ititle}</h3><p class=\"text-xs text-muted-foreground mt-1\">{$idesc}</p>";
                    $itemsHtml .= $ihref
                        ? "<a href=\"{$ihref}\" class=\"{$ic}\">{$inner}</a>\n"
                        : "<div class=\"{$ic}\">{$inner}</div>\n";
                }
                return "<div class=\"{$cls}\"" . $this->styleAttr($bg['style']) . ">{$itemsHtml}</div>\n";
            }

            case 'html':
                return ($props['code'] ?? '') . "\n";

            case 'postLoop': {
                $perPage = (int) ($props['perPage'] ?? $props['count'] ?? 6);
                $orderBy = $props['orderBy'] ?? 'latest';
                $cols = $props['cols'] ?? 'grid-cols-2';
                $gap = $props['gap'] ?? 'gap-4';
                $cardBg = $props['cardBg'] ?? 'bg-card';
                $cardRounded = $props['cardRounded'] ?? 'rounded-xl';
                $cardBorder = $props['cardBorder'] ?? 'border border-border';
                $cardPadding = $props['cardPadding'] ?? 'p-4';
                $imageHeight = $props['imageHeight'] ?? 'h-40';
                $showImage = (bool) ($props['showImage'] ?? true);
                $showCategory = (bool) ($props['showCategory'] ?? true);
                $showDate = (bool) ($props['showDate'] ?? true);
                $showExcerpt = (bool) ($props['showExcerpt'] ?? false);
                $showPagination = (bool) ($props['showPagination'] ?? true);

                $query = \App\Models\Article::query()
                    ->where('visibility', 'public');

                if (!empty($props['postTypeId'])) {
                    $query->where('post_type_id', (int) $props['postTypeId']);
                }
                if (!empty($props['categoryId'])) {
                    $query->where('category_id', (int) $props['categoryId']);
                }

                match ($orderBy) {
                    'oldest' => $query->oldest('id'),
                    'popular' => $query->orderByDesc('view_count'),
                    default => $query->orderByDesc('id'),
                };

                $currentPage = max(1, (int) request()->get('page', 1));
                $posts = $query->with(['category'])->paginate($perPage, ['*'], 'page', $currentPage);

                if ($posts->isEmpty()) {
                    return "<div class=\"{$cardBg} {$cardPadding} {$cardRounded} text-center text-sm text-[hsl(var(--muted-foreground))]\">No posts found.</div>\n";
                }

                $cards = '';
                foreach ($posts as $post) {
                    $imgUrl = $showImage ? $post->featured_image_url : '';
                    $img = $imgUrl
                        ? "<div class=\"{$imageHeight} overflow-hidden mb-3\"><img src=\"" . htmlspecialchars($imgUrl, ENT_QUOTES) . "\" alt=\"\" class=\"w-full h-full {$cardRounded} object-cover\"></div>"
                        : '';
                    $cat = $showCategory && $post->category
                        ? "<span class=\"text-xs text-[hsl(var(--primary))] font-medium\">" . htmlspecialchars($post->category->name, ENT_QUOTES) . "</span>"
                        : '';
                    $date = $showDate && $post->published_at
                        ? "<span class=\"text-xs text-[hsl(var(--muted-foreground))]\">" . $post->published_at->format('d M Y') . "</span>"
                        : '';
                    $meta = ($cat || $date) ? "<div class=\"flex items-center gap-2 mb-1.5\">{$cat}{$date}</div>" : '';
                    $excerpt = $showExcerpt && $post->excerpt
                        ? "<p class=\"text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed line-clamp-2\">" . htmlspecialchars($post->excerpt, ENT_QUOTES) . "</p>"
                        : '';
                    $title = htmlspecialchars($post->title, ENT_QUOTES);
                    $slug = htmlspecialchars($post->slug, ENT_QUOTES);
                    $cards .= "<a href=\"/articles/{$slug}\" class=\"{$cardBg} {$cardRounded} {$cardBorder} {$cardPadding} block hover:opacity-90 transition overflow-hidden\">{$img}{$meta}<h3 class=\"font-semibold text-sm leading-snug\">{$title}</h3>{$excerpt}</a>\n";
                }

                $paginationHtml = '';
                if ($showPagination && $posts->lastPage() > 1) {
                    $baseUrl = request()->url();
                    $queryParams = request()->except('page');
                    $links = '';
                    if ($posts->currentPage() > 1) {
                        $prev = http_build_query(array_merge($queryParams, ['page' => $posts->currentPage() - 1]));
                        $links .= "<a href=\"{$baseUrl}?{$prev}\" class=\"px-3 py-1.5 rounded-lg text-sm ring-1 ring-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition\">&#8592; Prev</a>";
                    }
                    $start = max(1, $posts->currentPage() - 2);
                    $end   = min($posts->lastPage(), $posts->currentPage() + 2);
                    for ($p = $start; $p <= $end; $p++) {
                        $params = http_build_query(array_merge($queryParams, ['page' => $p]));
                        $activeClass = $p === $posts->currentPage()
                            ? ' bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                            : ' hover:bg-[hsl(var(--muted))]';
                        $links .= "<a href=\"{$baseUrl}?{$params}\" class=\"px-3 py-1.5 rounded-lg text-sm ring-1 ring-[hsl(var(--border))]{$activeClass} transition\">{$p}</a>";
                    }
                    if ($posts->currentPage() < $posts->lastPage()) {
                        $next = http_build_query(array_merge($queryParams, ['page' => $posts->currentPage() + 1]));
                        $links .= "<a href=\"{$baseUrl}?{$next}\" class=\"px-3 py-1.5 rounded-lg text-sm ring-1 ring-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition\">Next &#8594;</a>";
                    }
                    $paginationHtml = "<div class=\"flex items-center justify-center gap-2 mt-6 flex-wrap\">{$links}</div>";
                }

                return "<div class=\"{$extraClasses}\"><div class=\"grid {$cols} {$gap}\">{$cards}</div>{$paginationHtml}</div>\n";
            }

            case 'categoryLoop': {
                $count = (int) ($props['count'] ?? 8);
                $cols = $props['cols'] ?? 'grid-cols-2';
                $gap = $props['gap'] ?? 'gap-3';
                $cardBg = $props['cardBg'] ?? 'bg-card';
                $cardRounded = $props['cardRounded'] ?? 'rounded-xl';
                $cardBorder = $props['cardBorder'] ?? 'border border-border';
                $cardPadding = $props['cardPadding'] ?? 'p-4';
                $showCount = (bool) ($props['showCount'] ?? true);

                $query = \App\Models\Category::query()->where('is_active', true);

                if (!empty($props['taxonomyId'])) {
                    $query->where('taxonomy_id', $props['taxonomyId']);
                }

                $categories = $query->orderBy('sort_order')
                    ->limit($count)
                    ->withCount('articles')
                    ->get();

                if ($categories->isEmpty()) {
                    return "<div class=\"{$cardBg} {$cardPadding} {$cardRounded} text-center text-sm text-[hsl(var(--muted-foreground))]\">No categories found.</div>\n";
                }

                $cards = '';
                foreach ($categories as $cat) {
                    $name = htmlspecialchars($cat->name, ENT_QUOTES);
                    $catSlug = htmlspecialchars($cat->slug, ENT_QUOTES);
                    $countHtml = $showCount
                        ? "<span class=\"text-xs text-[hsl(var(--muted-foreground))] mt-1 block\">{$cat->articles_count} " . __('articles') . "</span>"
                        : '';
                    $cards .= "<a href=\"/articles?category={$catSlug}\" class=\"{$cardBg} {$cardRounded} {$cardBorder} {$cardPadding} block hover:opacity-90 transition\"><span class=\"font-medium text-sm\">{$name}</span>{$countHtml}</a>\n";
                }

                return "<div class=\"grid {$cols} {$gap} {$extraClasses}\">{$cards}</div>\n";
            }

            case 'slider': {
                $height = $props['height'] ?? 'h-64';
                $rounded = $props['rounded'] ?? 'rounded-xl';
                $objectFit = $props['objectFit'] ?? 'object-cover';
                $titleColor = $props['titleColor'] ?? 'text-white';
                $source = $props['source'] ?? 'manual';
                $showDots = $props['showDots'] ?? true;
                $showArrows = $props['showArrows'] ?? true;
                $loop = $props['loop'] ?? true;
                $autoplay = $props['autoplay'] ?? false;
                $interval = (int) ($props['autoplayInterval'] ?? 5000);

                $slides = [];
                if ($source === 'posts') {
                    $q = \App\Models\Article::query()
                        ->where('visibility', 'public')
                        ->whereNotNull('featured_image_path');
                    if (!empty($props['postTypeId'])) {
                        $q->where('post_type_id', (int) $props['postTypeId']);
                    }
                    $posts = $q->orderByDesc('id')->limit((int) ($props['count'] ?? 5))->get();
                    foreach ($posts as $post) {
                        $slides[] = [
                            'image' => $post->featured_image_url ?? '',
                            'title' => $post->title,
                            'desc' => $post->excerpt ?? '',
                            'href' => '/articles/' . $post->slug,
                        ];
                    }
                } else {
                    $slides = $props['items'] ?? [];
                }

                if (empty($slides)) {
                    return "<div class=\"{$height} {$rounded} bg-[hsl(var(--muted))] flex items-center justify-center text-sm text-[hsl(var(--muted-foreground))]\">No slides configured.</div>\n";
                }

                $bgSize = $objectFit === 'object-contain' ? 'contain' : 'cover';
                $slidesHtml = '';
                foreach ($slides as $slide) {
                    $img = htmlspecialchars($slide['image'] ?? '', ENT_QUOTES);
                    $title = htmlspecialchars($slide['title'] ?? '', ENT_QUOTES);
                    $desc = htmlspecialchars($slide['desc'] ?? '', ENT_QUOTES);
                    $href = htmlspecialchars($slide['href'] ?? '#', ENT_QUOTES);
                    $bgStyle = $img ? " style=\"background-image:url('{$img}');background-size:{$bgSize};background-position:center;background-repeat:no-repeat\"" : '';
                    $titleHtml = $title ? "<h3 class=\"{$titleColor} font-bold text-xl leading-snug\">{$title}</h3>" : '';
                    $descHtml = $desc ? "<p class=\"text-white/80 text-sm mt-1\">{$desc}</p>" : '';
                    $overlay = ($titleHtml || $descHtml) ? "<div class=\"absolute inset-0 flex flex-col justify-end p-6\" style=\"background:linear-gradient(to top,rgba(0,0,0,0.6),transparent)\">{$titleHtml}{$descHtml}</div>" : '';
                    $el = ($href && $href !== '#') ? "a href=\"{$href}\"" : 'div';
                    $elEnd = ($href && $href !== '#') ? 'a' : 'div';
                    $slidesHtml .= "<{$el} class=\"swiper-slide relative {$height} {$rounded} overflow-hidden bg-[hsl(var(--muted))]\"{$bgStyle}>{$overlay}</{$elEnd}>\n";
                }

                $paginationHtml = $showDots ? '<div class="swiper-pagination"></div>' : '';
                $navigationHtml = $showArrows ? '<div class="swiper-button-prev !text-white"></div><div class="swiper-button-next !text-white"></div>' : '';

                $containerId = 'swiper-container-' . uniqid();
                $loopStr = $loop ? 'true' : 'false';
                $autoplayJson = $autoplay ? json_encode(['delay' => $interval, 'disableOnInteraction' => false]) : 'false';

                return "<div class=\"relative overflow-hidden {$extraClasses}\" id=\"{$containerId}\">\n" .
                       "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css\" />\n" .
                       "<div class=\"swiper\">\n" .
                       "<div class=\"swiper-wrapper\">\n{$slidesHtml}</div>\n" .
                       $paginationHtml . "\n" .
                       $navigationHtml . "\n" .
                       "</div>\n" .
                       "<script src=\"https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js\"></script>\n" .
                       "<script>\n" .
                       "if(typeof Swiper !== 'undefined') { initSwiper_{$containerId}(); } else {\n" .
                       "  var script = document.createElement('script');\n" .
                       "  script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';\n" .
                       "  script.onload = function() { initSwiper_{$containerId}(); };\n" .
                       "  document.head.appendChild(script);\n" .
                       "}\n" .
                       "function initSwiper_{$containerId}() {\n" .
                       "  var container = document.getElementById('{$containerId}');\n" .
                       "  if(!container) return;\n" .
                       "  var swiperEl = container.querySelector('.swiper');\n" .
                       "  if(!swiperEl) return;\n" .
                       "  var config = { loop: {$loopStr}, speed: 300, slidesPerView: 1, spaceBetween: 0 };\n" .
                       ($showDots ? "  config.pagination = { el: container.querySelector('.swiper-pagination'), clickable: true };\n" : "") .
                       ($showArrows ? "  config.navigation = { nextEl: container.querySelector('.swiper-button-next'), prevEl: container.querySelector('.swiper-button-prev') };\n" : "") .
                       ($autoplay ? "  config.autoplay = {$autoplayJson};\n" : "") .
                       "  new Swiper(swiperEl, config);\n" .
                       "  console.log('Swiper initialized for {$containerId}');\n" .
                       "}\n" .
                       "</script>\n" .
                       "</div>\n";
            }

            default:
                return '';
        }
    }

    private function buildResponsiveClasses(array $responsive): string
    {
        $classes = [];
        foreach (['sm', 'md', 'lg'] as $bp) {
            if (!empty($responsive[$bp])) {
                $bpClasses = is_array($responsive[$bp]) ? $responsive[$bp] : [$responsive[$bp]];
                foreach ($bpClasses as $class) {
                    if ($class) {
                        $classes[] = $bp === 'sm' ? $class : "{$bp}:{$class}";
                    }
                }
            }
        }
        return implode(' ', $classes);
    }
}
