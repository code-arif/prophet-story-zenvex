<?php

namespace App\Http\Controllers;

use App\Models\RequestMessage;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestMessageController extends Controller
{
    /**
     * Display chat conversation thread for a Service Request.
     */
    public function show(Request $request, $id)
    {
        $user = auth()->user() ?? $request->user();

        $serviceRequest = ServiceRequest::with([
            'customer',
            'provider.user',
            'category',
            'conversation.messages.sender'
        ])->findOrFail($id);

        // Authorization check: User must be either the customer or the provider
        $isCustomer = $serviceRequest->customer_id === $user->id;
        $isProvider = $serviceRequest->provider && $serviceRequest->provider->user_id === $user->id;

        if (!$isCustomer && !$isProvider && !$user->isAdmin()) {
            abort(403, 'এই চ্যাট থ্রেড অ্যাক্সেস করার অনুমতি নেই।');
        }

        // Auto-create conversation if not present
        $conversation = $serviceRequest->getOrCreateConversation();
        $conversation->load('messages.sender');

        return Inertia::render('ServiceRequests/Chat', [
            'serviceRequest' => $serviceRequest,
            'conversation' => $conversation,
            'messages' => $conversation->messages,
            'currentUser' => $user,
        ]);
    }

    /**
     * Store new message in request conversation.
     */
    public function store(Request $request, $id)
    {
        $user = auth()->user() ?? $request->user();

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $serviceRequest = ServiceRequest::findOrFail($id);

        // Authorization check
        $isCustomer = $serviceRequest->customer_id === $user->id;
        $isProvider = $serviceRequest->provider && $serviceRequest->provider->user_id === $user->id;

        if (!$isCustomer && !$isProvider && !$user->isAdmin()) {
            abort(403, 'মেসেজ পাঠানোর অনুমতি নেই।');
        }

        $conversation = $serviceRequest->getOrCreateConversation();

        $message = RequestMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $validated['body'],
        ]);

        $conversation->touch(); // Update conversation timestamp

        return redirect()->back()->with('success', 'মেসেজ পাঠানো হয়েছে।');
    }
}
