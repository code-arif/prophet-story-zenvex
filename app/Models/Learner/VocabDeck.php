<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * VocabDeck — a vocabulary deck shown on the vocabulary screen.
 */
class VocabDeck extends Model
{
    protected $table = 'vocab_decks';

    protected $fillable = [
        'slug', 'name', 'icon_key', 'tint_class', 'level',
        'description', 'sort_order', 'is_published',
    ];

    protected $casts = ['is_published' => 'boolean'];

    public function words(): BelongsToMany
    {
        return $this->belongsToMany(VocabularyWord::class, 'deck_word', 'deck_id', 'word_id');
    }
}
