<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function welcome()
    {
        return Inertia::render('Onboarding/Welcome');
    }

    public function setup()
    {
        return Inertia::render('Onboarding/ProfileSetup');
    }
}
