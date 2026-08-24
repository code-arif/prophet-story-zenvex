<?php

/**
 * Web Routes
 *
 * This file defines all web routes for the application.
 */

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminBulkSmsController;
use App\Http\Controllers\Admin\AdminLogsController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminSubscriptionController;
use App\Http\Controllers\Admin\AdminSubscriberController;
use App\Http\Controllers\Admin\AdminMediaController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\AppDownloadController;
use App\Http\Controllers\FirstLoginController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;

use App\Http\Controllers\EasyRise\HomeController as EasyRiseHomeController;
use App\Http\Controllers\EasyRise\LearnController;
use App\Http\Controllers\EasyRise\WorkController;
use App\Http\Controllers\EasyRise\MoneyController;
use App\Http\Controllers\EasyRise\AssistantController;
use App\Http\Controllers\EasyRise\SettingsController;
use App\Http\Controllers\EasyRise\OnboardingController;

use Illuminate\Support\Facades\Route;

// Public route — the landing page (/) is open to everyone.
Route::get('/', [HomeController::class, 'index'])->middleware('guest.access')->name('home');

// Authenticated User Routes
Route::post('/subscribe', [ProfileController::class, 'subscribe'])->name('profile.subscribe');
Route::post('/unsubscribe', [ProfileController::class, 'unsubscribe'])->name('profile.unsubscribe');
Route::match(['get', 'post'], '/logout', [ProfileController::class, 'logout'])->name('profile.logout');

// App download routes
Route::get('/app', [AppDownloadController::class, 'show'])->name('app.download');
Route::get('/app/download', [AppDownloadController::class, 'download'])->name('app.download.file');

// Public APK link (clean URL for direct download)
Route::get('/apk/{filename}', [AppDownloadController::class, 'publicDownload'])->name('apk.public');
Route::get('/p/{slug}', [PageController::class, 'show'])->name('pages.show');

// Authentication routes
Route::get('/login', [FirstLoginController::class, 'show'])->name('login.show');
Route::get('/guest', [FirstLoginController::class, 'guest'])->name('guest.start');
Route::post('/login/send-otp', [FirstLoginController::class, 'sendOtp'])->name('login.sendOtp');
Route::get('/login/verify', [FirstLoginController::class, 'verifyShow'])->name('login.verify.show');
Route::post('/login/verify', [FirstLoginController::class, 'verify'])->name('login.verify');

// ─────────────────────────────────────────────────────────────────────
// easy rise (ইজি রাইজ) — Backend phase: real controllers.
// ─────────────────────────────────────────────────────────────────────
Route::middleware('subscribed')->group(function () {
    // Tab: আজ (Home)
    Route::get('/home', [EasyRiseHomeController::class, 'index'])->name('easy.home');
    Route::get('/home/ladder', [EasyRiseHomeController::class, 'ladder'])->name('easy.home.ladder');

    // Tab: শেখা (Learn)
    Route::get('/learn', [LearnController::class, 'index'])->name('easy.learn');
    Route::get('/learn/marketplace', [LearnController::class, 'marketplace'])->name('easy.learn.marketplace');
    Route::get('/learn/compare', [LearnController::class, 'marketplace'])->name('easy.learn.compare');
    Route::get('/learn/niche', [LearnController::class, 'niche'])->name('easy.learn.niche');
    Route::get('/learn/checklist', [LearnController::class, 'checklist'])->name('easy.learn.checklist');
    Route::get('/learn/proposals', [LearnController::class, 'proposals'])->name('easy.learn.proposals');
    Route::get('/learn/scripts', [LearnController::class, 'scripts'])->name('easy.learn.scripts');
    Route::get('/learn/plan', [LearnController::class, 'plan'])->name('easy.learn.plan');
    Route::get('/learn/plan-90', [LearnController::class, 'plan'])->name('easy.learn.plan-90');
    Route::get('/learn/profile-review', [LearnController::class, 'profileReview'])->name('easy.learn.profile-review');

    // Tab: সহায়ক (AI Assistant — centre, elevated)
    Route::get('/assistant', [AssistantController::class, 'index'])->name('easy.assistant');

    // Tab: কাজ (Work)
    Route::get('/work', [WorkController::class, 'pipeline'])->name('easy.work');
    Route::get('/work/jobs/{id}', [WorkController::class, 'jobDetail'])->name('easy.work.job');
    Route::get('/work/jobs/{id}/scope', [WorkController::class, 'scope'])->name('easy.work.scope');
    Route::get('/work/proposals', [WorkController::class, 'proposals'])->name('easy.work.proposals');
    Route::get('/work/payments', [WorkController::class, 'payments'])->name('easy.work.payments');
    Route::get('/work/capacity', [WorkController::class, 'capacity'])->name('easy.work.capacity');
    Route::get('/work/screener', [WorkController::class, 'screener'])->name('easy.work.screener');

    // Tab: টাকা (Money)
    Route::get('/money', [MoneyController::class, 'index'])->name('easy.money');
    Route::get('/money/ledger', [MoneyController::class, 'ledger'])->name('easy.money.ledger');
    Route::get('/money/true-hourly', [MoneyController::class, 'trueHourly'])->name('easy.money.true-hourly');
    Route::get('/money/runway', [MoneyController::class, 'runway'])->name('easy.money.runway');
    Route::get('/money/channels', [MoneyController::class, 'channels'])->name('easy.money.channels');
    Route::get('/money/incentive', [MoneyController::class, 'incentive'])->name('easy.money.incentive');
    Route::get('/money/documents', [MoneyController::class, 'documents'])->name('easy.money.documents');
    Route::get('/money/proof', [MoneyController::class, 'proof'])->name('easy.money.proof');

    // Global: Settings (reached from top-bar gear, no bottom nav)
    Route::get('/settings', [SettingsController::class, 'index'])->name('easy.settings');
    Route::post('/settings/profile', [SettingsController::class, 'updateProfile'])->name('easy.settings.profile');
    Route::post('/settings/preferences', [SettingsController::class, 'updatePreferences'])->name('easy.settings.preferences');
    Route::post('/settings/work-rules', [SettingsController::class, 'updateWorkRules'])->name('easy.settings.work-rules');
    Route::post('/settings/reminders', [SettingsController::class, 'updateReminders'])->name('easy.settings.reminders');
});

// Onboarding routes (no bottom nav, guest access)
Route::middleware('guest.access')->group(function () {
    Route::get('/welcome', [OnboardingController::class, 'welcome'])->name('easy.welcome');
    Route::get('/welcome/setup', [OnboardingController::class, 'setup'])->name('easy.welcome.setup');
});

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

Route::middleware('subscribed')->group(function () {
    Route::get('/news', [ArticleController::class, 'index'])->name('news.index');
});

