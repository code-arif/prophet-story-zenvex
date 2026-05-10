<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BdAppsEvent;
use App\Models\SmsMessage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminLogsController extends Controller
{
    public function index()
    {
        $sms = [];
        if (Schema::hasTable('sms_messages')) {
            $sms = SmsMessage::query()
                ->orderByDesc('id')
                ->limit(20)
                ->get(['id', 'msisdn', 'status', 'provider', 'error', 'created_at']);
        }

        $bdapps = [];
        if (Schema::hasTable('bdapps_events')) {
            $bdapps = BdAppsEvent::query()
                ->orderByDesc('id')
                ->limit(20)
                ->get([
                    'id',
                    'direction',
                    'service',
                    'http_method',
                    'url',
                    'status_code',
                    'request',
                    'response',
                    'error',
                    'created_at'
                ]);
        }

        $logPath = storage_path('logs/laravel.log');
        $tail = '';
        if (File::exists($logPath)) {
            $content = File::get($logPath);
            $lines = preg_split('/\r\n|\r|\n/', $content) ?: [];
            $tail = implode("\n", array_slice($lines, -250));
        }

        return Inertia::render('Admin/Logs/Index', [
            'sms' => $sms,
            'bdapps' => $bdapps,
            'laravelLogTail' => $tail,
        ]);
    }
}
