<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProphetRequest;
use App\Models\Prophet;
use Inertia\Inertia;

/**
 * AdminProphetController - Admin CRUD for Prophets.
 *
 * Follows the same pattern as the other admin content controllers:
 * Inertia-rendered index/create/edit pages, form-request validation,
 * redirect-to-edit after create. Deleting a Prophet is blocked while it
 * still has chapters.
 */
class AdminProphetController extends Controller
{
    public function index()
    {
        $prophets = Prophet::query()
            ->withCount('chapters')
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Prophets/Index', [
            'prophets' => $prophets,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Prophets/Edit', [
            'mode' => 'create',
            'prophet' => [
                'name' => '',
                'name_arabic' => '',
                'short_intro' => '',
                'cover_image_path' => '',
                'chronological_order' => 1,
            ],
            'chapters' => [],
        ]);
    }

    public function store(ProphetRequest $request)
    {
        $prophet = Prophet::query()->create($request->validated());

        return redirect()->route('admin.prophets.edit', $prophet)->with('status', 'Prophet created.');
    }

    public function edit(Prophet $prophet)
    {
        $chapters = $prophet->chapters()
            ->get(['id', 'chapter_number', 'title', 'source_reference']);

        return Inertia::render('Admin/Prophets/Edit', [
            'mode' => 'edit',
            'prophet' => $prophet->only([
                'id',
                'name',
                'name_arabic',
                'short_intro',
                'cover_image_path',
                'cover_image_url',
                'chronological_order',
            ]),
            'chapters' => $chapters,
        ]);
    }

    public function update(ProphetRequest $request, Prophet $prophet)
    {
        $prophet->update($request->validated());

        return back()->with('status', 'Prophet saved.');
    }

    public function destroy(Prophet $prophet)
    {
        // Keep it safe: allow deletion only if no chapters reference it.
        if ($prophet->chapters()->exists()) {
            return back()->with('error', 'Prophet has story chapters. Delete the chapters first.');
        }

        $prophet->delete();

        return redirect()->route('admin.prophets.index')->with('status', 'Prophet deleted.');
    }
}