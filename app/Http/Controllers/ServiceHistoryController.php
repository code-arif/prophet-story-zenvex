<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategory;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceHistoryController extends Controller
{
    /**
     * Display per-household service history for the logged-in customer.
     */
    public function index(Request $request)
    {
        $user = auth()->user() ?? $request->user();

        $selectedCategory = $request->input('category_id');

        $query = ServiceRequest::query()
            ->where('customer_id', $user->id)
            ->with([
                'category',
                'provider.user',
                'serviceQuotes' => function ($q) {
                    $q->where('status', 'accepted');
                },
                'review',
                'statusLogs',
            ])
            ->latest();

        if ($selectedCategory) {
            $query->where('category_id', $selectedCategory);
        }

        $serviceRequests = $query->paginate(15)->withQueryString();
        $categories = ServiceCategory::query()->orderBy('name')->get();

        return Inertia::render('ServiceRequests/History', [
            'serviceRequests' => $serviceRequests,
            'categories' => $categories,
            'selectedCategory' => $selectedCategory,
        ]);
    }
}
