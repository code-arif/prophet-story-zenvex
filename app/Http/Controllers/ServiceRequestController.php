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

        return redirect()->route('providers.index')->with('success', $message);
    }
}
