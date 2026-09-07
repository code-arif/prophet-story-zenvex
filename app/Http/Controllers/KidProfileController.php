<?php

namespace App\Http\Controllers;

use App\Models\KidProfile;
use App\Models\Prophet;
use App\Support\CurrentSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * KidProfileController - Lightweight child profile management for parents.
 *
 * Allows a parent to create and edit child profiles, curate unlocked
 * Prophet stories per child, and seamlessly switch the active app context
 * via session without separate credentials.
 */
class KidProfileController extends Controller
{
    /**
     * Resolve the current parent user/subscriber ID.
     */
    private function getParentId(Request $request): ?int
    {
        $subscriberId = CurrentSubscriber::id($request);
        if ($subscriberId !== null) {
            return $subscriberId;
        }

        if (Auth::check()) {
            return (int) Auth::id();
        }

        return null;
    }

    /**
     * List child profiles and available Prophets for the parent.
     */
    public function index(Request $request)
    {
        $parentId = $this->getParentId($request);

        $profiles = $parentId !== null
            ? KidProfile::query()->where('parent_user_id', $parentId)->latest()->get()
            : collect();

        $prophets = Prophet::query()
            ->withCount('chapters')
            ->orderBy('chronological_order')
            ->orderBy('name')
            ->get(['id', 'name', 'name_arabic', 'short_intro', 'cover_image_path', 'chronological_order'])
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'name_arabic' => $p->name_arabic,
                'short_intro' => $p->short_intro,
                'cover_image_url' => $p->cover_image_url,
                'chapter_count' => (int) $p->chapters_count,
            ]);

        $activeProfileId = $request->session()->get('active_kid_profile_id');

        return Inertia::render('KidProfiles/Index', [
            'profiles' => $profiles,
            'prophets' => $prophets,
            'activeProfileId' => $activeProfileId ? (int) $activeProfileId : null,
            'isParentLoggedIn' => $parentId !== null,
        ]);
    }

    /**
     * Store a new child profile.
     */
    public function store(Request $request)
    {
        $parentId = $this->getParentId($request);
        if ($parentId === null) {
            return redirect()->route('login.show')
                ->with('error', 'সন্তানের প্রোফাইল যুক্ত করতে অনুগ্রহ করে প্রথমে লগইন করুন।');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'default_reader_mode' => ['nullable', 'string', 'in:kid,standard'],
            'unlocked_prophet_ids' => ['nullable', 'array'],
            'unlocked_prophet_ids.*' => ['integer', 'exists:prophets,id'],
        ]);

        $profile = KidProfile::create([
            'parent_user_id' => $parentId,
            'name' => trim($validated['name']),
            'default_reader_mode' => $validated['default_reader_mode'] ?? 'kid',
            'unlocked_prophet_ids' => !empty($validated['unlocked_prophet_ids']) ? array_values(array_map('intval', $validated['unlocked_prophet_ids'])) : null,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['saved' => true, 'profile' => $profile]);
        }

        return back()->with('success', "{$profile->name}-এর প্রোফাইল সফলভাবে তৈরি হয়েছে।");
    }

    /**
     * Update an existing child profile.
     */
    public function update(Request $request, KidProfile $kidProfile)
    {
        $parentId = $this->getParentId($request);
        if ($parentId === null || $kidProfile->parent_user_id !== $parentId) {
            abort(403, 'অননুমোদিত অনুরোধ।');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'default_reader_mode' => ['nullable', 'string', 'in:kid,standard'],
            'unlocked_prophet_ids' => ['nullable', 'array'],
            'unlocked_prophet_ids.*' => ['integer', 'exists:prophets,id'],
        ]);

        $kidProfile->update([
            'name' => trim($validated['name']),
            'default_reader_mode' => $validated['default_reader_mode'] ?? 'kid',
            'unlocked_prophet_ids' => !empty($validated['unlocked_prophet_ids']) ? array_values(array_map('intval', $validated['unlocked_prophet_ids'])) : null,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['saved' => true, 'profile' => $kidProfile]);
        }

        return back()->with('success', "{$kidProfile->name}-এর প্রোফাইল আপডেট করা হয়েছে।");
    }

    /**
     * Delete a child profile.
     */
    public function destroy(Request $request, KidProfile $kidProfile)
    {
        $parentId = $this->getParentId($request);
        if ($parentId === null || $kidProfile->parent_user_id !== $parentId) {
            abort(403, 'অননুমোদিত অনুরোধ।');
        }

        if ((int) $request->session()->get('active_kid_profile_id') === $kidProfile->id) {
            $request->session()->forget('active_kid_profile_id');
        }

        $name = $kidProfile->name;
        $kidProfile->delete();

        if ($request->wantsJson()) {
            return response()->json(['deleted' => true]);
        }

        return back()->with('success', "{$name}-এর প্রোফাইল মুছে ফেলা হয়েছে।");
    }

    /**
     * Switch active reading context between Parent and Child profile.
     */
    public function switch(Request $request)
    {
        $parentId = $this->getParentId($request);
        $profileId = $request->input('profile_id');

        if (empty($profileId) || $profileId === 'parent' || $profileId === 0) {
            $request->session()->forget('active_kid_profile_id');

            if ($request->wantsJson()) {
                return response()->json(['active_profile' => null, 'reading_as' => 'parent']);
            }

            return back()->with('success', 'অভিভাবক মোডে ফিরে আসা হয়েছে।');
        }

        $profile = KidProfile::query()
            ->where('id', (int) $profileId)
            ->when($parentId !== null, fn ($q) => $q->where('parent_user_id', $parentId))
            ->firstOrFail();

        $request->session()->put('active_kid_profile_id', $profile->id);

        if ($request->wantsJson()) {
            return response()->json([
                'active_profile' => [
                    'id' => $profile->id,
                    'name' => $profile->name,
                    'default_reader_mode' => $profile->default_reader_mode,
                ],
                'reading_as' => $profile->name,
            ]);
        }

        return back()->with('success', "পড়ছেন: {$profile->name}");
    }
}
