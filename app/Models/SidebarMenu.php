<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SidebarMenu extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'icon',
        'path',
        'permission',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::saved(fn () => \Illuminate\Support\Facades\Cache::forget('sidebar_menus'));
        static::deleted(fn () => \Illuminate\Support\Facades\Cache::forget('sidebar_menus'));
    }

    public function children()
    {
        return $this->hasMany(SidebarMenu::class, 'parent_id');
    }
}
