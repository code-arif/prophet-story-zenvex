<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Kid Profiles Table
 *
 * Lightweight child profile management for parents without separate auth.
 * Stores child name, default reader mode (defaults to 'kid'), and an optional
 * curated subset of unlocked Prophet story IDs (null/empty = all unlocked).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kid_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_user_id')->index();
            $table->string('name');
            $table->string('default_reader_mode')->default('kid');
            $table->json('unlocked_prophet_ids')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kid_profiles');
    }
};
