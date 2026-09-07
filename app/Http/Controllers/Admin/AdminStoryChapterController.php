<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoryChapterRequest;
use App\Models\Prophet;
use App\Models\StoryChapter;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * AdminStoryChapterController - Admin CRUD for StoryChapters.
 *
 * Chapters belong to a Prophet; the edit form always requires a Prophet and
 * a `source_reference` citation (enforced by StoryChapterRequest). The index
 * supports filtering by Prophet via the `prophet` query parameter.
 */
class AdminStoryChapterController extends Controller
{
    public function index(Request $request)
    {
        $query = StoryChapter::query()
            ->with('prophet:id,name,name_arabic');

        $prophetId = (int) $request->query('prophet', 0);
        if ($prophetId > 0) {
            $query->where('prophet_id', $prophetId);
        }

        $chapters = $query
            ->orderBy('chapter_number')
            ->orderBy('id')
            ->paginate(25);

        $prophets = Prophet::query()
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get(['id', 'name', 'name_arabic']);

        return Inertia::render('Admin/StoryChapters/Index', [
            'chapters' => $chapters,
            'prophets' => $prophets,
            'filters' => ['prophet' => $prophetId > 0 ? $prophetId : ''],
        ]);
    }

    public function create(Request $request)
    {
        $prophets = Prophet::query()
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get(['id', 'name', 'name_arabic']);

        $preselectedProphetId = (int) $request->query('prophet', 0);

        return Inertia::render('Admin/StoryChapters/Edit', [
            'mode' => 'create',
            'prophets' => $prophets,
            'chapter' => [
                'prophet_id' => $preselectedProphetId > 0 ? $preselectedProphetId : '',
                'chapter_number' => 1,
                'title' => '',
                'content_standard' => '',
                'content_kid_friendly' => '',
                'illustration_path' => '',
                'audio_path' => '',
                'moral_lesson' => '',
                'source_reference' => '',
            ],
        ]);
    }

    public function store(StoryChapterRequest $request)
    {
        $chapter = StoryChapter::query()->create($request->validated());

        // Convenience for entering many chapters of one prophet in a row.
        if ($request->boolean('save_and_add')) {
            return redirect()->route('admin.story-chapters.create', ['prophet' => $chapter->prophet_id])
                ->with('status', 'Chapter created.');
        }

        return redirect()->route('admin.story-chapters.edit', $chapter)->with('status', 'Chapter created.');
    }

    public function edit(StoryChapter $chapter)
    {
        $prophets = Prophet::query()
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get(['id', 'name', 'name_arabic']);

        return Inertia::render('Admin/StoryChapters/Edit', [
            'mode' => 'edit',
            'prophets' => $prophets,
            'chapter' => $chapter->only([
                'id',
                'prophet_id',
                'chapter_number',
                'title',
                'content_standard',
                'content_kid_friendly',
                'illustration_path',
                'audio_path',
                'moral_lesson',
                'source_reference',
            ]),
        ]);
    }

    public function update(StoryChapterRequest $request, StoryChapter $chapter)
    {
        $chapter->update($request->validated());

        return back()->with('status', 'Chapter saved.');
    }

    public function destroy(StoryChapter $chapter)
    {
        $chapter->delete();

        return redirect()->route('admin.story-chapters.index')->with('status', 'Chapter deleted.');
    }
}