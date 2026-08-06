<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Learner\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * AdminLessonController — manage the Learn English lesson ladder
 * (level → unit → ordered lessons with explanation, examples and exercises).
 */
class AdminLessonController extends Controller
{
    public const LEVELS = ['A1', 'A2', 'B1'];

    public function index(Request $request)
    {
        $query = Lesson::query();

        $search = $request->query('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', '%' . $search . '%')
                  ->orWhere('title_bn', 'like', '%' . $search . '%');
            });
        }

        $level = $request->query('level');
        if (in_array($level, self::LEVELS, true)) {
            $query->where('level', $level);
        }

        $sortDir = $request->query('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy('level')->orderBy('unit_no', $sortDir)->orderBy('order_index', $sortDir);

        $lessons = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/LearnerContent/Lessons/Index', [
            'lessons' => $lessons,
            'filters' => ['search' => $search ?? '', 'level' => $level ?? ''],
            'levels' => self::LEVELS,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LearnerContent/Lessons/Edit', [
            'mode' => 'create',
            'levels' => self::LEVELS,
            'lesson' => [
                'level' => 'A1',
                'unit_no' => 1,
                'order_index' => 0,
                'title_en' => '',
                'title_bn' => '',
                'subtitle_bn' => '',
                'explanation_bn' => '',
                'examples' => [['en' => '', 'bn' => '']],
                'exercises' => [['typeBn' => 'শূন্যস্থান পূরণ', 'q' => '', 'options' => ['', ''], 'answer' => 0, 'explanationBn' => '']],
                'estimated_minutes' => 5,
                'is_published' => true,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateLesson($request);

        $lesson = Lesson::create($this->lessonData($validated));

        return redirect()->route('admin.learner.lessons.edit', $lesson)->with('status', 'Lesson created.');
    }

    public function edit(Lesson $lesson)
    {
        return Inertia::render('Admin/LearnerContent/Lessons/Edit', [
            'mode' => 'edit',
            'levels' => self::LEVELS,
            'lesson' => [
                'id' => $lesson->id,
                'level' => $lesson->level,
                'unit_no' => $lesson->unit_no,
                'order_index' => $lesson->order_index,
                'title_en' => $lesson->title_en,
                'title_bn' => $lesson->title_bn,
                'subtitle_bn' => $lesson->subtitle_bn,
                'explanation_bn' => $lesson->explanation_bn,
                'examples' => $lesson->examples ?: [],
                'exercises' => $lesson->exercises ?: [],
                'estimated_minutes' => $lesson->estimated_minutes,
                'is_published' => $lesson->is_published,
            ],
        ]);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $validated = $this->validateLesson($request);

        $lesson->update($this->lessonData($validated));

        return back()->with('status', 'Lesson saved.');
    }

    public function destroy(Lesson $lesson)
    {
        $lesson->delete();

        return redirect()->route('admin.learner.lessons.index')->with('status', 'Lesson deleted.');
    }

    private function validateLesson(Request $request): array
    {
        return $request->validate([
            'level' => ['required', 'string', 'in:A1,A2,B1'],
            'unit_no' => ['required', 'integer', 'min:1'],
            'order_index' => ['nullable', 'integer', 'min:0'],
            'title_en' => ['required', 'string', 'max:160'],
            'title_bn' => ['nullable', 'string', 'max:160'],
            'subtitle_bn' => ['nullable', 'string', 'max:200'],
            'explanation_bn' => ['required', 'string'],
            'examples' => ['array'],
            'examples.*.en' => ['nullable', 'string', 'max:300'],
            'examples.*.bn' => ['nullable', 'string', 'max:300'],
            'exercises' => ['array'],
            'exercises.*.typeBn' => ['nullable', 'string', 'max:80'],
            'exercises.*.q' => ['required', 'string', 'max:300'],
            'exercises.*.options' => ['array', 'min:2'],
            'exercises.*.answer' => ['nullable', 'integer', 'min:0'],
            'exercises.*.explanationBn' => ['nullable', 'string', 'max:400'],
            'estimated_minutes' => ['nullable', 'integer', 'min:1', 'max:240'],
            'is_published' => ['nullable', 'boolean'],
        ]);
    }

    private function lessonData(array $v): array
    {
        $exercises = collect($v['exercises'] ?? [])
            ->filter(fn ($e) => !empty($e['q']))
            ->map(fn ($e) => [
                'typeBn' => $e['typeBn'] ?? 'শূন্যস্থান পূরণ',
                'q' => $e['q'],
                'options' => array_values(array_filter($e['options'] ?? [])),
                'answer' => (int) ($e['answer'] ?? 0),
                'explanationBn' => $e['explanationBn'] ?? null,
            ])
            ->values()
            ->all();

        $examples = collect($v['examples'] ?? [])
            ->filter(fn ($e) => !empty($e['en']) || !empty($e['bn']))
            ->map(fn ($e) => ['en' => $e['en'] ?? '', 'bn' => $e['bn'] ?? ''])
            ->values()
            ->all();

        return [
            'level' => $v['level'],
            'unit_no' => (int) $v['unit_no'],
            'order_index' => (int) ($v['order_index'] ?? 0),
            'title_en' => $v['title_en'],
            'title_bn' => $v['title_bn'] ?? null,
            'subtitle_bn' => $v['subtitle_bn'] ?? null,
            'explanation_bn' => $v['explanation_bn'],
            'examples' => $examples,
            'exercises' => $exercises,
            'estimated_minutes' => (int) ($v['estimated_minutes'] ?? 5),
            'is_published' => (bool) ($v['is_published'] ?? true),
        ];
    }
}
