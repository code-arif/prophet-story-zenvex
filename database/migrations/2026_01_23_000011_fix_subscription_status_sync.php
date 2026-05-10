<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!DB::getSchemaBuilder()->hasTable('subscriptions')) {
            return;
        }

        $msisdns = DB::table('subscriptions')->distinct()->pluck('msisdn');

        foreach ($msisdns as $msisdn) {
            $active = DB::table('subscriptions')
                ->where('msisdn', $msisdn)
                ->where('status', 'active')
                ->first();

            $canceled = DB::table('subscriptions')
                ->where('msisdn', $msisdn)
                ->where('status', 'canceled')
                ->first();

            // If active is currently active, remove canceled row.
            if ($active && $active->ends_at === null) {
                DB::table('subscriptions')
                    ->where('msisdn', $msisdn)
                    ->where('status', 'canceled')
                    ->delete();
                continue;
            }

            // If canceled exists, remove any active row (ended or not).
            if ($canceled) {
                DB::table('subscriptions')
                    ->where('msisdn', $msisdn)
                    ->where('status', 'active')
                    ->delete();
                continue;
            }

            // If we only have an ended active row, convert it into a canceled row.
            if ($active) {
                DB::table('subscriptions')->updateOrInsert(
                    ['msisdn' => $msisdn, 'status' => 'canceled'],
                    [
                        'starts_at' => null,
                        'ends_at' => $active->ends_at ?? now(),
                        'channel' => $active->channel ?? null,
                        'last_message' => $active->last_message ?? null,
                        'created_at' => $active->created_at ?? now(),
                        'updated_at' => now(),
                    ]
                );

                DB::table('subscriptions')
                    ->where('msisdn', $msisdn)
                    ->where('status', 'active')
                    ->delete();
            }
        }
    }

    public function down(): void
    {
        // no-op (data normalization)
    }
};
