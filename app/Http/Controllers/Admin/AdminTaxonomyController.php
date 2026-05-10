<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PostType;
use App\Models\Taxonomy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminTaxonomyController extends Controller
{
    public function index()
    {
        $taxonomies = Taxonomy::query()
            ->with(['postType:id,name,slug'])
            ->withCount('categories')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'post_type_id', 'slug', 'name', 'description', 'is_active', 'sort_order', 'updated_at']);

        return Inertia::render('Admin/Taxonomies/Index', [
            'taxonomies' => $taxonomies,
        ]);
    }

    public function create()
    {
        $postTypes = PostType::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Taxonomies/Edit', [
            'mode' => 'create',
            'postTypes' => $postTypes,
            'taxonomy' => [
                'post_type_id' => null,
                'name' => '',
                'slug' => '',
                'description' => '',
                'is_active' => true,
                'sort_order' => 0,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_type_id' => ['required', 'exists:post_types,id'],
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['nullable', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['name']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (Taxonomy::query()->where('post_type_id', $validated['post_type_id'])->where('slug', $slug)->exists()) {
            return back()->with('error', 'Slug already exists for this post type.');
        }

        $taxonomy = Taxonomy::query()->create([
            'post_type_id' => $validated['post_type_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'is_active' => (bool) $validated['is_active'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return redirect()->route('admin.taxonomies.edit', $taxonomy)->with('status', 'Taxonomy created.');
    }

    public function edit(Taxonomy $taxonomy)
    {
        $postTypes = PostType::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Taxonomies/Edit', [
            'mode' => 'edit',
            'postTypes' => $postTypes,
            'taxonomy' => $taxonomy->only(['id', 'post_type_id', 'name', 'slug', 'description', 'is_active', 'sort_order']),
        ]);
    }

    public function update(Request $request, Taxonomy $taxonomy)
    {
        $validated = $request->validate([
            'post_type_id' => ['required', 'exists:post_types,id'],
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['nullable', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['name']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (Taxonomy::query()
            ->where('post_type_id', $validated['post_type_id'])
            ->where('slug', $slug)
            ->where('id', '!=', $taxonomy->id)
            ->exists()) {
            return back()->with('error', 'Slug already exists for this post type.');
        }

        $taxonomy->update([
            'post_type_id' => $validated['post_type_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'is_active' => (bool) $validated['is_active'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        return back()->with('status', 'Taxonomy updated.');
    }

    public function destroy(Taxonomy $taxonomy)
    {
        $taxonomy->delete();

        return redirect()->route('admin.taxonomies.index')->with('status', 'Taxonomy deleted.');
    }
}
