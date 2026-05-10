<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

class LoopPreviewController extends Controller
{
    /**
     * Public endpoint for live loop-block data on page views.
     *
     * GET /api/loop-preview
     *   ?type=postLoop|categoryLoop
     *   &postTypeId=
     *   &categoryId=
     *   &taxonomyId=
     *   &count=6
     *   &orderBy=latest|oldest|alpha
     *   &page=1
     */
    public function index(Request $request)
    {
        $type    = $request->query('type', 'postLoop');
        $count   = (int) min((int) $request->query('count', 6), 24);
        $page    = max(1, (int) $request->query('page', 1));
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
                    'href'  => '/category/' . $c->slug,
                ])
                ->values();

            return response()->json(['items' => $items, 'total' => $items->count(), 'pages' => 1]);
        }

        // postLoop
        $postTypeId = $request->query('postTypeId');
        $categoryId = $request->query('categoryId');

        $query = Article::with(['category'])
            ->whereNotNull('published_at')
            ->where('visibility', 'public')
            ->when($postTypeId, fn ($q) => $q->where('post_type_id', $postTypeId))
            ->when($categoryId, fn ($q) => $q->where('category_id', $categoryId));

        match ($orderBy) {
            'oldest' => $query->orderBy('published_at'),
            'alpha'  => $query->orderBy('title'),
            default  => $query->orderByDesc('published_at'),
        };

        $paginator = $query->paginate($count, ['id', 'title', 'slug', 'excerpt', 'featured_image_path', 'published_at', 'category_id', 'visibility'], 'page', $page);

        $items = collect($paginator->items())->map(fn ($a) => [
            'id'       => $a->id,
            'title'    => $a->title,
            'slug'     => $a->slug,
            'excerpt'  => $a->excerpt,
            'image'    => $a->featured_image_url,
            'category' => $a->category?->name,
            'date'     => $a->published_at?->format('M j, Y'),
            'href'     => '/articles/' . $a->slug,
        ])->values();

        return response()->json([
            'items'       => $items,
            'total'       => $paginator->total(),
            'pages'       => $paginator->lastPage(),
            'currentPage' => $paginator->currentPage(),
        ]);
    }
}
