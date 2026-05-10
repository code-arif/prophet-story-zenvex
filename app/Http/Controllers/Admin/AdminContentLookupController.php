<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use Illuminate\Http\Request;

class AdminContentLookupController extends Controller
{
    public function pages(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $items = Page::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($q2) use ($q) {
                    $q2->where('title', 'like', '%'.$q.'%')
                        ->orWhere('slug', 'like', '%'.$q.'%');
                });
            })
            ->orderByDesc('updated_at')
            ->limit(12)
            ->get(['id', 'title', 'slug', 'is_published'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'is_published' => (bool) $p->is_published,
                'href' => '/p/'.$p->slug,
            ])
            ->values();

        return response()->json(['items' => $items]);
    }

    public function articles(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $items = Article::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($q2) use ($q) {
                    $q2->where('title', 'like', '%'.$q.'%')
                        ->orWhere('slug', 'like', '%'.$q.'%');
                });
            })
            ->orderByDesc('published_at')
            ->orderByDesc('updated_at')
            ->limit(12)
            ->get(['id', 'title', 'slug', 'published_at'])
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'is_published' => $a->published_at !== null,
                'href' => '/articles/'.$a->slug,
            ])
            ->values();

        return response()->json(['items' => $items]);
    }

    /**
     * Builder loop preview — returns lightweight post/category data for the
     * S Builder canvas preview.
     *
     * GET /admin/lookup/loop-preview
     *   ?type=postLoop|categoryLoop
     *   &postTypeId=   (postLoop)
     *   &categoryId=   (postLoop)
     *   &taxonomyId=   (categoryLoop)
     *   &count=6
     *   &orderBy=latest|oldest|alpha
     */
    public function loopPreview(Request $request)
    {
        $type    = $request->query('type', 'postLoop');
        $count   = (int) min((int) $request->query('count', 6), 24);
        $orderBy = $request->query('orderBy', 'latest');

        if ($type === 'categoryLoop') {
            $taxonomyId = $request->query('taxonomyId');

            $items = Category::query()
                ->when($taxonomyId, fn ($q) => $q->where('taxonomy_id', $taxonomyId))
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->limit($count)
                ->get(['id', 'name', 'slug', 'taxonomy_id'])
                ->map(fn ($c) => [
                    'id'    => $c->id,
                    'name'  => $c->name,
                    'slug'  => $c->slug,
                    'count' => $c->articles()->whereNotNull('published_at')->count(),
                ])
                ->values();

            return response()->json(['items' => $items]);
        }

        // postLoop
        $postTypeId = $request->query('postTypeId');
        $categoryId = $request->query('categoryId');

        $query = Article::with(['category'])
            ->whereNotNull('published_at')
            ->when($postTypeId, fn ($q) => $q->where('post_type_id', $postTypeId))
            ->when($categoryId, fn ($q) => $q->where('category_id', $categoryId));

        match ($orderBy) {
            'oldest' => $query->orderBy('published_at'),
            'alpha'  => $query->orderBy('title'),
            default  => $query->orderByDesc('published_at'),
        };

        $items = $query->limit($count)->get(['id', 'title', 'slug', 'excerpt', 'featured_image_path', 'published_at', 'category_id'])
            ->map(fn ($a) => [
                'id'       => $a->id,
                'title'    => $a->title,
                'slug'     => $a->slug,
                'excerpt'  => $a->excerpt,
                'image'    => $a->featured_image_url,
                'category' => $a->category?->name,
                'date'     => $a->published_at?->format('M j, Y'),
            ])
            ->values();

        return response()->json(['items' => $items]);
    }
}
