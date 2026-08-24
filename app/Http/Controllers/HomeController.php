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
    // Show landing page
    public function index()
    {
        return Inertia::render('Landing/Index');
    }
}
