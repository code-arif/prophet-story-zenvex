<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Learner\SubscriberVocabulary;
use App\Models\Learner\VocabDeck;
use App\Models\Learner\VocabularyWord;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * AdminVocabController — manage vocabulary decks (and their words).
 * Words are edited inline inside the deck form and synced on save.
 */
class AdminVocabController extends Controller
{
    public const LEVELS = ['A1', 'A2', 'B1'];
    public const ICON_KEYS = ['home', 'briefcase', 'graduation', 'plane', 'star', 'book'];
    public const TINT_CLASSES = [
        'bg-learn-primary-tint text-learn-primary' => 'Blue',
        'bg-[#EEF1FF] text-[#6366F1]' => 'Indigo',
        'bg-[#DDF3EC] text-[#0D9488]' => 'Teal',
        'bg-learn-warn-tint text-learn-warn' => 'Amber',
        'bg-[#FDEBEF] text-[#E11D48]' => 'Rose',
        'bg-[#F3E8FF] text-[#9333EA]' => 'Purple',
    ];

    public function index(Request $request)
    {
        $query = VocabDeck::query()->withCount('words');

        $search = $request->query('search');
        if ($search) {
            $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('slug', 'like', '%' . $search . '%');
        }

        $decks = $query->orderBy('sort_order')->orderBy('name')->paginate(20)->withQueryString();

        return Inertia::render('Admin/LearnerContent/Vocab/Index', [
            'decks' => $decks,
            'filters' => ['search' => $search ?? ''],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LearnerContent/Vocab/Edit', [
            'mode' => 'create',
            'levels' => self::LEVELS,
            'iconKeys' => self::ICON_KEYS,
            'tintClasses' => collect(self::TINT_CLASSES)->map(fn ($label, $class) => ['value' => $class, 'label' => $label])->values()->all(),
            'deck' => [
                'slug' => '',
                'name' => '',
                'icon_key' => 'home',
                'tint_class' => array_key_first(self::TINT_CLASSES),
                'level' => 'A1',
                'description' => '',
                'sort_order' => 0,
                'is_published' => true,
                'words' => [['word' => '', 'ipa' => '', 'meaning_bn' => '', 'example_en' => '', 'example_bn' => '', 'level' => 'A1']],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateDeck($request);

        $deck = VocabDeck::create($this->deckData($validated, null));

        $this->syncWords($deck, $validated['words'] ?? []);

        return redirect()->route('admin.learner.vocabulary.edit', $deck)->with('status', 'Deck created.');
    }

    public function edit(VocabDeck $vocabulary)
    {
        $deck = $vocabulary;

        return Inertia::render('Admin/LearnerContent/Vocab/Edit', [
            'mode' => 'edit',
            'levels' => self::LEVELS,
            'iconKeys' => self::ICON_KEYS,
            'tintClasses' => collect(self::TINT_CLASSES)->map(fn ($label, $class) => ['value' => $class, 'label' => $label])->values()->all(),
            'deck' => [
                'id' => $deck->id,
                'slug' => $deck->slug,
                'name' => $deck->name,
                'icon_key' => $deck->icon_key,
                'tint_class' => $deck->tint_class,
                'level' => $deck->level,
                'description' => $deck->description,
                'sort_order' => $deck->sort_order,
                'is_published' => $deck->is_published,
                'words' => $deck->words()->orderBy('id')->get()->map(fn ($w) => [
                    'id' => $w->id,
                    'word' => $w->word,
                    'ipa' => $w->ipa,
                    'meaning_bn' => $w->meaning_bn,
                    'example_en' => $w->example_en,
                    'example_bn' => $w->example_bn,
                    'level' => $w->level,
                ])->all(),
            ],
        ]);
    }

    public function update(Request $request, VocabDeck $vocabulary)
    {
        $deck = $vocabulary;
        $validated = $this->validateDeck($request);

        $deck->update($this->deckData($validated, $deck->id));

        $this->syncWords($deck, $validated['words'] ?? []);

        return back()->with('status', 'Deck saved.');
    }

    public function destroy(VocabDeck $vocabulary)
    {
        // Unlink words; delete only the ones no learner saved and no other deck uses.
        $deck = $vocabulary;
        foreach ($deck->words()->pluck('vocabulary_words.id') as $wordId) {
            $this->detachAndMaybeDelete((int) $wordId, $deck);
        }
        $deck->delete();

        return redirect()->route('admin.learner.vocabulary.index')->with('status', 'Deck deleted.');
    }

    private function validateDeck(Request $request): array
    {
        return $request->validate([
            'slug' => ['nullable', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:120'],
            'icon_key' => ['nullable', 'string', 'max:40'],
            'tint_class' => ['nullable', 'string', 'max:200'],
            'level' => ['required', 'string', 'in:A1,A2,B1'],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'words' => ['array'],
            'words.*.word' => ['required_with:words.*.meaning_bn', 'string', 'max:80'],
            'words.*.ipa' => ['nullable', 'string', 'max:40'],
            'words.*.meaning_bn' => ['nullable', 'string', 'max:200'],
            'words.*.example_en' => ['nullable', 'string', 'max:300'],
            'words.*.example_bn' => ['nullable', 'string', 'max:300'],
            'words.*.level' => ['nullable', 'string', 'in:A1,A2,B1'],
            'words.*.id' => ['nullable', 'integer'],
            'words.*._remove' => ['nullable', 'boolean'],
        ]);
    }

    private function deckData(array $v, ?int $exceptId): array
    {
        $slugInput = trim((string) ($v['slug'] ?? $v['name']));
        $slug = Str::slug($slugInput);
        if ($slug === '') {
            $slug = 'deck-' . substr(sha1($slugInput . (string) time()), 0, 10);
        }

        $original = $slug;
        $counter = 1;
        while (VocabDeck::query()->where('slug', $slug)->where('id', '!=', $exceptId ?? 0)->exists()) {
            $slug = $original . '-' . $counter++;
        }

        return [
            'slug' => $slug,
            'name' => $v['name'],
            'icon_key' => $v['icon_key'] ?? 'home',
            'tint_class' => $v['tint_class'] ?? array_key_first(self::TINT_CLASSES),
            'level' => $v['level'],
            'description' => $v['description'] ?? null,
            'sort_order' => (int) ($v['sort_order'] ?? 0),
            'is_published' => (bool) ($v['is_published'] ?? true),
        ];
    }

    /** Create / update / detach words submitted inside the deck form. */
    private function syncWords(VocabDeck $deck, array $words): void
    {
        $before = $deck->words()->pluck('vocabulary_words.id')->all();

        foreach ($words as $row) {
            if (!empty($row['_remove'])) {
                continue;
            }

            $word = trim((string) ($row['word'] ?? ''));
            if ($word === '') {
                continue;
            }

            $data = [
                'word' => $word,
                'ipa' => $row['ipa'] ?? null,
                'meaning_bn' => $row['meaning_bn'] ?? null,
                'example_en' => $row['example_en'] ?? null,
                'example_bn' => $row['example_bn'] ?? null,
                'level' => !empty($row['level']) ? $row['level'] : $deck->level,
            ];

            if (!empty($row['id']) && $deck->words()->where('vocabulary_words.id', $row['id'])->exists()) {
                VocabularyWord::query()->whereKey($row['id'])->update($data);
            } else {
                $wordModel = VocabularyWord::create($data);
                $deck->words()->syncWithoutDetaching([$wordModel->id]);
            }
        }

        // Words explicitly removed → detach (delete only when unreferenced by learners).
        $kept = [];
        foreach ($words as $row) {
            if (!empty($row['_remove'])) {
                if (!empty($row['id'])) {
                    $this->detachAndMaybeDelete((int) $row['id'], $deck);
                }
                continue;
            }
            if (!empty($row['id'])) {
                $kept[] = (int) $row['id'];
            }
        }

        $removed = array_diff($before, $kept);
        if ($removed !== []) {
            $deck->words()->detach($removed);
        }
    }

    private function detachAndMaybeDelete(int $wordId, VocabDeck $deck): void
    {
        $deck->words()->detach($wordId);

        $word = VocabularyWord::find($wordId);
        if (!$word) {
            return;
        }

        $inOtherDecks = $word->decks()->where('vocab_decks.id', '!=', $deck->id)->exists();
        $usedByLearners = SubscriberVocabulary::query()->where('word_id', $wordId)->exists();

        if (!$inOtherDecks && !$usedByLearners) {
            $word->delete();
        }
    }
}
