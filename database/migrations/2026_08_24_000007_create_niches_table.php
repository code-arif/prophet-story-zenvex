<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('niches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('profiles_found')->default(0);
            $table->unsignedInteger('jobs_posted_7d')->default(0);
            $table->unsignedBigInteger('rate_min')->default(0);
            $table->unsignedBigInteger('rate_max')->default(0);
            $table->unsignedTinyInteger('skill')->default(0);
            $table->unsignedSmallInteger('score')->default(0);
            $table->string('band')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('niches');
    }
};
