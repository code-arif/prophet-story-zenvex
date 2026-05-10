<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (!Schema::hasColumn('articles', 'category_id')) {
                $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete()->after('id');
            }
            if (!Schema::hasColumn('articles', 'is_breaking')) {
                $table->boolean('is_breaking')->default(false)->index()->after('published_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'is_breaking')) {
                $table->dropColumn('is_breaking');
            }
            if (Schema::hasColumn('articles', 'category_id')) {
                $table->dropConstrainedForeignId('category_id');
            }
        });
    }
};
