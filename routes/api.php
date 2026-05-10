<?php

use App\Http\Controllers\Webhooks\SmsWebhookController;
use App\Http\Controllers\Webhooks\SmsReportWebhookController;
use App\Http\Controllers\Webhooks\SubscriptionNotifyWebhookController;
use App\Http\Controllers\Webhooks\UssdWebhookController;
use App\Http\Controllers\Api\PrayerTimeController;
use App\Http\Controllers\QuranController as LocalQuranController;
use Illuminate\Support\Facades\Route;

Route::post('/webhooks/sms', SmsWebhookController::class)->name('webhooks.sms');
Route::post('/webhooks/sms/report', SmsReportWebhookController::class)->name('webhooks.sms.report');
Route::post('/webhooks/ussd', UssdWebhookController::class)->name('webhooks.ussd');
Route::post('/webhooks/subscription/notify', SubscriptionNotifyWebhookController::class)->name('webhooks.subscription.notify');

// Public loop-preview endpoint — used by the page renderer to fetch live post/category data
Route::get('/loop-preview', [\App\Http\Controllers\Api\LoopPreviewController::class, 'index'])->name('loop-preview');
