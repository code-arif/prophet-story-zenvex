<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bdapps_events', function (Blueprint $table) {
            $table->id();
            $table->string('direction', 8); // in|out
            $table->string('service', 64);
            $table->string('http_method', 8)->default('POST');
            $table->text('url')->nullable();
            $table->unsignedInteger('status_code')->nullable();
            $table->json('headers')->nullable();
            $table->json('request')->nullable();
            $table->json('response')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();

            $table->index(['direction', 'service']);
            $table->index(['service', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bdapps_events');
    }
};
