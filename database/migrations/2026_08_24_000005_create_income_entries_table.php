<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('income_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_id')->nullable()->constrained('easy_rise_jobs')->nullOnDelete();
            $table->date('date');
            $table->string('currency', 10)->default('BDT');
            $table->unsignedBigInteger('amount_paisa')->default(0);
            $table->decimal('rate', 8, 2)->default(0);
            $table->string('channel')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('income_entries');
    }
};
