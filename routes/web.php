<?php

/**
 * Web Routes
 *
 * This file defines all web routes for the application.
 */

use \Inertia\Inertia;
use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminBulkSmsController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminFeedbackController;
use App\Http\Controllers\Admin\AdminLogsController;
use App\Http\Controllers\Admin\AdminMediaController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminSubscriberController;
use App\Http\Controllers\Admin\AdminSubscriptionController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\AppDownloadController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\FirstLoginController;
use App\Http\Controllers\HomeController;

use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestMessageController;
use App\Http\Controllers\ServiceDisputeController;
use App\Http\Controllers\ServiceHistoryController;
use App\Http\Controllers\ServicePaymentController;
use App\Http\Controllers\ServiceProviderProfileController;
use App\Http\Controllers\ServiceQuoteController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\ServiceReviewController;
use Illuminate\Support\Facades\Route;


Route::get('/', [HomeController::class, 'index'])->middleware('guest.access')->name('home');

// Authenticated & Subscribed User Routes
Route::middleware('subscribed')->group(function () {
    // Service Disputes & Issue Reporting
    Route::post('/service-disputes', [ServiceDisputeController::class, 'store'])->name('service-disputes.store');

    // Service Payments Recording & Confirmation
    Route::post('/service-payments', [ServicePaymentController::class, 'store'])->name('service-payments.store');
    Route::post('/service-payments/{id}/confirm', [ServicePaymentController::class, 'confirm'])->name('service-payments.confirm');

    // Service Request History View
    Route::get('/service-requests/history', [ServiceHistoryController::class, 'index'])->name('service-requests.history');

    // Post-job Customer Reviews & Price Fairness Signals
    Route::post('/service-reviews', [ServiceReviewController::class, 'store'])->name('service-reviews.store');

    // Scoped Real-time Messaging
    Route::get('/service-requests/{id}/chat', [RequestMessageController::class, 'show'])->name('service-requests.chat');
    Route::post('/service-requests/{id}/messages', [RequestMessageController::class, 'store'])->name('service-requests.messages.store');

    // Upfront Pricing & Quotes
    Route::post('/service-quotes', [ServiceQuoteController::class, 'store'])->name('service-quotes.store');
    Route::post('/service-quotes/{id}/accept', [ServiceQuoteController::class, 'accept'])->name('service-quotes.accept');
    Route::post('/service-quotes/{id}/reject', [ServiceQuoteController::class, 'reject'])->name('service-quotes.reject');

    // Service Booking Requests
    Route::get('/service-requests/create', [ServiceRequestController::class, 'create'])->name('service-requests.create');
    Route::post('/service-requests', [ServiceRequestController::class, 'store'])->name('service-requests.store');
    Route::get('/service-requests/{id}', [ServiceRequestController::class, 'show'])->name('service-requests.show');
    Route::post('/service-requests/{id}/status', [ServiceRequestController::class, 'updateStatus'])->name('service-requests.update-status');

    // Favorite Providers
    Route::get('/providers/favorites', [\App\Http\Controllers\FavoriteProviderController::class, 'index'])->name('providers.favorites');
    Route::post('/favorites', [\App\Http\Controllers\FavoriteProviderController::class, 'store'])->name('favorites.store');
    Route::delete('/favorites/{providerId}', [\App\Http\Controllers\FavoriteProviderController::class, 'destroy'])->name('favorites.destroy');

    // Provider Browse & Search Experience
    Route::get('/providers', [ServiceProviderProfileController::class, 'index'])->name('providers.index');
    Route::get('/providers/{id}', [ServiceProviderProfileController::class, 'show'])->name('providers.show');

    // Service Provider setup, schedule, dashboard & profile routes
    Route::get('/provider/dashboard', [\App\Http\Controllers\ProviderDashboardController::class, 'index'])->name('provider.dashboard');
    Route::get('/provider/setup', [ServiceProviderProfileController::class, 'create'])->name('provider.setup');
    Route::post('/provider/setup', [ServiceProviderProfileController::class, 'store'])->name('provider.store');
    Route::post('/provider/toggle-availability', [ServiceProviderProfileController::class, 'toggleAvailability'])->name('provider.toggle-availability');
    Route::get('/provider/schedule', [\App\Http\Controllers\ProviderScheduleController::class, 'index'])->name('provider.schedule.index');
    Route::post('/provider/schedule/weekly', [\App\Http\Controllers\ProviderScheduleController::class, 'updateWeekly'])->name('provider.schedule.weekly');
    Route::post('/provider/schedule/exception', [\App\Http\Controllers\ProviderScheduleController::class, 'toggleExceptionDate'])->name('provider.schedule.exception');

    // Profile & Subscription Management
    Route::post('/subscribe', [ProfileController::class, 'subscribe'])->name('profile.subscribe');
    Route::post('/unsubscribe', [ProfileController::class, 'unsubscribe'])->name('profile.unsubscribe');
    Route::match(['get', 'post'], '/logout', [ProfileController::class, 'logout'])->name('profile.logout');

    // News
    Route::get('/news', [ArticleController::class, 'index'])->name('news.index');
});

