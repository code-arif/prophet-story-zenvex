<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AssistantController extends Controller
{
    public function index()
    {
        $situations = [
            [
                'id' => 'payment_delay',
                'label' => 'Payment is delayed',
                'labelBn' => 'পেমেন্ট বিলম্বিত',
                'icon' => 'DollarSign',
            ],
            [
                'id' => 'scope_cream',
                'label' => 'Scope is expanding',
                'labelBn' => 'স্কোপ বাড়ছে',
                'icon' => 'Expand',
            ],
            [
                'id' => 'revision_abuse',
                'label' => 'Too many revisions',
                'labelBn' => 'অতিরিক্ত রিভিশন',
                'icon' => 'Repeat',
            ],
            [
                'id' => 'difficult_client',
                'label' => 'Difficult client',
                'labelBn' => 'কঠিন ক্লায়েন্ট',
                'icon' => 'UserX',
            ],
            [
                'id' => 'undercharging',
                'label' => 'Charging too little',
                'labelBn' => 'কম মূল্য নিচ্ছেন',
                'icon' => 'TrendingDown',
            ],
            [
                'id' => 'burnout',
                'label' => 'Feeling burned out',
                'labelBn' => 'বার্নআউট',
                'icon' => 'AlertTriangle',
            ],
        ];

        return Inertia::render('Assistant/Index', [
            'situations' => $situations,
        ]);
    }
}
