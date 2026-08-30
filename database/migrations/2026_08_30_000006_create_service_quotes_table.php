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
        Schema::create('service_quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_request_id')->constrained('service_requests')->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained('service_provider_profiles')->cascadeOnDelete();
            $table->decimal('estimated_total', 10, 2);
            $table->decimal('visit_charge', 10, 2)->nullable();
            $table->decimal('labor_charge', 10, 2)->nullable();
            $table->decimal('materials_charge', 10, 2)->nullable();
            $table->text('breakdown_note')->nullable();
            $table->enum('status', ['sent', 'accepted', 'rejected'])->default('sent');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_quotes');
    }
};
