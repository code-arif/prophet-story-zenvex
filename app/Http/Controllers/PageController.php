<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Http\Controllers\Admin\AdminPageBuilderController;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * PageController - Handles static page display
 * 
 * This controller manages the display of static pages created in the CMS.
 * It supports both regular content pages and pages built with the
 * visual page builder (with dynamic block rendering).
 * 
 * Features:
 * - Static page rendering
 * - Dynamic page builder content rendering
 * - Real-time rendering of dynamic blocks (postLoop, categoryLoop, slider)
 */
class PageController extends Controller
{
    /**
     * Display a static page.
     * 
     * If the page uses the builder, this method dynamically renders
     * the builder content to ensure dynamic blocks reflect current data.
     * 
     * @param Request $request The HTTP request
     * @param string $slug The page slug from the URL
     * @return \Inertia\Response
     */
    public function show(Request $request, string $slug)
    {
        $page = Page::query()->where('slug', $slug)->where('is_published', true)->firstOrFail();

        // Re-render builder pages at view time so dynamic blocks (postLoop, categoryLoop,
        // slider) always reflect the latest database content.
        $content = $page->content;
        if ($page->use_builder && is_array($page->builder_data) && count($page->builder_data)) {
            $renderer = new AdminPageBuilderController();
            $content = $renderer->renderBuilderHtmlPublic($page->builder_data);
        }

        return Inertia::render('Pages/Show', [
            'page' => array_merge($page->toArray(), ['content' => $content]),
        ]);
    }
}
