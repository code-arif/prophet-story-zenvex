<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * HomeController — root URL ("/") handler.
 *
 * Routing logic:
 *  - Authenticated subscriber (msisdn in session, not a guest) → /library
 *  - All other visitors → Landing/Index (public marketing page)
 */
class HomeController extends Controller
{
    public function index(Request $request)
    {
        $msisdn = (string) $request->session()->get('msisdn', '');
        $isGuest = (bool) $request->session()->get('is_guest', false);

        // Redirect already-authenticated subscribers into the app
        if ($msisdn !== '' && !$isGuest) {
            return redirect()->route('library.index');
        }

        return Inertia::render('Landing/Index');
    }
}