// App download routes
Route::get('/app', [AppDownloadController::class, 'show'])->name('app.download');
Route::get('/app/download', [AppDownloadController::class, 'download'])->name('app.download.file');

// Public APK link (clean URL for direct download)
Route::get('/apk/{filename}', [AppDownloadController::class, 'publicDownload'])->name('apk.public');
Route::get('/p/{slug}', [PageController::class, 'show'])->name('pages.show');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

// Authentication routes
Route::get('/login', [FirstLoginController::class, 'show'])->name('login.show');
Route::get('/guest', [FirstLoginController::class, 'guest'])->name('guest.start');
Route::post('/login/send-otp', [FirstLoginController::class, 'sendOtp'])->name('login.sendOtp');
Route::get('/login/verify', [FirstLoginController::class, 'verifyShow'])->name('login.verify.show');
Route::post('/login/verify', [FirstLoginController::class, 'verify'])->name('login.verify');

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin authentication (no middleware - public)
    Route::get('/login', [AdminAuthController::class, 'show'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    Route::match(['get', 'post'], '/logout', [AdminAuthController::class, 'logout'])->name('logout')->middleware('auth');

    // Protected admin routes
    Route::middleware('auth')->group(function () {
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        // user route
        Route::resource('users', AdminUserController::class);

        // General settings
        Route::redirect('/settings', '/admin/settings/general')->name('settings');
        Route::get('/settings/general', [AdminSettingsController::class, 'general'])->name('settings.general');
        Route::post('/settings/general', [AdminSettingsController::class, 'saveGeneral'])->name('settings.general.save');

        Route::get('/settings/integrations', [AdminSettingsController::class, 'integrations'])->name('settings.integrations');
        Route::post('/settings/integrations', [AdminSettingsController::class, 'saveIntegrations'])->name('settings.integrations.save');

        Route::get('/settings/bdapps', [AdminSettingsController::class, 'bdapps'])->name('settings.bdapps');
        Route::post('/settings/bdapps/test-sms', [AdminSettingsController::class, 'bdappsTestSms'])->name('settings.bdapps.testSms');
        Route::post('/settings/bdapps/notifications', [AdminSettingsController::class, 'saveBdappsNotifications'])->name('settings.bdapps.notifications.save');

        Route::get('/settings/ussd-menu', [AdminSettingsController::class, 'ussdMenu'])->name('settings.ussdMenu');
        Route::post('/settings/ussd-menu', [AdminSettingsController::class, 'saveUssdMenu'])->name('settings.ussdMenu.save');

        // Articles
        Route::get('/articles', [AdminArticleController::class, 'index'])->name('articles.index');
        Route::get('/articles/export', [AdminArticleController::class, 'export'])->name('articles.export');
        Route::post('/articles/import', [AdminArticleController::class, 'import'])->name('articles.import');
        Route::get('/articles/create', [AdminArticleController::class, 'create'])->name('articles.create');
        Route::post('/articles', [AdminArticleController::class, 'store'])->name('articles.store');
        Route::get('/articles/{article:id}/edit', [AdminArticleController::class, 'edit'])->name('articles.edit');
        Route::put('/articles/{article:id}', [AdminArticleController::class, 'update'])->name('articles.update');
        Route::delete('/articles/{article:id}', [AdminArticleController::class, 'destroy'])->name('articles.destroy');

        // Categories
        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::get('/categories/create', [AdminCategoryController::class, 'create'])->name('categories.create');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::get('/categories/{category}/edit', [AdminCategoryController::class, 'edit'])->name('categories.edit');
        Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

        // Logs
        Route::get('/logs', [AdminLogsController::class, 'index'])->name('logs.index');

        // Subscribers
        Route::get('/subscribers', [AdminSubscriberController::class, 'index'])->name('subscribers.index');
        Route::get('/subscribers/{msisdn}', [AdminSubscriberController::class, 'show'])->name('subscribers.show');
        Route::post('/subscribers/{msisdn}/sms', [AdminSubscriberController::class, 'sendSms'])->name('subscribers.sms');
        Route::delete('/subscribers/{msisdn}', [AdminSubscriberController::class, 'destroy'])->name('subscribers.destroy');

        // Bulk SMS
        Route::get('/sms/bulk', [AdminBulkSmsController::class, 'create'])->name('sms.bulk');
        Route::post('/sms/bulk', [AdminBulkSmsController::class, 'store'])->name('sms.bulk.send');

        // Feedbacks
        Route::get('/feedbacks', [AdminFeedbackController::class, 'index'])->name('feedbacks.index');
        Route::post('/feedbacks/{id}/toggle-status', [AdminFeedbackController::class, 'toggleStatus'])->name('feedbacks.toggleStatus');
        Route::delete('/feedbacks/{id}', [AdminFeedbackController::class, 'destroy'])->name('feedbacks.destroy');

        // Subscriptions
        Route::get('/subscriptions', [AdminSubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::get('/subscriptions/{msisdn}', [AdminSubscriptionController::class, 'show'])->name('subscriptions.show');
        Route::post('/subscriptions/{msisdn}/activate', [AdminSubscriptionController::class, 'activate'])->name('subscriptions.activate');
        Route::post('/subscriptions/{msisdn}/cancel', [AdminSubscriptionController::class, 'cancel'])->name('subscriptions.cancel');
        Route::post('/subscriptions/{msisdn}/clear', [AdminSubscriptionController::class, 'clear'])->name('subscriptions.clear');
        Route::post('/subscriptions/{msisdn}/send-sms', [AdminSubscriptionController::class, 'sendSms'])->name('subscriptions.sendSms');

        // Media file manager
        Route::get('/media', [AdminMediaController::class, 'index'])->name('media.index');
        Route::post('/media', [AdminMediaController::class, 'store'])->name('media.store');
        Route::post('/media/sync', [AdminMediaController::class, 'sync'])->name('media.sync');
        Route::post('/media/folder', [AdminMediaController::class, 'createFolder'])->name('media.folder.create');
        Route::delete('/media/folder', [AdminMediaController::class, 'deleteFolder'])->name('media.folder.delete');
        Route::post('/media/{media}/move', [AdminMediaController::class, 'move'])->name('media.move');
        Route::post('/media/{media}/rename', [AdminMediaController::class, 'rename'])->name('media.rename');
        Route::put('/media/{media}', [AdminMediaController::class, 'update'])->name('media.update');
        Route::delete('/media/{media}', [AdminMediaController::class, 'destroy'])->name('media.destroy');

        // APK manager
        Route::get('/apk', [AdminMediaController::class, 'apkIndex'])->name('apk.index');
        Route::post('/apk', [AdminMediaController::class, 'apkStore'])->name('apk.store');
        Route::post('/apk/{media}/activate', [AdminMediaController::class, 'apkSetActive'])->name('apk.activate');
        Route::delete('/apk/{media}', [AdminMediaController::class, 'apkDestroy'])->name('apk.destroy');

        // Role and Permission Management (Admin only)
        Route::middleware(['role:admin'])->group(function () {
            Route::resource('roles', AdminRoleController::class);
            Route::resource('permissions', AdminPermissionController::class)->only(['index', 'store', 'update', 'destroy']);
        });
    });
});

