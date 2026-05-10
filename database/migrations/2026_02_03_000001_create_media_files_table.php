<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('original_name');
            $table->string('path');
            $table->string('disk')->default('public');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->string('type')->default('file'); // file, image, apk, video, document
            $table->string('collection')->nullable(); // grouping: 'apk', 'images', etc.
            $table->text('description')->nullable();
            $table->string('version')->nullable(); // for APKs
            $table->boolean('is_active')->default(true); // for APKs: currently downloadable version
            $table->unsignedBigInteger('download_count')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['type', 'collection']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
