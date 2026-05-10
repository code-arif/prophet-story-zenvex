<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\AppSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/**
 * SearchController - Handles article search functionality
 * 
 * This controller provides search functionality for articles.
 * It searches through article titles and excerpts for matching keywords.
 * 
 * Features:
 * - Case-insensitive search in title and excerpt
 * - Limits results to 40 for performance
 * - Includes category information if available
 * - Returns results via Inertia to Search/Index page
 */
class SearchController extends Controller
{
    /**
     * Handle search request and return matching articles.
     * 
     * @param Request $request The HTTP request containing 'q' query parameter
     * @param AppSettings $settings Application settings service
     * @return \Inertia\Response
     */
    public function __invoke(Request $request, AppSettings $settings)
    {
        $q = trim((string) $request->query('q', ''));

        $cols = ['id', 'category_id', 'slug', 'title', 'excerpt', 'published_at', 'featured_image_path', 'is_breaking'];
        if (Schema::hasColumn('articles', 'view_count')) {
            $cols[] = 'view_count';
        }

        $results = collect();

        if ($q !== '') {
            $query = Article::query()
                ->whereNotNull('published_at')
                ->where(function ($sub) use ($q) {
                    $sub->where('title', 'like', "%{$q}%")
                        ->orWhere('excerpt', 'like', "%{$q}%");
                })
                ->orderByDesc('published_at');

            if (Schema::hasTable('categories')) {
                $query->with(['category:id,slug,name']);
            }

            $results = $query->limit(40)->get($cols);
        }

        return Inertia::render('Search/Index', [
            'brandName' => $settings->brandName(),
            'q' => $q,
            'results' => $results,
        ]);
    }
}
