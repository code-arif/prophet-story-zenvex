<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Learner\ReadingPassage;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * AdminReadingController — manage reading passages (content, glossary, questions).
 */
class AdminReadingController extends Controller
{
    public const LEVELS = ['A1', 'A2', 'B1'];

    public function index(Request $request)
    {
        $query = ReadingPassage::query();

        $search = $request->query('search');
        if ($search) {
            $query->where('title_en', 'like', '%' . $search . '%');
        }

        $level = $request->query('level');
        if (in_array($level, self::LEVELS, true)) {
            $query->where('level', $level);
        }

        $passages = $query->orderBy('sort_order')->orderBy('title_en')->paginate(20)->withQueryString();

        return Inertia::render('Admin/LearnerContent/Reading/Index', [
            'passages' => $passages,
            'filters' => ['search' => $search ?? '', 'level' => $level ?? ''],
            'levels' => self::LEVELS,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LearnerContent/Reading/Edit', [
            'mode' => 'create',
            'levels' => self::LEVELS,
            'passage' => [
                'level' => 'A1',
                'title_en' => '',
                'summary_bn' => '',
                'content' => '',
                'glossary' => [['token' => '', 'ipa' => '', 'bn' => '', 'exampleEn' => '', 'exampleBn' => '']],
                'questions' => [['q' => '', 'options' => ['', '', '', ''], 'answer' => 0]],
                'words' => 0,
                'minutes' => 3,
                'sort_order' => 0,
                'is_published' => true,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePassage($request);

        $passage = ReadingPassage::create($this->passageData($validated));

        return redirect()->route('admin.learner.reading.edit', $passage)->with('status', 'Passage created.');
    }

    public function edit(ReadingPassage $reading)
    {
        $passage = $reading;

        return Inertia::render('Admin/LearnerContent/Reading/Edit', [
            'mode' => 'edit',
            'levels' => self::LEVELS,
            'passage' => [
                'id' => $passage->id,
                'level' => $passage->level,
                'title_en' => $passage->title_en,
                'summary_bn' => $passage->summary_bn,
                'content' => $passage->content,
                'glossary' => $this->glossaryToRows($passage->glossary),
                'questions' => $passage->questions ?: [],
                'words' => $passage->words,
                'minutes' => $passage->minutes,
                'sort_order' => $passage->sort_order,
                'is_published' => $passage->is_published,
            ],
        ]);
    }

    public function update(Request $request, ReadingPassage $reading)
    {
        $validated = $this->validatePassage($request);
        $passage = $reading;

        $passage->update($this->passageData($validated));

        return back()->with('status', 'Passage saved.');
    }

    public function destroy(ReadingPassage $reading)
    {
        $reading->delete();

        return redirect()->route('admin.learner.reading.index')->with('status', 'Passage deleted.');
    }

    /** Convert the stored { token: {...} } map into editable rows. */
    private function glossaryToRows(?array $glossary): array
    {
        if (!$glossary) {
            return [];
        }

        $rows = [];
        foreach ($glossary as $token => $g) {
            $rows[] = [
                'token' => (string) $token,
                'ipa' => $g['ipa'] ?? null,
                'bn' => $g['bn'] ?? null,
                'exampleEn' => $g['exampleEn'] ?? null,
                'exampleBn' => $g['exampleBn'] ?? null,
            ];
        }

        return $rows;
    }

    private function validatePassage(Request $request): array
    {
        return $request->validate([
            'level' => ['required', 'string', 'in:A1,A2,B1'],
            'title_en' => ['required', 'string', 'max:200'],
            'summary_bn' => ['nullable', 'string', 'max:400'],
            'content' => ['required', 'string'],
            'glossary' => ['array'],
            'glossary.*.token' => ['nullable', 'string', 'max:60'],
            'glossary.*.ipa' => ['nullable', 'string', 'max:40'],
            'glossary.*.bn' => ['nullable', 'string', 'max:200'],
            'glossary.*.exampleEn' => ['nullable', 'string', 'max:300'],
            'glossary.*.exampleBn' => ['nullable', 'string', 'max:300'],
            'questions' => ['array'],
            'questions.*.q' => ['required', 'string', 'max:400'],
            'questions.*.options' => ['array', 'min:2'],
            'questions.*.answer' => ['nullable', 'integer', 'min:0'],
            'words' => ['nullable', 'integer', 'min:0'],
            'minutes' => ['nullable', 'integer', 'min:1', 'max:240'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
        ]);
    }

    private function passageData(array $v): array
    {
        $content = trim((string) $v['content']);

        // Glossary rows → { token: { ipa, bn, exampleEn, exampleBn } }
        $glossary = [];
        foreach ($v['glossary'] ?? [] as $row) {
            $token = trim((string) ($row['token'] ?? ''));
            if ($token === '') {
                continue;
            }
            $glossary[$token] = [
                'ipa' => $row['ipa'] ?? null,
                'bn' => $row['bn'] ?? null,
                'exampleEn' => $row['exampleEn'] ?? null,
                'exampleBn' => $row['exampleBn'] ?? null,
            ];
        }

        $questions = collect($v['questions'] ?? [])
            ->filter(fn ($q) => !empty($q['q']))
            ->map(fn ($q) => [
                'q' => $q['q'],
                'options' => array_values(array_filter($q['options'] ?? [])),
                'answer' => (int) ($q['answer'] ?? 0),
            ])
            ->values()
            ->all();

        return [
            'level' => $v['level'],
            'title_en' => $v['title_en'],
            'summary_bn' => $v['summary_bn'] ?? null,
            'content' => $content,
            'glossary' => $glossary ?: null,
            'questions' => $questions ?: null,
            'words' => (int) ($v['words'] ?? str_word_count($content)),
            'minutes' => (int) ($v['minutes'] ?? 3),
            'sort_order' => (int) ($v['sort_order'] ?? 0),
            'is_published' => (bool) ($v['is_published'] ?? true),
        ];
    }
}
