<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Convert stored MSISDNs from +8801... to 8801... (digits only)
        // Keep it minimal and safe: only strip leading '+'.
        foreach (['subscribers', 'subscriptions', 'sms_messages'] as $table) {
            try {
                DB::statement("UPDATE {$table} SET msisdn = SUBSTR(msisdn, 2) WHERE msisdn LIKE '+%'");
            } catch (\Throwable $e) {
                // Table may not exist in some environments; ignore.
            }
        }
    }

    public function down(): void
    {
        // No-op: restoring previous format isn't necessary.
    }
};
