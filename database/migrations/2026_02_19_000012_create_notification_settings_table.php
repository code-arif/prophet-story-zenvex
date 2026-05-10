<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            
            // Prayer notifications
            $table->boolean('prayer_fajr')->default(false);
            $table->boolean('prayer_dhuhr')->default(false);
            $table->boolean('prayer_asr')->default(false);
            $table->boolean('prayer_maghrib')->default(false);
            $table->boolean('prayer_isha')->default(false);
            $table->integer('prayer_reminder_minutes')->default(15); // Minutes before prayer
            
            // Learning notifications
            $table->boolean('quran_daily_reminder')->default(false);
            $table->time('quran_reminder_time')->nullable();
            $table->boolean('live_class_reminder')->default(false);
            $table->integer('live_class_reminder_minutes')->default(30);
            
            // Notification channels
            $table->boolean('browser_notifications')->default(false);
            $table->boolean('email_notifications')->default(true);
            $table->boolean('sms_notifications')->default(false);
            
            $table->timestamps();

            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_settings');
    }
};
