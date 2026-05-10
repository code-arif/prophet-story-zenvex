<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Subscriptions Table
 * 
 * This migration creates the subscriptions table for tracking
 * user subscriptions to services via MSISDN (phone number).
 * 
 * Features:
 * - Tracks subscription status (active, canceled)
 * - Records subscription period (starts_at, ends_at)
 * - Stores channel information (SMS, USSD, etc.)
 * - Unique constraint on (msisdn, status) to prevent duplicates
 * 
 * Both msisdn and status are indexed for faster queries.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates the subscriptions table with fields for
     * managing user subscriptions.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();                               // Primary key
            $table->string('msisdn')->index();           // Phone number (indexed)
            $table->string('status')->index();           // Status: active, canceled (indexed)
            $table->timestamp('starts_at')->nullable(); // Subscription start
            $table->timestamp('ends_at')->nullable();   // Subscription end
            $table->string('channel')->nullable();      // Channel: SMS, USSD, etc.
            $table->text('last_message')->nullable();   // Last message sent
            $table->timestamps();                       // created_at and updated_at

            $table->unique(['msisdn', 'status']);      // Prevent duplicate active subscriptions
        });
    }

    /**
     * Reverse the migrations.
     * 
     * Drops the subscriptions table.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
