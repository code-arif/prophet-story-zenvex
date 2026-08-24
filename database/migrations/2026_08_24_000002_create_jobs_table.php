<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('easy_rise_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->string('title');
            $table->enum('status', ['prospect', 'applied', 'active', 'delivered', 'awaiting_payment', 'closed'])->default('prospect');
            $table->date('deadline')->nullable();
            $table->unsignedBigInteger('agreed_paisa')->default(0);
            $table->string('currency', 10)->default('BDT');
            $table->unsignedSmallInteger('concepts')->default(0);
            $table->unsignedSmallInteger('revisions')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('easy_rise_jobs');
    }
};
