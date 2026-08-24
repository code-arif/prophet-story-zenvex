<?php

namespace App\Http\Controllers;

use App\Services\AppSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * HomeController - Handles the main homepage.
 *
 * The root URL ("/") is the public landing page for easy rise.
 *  - Logged-in and guest users are sent to the app home (/home).
 *  - Anonymous visitors see the onboarding welcome page.
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

        // Logged-in and guest users go straight to the easy rise app home.
        if ($msisdn !== '' || $isGuest) {
            return redirect()->route('easy.home');
        }

        // Anonymous visitors see the onboarding welcome page.
        return Inertia::render('Onboarding/Welcome', [
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
