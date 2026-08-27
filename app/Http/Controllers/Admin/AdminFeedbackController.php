<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EasyRise\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminFeedbackController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::query()->orderByDesc('created_at');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('contact', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $feedbacks = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Feedbacks/Index', [
            'feedbacks' => $feedbacks,
            'filters' => $request->only(['search']),
        ]);
    }

    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return redirect()->back()->with('success', 'মতামতটি মুছে ফেলা হয়েছে।');
    }

    public function toggleStatus($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->status = $feedback->status === 'reviewed' ? 'new' : 'reviewed';
        $feedback->save();

        return redirect()->back()->with('success', 'মতামতের স্ট্যাটাস পরিবর্তন হয়েছে।');
    }
}
