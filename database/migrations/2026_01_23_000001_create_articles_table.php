<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Articles Table
 * 
 * This migration creates the articles table for the CMS.
 * Articles are the main content type and support:
 * - SEO-friendly URLs via slug
 * - Publishing workflow with published_at timestamp
 * - Excerpts for article summaries
 * - Full body content (HTML/text)
 * 
 * The published_at field is indexed for faster queries.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates the articles table with fields for
     * content management and publishing.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();                              // Primary key
            $table->string('slug')->unique();           // URL-friendly identifier
            $table->string('title');                    // Article title
            $table->text('excerpt')->nullable();        // Short summary
            $table->longText('body');                   // Main content
            $table->timestamp('published_at')->nullable()->index(); // Publication date (indexed)
            $table->timestamps();                       // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Drops the articles table.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
