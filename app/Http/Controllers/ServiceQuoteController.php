<?php

namespace App\Http\Controllers;

use App\Models\ServiceProviderProfile;
use App\Models\ServiceQuote;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ServiceQuoteController extends Controller
{
    /**
     * Store a new estimated quote for a service request (Provider side).
     */
    public function store(Request $request)
    {
        $user = auth()->user() ?? $request->user();
        $provider = ServiceProviderProfile::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'service_request_id' => ['required', 'exists:service_requests,id'],
            'estimated_total' => ['required', 'numeric', 'min:0'],
            'visit_charge' => ['nullable', 'numeric', 'min:0'],
            'labor_charge' => ['nullable', 'numeric', 'min:0'],
            'materials_charge' => ['nullable', 'numeric', 'min:0'],
            'breakdown_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $serviceRequest = ServiceRequest::findOrFail($validated['service_request_id']);

        $quote = ServiceQuote::create([
            'service_request_id' => $serviceRequest->id,
            'provider_id' => $provider->id,
            'estimated_total' => $validated['estimated_total'],
            'visit_charge' => $validated['visit_charge'] ?? $provider->visit_charge,
            'labor_charge' => $validated['labor_charge'] ?? 0,
            'materials_charge' => $validated['materials_charge'] ?? 0,
            'breakdown_note' => $validated['breakdown_note'] ?? null,
            'status' => 'sent',
        ]);

        return redirect()->back()->with('success', 'আপনার কাজের খরচের আনুমানিক হিসাবটি কাস্টমারের কাছে পাঠানো হয়েছে!');
    }

    /**
     * Customer accepts a service quote.
     */
    public function accept(Request $request, $id)
    {
        $quote = ServiceQuote::with(['serviceRequest'])->findOrFail($id);
        $user = auth()->user() ?? $request->user();

        // Ensure user is the customer of the request
        if ($quote->serviceRequest->customer_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $quote->status = 'accepted';
        $quote->save();

        // Update service request status & provider assignment
        $serviceRequest = $quote->serviceRequest;
        $serviceRequest->status = 'accepted';
        $serviceRequest->provider_id = $quote->provider_id;
        $serviceRequest->save();

        // Auto-create chat conversation for timing and access coordination
        $serviceRequest->getOrCreateConversation();

        return redirect()->back()->with('success', 'আপনি প্রোভাইডারের প্রাইস কোটেশনটি গ্রহণ করেছেন! চ্যাটে বিস্তারিত আলোচনা করুন।');
    }

    /**
     * Customer rejects a service quote.
     */
    public function reject(Request $request, $id)
    {
        $quote = ServiceQuote::with(['serviceRequest'])->findOrFail($id);
        $user = auth()->user() ?? $request->user();

        if ($quote->serviceRequest->customer_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $quote->status = 'rejected';
        $quote->save();

        return redirect()->back()->with('success', 'প্রাইস কোটেশনটি প্রত্যাখ্যান করা হয়েছে।');
    }
}
