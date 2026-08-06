<?php

namespace App\Http\Controllers\Learner;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Services\SubscriberSync;
use Illuminate\Http\Request;

/**
 * BaseController — shared helpers for the "Learn English" learner controllers.
 */
abstract class BaseController extends Controller
{
    /**
     * Resolve the current logged-in subscriber from the session MSISDN.
     * The auth middleware (EnsureLearner) guarantees the msisdn exists.
     */
    protected function subscriber(Request $request): Subscriber
    {
        $msisdn = (string) $request->session()->get('msisdn', '');

        $subscriber = Subscriber::query()->where('msisdn', $msisdn)->first();
        if ($subscriber) {
            return $subscriber;
        }

        // Edge case: subscriber record was deleted while session persisted.
        return app(SubscriberSync::class)->ensureExists($msisdn);
    }
}
