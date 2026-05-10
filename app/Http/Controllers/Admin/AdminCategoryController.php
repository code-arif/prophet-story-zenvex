<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Taxonomy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query()
            ->with(['taxonomy:id,name,slug,post_type_id', 'taxonomy.postType:id,name,slug'])
            ->orderBy('sort_order')
            ->orderBy('name');

        $taxonomySlug = $request->query('taxonomy');
        $activeTaxonomy = null;
        if ($taxonomySlug && \Illuminate\Support\Facades\Schema::hasTable('taxonomies')) {
            $activeTaxonomy = Taxonomy::where('slug', $taxonomySlug)->first();
            if ($activeTaxonomy) {
                $query->where('taxonomy_id', $activeTaxonomy->id);
            }
        }

        $categories = $query->get(['id', 'taxonomy_id', 'slug', 'name', 'sort_order', 'is_active', 'show_in_nav', 'updated_at']);

        return Inertia::render('Admin/Categories/Index', [
            'categories'     => $categories,
            'filters'        => ['taxonomy' => $taxonomySlug ?? ''],
            'activeTaxonomy' => $activeTaxonomy ? ['id' => $activeTaxonomy->id, 'name' => $activeTaxonomy->name, 'slug' => $activeTaxonomy->slug] : null,
        ]);
    }

    public function create(Request $request)
    {
        $taxonomies = Taxonomy::query()
            ->with(['postType:id,name,slug'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'post_type_id', 'name', 'slug']);

        $preselectedTaxonomyId = null;
        $taxonomySlug = $request->query('taxonomy');
        if ($taxonomySlug) {
            $tx = $taxonomies->firstWhere('slug', $taxonomySlug);
            $preselectedTaxonomyId = $tx?->id;
        }

        return Inertia::render('Admin/Categories/Edit', [
            'mode' => 'create',
            'taxonomies' => $taxonomies,
            'category' => [
                'taxonomy_id' => $preselectedTaxonomyId,
                'name' => '',
                'slug' => '',
                'sort_order' => 0,
                'is_active' => true,
                'show_in_nav' => true,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'taxonomy_id' => ['nullable', 'exists:taxonomies,id'],
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['nullable', 'string', 'max:80'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['required', 'boolean'],
            'show_in_nav' => ['required', 'boolean'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['name']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (Category::query()->where('slug', $slug)->exists()) {
            return back()->with('error', 'Slug already exists.');
        }

        $category = Category::query()->create([
            'taxonomy_id' => $validated['taxonomy_id'] ?? null,
            'name' => $validated['name'],
            'slug' => $slug,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => (bool) $validated['is_active'],
            'show_in_nav' => (bool) $validated['show_in_nav'],
        ]);

        return redirect()->route('admin.categories.edit', $category)->with('status', 'Category created.');
    }

    public function edit(Category $category)
    {
        $taxonomies = Taxonomy::query()
            ->with(['postType:id,name,slug'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'post_type_id', 'name', 'slug']);

        return Inertia::render('Admin/Categories/Edit', [
            'mode' => 'edit',
            'taxonomies' => $taxonomies,
            'category' => $category->only(['id', 'taxonomy_id', 'name', 'slug', 'sort_order', 'is_active', 'show_in_nav']),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'taxonomy_id' => ['nullable', 'exists:taxonomies,id'],
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['nullable', 'string', 'max:80'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['required', 'boolean'],
            'show_in_nav' => ['required', 'boolean'],
        ]);

        $slug = Str::slug((string) ($validated['slug'] ?? $validated['name']));
        if ($slug === '') {
            return back()->with('error', 'Slug is required.');
        }

        if (Category::query()->where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
            return back()->with('error', 'Slug already exists.');
        }

        $category->update([
            'taxonomy_id' => $validated['taxonomy_id'] ?? null,
            'name' => $validated['name'],
            'slug' => $slug,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => (bool) $validated['is_active'],
            'show_in_nav' => (bool) $validated['show_in_nav'],
        ]);

        return back()->with('status', 'Category saved.');
    }

    public function destroy(Category $category)
    {
        // Keep it safe: allow deletion only if no articles use it.
        if ($category->articles()->exists()) {
            return back()->with('error', 'Category has articles. Remove assignments first.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')->with('status', 'Category deleted.');
    }
}
