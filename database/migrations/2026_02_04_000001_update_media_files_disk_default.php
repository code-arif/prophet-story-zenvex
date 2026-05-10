<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing media files disk to 'public' if NULL
        DB::table('media_files')
            ->whereNull('disk')
            ->update(['disk' => 'public']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
