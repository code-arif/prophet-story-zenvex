<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminPostTypeController extends Controller
{
    public function index()
    {
        $postTypes = PostType::query()
            ->withCount('taxonomies')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'slug', 'name', 'icon', 'description', 'is_active', 'sort_order', 'updated_at']);

        return Inertia::render('Admin/PostTypes/Index', [
            'postTypes' => $postTypes,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/PostTypes/Edit', [
            'mode' => 'create',
            'postType' => [
                'name' => '',
                'slug' => '',
                'description' => '',
                'icon' => '',
                'is_active' => true,
                'sort_order' => 0,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['nullable', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:80'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['name']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (PostType::query()->where('slug', $slug)->exists()) {
            return back()->with('error', 'Slug already exists.');
        }

        $postType = PostType::query()->create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'is_active' => (bool) $validated['is_active'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->route('admin.post-types.edit', $postType)->with('status', 'Post type created.');
    }

    public function edit(PostType $postType)
    {
        return Inertia::render('Admin/PostTypes/Edit', [
            'mode' => 'edit',
            'postType' => $postType->only(['id', 'name', 'slug', 'description', 'icon', 'is_active', 'sort_order']),
        ]);
    }

    public function update(Request $request, PostType $postType)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['nullable', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:80'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['name']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (PostType::query()->where('slug', $slug)->where('id', '!=', $postType->id)->exists()) {
            return back()->with('error', 'Slug already exists.');
        }

        $postType->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'is_active' => (bool) $validated['is_active'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return back()->with('status', 'Post type updated.');
    }

    public function destroy(PostType $postType)
    {
        $postType->delete();

        return redirect()->route('admin.post-types.index')->with('status', 'Post type deleted.');
    }
}
