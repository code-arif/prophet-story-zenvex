<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminArticleController extends Controller
{
    private function normalizeFeaturedImagePath(?string $path): ?string
    {
        if (!$path || trim($path) === '') {
            return null;
        }

        $path = trim($path);

        // If it's already a full URL, return as-is
        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        // Remove /storage/ prefix if present
        $path = preg_replace('#^/storage/#', '', $path);
        $path = ltrim($path, '/');

        if ($path === '') {
            return null;
        }

        // Convert relative path to full ImageKit URL
        $imagekitEndpoint = config('filesystems.disks.imagekit.url_endpoint');
        if ($imagekitEndpoint) {
            return rtrim($imagekitEndpoint, '/') . '/' . $path;
        }

        // Fallback to relative path
        return $path;
    }

    private function normalizeBodyBlocks(mixed $raw): ?array
    {
        if ($raw === null || $raw === '') {
            return null;
        }

        if (is_array($raw)) {
            return $raw;
        }

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    private function blocksToPlainText(array $blocks): string
    {
        $parts = [];
        foreach ($blocks as $block) {
            if (!is_array($block)) {
                continue;
            }

            $type = (string) ($block['type'] ?? '');
            if ($type === 'heading' || $type === 'paragraph' || $type === 'quote') {
                $text = trim((string) ($block['text'] ?? ''));
                if ($text !== '') {
                    $parts[] = $text;
                }
            }

            if ($type === 'list') {
                $items = $block['items'] ?? null;
                if (is_array($items)) {
                    foreach ($items as $it) {
                        $t = trim((string) $it);
                        if ($t !== '') {
                            $parts[] = $t;
                        }
                    }
                }
            }
        }

        return trim(implode("\n\n", $parts));
    }

    public function index(Request $request)
    {
        $cols = ['id', 'slug', 'title', 'excerpt', 'published_at', 'updated_at', 'category_id'];
        if (Schema::hasColumn('articles', 'view_count')) {
            $cols[] = 'view_count';
        }

        if (Schema::hasColumn('articles', 'featured_image_path')) {
            $cols[] = 'featured_image_path';
        }

        if (Schema::hasColumn('articles', 'post_type_id')) {
            $cols[] = 'post_type_id';
        }

        $query = Article::query();

        // Search
        $search = $request->query('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('slug', 'like', '%' . $search . '%')
                  ->orWhere('excerpt', 'like', '%' . $search . '%');
            });
        }

        // Filter by post type slug
        $postTypeSlug = $request->query('post_type');
        $postType = null;
        if ($postTypeSlug && Schema::hasTable('post_types') && Schema::hasColumn('articles', 'post_type_id')) {
            $postType = \App\Models\PostType::where('slug', $postTypeSlug)->first();
            if ($postType) {
                $query->where('post_type_id', $postType->id);
            }
        }

        // Sorting
        $sortBy = $request->query('sort_by', 'published_at');
        $sortDir = $request->query('sort_dir', 'desc');
        
        $allowedSorts = ['title', 'published_at', 'view_count', 'updated_at'];
        if (in_array($sortBy, $allowedSorts)) {
            if ($sortBy === 'view_count' && !Schema::hasColumn('articles', 'view_count')) {
                $sortBy = 'published_at';
            }
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->orderByDesc('published_at')->orderByDesc('updated_at');
        }

        $perPage = app(\App\Services\AppSettings::class)->paginationArticles();
        $articles = $query->paginate($perPage, $cols);

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'filters' => [
                'search'    => $search ?? '',
                'sort_by'   => $sortBy,
                'sort_dir'  => $sortDir,
                'post_type' => $postTypeSlug ?? '',
            ],
            'postType' => $postType ? ['id' => $postType->id, 'name' => $postType->name, 'slug' => $postType->slug, 'icon' => $postType->icon] : null,
        ]);
    }

    public function create(Request $request)
    {
        $categories = [];
        if (Schema::hasTable('categories')) {
            $categories = Category::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'is_active'])
                ->values()
                ->all();
        }

        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->values()
            ->all();

        $postTypeId = null;
        $postTypeSlug = $request->query('post_type');
        $postTypes = [];
        if (Schema::hasTable('post_types')) {
            $postTypes = \App\Models\PostType::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'icon'])
                ->values()
                ->all();
            if ($postTypeSlug) {
                $pt = collect($postTypes)->firstWhere('slug', $postTypeSlug);
                $postTypeId = $pt ? $pt['id'] : null;
            }
        }

        return Inertia::render('Admin/Articles/Edit', [
            'mode' => 'create',
            'categories' => $categories,
            'users' => $users,
            'postTypes' => $postTypes,
            'article' => [
                'title' => '',
                'slug' => '',
                'excerpt' => '',
                'category_id' => null,
                'post_type_id' => $postTypeId,
                'is_breaking' => false,
                'featured_image_path' => null,
                'body' => '',
                'body_blocks' => null,
                'published_at' => null,
                'publish_by' => auth()->id(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:120'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'post_type_id' => ['nullable', 'integer', 'exists:post_types,id'],
            'is_breaking' => ['nullable', 'boolean'],
            'body' => ['nullable', 'string'],
            'body_blocks' => ['nullable'],
            'published_at' => ['nullable', 'date'],
            'publish_by' => ['nullable', 'integer', 'exists:users,id'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'featured_image_path' => ['nullable', 'string', 'max:500'],
            'visibility' => ['nullable', 'string', 'in:public,private,premium,draft'],
        ]);

        $bodyBlocks = $this->normalizeBodyBlocks($request->input('body_blocks'));
        $body = trim((string) ($validated['body'] ?? ''));
        if ($body === '' && $bodyBlocks) {
            $body = $this->blocksToPlainText($bodyBlocks);
        }
        if ($body === '' && !$bodyBlocks) {
            return back()->with('error', 'Body is required (or use the page builder).');
        }

        // Build slug from provided slug or title. If slugification fails (empty),
        // fall back to a generated slug to ensure we always have a usable value.
        $slugInput = (string) ($validated['slug'] ?? $validated['title']);
        $slug = Str::slug($slugInput);
        if ($slug === '') {
            // Fallback: use a deterministic short hash of title+time to avoid empty slugs
            $slug = 'article-' . substr(sha1($slugInput . (string) time()), 0, 12);
        }

        // Ensure uniqueness by appending a counter when necessary
        $originalSlug = $slug;
        $counter = 1;
        while (Article::query()->where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        // Determine featured image path
        $featuredImagePath = null;

        // Priority: uploaded file > media library selection
        if ($request->hasFile('featured_image')) {
            $file = $request->file('featured_image');
            $featuredImagePath = $file->storePubliclyAs(
                'article-images',
                Str::uuid()->toString().'.'.$file->getClientOriginalExtension(),
                'public'
            );
        } elseif (!empty($validated['featured_image_path'])) {
            $featuredImagePath = $this->normalizeFeaturedImagePath($validated['featured_image_path']);
        }

        $article = Article::query()->create([
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'post_type_id' => $validated['post_type_id'] ?? null,
            'is_breaking' => (bool) ($validated['is_breaking'] ?? false),
            'featured_image_path' => $featuredImagePath,
            'body' => $body,
            'body_blocks' => $bodyBlocks,
            // If published_at is not provided, default to current time
            'published_at' => $validated['published_at'] ?? now(),
            'publish_by' => $validated['publish_by'] ?? auth()->id(),
            'visibility' => $validated['visibility'] ?? 'public',
        ]);

        return redirect()->route('admin.articles.edit', $article)->with('status', 'Article created.');
    }

    public function edit(Article $article)
    {
        $categories = [];
        if (Schema::hasTable('categories')) {
            $categories = Category::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'is_active'])
                ->values()
                ->all();
        }

        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->values()
            ->all();

        $postTypes = [];
        if (Schema::hasTable('post_types')) {
            $postTypes = \App\Models\PostType::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'icon'])
                ->values()
                ->all();
        }

        return Inertia::render('Admin/Articles/Edit', [
            'mode' => 'edit',
            'categories' => $categories,
            'users' => $users,
            'postTypes' => $postTypes,
            'article' => $article->only(['id', 'title', 'slug', 'excerpt', 'category_id', 'post_type_id', 'is_breaking', 'featured_image_path', 'featured_image_url', 'body', 'body_blocks', 'published_at', 'publish_by', 'visibility']),
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:120'],
            'excerpt' => ['nullable', 'string', 'max:1000'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'post_type_id' => ['nullable', 'integer', 'exists:post_types,id'],
            'is_breaking' => ['nullable', 'boolean'],
            'body' => ['nullable', 'string'],
            'body_blocks' => ['nullable'],
            'published_at' => ['nullable', 'date'],
            'publish_by' => ['nullable', 'integer', 'exists:users,id'],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'featured_image_path' => ['nullable', 'string', 'max:500'],
            'remove_featured_image' => ['nullable', 'boolean'],
            'visibility' => ['nullable', 'string', 'in:public,private,premium,draft'],
        ]);

        $bodyBlocks = $this->normalizeBodyBlocks($request->input('body_blocks'));
        $body = trim((string) ($validated['body'] ?? ''));
        if ($body === '' && $bodyBlocks) {
            $body = $this->blocksToPlainText($bodyBlocks);
        }
        if ($body === '' && !$bodyBlocks) {
            return back()->with('error', 'Body is required (or use the page builder).');
        }

        // Build slug from provided slug or title. If slugification fails (empty),
        // fall back to a generated slug so updates don't fail when the slug is empty.
        $slugInput = (string) ($validated['slug'] ?? $validated['title']);
        $slug = Str::slug($slugInput);
        if ($slug === '') {
            $slug = 'article-' . substr(sha1($slugInput . (string) time()), 0, 12);
        }

        // Ensure uniqueness by appending a counter when necessary (exclude current article)
        $originalSlug = $slug;
        $counter = 1;
        while (Article::query()->where('slug', $slug)->where('id', '!=', $article->id)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $article->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $validated['excerpt'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'post_type_id' => $validated['post_type_id'] ?? $article->post_type_id,
            'is_breaking' => (bool) ($validated['is_breaking'] ?? false),
            'body' => $body,
            'body_blocks' => $bodyBlocks,
            // If published_at is not provided on update, set to current time
            'published_at' => $validated['published_at'] ?? now(),
            'publish_by' => $validated['publish_by'] ?? null,
            'visibility' => $validated['visibility'] ?? 'public',
        ]);

        // Handle featured image removal
        if ((bool) ($validated['remove_featured_image'] ?? false)) {
            // Only delete if it's in article-images folder (uploaded directly, not from media library)
            if ($article->featured_image_path && str_starts_with($article->featured_image_path, 'article-images/')) {
                Storage::disk('public')->delete($article->featured_image_path);
            }
            $article->featured_image_path = null;
            $article->save();
        }

        // Handle new file upload
        if ($request->hasFile('featured_image')) {
            // Delete old image if it's in article-images folder
            if ($article->featured_image_path && str_starts_with($article->featured_image_path, 'article-images/')) {
                Storage::disk('public')->delete($article->featured_image_path);
            }

            $file = $request->file('featured_image');
            $path = $file->storePubliclyAs(
                'article-images',
                Str::uuid()->toString().'.'.$file->getClientOriginalExtension(),
                'public'
            );
            $article->featured_image_path = $path;
            $article->save();
        } elseif (!empty($validated['featured_image_path']) && $validated['featured_image_path'] !== $article->featured_image_path) {
            // Media library selection
            // Delete old image if it's in article-images folder
            if ($article->featured_image_path && str_starts_with($article->featured_image_path, 'article-images/')) {
                Storage::disk('public')->delete($article->featured_image_path);
            }
            $article->featured_image_path = $this->normalizeFeaturedImagePath($validated['featured_image_path']);
            $article->save();
        }

        return back()->with('status', 'Article saved.');
    }

    public function destroy(Article $article)
    {
        if ($article->featured_image_path) {
            Storage::disk('public')->delete($article->featured_image_path);
        }

        $article->delete();

        return redirect()->route('admin.articles.index')->with('status', 'Article deleted.');
    }

    public function export()
    {
        $articles = Article::query()
            ->with('category')
            ->orderByDesc('published_at')
            ->get(['id', 'title', 'slug', 'excerpt', 'category_id', 'published_at', 'featured_image_path', 'is_breaking', 'view_count', 'body']);

        $csv = [];
        $csv[] = ['id', 'title', 'slug', 'excerpt', 'category', 'published_at', 'image_path', 'is_breaking', 'details'];

        foreach ($articles as $article) {
            $csv[] = [
                '', // Empty ID for auto-create on import
                $article->title,
                '', // Empty slug for auto-generate on import
                $article->excerpt ?? '',
                $article->category?->name ?? '',
                $article->published_at ? $article->published_at->format('Y-m-d H:i:s') : '',
                $article->featured_image_path ?? '',
                $article->is_breaking ? 'Yes' : 'No',
                $article->body ?? '', // Keep HTML formatting
            ];
        }

        $filename = 'articles_export_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');
        
        foreach ($csv as $row) {
            fputcsv($handle, $row);
        }
        
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    public function import(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:10240'], // 10MB
            'confirm' => ['nullable', 'boolean'],
            'decisions' => ['nullable', 'array'],
        ]);

        $file = $validated['file'];
        $handle = fopen($file->getRealPath(), 'r');
        
        if (!$handle) {
            return response()->json(['message' => 'Failed to open file'], 400);
        }

        // Skip header row
        $header = fgetcsv($handle);
        
        $imported = 0;
        $errors = [];
        $conflicts = [];
        $rowIndex = 0;
        $decisions = $validated['decisions'] ?? [];
        $isConfirmed = $validated['confirm'] ?? false;

        while (($row = fgetcsv($handle)) !== false) {
            try {
                // CSV columns: id, title, slug, excerpt, category, published_at, image_path, is_breaking, details
                if (count($row) < 2) continue; // Need at least title

                $csvId = trim($row[0] ?? '');
                $title = trim($row[1] ?? ''); // Title
                
                if (empty($title)) {
                    $errors[] = 'Skipped row: Title is required';
                    continue;
                }

                // Generate slug from title if empty
                $slug = trim($row[2] ?? '');
                if (empty($slug)) {
                    $slug = Str::slug($title);
                }

                // Check for conflicts by ID or slug
                $existingArticle = null;
                if (!empty($csvId) && is_numeric($csvId)) {
                    $existingArticle = Article::find($csvId);
                }
                if (!$existingArticle) {
                    $existingArticle = Article::where('slug', $slug)->first();
                }

                // If conflict found and not confirmed, collect conflicts
                if ($existingArticle && !$isConfirmed) {
                    $conflicts[] = [
                        'index' => $rowIndex,
                        'csv_title' => $title,
                        'csv_slug' => $slug,
                        'existing_id' => $existingArticle->id,
                        'existing_title' => $existingArticle->title,
                        'existing_slug' => $existingArticle->slug,
                        'row_data' => $row,
                    ];
                    $rowIndex++;
                    continue;
                }

                // Find or create category by name
                $categoryId = null;
                $categoryName = trim($row[4] ?? '');
                if (!empty($categoryName)) {
                    $category = \App\Models\Category::query()
                        ->where('name', 'like', $categoryName)
                        ->first();
                    
                    if (!$category) {
                        // Create new category if not found
                        $categorySlug = Str::slug($categoryName);
                        $originalCategorySlug = $categorySlug;
                        $catCounter = 1;
                        while (\App\Models\Category::query()->where('slug', $categorySlug)->exists()) {
                            $categorySlug = $originalCategorySlug . '-' . $catCounter++;
                        }
                        
                        $category = \App\Models\Category::create([
                            'name' => $categoryName,
                            'slug' => $categorySlug,
                            'is_active' => true,
                            'sort_order' => 999,
                        ]);
                    }
                    
                    $categoryId = $category->id;
                }

                // Parse published date
                $publishedAt = trim($row[5] ?? '');
                if (empty($publishedAt)) {
                    $publishedAt = now();
                }

                // Get article body/details
                $body = trim($row[8] ?? '');
                if (empty($body)) {
                    $body = 'Please edit to add content.';
                }

                $articleData = [
                    'title' => $title,
                    'slug' => $slug,
                    'excerpt' => trim($row[3] ?? '') ?: null,
                    'category_id' => $categoryId,
                    'published_at' => $publishedAt,
                    'featured_image_path' => trim($row[6] ?? '') ?: null,
                    'is_breaking' => isset($row[7]) && strtolower(trim($row[7])) === 'yes',
                    'body' => $body,
                ];

                // Handle confirmed import with decisions
                if ($isConfirmed && isset($decisions[$rowIndex])) {
                    $decision = $decisions[$rowIndex];
                    
                    if ($decision === 'overwrite' && $existingArticle) {
                        $existingArticle->update($articleData);
                        $imported++;
                    } elseif ($decision === 'create_new') {
                        // Generate unique slug for new article
                        $originalSlug = $slug;
                        $counter = 1;
                        while (Article::query()->where('slug', $slug)->exists()) {
                            $slug = $originalSlug . '-' . $counter++;
                        }
                        $articleData['slug'] = $slug;
                        Article::create($articleData);
                        $imported++;
                    }
                    // 'skip' decision means do nothing
                } else {
                    // No conflict, create new article
                    Article::create($articleData);
                    $imported++;
                }

                $rowIndex++;
            } catch (\Exception $e) {
                $errors[] = 'Row error: ' . $e->getMessage();
                $rowIndex++;
            }
        }

        fclose($handle);

        // If conflicts found, return them for user decision
        if (!empty($conflicts) && !$isConfirmed) {
            return response()->json([
                'conflicts' => $conflicts,
                'message' => count($conflicts) . ' conflict(s) found. Please choose how to handle them.',
            ], 409); // 409 Conflict status
        }

        if ($imported > 0) {
            return response()->json([
                'message' => "Successfully imported {$imported} articles." . (count($errors) > 0 ? ' Some rows had errors.' : ''),
                'imported' => $imported,
                'errors' => $errors,
            ]);
        }

        return response()->json([
            'message' => 'No articles were imported. ' . implode(' ', array_slice($errors, 0, 5)),
        ], 400);
    }
}
