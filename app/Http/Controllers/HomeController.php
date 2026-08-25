<?php

namespace App\Http\Controllers;

use \Illuminate\Support\Facades\Auth;
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
    // Show landing page for guests, or redirect logged-in users to /home
    public function index(Request $request)
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $isGuest = (bool) $request->session()->get('is_guest', false);

        if ($msisdn === '' && Auth::guard('subscriber')->check()) {
            $user = Auth::guard('subscriber')->user();
            $msisdn = $user->msisdn;
            $request->session()->put('msisdn', $msisdn);
        }

        if ($msisdn !== '' && !$isGuest) {
            return redirect()->route('easy.home');
        }

        return Inertia::render('Landing/Index');
    }
}
