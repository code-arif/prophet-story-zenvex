<?php

namespace App\Http\Controllers;

use App\Models\ServiceProviderProfile;
use App\Models\ServiceRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderDashboardController extends Controller
{
    /**
     * Display the operational home dashboard for service providers.
     */
    public function index(Request $request)
    {
        $user = auth()->user() ?? $request->user();
        $provider = ServiceProviderProfile::with(['user', 'serviceCategories'])->where('user_id', $user->id)->first();

        if (!$provider) {
            return redirect()->route('provider.setup')->with('info', 'প্রোভাইডার ড্যাশবোর্ড ব্যবহারের পূর্বে আপনার প্রোফাইল সেটআপ সম্পন্ন করুন।');
        }

        $categoryIds = $provider->serviceCategories->pluck('id')->toArray();

        // 1. Pending Incoming Requests (Direct to this provider OR Broadcast matching category)
        $pendingRequests = ServiceRequest::query()
            ->with(['customer', 'category', 'serviceQuotes'])
            ->where('status', 'pending')
            ->where(function ($q) use ($provider, $categoryIds) {
                $q->where('provider_id', $provider->id)
                  ->orWhere(function ($bq) use ($categoryIds) {
                      $bq->where('request_mode', 'broadcast')
                         ->whereIn('category_id', $categoryIds);
                  });
            })
            ->latest()
            ->get();

        // 2. Active Jobs (Assigned to this provider with active statuses)
        $activeJobs = ServiceRequest::query()
            ->with(['customer', 'category', 'serviceQuotes', 'conversation'])
            ->where('provider_id', $provider->id)
            ->whereIn('status', ['accepted', 'en_route', 'in_progress'])
            ->latest()
            ->get();

        // 3. Completed Jobs (Assigned to this provider)
        $completedJobs = ServiceRequest::query()
            ->with(['customer', 'category', 'serviceQuotes', 'review'])
            ->where('provider_id', $provider->id)
            ->where('status', 'completed')
            ->latest()
            ->get();

        // Monthly Earnings Calculation (Current Month)
        $currentMonth = Carbon::now();
        $completedThisMonth = ServiceRequest::query()
            ->where('provider_id', $provider->id)
            ->where('status', 'completed')
            ->whereYear('updated_at', $currentMonth->year)
            ->whereMonth('updated_at', $currentMonth->month)
            ->with('serviceQuotes')
            ->get();

        $monthlyEarnings = 0;
        foreach ($completedThisMonth as $job) {
            $acceptedQuote = $job->serviceQuotes->where('status', 'accepted')->first();
            if ($acceptedQuote) {
                $monthlyEarnings += (float) $acceptedQuote->estimated_total;
            } else {
                $monthlyEarnings += (float) ($provider->visit_charge ?? 150);
            }
        }

        return Inertia::render('Provider/Dashboard', [
            'provider' => $provider,
            'pendingRequests' => $pendingRequests,
            'activeJobs' => $activeJobs,
            'completedJobs' => $completedJobs,
            'monthlyEarnings' => $monthlyEarnings,
            'completedThisMonthCount' => $completedThisMonth->count(),
        ]);
    }
}
