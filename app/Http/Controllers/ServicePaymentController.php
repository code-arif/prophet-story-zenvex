<?php

namespace App\Http\Controllers;

use App\Models\ServicePayment;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ServicePaymentController extends Controller
{
    /**
     * Store or update payment record for a completed Service Request.
     */
    public function store(Request $request)
    {
        $user = auth()->user() ?? $request->user();

        $validated = $request->validate([
            'service_request_id' => ['required', 'exists:service_requests,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'method' => ['required', 'in:cash,bkash,nagad'],
            'transaction_id' => ['nullable', 'string', 'max:255'],
        ]);

        $serviceRequest = ServiceRequest::findOrFail($validated['service_request_id']);

        $payment = ServicePayment::updateOrCreate(
            ['service_request_id' => $serviceRequest->id],
            [
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'transaction_id' => $validated['transaction_id'] ?? null,
                'status' => 'pending',
            ]
        );

        $msg = $validated['method'] === 'cash' 
            ? 'ক্যাশ পেমেন্ট মেথড রেকর্ড করা হয়েছে। প্রাপ্তি নিশ্চিত করতে কনফার্ম বাটনে চাপুন।'
            : 'MFS (' . strtoupper($validated['method']) . ') পেমেন্ট তথ্য সংরক্ষণ করা হয়েছে!';

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Confirm payment received or paid (Customer or Provider).
     */
    public function confirm(Request $request, $id)
    {
        $user = auth()->user() ?? $request->user();
        $payment = ServicePayment::with('serviceRequest')->findOrFail($id);

        $serviceRequest = $payment->serviceRequest;

        $isCustomer = $serviceRequest->customer_id === $user->id;
        $isProvider = $serviceRequest->provider && $serviceRequest->provider->user_id === $user->id;

        if (!$isCustomer && !$isProvider && !$user->isAdmin()) {
            abort(403, 'পেমেন্ট কনফার্ম করার অনুমতি নেই।');
        }

        $payment->status = 'confirmed';
        $payment->confirmed_by = $user->id;
        $payment->confirmed_at = now();
        $payment->save();

        return redirect()->back()->with('success', 'পেমেন্ট সফলভাবে কনফার্ম করা হয়েছে! ধন্যবাদ।');
    }
}
