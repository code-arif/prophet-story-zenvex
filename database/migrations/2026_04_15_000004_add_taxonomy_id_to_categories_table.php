<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedBigInteger('taxonomy_id')->nullable()->after('id');
            $table->foreign('taxonomy_id')->references('id')->on('taxonomies')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['taxonomy_id']);
            $table->dropColumn('taxonomy_id');
        });
    }
};
