<?php

namespace App\Models\EasyRise;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedbacks';

    protected $fillable = [
        'user_id',
        'name',
        'contact',
        'rating',
        'message',
        'status',
    ];
}
