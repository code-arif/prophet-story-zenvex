<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Pages Table
 * 
 * This migration creates the pages table for static pages in the CMS.
 * 
 * Features:
 * - SEO-friendly URLs via slug (unique)
 * - Page content (HTML/text)
 * - Publishing status with index for faster queries
 * 
 * Pages are used for static content like About, Contact, etc.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates the pages table with fields for
     * managing static page content.
     */
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();                               // Primary key
            $table->string('slug')->unique();             // URL-friendly identifier
            $table->string('title');                     // Page title
            $table->longText('content')->nullable();     // Page content
            $table->boolean('is_published')->default(true)->index(); // Publishing status (indexed)
            $table->timestamps();                        // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Drops the pages table.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
