<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoryChapterRequest;
use App\Models\Prophet;
use App\Models\StoryChapter;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * AdminStoryChapterController - Admin CRUD for StoryChapters.
 *
 * Chapters belong to a Prophet; the edit form always requires a Prophet and
 * a `source_reference` citation (enforced by StoryChapterRequest). The index
 * supports filtering by Prophet via the `prophet` query parameter.
 *
 * Narrated audio (`audio_path`) can be typed as a path/URL or uploaded as a
 * file; uploaded files land in storage under `chapter-audio/` (public disk).
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
                'audio_url' => null,
                'moral_lesson' => '',
                'source_reference' => '',
            ],
        ]);
    }

    public function store(StoryChapterRequest $request)
    {
        $data = $request->validated();
        unset($data['audio'], $data['remove_audio']);

        if ($request->hasFile('audio')) {
            $data['audio_path'] = $this->persistAudioFile($request->file('audio'));
        }

        $chapter = StoryChapter::query()->create($data);

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
                'audio_url',
                'moral_lesson',
                'source_reference',
            ]),
        ]);
    }

    public function update(StoryChapterRequest $request, StoryChapter $chapter)
    {
        $data = $request->validated();
        unset($data['audio'], $data['remove_audio']);

        // Explicit removal of the current narration audio.
        if ($request->boolean('remove_audio')) {
            $this->deleteStoredAudio($chapter);
            $data['audio_path'] = null;
        }

        // A new uploaded file replaces whatever audio existed.
        if ($request->hasFile('audio')) {
            $this->deleteStoredAudio($chapter);
            $data['audio_path'] = $this->persistAudioFile($request->file('audio'));
        }

        $chapter->update($data);

        return back()->with('status', 'Chapter saved.');
    }

    public function destroy(StoryChapter $chapter)
    {
        $this->deleteStoredAudio($chapter);
        $chapter->delete();

        return redirect()->route('admin.story-chapters.index')->with('status', 'Chapter deleted.');
    }

    /**
     * Store an uploaded narration file on the public disk.
     */
    private function persistAudioFile(UploadedFile $file): string
    {
        return $file->storePubliclyAs(
            'chapter-audio',
            Str::uuid()->toString() . '.' . $file->getClientOriginalExtension(),
            'public'
        );
    }

    /**
     * Remove a stored audio file when it lives in chapter-audio/ (i.e. was
     * uploaded here, not picked from a URL/media library).
     */
    private function deleteStoredAudio(StoryChapter $chapter): void
    {
        if ($chapter->audio_path && str_starts_with($chapter->audio_path, 'chapter-audio/')) {
            Storage::disk('public')->delete($chapter->audio_path);
        }
    }
}