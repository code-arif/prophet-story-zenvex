<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert guest mode setting if not exists
        DB::table('settings')->updateOrInsert(
            ['key' => 'guest_mode.enabled'],
            ['value' => 'false']
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->where('key', 'guest_mode.enabled')->delete();
    }
};
