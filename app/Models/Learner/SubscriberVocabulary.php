<?php

namespace App\Models\Learner;

use Illuminate\Database\Eloquent\Model;

/**
 * SubscriberVocabulary — per-learner SRS state for a vocabulary word.
 * Rating: 0 = জানি না, 1 = কঠিন, 2 = জানি.
 */
class SubscriberVocabulary extends Model
{
    protected $table = 'subscriber_vocabulary';

    protected $fillable = [
        'subscriber_id', 'word_id', 'rating', 'repetitions', 'due_at', 'saved',
    ];

    protected $casts = [
        'due_at' => 'date',
        'saved' => 'boolean',
    ];

    public function word()
    {
        return $this->belongsTo(VocabularyWord::class, 'word_id');
    }
}
