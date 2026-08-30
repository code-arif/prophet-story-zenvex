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
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('provider_id')->nullable()->constrained('service_provider_profiles')->nullOnDelete();
            $table->enum('request_mode', ['direct', 'broadcast'])->default('direct');
            $table->foreignId('category_id')->constrained('service_categories')->cascadeOnDelete();
            $table->text('description');
            $table->json('photo_paths')->nullable();
            $table->enum('urgency', ['scheduled', 'urgent_today', 'emergency_now'])->default('urgent_today');
            $table->date('preferred_date')->nullable();
            $table->string('preferred_time_slot')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->text('address_note');
            $table->string('district')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('status', [
                'pending',
                'accepted',
                'declined',
                'en_route',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
