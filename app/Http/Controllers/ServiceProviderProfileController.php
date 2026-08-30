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
     * Display a listing of service providers with search & filters.
     */
    public function index(Request $request)
    {
        $categories = ServiceCategory::query()->orderBy('name')->get();

        $query = ServiceProviderProfile::query()
            ->with(['user', 'serviceCategories']);

        // Search query (name, bio, area, district)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%");
                })
                ->orWhere('bio', 'like', "%{$search}%")
                ->orWhere('base_area_name', 'like', "%{$search}%")
                ->orWhere('district', 'like', "%{$search}%");
            });
        }

        // Category filter (by ID or slug)
        if ($categoryParam = $request->input('category')) {
            $query->whereHas('serviceCategories', function ($cq) use ($categoryParam) {
                if (is_numeric($categoryParam)) {
                    $cq->where('service_categories.id', $categoryParam);
                } else {
                    $cq->where('service_categories.slug', $categoryParam);
                }
            });
        }

        // District filter
        if ($district = $request->input('district')) {
            $query->where('district', $district);
        }

        // Emergency / Available Now filter
        if ($request->boolean('emergency_only') || $request->boolean('is_available_now')) {
            $query->where('is_available_now', true);
        }

        // Verified filter
        if ($request->has('verified_only') && $request->boolean('verified_only')) {
            $query->where('verification_status', 'verified');
        }

        // Minimum rating filter
        if ($minRating = $request->input('min_rating')) {
            $query->where('rating', '>=', (float) $minRating);
        }

        // Location / Distance query using Haversine formula
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        if ($lat && $lng) {
            $lat = (float) $lat;
            $lng = (float) $lng;
            $query->selectRaw("service_provider_profiles.*, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance_km", [$lat, $lng, $lat]);

            if ($maxDistance = $request->input('max_distance')) {
                $query->having('distance_km', '<=', (float) $maxDistance);
            }
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'rating');
        if ($sortBy === 'distance' && $lat && $lng) {
            $query->orderBy('distance_km', 'asc');
        } elseif ($sortBy === 'experience') {
            $query->orderByDesc('years_experience');
        } else {
            $query->orderByDesc('rating')->orderByDesc('created_at');
        }

        $providers = $query->paginate(12)->withQueryString();

        return Inertia::render('Providers/Browse', [
            'providers' => $providers,
            'categories' => $categories,
            'filters' => $request->only([
                'search', 'category', 'district', 'emergency_only', 'verified_only', 'min_rating', 'max_distance', 'sort_by', 'lat', 'lng'
            ]),
        ]);
    }

    /**
     * Display full profile of a single service provider.
     */
    public function show($id)
    {
        $provider = ServiceProviderProfile::query()
            ->with(['user', 'serviceCategories'])
            ->findOrFail($id);

        return Inertia::render('Providers/Show', [
            'provider' => $provider,
        ]);
    }

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
