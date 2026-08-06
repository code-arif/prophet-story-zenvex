<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lessons — the curriculum ladder (feature 1). Content blocks are stored as
 * JSON so the lesson player can render explanation → examples → exercises
 * without extra joins. Exercises: [{ typeBn, q, options[], answer, explanationBn }]
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('level');                 // A1 | A2 | B1
            $table->unsignedSmallInteger('unit_no')->default(1);
            $table->unsignedInteger('order_index')->default(0);
            $table->string('title_en');
            $table->string('title_bn')->nullable();
            $table->string('subtitle_bn')->nullable();
            $table->text('explanation_bn');
            $table->json('examples');                // [{ en, bn }]
            $table->json('exercises');               // [{ typeBn, q, options[], answer, explanationBn }]
            $table->unsignedSmallInteger('estimated_minutes')->default(5);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['level', 'unit_no', 'order_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
