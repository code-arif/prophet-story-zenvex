<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('purpose');
            $table->string('name');
            $table->enum('status', ['missing', 'expired', 'valid'])->default('missing');
            $table->date('expiry_date')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'purpose']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
