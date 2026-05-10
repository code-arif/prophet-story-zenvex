<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'featured_image_path')) {
                $table->string('featured_image_path')->nullable()->after('excerpt');
            }
            if (!Schema::hasColumn('articles', 'body_blocks')) {
                $table->json('body_blocks')->nullable()->after('body');
            }
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'body_blocks')) {
                $table->dropColumn('body_blocks');
            }
            if (Schema::hasColumn('articles', 'featured_image_path')) {
                $table->dropColumn('featured_image_path');
            }
        });
    }
};
