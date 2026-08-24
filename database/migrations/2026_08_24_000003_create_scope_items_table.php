<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scope_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_id')->constrained('easy_rise_jobs')->cascadeOnDelete();
            $table->date('date');
            $table->text('description');
            $table->decimal('hours', 5, 2)->default(0);
            $table->timestamps();

            $table->index(['user_id', 'job_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scope_items');
    }
};
