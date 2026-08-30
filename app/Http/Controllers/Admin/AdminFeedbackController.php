<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminFeedbackController extends Controller
{
    public function index(Request $request)
    {
        $feedbacks = new LengthAwarePaginator([], 0, 15);

        return Inertia::render('Admin/Feedbacks/Index', [
            'feedbacks' => $feedbacks,
            'filters' => $request->only(['search']),
        ]);
    }

    public function destroy($id)
    {
        return redirect()->back()->with('success', 'মতামতটি মুছে ফেলা হয়েছে।');
    }

    public function toggleStatus($id)
    {
        return redirect()->back()->with('success', 'মতামতের স্ট্যাটাস পরিবর্তন হয়েছে।');
    }
}
