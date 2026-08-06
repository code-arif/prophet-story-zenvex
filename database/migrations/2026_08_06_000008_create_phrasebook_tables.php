<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phrasebook (feature 10): situation groups + per-subscriber favourites.
 * phrases.situation maps to the picker tabs (interview, doctor, bank…).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phrases', function (Blueprint $table) {
            $table->id();
            $table->string('situation');             // interview | doctor | bank | airport | classroom | shop | phone
            $table->string('group_label');           // শুরুতে / শেষে / লক্ষণ বলার সময় …
            $table->string('english');
            $table->string('bengali');
            $table->string('note')->nullable();
            $table->string('level')->default('A2');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index('situation');
        });

        Schema::create('saved_phrases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscriber_id')->constrained('subscribers')->cascadeOnDelete();
            $table->foreignId('phrase_id')->constrained('phrases')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['subscriber_id', 'phrase_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_phrases');
        Schema::dropIfExists('phrases');
    }
};
