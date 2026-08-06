<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * VocabularyWord — a flashcard front (English) / back (Bangla).
 */
class VocabularyWord extends Model
{
    protected $fillable = [
        'word', 'ipa', 'meaning_bn', 'example_en', 'example_bn', 'level',
    ];

    public function decks(): BelongsToMany
    {
        return $this->belongsToMany(VocabDeck::class, 'deck_word', 'word_id', 'deck_id');
    }
}
