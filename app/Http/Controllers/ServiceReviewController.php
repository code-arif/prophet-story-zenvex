<?php

namespace App\Http\Controllers;

use App\Models\ServiceReview;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ServiceReviewController extends Controller
{
    /**
     * Store post-job customer rating and price-fairness signal.
     */
    public function store(Request $request)
    {
        $user = auth()->user() ?? $request->user();

        $validated = $request->validate([
            'service_request_id' => ['required', 'exists:service_requests,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'price_fairness' => ['required', 'in:fair,slightly_high,overpriced'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $serviceRequest = ServiceRequest::findOrFail($validated['service_request_id']);

        // Rule 1: Must be the customer who created the request
        if ($serviceRequest->customer_id !== $user->id) {
            abort(403, 'কেবলমাত্র কাজের কাস্টমার রিভিউ দিতে পারবেন।');
        }

        // Rule 2: ServiceRequest status must be 'completed'
        if ($serviceRequest->status !== 'completed') {
            return redirect()->back()->withErrors([
                'service_request_id' => 'কাজ সম্পন্ন হওয়ার পরই রিভিউ দেওয়া সম্ভব।',
            ]);
        }

        // Rule 3: Only allowed once
        if ($serviceRequest->review()->exists()) {
            return redirect()->back()->withErrors([
                'service_request_id' => 'আপনি ইতিপূর্বে এই কাজের রিভিউ প্রদান করেছেন।',
            ]);
        }

        $review = ServiceReview::create([
            'service_request_id' => $serviceRequest->id,
            'reviewer_id' => $user->id,
            'provider_id' => $serviceRequest->provider_id,
            'rating' => $validated['rating'],
            'price_fairness' => $validated['price_fairness'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return redirect()->back()->with('success', 'আপনার মূল্যবান মতামত ও রেটিং জমা দেওয়া হয়েছে! ধন্যবাদ।');
    }
}
