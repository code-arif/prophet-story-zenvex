<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->timestamp('viewed_at')->useCurrent()->index();
            $table->string('fingerprint', 64)->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_views');
    }
};
