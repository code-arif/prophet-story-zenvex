<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reminder_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_id')->constrained('easy_rise_jobs')->cascadeOnDelete();
            $table->string('step');
            $table->timestamp('sent_at');
            $table->timestamps();

            $table->index(['user_id', 'job_id', 'step']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reminder_logs');
    }
};
