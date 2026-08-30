<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Models\ServiceCategory;
use App\Models\ServiceProviderProfile;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    /**
     * Show booking request creation form.
     */
    public function create(Request $request)
    {
        $categories = ServiceCategory::query()->orderBy('name')->get();

        $selectedCategory = null;
        if ($catId = $request->input('category_id')) {
            $selectedCategory = ServiceCategory::find($catId);
        }

        $selectedProvider = null;
        if ($provId = $request->input('provider_id')) {
            $selectedProvider = ServiceProviderProfile::with(['user', 'serviceCategories'])->find($provId);
            if ($selectedProvider && !$selectedCategory && $selectedProvider->serviceCategories->first()) {
                $selectedCategory = $selectedProvider->serviceCategories->first();
            }
        }

        return Inertia::render('ServiceRequests/Create', [
            'categories' => $categories,
            'selectedCategory' => $selectedCategory,
            'selectedProvider' => $selectedProvider,
            'districts' => [
                'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
                'Barisal', 'Rangpur', 'Mymensingh', 'Gazipur', 'Narayanganj', 'Cumilla', 'Bogra',
            ],
            'timeSlots' => [
                '08:00 AM - 10:00 AM',
                '10:00 AM - 12:00 PM',
                '12:00 PM - 02:00 PM',
                '02:00 PM - 04:00 PM',
                '04:00 PM - 06:00 PM',
                '06:00 PM - 08:00 PM',
            ],
        ]);
    }

    /**
     * Store new Service Request in database.
     */
    public function store(StoreServiceRequest $request)
    {
        $user = auth()->user() ?? $request->user();

        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photoPaths[] = $photo->store('service_request_photos', 'public');
            }
        }

        $data = $request->validated();
        unset($data['photos']);

        $data['customer_id'] = $user->id;
        $data['photo_paths'] = $photoPaths;
        $data['status'] = 'pending';

        $serviceRequest = ServiceRequest::create($data);

        $message = $serviceRequest->request_mode === 'broadcast'
            ? 'আপনার সার্ভিস রিকোয়েস্টটি এলাকার সকল ফ্রি মিস্ত্রিদের কাছে পাঠানো হয়েছে!'
            : 'আপনার সার্ভিস বুকিং রিকোয়েস্টটি মিস্ত্রির কাছে পাঠানো হয়েছে!';

        return redirect()->route('service-requests.show', $serviceRequest->id)->with('success', $message);
    }

    /**
     * Display a specific Service Request details with status stepper and history.
     */
    public function show(Request $request, $id)
    {
        $user = auth()->user() ?? $request->user();

        $serviceRequest = ServiceRequest::with([
            'customer',
            'provider.user',
            'category',
            'serviceQuotes.provider.user',
            'statusLogs.changedBy',
            'conversation',
        ])->findOrFail($id);

        $isCustomer = $serviceRequest->customer_id === $user->id;
        $isProvider = $serviceRequest->provider && $serviceRequest->provider->user_id === $user->id;

        if (!$isCustomer && !$isProvider && !$user->isAdmin()) {
            // If broadcast request, allow any provider matching category to view
            $providerProfile = $user->serviceProviderProfile;
            $canViewBroadcast = $serviceRequest->request_mode === 'broadcast' && $providerProfile;

            if (!$canViewBroadcast) {
                abort(403, 'এই সার্ভিস রিকোয়েস্ট দেখার অনুমতি নেই।');
            }
        }

        return Inertia::render('ServiceRequests/Show', [
            'serviceRequest' => $serviceRequest,
            'activeQuote' => $serviceRequest->activeQuote(),
            'statusLogs' => $serviceRequest->statusLogs,
            'currentUser' => $user,
            'isCustomer' => $isCustomer,
            'isProvider' => $isProvider,
        ]);
    }

    /**
     * Update Service Request status enforcing state machine rules.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = auth()->user() ?? $request->user();
        $serviceRequest = ServiceRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:accepted,declined,en_route,in_progress,completed,cancelled'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $newStatus = $validated['status'];
        $currentStatus = $serviceRequest->status;

        // Valid status transition rules mapping
        $allowedTransitions = [
            'pending' => ['accepted', 'declined', 'cancelled'],
            'accepted' => ['en_route', 'cancelled'],
            'en_route' => ['in_progress', 'cancelled'],
            'in_progress' => ['completed', 'cancelled'],
        ];

        if (!isset($allowedTransitions[$currentStatus]) || !in_between_array($newStatus, $allowedTransitions[$currentStatus])) {
            return redirect()->back()->withErrors([
                'status' => "স্ট্যাটাস {$currentStatus} থেকে {$newStatus}-এ পরিবর্তনের অনুমতি নেই।",
            ]);
        }

        if ($newStatus === 'cancelled' && empty($validated['reason'])) {
            return redirect()->back()->withErrors([
                'reason' => 'বাতিল করার কারণ উল্লেখ করা আবশ্যক।',
            ]);
        }

        // If provider accepting a broadcast request, assign provider_id
        if ($newStatus === 'accepted' && !$serviceRequest->provider_id && $user->serviceProviderProfile) {
            $serviceRequest->provider_id = $user->serviceProviderProfile->id;
        }

        $serviceRequest->updateStatusWithLog($newStatus, $user->id, $validated['reason'] ?? null);

        // Auto-create chat if accepted
        if ($newStatus === 'accepted') {
            $serviceRequest->getOrCreateConversation();
        }

        $statusLabels = [
            'accepted' => 'রিকোয়েস্ট গ্রহণ করা হয়েছে!',
            'en_route' => 'মিস্ত্রি গন্তব্যের উদ্দেশ্যে রওনা হয়েছেন!',
            'in_progress' => 'কাজ শুরু হয়েছে!',
            'completed' => 'কাজটি সফলভাবে সম্পন্ন হয়েছে!',
            'cancelled' => 'রিকোয়েস্ট বাতিল করা হয়েছে।',
            'declined' => 'রিকোয়েস্ট প্রত্যাখ্যান করা হয়েছে।',
        ];

        return redirect()->back()->with('success', $statusLabels[$newStatus] ?? 'স্ট্যাটাস আপডেট করা হয়েছে!');
    }
}

/**
 * Helper to check if string exists in array.
 */
function in_between_array($needle, $haystack) {
    return in_array($needle, $haystack, true);
}

