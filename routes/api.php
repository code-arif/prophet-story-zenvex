<?php

use App\Http\Controllers\Webhooks\SmsWebhookController;
use App\Http\Controllers\Webhooks\SmsReportWebhookController;
use App\Http\Controllers\Webhooks\SubscriptionNotifyWebhookController;
use App\Http\Controllers\Webhooks\UssdWebhookController;
use App\Http\Controllers\Api\PrayerTimeController;
use App\Http\Controllers\QuranController as LocalQuranController;
use App\Http\Controllers\Admin\AdminContentLookupController;
use App\Http\Controllers\Admin\AdminMediaController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AdminPermissionController;
use Illuminate\Support\Facades\Route;

Route::post('/webhooks/sms', SmsWebhookController::class)->name('webhooks.sms');
Route::post('/webhooks/sms/report', SmsReportWebhookController::class)->name('webhooks.sms.report');
Route::post('/webhooks/ussd', UssdWebhookController::class)->name('webhooks.ussd');
Route::post('/webhooks/subscription/notify', SubscriptionNotifyWebhookController::class)->name('webhooks.subscription.notify');

// Public loop-preview endpoint — used by the page renderer to fetch live post/category data
Route::get('/loop-preview', [\App\Http\Controllers\Api\LoopPreviewController::class, 'index'])->name('loop-preview');

// Protected Admin API routes (Sanctum SPA authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/lookup/pages', [AdminContentLookupController::class, 'pages'])->name('api.admin.lookup.pages');
    Route::get('/admin/lookup/articles', [AdminContentLookupController::class, 'articles'])->name('api.admin.lookup.articles');
    Route::get('/admin/lookup/loop-preview', [AdminContentLookupController::class, 'loopPreview'])->name('api.admin.lookup.loop-preview');
    Route::get('/admin/media/api', [AdminMediaController::class, 'api'])->name('api.admin.media.api');
});

// Protected Stateful CRUD routes in api.php
Route::middleware(['auth:sanctum'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

});
