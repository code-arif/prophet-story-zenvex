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
        Schema::table('service_provider_profiles', function (Blueprint $table) {
            $table->decimal('visit_charge', 10, 2)->nullable()->after('years_experience');
            $table->decimal('hourly_rate', 10, 2)->nullable()->after('visit_charge');
            $table->text('pricing_note')->nullable()->after('hourly_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_provider_profiles', function (Blueprint $table) {
            $table->dropColumn(['visit_charge', 'hourly_rate', 'pricing_note']);
        });
    }
};
