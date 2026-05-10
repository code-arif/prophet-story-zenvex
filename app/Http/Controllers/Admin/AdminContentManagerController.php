<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\PostType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminContentManagerController extends Controller
{
    public function index(Request $request)
    {
        $contentType = $request->query('content_type', 'all');  // all | articles | pages
        $search      = (string) $request->query('search', '');
        $postTypeId  = $request->query('post_type_id', '');
        $categoryId  = $request->query('category_id', '');
        $visibility  = $request->query('visibility', '');
        $sortBy      = $request->query('sort_by', 'updated_at');
        $sortDir     = $request->query('sort_dir', 'desc');
        $perPage     = max(1, min(100, (int) $request->query('per_page', 20)));
        $page        = max(1, (int) $request->query('page', 1));

        $items = collect();

        // ── Articles ──────────────────────────────────────────
        if ($contentType === 'all' || $contentType === 'articles') {
            $cols = ['id', 'title', 'slug', 'visibility', 'updated_at', 'published_at', 'category_id', 'post_type_id'];
            if (Schema::hasColumn('articles', 'featured_image_path')) {
                $cols[] = 'featured_image_path';
            }

            $q = Article::query()->select($cols);

            if ($search !== '') {
                $q->where(function ($qq) use ($search) {
                    $qq->where('title', 'like', "%{$search}%")
                       ->orWhere('slug', 'like', "%{$search}%");
                });
            }

            if ($postTypeId !== '') {
                $q->where('post_type_id', (int) $postTypeId);
            }

            if ($categoryId !== '') {
                $q->where('category_id', (int) $categoryId);
            }

            if ($visibility !== '') {
                $q->where('visibility', $visibility);
            }

            $articles = $q->with(['category:id,name,slug', 'postType:id,name,slug'])
                ->orderBy($sortBy === 'title' ? 'title' : 'updated_at', $sortDir)
                ->get();

            $items = $items->merge($articles->map(fn ($a) => [
                'id'          => $a->id,
                'content_type'=> 'article',
                'title'       => $a->title,
                'slug'        => $a->slug,
                'visibility'  => $a->visibility ?? 'public',
                'updated_at'  => $a->updated_at?->toIso8601String(),
                'published_at'=> $a->published_at?->toIso8601String(),
                'category'    => $a->category ? ['id' => $a->category->id, 'name' => $a->category->name] : null,
                'post_type'   => $a->postType ? ['id' => $a->postType->id, 'name' => $a->postType->name] : null,
                'edit_url'    => "/admin/articles/{$a->id}/edit",
                'view_url'    => "/articles/{$a->slug}",
            ]));
        }

        // ── Pages ─────────────────────────────────────────────
        if ($contentType === 'all' || $contentType === 'pages') {
            $q = Page::query()->select(['id', 'title', 'slug', 'is_published', 'use_builder', 'visibility', 'updated_at']);

            if ($search !== '') {
                $q->where(function ($qq) use ($search) {
                    $qq->where('title', 'like', "%{$search}%")
                       ->orWhere('slug', 'like', "%{$search}%");
                });
            }

            if ($visibility !== '') {
                if ($visibility === 'public') {
                    $q->where('is_published', true);
                } elseif ($visibility === 'draft') {
                    $q->where('is_published', false);
                }
            }

            $pages = $q->orderBy('updated_at', $sortDir)->get();

            $items = $items->merge($pages->map(fn ($p) => [
                'id'          => $p->id,
                'content_type'=> 'page',
                'title'       => $p->title,
                'slug'        => $p->slug,
                'visibility'  => $p->is_published ? 'public' : 'draft',
                'updated_at'  => $p->updated_at?->toIso8601String(),
                'published_at'=> null,
                'category'    => null,
                'post_type'   => null,
                'use_builder' => $p->use_builder,
                'edit_url'    => "/admin/pages/{$p->id}/edit",
                'view_url'    => "/p/{$p->slug}",
            ]));
        }

        // ── Sort combined ─────────────────────────────────────
        $items = $sortDir === 'desc'
            ? $items->sortByDesc('updated_at')->values()
            : $items->sortBy('updated_at')->values();

        // ── Paginate ──────────────────────────────────────────
        $total     = $items->count();
        $lastPage  = max(1, (int) ceil($total / $perPage));
        $page      = min($page, $lastPage);
        $pagedItems = $items->forPage($page, $perPage)->values();

        $pagination = [
            'total'        => $total,
            'per_page'     => $perPage,
            'current_page' => $page,
            'last_page'    => $lastPage,
            'from'         => $total === 0 ? 0 : ($page - 1) * $perPage + 1,
            'to'           => min($page * $perPage, $total),
        ];

        // ── Stats ─────────────────────────────────────────────
        $stats = [
            'total_articles'    => Article::query()->count(),
            'published_articles'=> Article::query()->where('visibility', 'public')->count(),
            'draft_articles'    => Article::query()->where('visibility', 'draft')->count(),
            'total_pages'       => Page::query()->count(),
            'published_pages'   => Page::query()->where('is_published', true)->count(),
            'by_post_type'      => PostType::query()
                ->withCount('articles')
                ->orderBy('sort_order')
                ->get(['id', 'name', 'articles_count'])
                ->map(fn ($pt) => ['name' => $pt->name, 'count' => $pt->articles_count]),
        ];

        return Inertia::render('Admin/ContentManager/Index', [
            'items'      => $pagedItems,
            'pagination' => $pagination,
            'stats'      => $stats,
            'postTypes'  => PostType::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
            'categories' => Category::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'filters'    => [
                'content_type' => $contentType,
                'search'       => $search,
                'post_type_id' => $postTypeId,
                'category_id'  => $categoryId,
                'visibility'   => $visibility,
                'sort_by'      => $sortBy,
                'sort_dir'     => $sortDir,
                'per_page'     => $perPage,
                'page'         => $page,
            ],
        ]);
    }

    public function destroy(Request $request, string $type, int $id)
    {
        if ($type === 'article') {
            Article::query()->findOrFail($id)->delete();
        } elseif ($type === 'page') {
            Page::query()->findOrFail($id)->delete();
        }

        return back()->with('status', ucfirst($type) . ' deleted.');
    }
}
