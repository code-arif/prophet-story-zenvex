<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceProviderProfileRequest;
use App\Http\Requests\UpdateServiceProviderProfileRequest;
use App\Models\ServiceCategory;
use App\Models\ServiceProviderProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceProviderProfileController extends Controller
{
    /**
     * Display form to create or edit a Service Provider Profile.
     */
    public function create(Request $request)
    {
        $user = auth()->user() ?? $request->user();
        $categories = ServiceCategory::query()->orderBy('name')->get();

        $profile = null;
        if ($user) {
            $profile = ServiceProviderProfile::query()
                ->where('user_id', $user->id)
                ->with('serviceCategories')
                ->first();
        }

        return Inertia::render('Provider/CreateProfile', [
            'categories' => $categories,
            'profile' => $profile,
            'districts' => [
                'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
                'Barisal', 'Rangpur', 'Mymensingh', 'Gazipur', 'Narayanganj', 'Cumilla', 'Bogra',
            ],
        ]);
    }

    /**
     * Store or update a Service Provider Profile.
     */
    public function store(StoreServiceProviderProfileRequest $request)
    {
        $user = auth()->user() ?? $request->user();

        $profile = ServiceProviderProfile::firstOrNew(['user_id' => $user->id]);
        
        $data = $request->only([
            'bio',
            'years_experience',
            'service_radius_km',
            'base_area_name',
            'district',
            'latitude',
            'longitude',
            'is_available_now',
        ]);

        if ($request->hasFile('document')) {
            if ($profile->nid_or_certificate_path) {
                Storage::disk('public')->delete($profile->nid_or_certificate_path);
            }
            $path = $request->file('document')->store('provider_documents', 'public');
            $data['nid_or_certificate_path'] = $path;
            $data['verification_status'] = 'pending';
        }

        $profile->fill($data);
        $profile->save();

        if ($request->has('category_ids')) {
            $profile->serviceCategories()->sync($request->input('category_ids', []));
        }

        return redirect()->back()->with('success', 'আপনার প্রোভাইডার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।');
    }

    /**
     * Update existing Service Provider Profile.
     */
    public function update(UpdateServiceProviderProfileRequest $request)
    {
        return $this->store(new StoreServiceProviderProfileRequest($request->all()));
    }

    /**
     * Toggle emergency availability mode.
     */
    public function toggleAvailability(Request $request)
    {
        $user = auth()->user() ?? $request->user();
        $profile = ServiceProviderProfile::where('user_id', $user->id)->firstOrFail();

        $profile->is_available_now = !$profile->is_available_now;
        $profile->save();

        return redirect()->back()->with('success', 'আপনার এমার্জেন্সি প্রাপ্যতা আপডেট হয়েছে।');
    }
}
