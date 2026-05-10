<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Users Table
 * 
 * This migration creates the core tables for Laravel's authentication system:
 * - users: Stores user accounts with name, email, password
 * - password_reset_tokens: Stores tokens for password reset functionality
 * - sessions: Stores user session data
 * 
 * These tables are essential for the admin authentication system.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates three tables:
     * 1. users - User accounts with authentication fields
     * 2. password_reset_tokens - For password reset functionality
     * 3. sessions - For session-based authentication
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();                    // Primary key
            $table->string('name');           // User's full name
            $table->string('email')->unique(); // Unique email address
            $table->timestamp('email_verified_at')->nullable(); // Email verification timestamp
            $table->string('password');       // Hashed password
            $table->rememberToken();          // Remember me token
            $table->timestamps();             // created_at and updated_at
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // User's email (primary key)
            $table->string('token');            // Reset token
            $table->timestamp('created_at')->nullable(); // Token creation time
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();           // Session ID
            $table->foreignId('user_id')->nullable()->index(); // User reference
            $table->string('ip_address', 45)->nullable(); // User's IP address
            $table->text('user_agent')->nullable();      // Browser user agent
            $table->longText('payload');                // Session data
            $table->integer('last_activity')->index();  // Last activity timestamp
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Drops all tables created by this migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
