<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Prophets Table
 *
 * Core content entity — the Prophets whose narratives the app presents.
 * `chronological_order` drives the library browse view sequencing.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prophets', function (Blueprint $table) {
            $table->id();
            $table->string('name');                     // Name in the app language (e.g. Bengali)
            $table->string('name_arabic')->nullable();  // Arabic name (إبراهيم)
            $table->text('short_intro');                // One-two line introduction
            $table->string('cover_image_path');         // Cover image path for the library card
            $table->integer('chronological_order')->index(); // Sequencing for the browse view
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prophets');
    }
};