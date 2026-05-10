<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\AdminPageBuilderController;
use App\Models\Category;
use App\Models\Page;
use App\Models\PostType;
use App\Models\Taxonomy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPageController extends Controller
{
    public function index()
    {
        $pages = Page::query()
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'slug', 'is_published', 'visibility', 'updated_at']);

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/Edit', [
            'mode' => 'create',
            'page' => [
                'title' => '',
                'slug' => '',
                'content' => '',
                'is_published' => false,
                'visibility' => 'public',
            ],
            'postTypes'  => PostType::where('is_active', true)->orderBy('sort_order')->get(['id', 'name'])->toArray(),
            'categories' => Category::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'taxonomy_id'])->toArray(),
            'taxonomies' => Taxonomy::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'post_type_id'])->toArray(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:120'],
            'content' => ['nullable', 'string'],
            'is_published' => ['nullable', 'boolean'],
            'visibility' => ['nullable', 'string', 'in:public,private,premium,draft'],
            'builder_data' => ['nullable', 'array'],
            'use_builder' => ['nullable', 'boolean'],
        ]);

        $slugInput = (string) ($validated['slug'] ?? $validated['title']);
        $slug = Str::slug($slugInput);
        if ($slug === '') {
            $slug = 'page-' . substr(sha1($slugInput . (string) time()), 0, 12);
        }

        $originalSlug = $slug;
        $counter = 1;
        while (Page::query()->where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $content = $validated['content'] ?? '';
        if (!empty($validated['use_builder']) && !empty($validated['builder_data'])) {
            try {
                $renderer = new AdminPageBuilderController();
                $content = $renderer->renderBuilderHtmlPublic($validated['builder_data']);
            } catch (\Throwable) {
                // fall back to client-rendered content
            }
        }

        $page = Page::query()->create([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $content,
            'builder_data' => $validated['builder_data'] ?? null,
            'use_builder' => (bool) ($validated['use_builder'] ?? false),
            'is_published' => (bool) ($validated['is_published'] ?? false),
            'visibility' => $validated['visibility'] ?? 'public',
        ]);

        return redirect()->route('admin.pages.edit', $page)->with('status', 'Page created.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Edit', [
            'mode' => 'edit',
            'page' => $page->only(['id', 'title', 'slug', 'content', 'is_published', 'visibility', 'builder_data', 'use_builder']),
            'postTypes'  => PostType::where('is_active', true)->orderBy('sort_order')->get(['id', 'name'])->toArray(),
            'categories' => Category::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'taxonomy_id'])->toArray(),
            'taxonomies' => Taxonomy::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'post_type_id'])->toArray(),
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:120'],
            'content' => ['nullable', 'string'],
            'is_published' => ['nullable', 'boolean'],
            'visibility' => ['nullable', 'string', 'in:public,private,premium,draft'],
            'builder_data' => ['nullable', 'array'],
            'use_builder' => ['nullable', 'boolean'],
        ]);

        $slugInput = (string) ($validated['slug'] ?? $validated['title']);
        $slug = Str::slug($slugInput);
        if ($slug === '') {
            $slug = 'page-' . substr(sha1($slugInput . (string) time()), 0, 12);
        }

        $originalSlug = $slug;
        $counter = 1;
        while (Page::query()->where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $content = $validated['content'] ?? '';
        if (!empty($validated['use_builder']) && !empty($validated['builder_data'])) {
            try {
                $renderer = new AdminPageBuilderController();
                $content = $renderer->renderBuilderHtmlPublic($validated['builder_data']);
            } catch (\Throwable) {
                // fall back to client-rendered content
            }
        }

        $page->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'content' => $content,
            'builder_data' => $validated['builder_data'] ?? null,
            'use_builder' => (bool) ($validated['use_builder'] ?? false),
            'is_published' => (bool) ($validated['is_published'] ?? false),
            'visibility' => $validated['visibility'] ?? 'public',
        ]);

        return back()->with('status', 'Page saved.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.pages.index')->with('status', 'Page deleted.');
    }
}
