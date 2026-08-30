<?php

namespace App\Http\Controllers;

use App\Models\FavoriteProvider;
use App\Models\ServiceProviderProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteProviderController extends Controller
{
    /**
     * List all favorite providers saved by the customer.
     */
    public function index(Request $request)
    {
        $user = auth()->user() ?? $request->user();

        $favoriteProfiles = $user->favoriteProviders()
            ->with(['user', 'serviceCategories', 'reviews'])
            ->get();

        $favoriteProfiles->each(function ($p) {
            $p->append(['average_rating', 'total_reviews', 'price_fairness_score']);
        });

        return Inertia::render('Providers/Favorites', [
            'favorites' => $favoriteProfiles,
        ]);
    }

    /**
     * Store/Toggle a provider in customer's favorites.
     */
    public function store(Request $request)
    {
        $user = auth()->user() ?? $request->user();

        $validated = $request->validate([
            'provider_id' => ['required', 'exists:service_provider_profiles,id'],
        ]);

        $providerId = $validated['provider_id'];

        $existing = FavoriteProvider::where('customer_id', $user->id)
            ->where('provider_id', $providerId)
            ->first();

        if ($existing) {
            $existing->delete();
            $msg = 'প্রোভাইডারটি প্রিয় তালিকা থেকে সরানো হয়েছে।';
        } else {
            FavoriteProvider::create([
                'customer_id' => $user->id,
                'provider_id' => $providerId,
            ]);
            $msg = 'প্রোভাইডারটি সফলভাবে প্রিয় তালিকায় যুক্ত করা হয়েছে!';
        }

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Remove a provider from favorites.
     */
    public function destroy(Request $request, $providerId)
    {
        $user = auth()->user() ?? $request->user();

        FavoriteProvider::where('customer_id', $user->id)
            ->where('provider_id', $providerId)
            ->delete();

        return redirect()->back()->with('success', 'প্রোভাইডারটি প্রিয় তালিকা থেকে সরানো হয়েছে।');
    }
}
