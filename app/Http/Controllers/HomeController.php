<?php

namespace App\Http\Controllers;

use App\Services\AppSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * HomeController - Handles the main homepage.
 *
 * The root URL ("/") is the public marketing landing page for the
 * "Learn English" learner app:
 *  - Anonymous visitors see the landing page (Learner/Onboarding/Welcome).
 *  - Logged-in and guest users are sent straight to the app home (/home).
 */
class HomeController extends Controller
{
    /**
     * Handle the homepage request.
     *
     * @param Request $request The HTTP request
     * @param AppSettings $settings Application settings service
     * @param string|null $slug Optional category slug (kept for route compat)
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function __invoke(Request $request, AppSettings $settings, ?string $slug = null)
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $isGuest = (bool) $request->session()->get('is_guest', false);

        // Logged-in and guest users go straight to the learner app home.
        if ($msisdn !== '' || $isGuest) {
            return redirect()->route('learner.home');
        }

        // Anonymous visitors see the public marketing landing page.
        return Inertia::render('Learner/Onboarding/Welcome', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'appChargeText' => (string) $settings->get('app.download_charge_text', ''),
        ]);
    }

        
    public function quran()
    {
        return Inertia::render('Quran/Index');
    }
    
    public function quranShow($surah)
    {
        return Inertia::render('Quran', ['surahNumber' => (int)$surah]);
    }
}
