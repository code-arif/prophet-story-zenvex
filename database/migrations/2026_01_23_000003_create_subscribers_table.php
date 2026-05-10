<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Subscribers Table
 * 
 * This migration creates the subscribers table for storing
 * subscriber information collected via SMS/USSD services.
 * 
 * Fields:
 * - msisdn: Phone number (unique identifier)
 * - name: Subscriber's name (optional)
 * - dob: Date of birth (optional)
 * - avatar_path: Path to avatar image (optional)
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates the subscribers table with fields for
     * storing subscriber profile information.
     */
    public function up(): void
    {
        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();                               // Primary key
            $table->string('msisdn')->unique();          // Phone number (unique)
            $table->string('name')->nullable();          // Subscriber name
            $table->date('dob')->nullable();             // Date of birth
            $table->string('avatar_path')->nullable();    // Avatar image path
            $table->timestamps();                        // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Drops the subscribers table.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscribers');
    }
};
