<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Learner\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * AdminQuizController — manage practice quizzes (quick / topic / level).
 */
class AdminQuizController extends Controller
{
    public const LEVELS = ['A1', 'A2', 'B1'];
    public const KINDS = ['quick', 'topic', 'level'];

    public function index(Request $request)
    {
        $query = Quiz::query();

        $search = $request->query('search');
        if ($search) {
            $query->where('title_bn', 'like', '%' . $search . '%')
                ->orWhere('topic', 'like', '%' . $search . '%');
        }

        $kind = $request->query('kind');
        if (in_array($kind, self::KINDS, true)) {
            $query->where('kind', $kind);
        }

        $quizzes = $query->orderBy('sort_order')->orderBy('title_bn')->paginate(20)->withQueryString();

        return Inertia::render('Admin/LearnerContent/Quizzes/Index', [
            'quizzes' => $quizzes,
            'filters' => ['search' => $search ?? '', 'kind' => $kind ?? ''],
            'kinds' => self::KINDS,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LearnerContent/Quizzes/Edit', [
            'mode' => 'create',
            'levels' => self::LEVELS,
            'kinds' => self::KINDS,
            'quiz' => [
                'slug' => '',
                'kind' => 'quick',
                'title_bn' => '',
                'description_bn' => '',
                'topic' => '',
                'level' => 'A2',
                'questions' => [['topic' => '', 'q' => '', 'options' => ['', '', '', ''], 'answer' => 0, 'reasonBn' => '']],
                'duration_minutes' => 3,
                'sort_order' => 0,
                'is_active' => true,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateQuiz($request);

        $quiz = Quiz::create($this->quizData($validated, null));

        return redirect()->route('admin.learner.quizzes.edit', $quiz)->with('status', 'Quiz created.');
    }

    public function edit(Quiz $quiz)
    {
        return Inertia::render('Admin/LearnerContent/Quizzes/Edit', [
            'mode' => 'edit',
            'levels' => self::LEVELS,
            'kinds' => self::KINDS,
            'quiz' => [
                'id' => $quiz->id,
                'slug' => $quiz->slug,
                'kind' => $quiz->kind,
                'title_bn' => $quiz->title_bn,
                'description_bn' => $quiz->description_bn,
                'topic' => $quiz->topic,
                'level' => $quiz->level,
                'questions' => $quiz->questions ?: [],
                'duration_minutes' => $quiz->duration_minutes,
                'sort_order' => $quiz->sort_order,
                'is_active' => $quiz->is_active,
            ],
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $this->validateQuiz($request);

        $quiz->update($this->quizData($validated, $quiz->id));

        return back()->with('status', 'Quiz saved.');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();

        return redirect()->route('admin.learner.quizzes.index')->with('status', 'Quiz deleted.');
    }

    private function validateQuiz(Request $request): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:120'],
            'kind' => ['required', 'string', 'in:quick,topic,level'],
            'title_bn' => ['required', 'string', 'max:160'],
            'description_bn' => ['nullable', 'string', 'max:400'],
            'topic' => ['nullable', 'string', 'max:80'],
            'level' => ['required', 'string', 'in:A1,A2,B1'],
            'questions' => ['array', 'min:1'],
            'questions.*.topic' => ['nullable', 'string', 'max:80'],
            'questions.*.q' => ['required', 'string', 'max:400'],
            'questions.*.options' => ['array', 'min:2'],
            'questions.*.answer' => ['nullable', 'integer', 'min:0'],
            'questions.*.reasonBn' => ['nullable', 'string', 'max:400'],
            'duration_minutes' => ['nullable', 'integer', 'min:1', 'max:240'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    private function quizData(array $v, ?int $exceptId): array
    {
        $slugInput = trim((string) ($v['slug'] ?? $v['title_bn']));
        $slug = Str::slug($slugInput);
        if ($slug === '') {
            $slug = 'quiz-' . substr(sha1($slugInput . (string) time()), 0, 10);
        }

        $original = $slug;
        $counter = 1;
        while (Quiz::query()->where('slug', $slug)->where('id', '!=', $exceptId ?? 0)->exists()) {
            $slug = $original . '-' . $counter++;
        }

        $questions = collect($v['questions'] ?? [])
            ->filter(fn ($q) => !empty($q['q']))
            ->map(fn ($q) => [
                'topic' => $q['topic'] ?? null,
                'q' => $q['q'],
                'options' => array_values(array_filter($q['options'] ?? [])),
                'answer' => (int) ($q['answer'] ?? 0),
                'reasonBn' => $q['reasonBn'] ?? null,
            ])
            ->values()
            ->all();

        return [
            'slug' => $slug,
            'kind' => $v['kind'],
            'title_bn' => $v['title_bn'],
            'description_bn' => $v['description_bn'] ?? null,
            'topic' => $v['topic'] ?? null,
            'level' => $v['level'],
            'questions' => $questions,
            'duration_minutes' => (int) ($v['duration_minutes'] ?? 3),
            'sort_order' => (int) ($v['sort_order'] ?? 0),
            'is_active' => (bool) ($v['is_active'] ?? true),
        ];
    }
}
