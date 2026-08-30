<?php

namespace App\Http\Controllers;

use App\Models\ServiceDispute;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ServiceDisputeController extends Controller
{
    /**
     * Store a new dispute report for a Service Request.
     */
    public function store(Request $request)
    {
        $user = auth()->user() ?? $request->user();

        $validated = $request->validate([
            'service_request_id' => ['required', 'exists:service_requests,id'],
            'reason' => ['required', 'in:no_show,poor_quality,price_disagreement,other'],
            'description' => ['required', 'string', 'min:10'],
        ]);

        $serviceRequest = ServiceRequest::findOrFail($validated['service_request_id']);

        // Check user permission (customer or provider)
        $isCustomer = $serviceRequest->customer_id === $user->id;
        $isProvider = $serviceRequest->provider && $serviceRequest->provider->user_id === $user->id;

        if (!$isCustomer && !$isProvider && !$user->isAdmin()) {
            abort(403, 'এই কাজের সমস্যা রিপোর্ট করার অনুমতি নেই।');
        }

        // Disputes are allowed once request is accepted or later
        if (in_array($serviceRequest->status, ['pending', 'declined', 'cancelled'])) {
            return redirect()->back()->with('error', 'অনুমোদিত বা চলতি কাজের ক্ষেত্রেই কেবল সমস্যা রিপোর্ট করা সম্ভব।');
        }

        ServiceDispute::create([
            'service_request_id' => $serviceRequest->id,
            'raised_by' => $user->id,
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'status' => 'open',
        ]);

        return redirect()->back()->with('success', 'আপনার রিপোর্টটি জমা নেওয়া হয়েছে। অ্যাডমিন টিম এবং অপর পক্ষ বিষয়টি পর্যবেক্ষণ করবে।');
    }
}
