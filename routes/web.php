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
use App\Http\Controllers\LearnerController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Public Routes (Guest Access)
Route::middleware('guest.access')->group(function () {
    Route::get('/', HomeController::class)->name('home');
});

// Authenticated User Routes
Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
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
// "Learn English" learner UI (Stitch redesign) — UI-phase routes.
// Screens are props-driven; backend data lands in later phases. Keep
// existing admin/public routes untouched.
// ─────────────────────────────────────────────────────────────────────
Route::prefix('welcome')->name('welcome.')->group(function () {
    Route::get('/', [LearnerController::class, 'welcome'])->name('index');
    Route::get('/profile', [LearnerController::class, 'profileSetup'])->name('profile');
    Route::get('/placement', [LearnerController::class, 'placement'])->name('placement');
    Route::get('/placement/result', [LearnerController::class, 'placementResult'])->name('placement.result');
});

Route::get('/home', [LearnerController::class, 'home'])->name('learner.home');

// Learn hub + learning flows
Route::prefix('learn')->name('learn.')->group(function () {
    Route::get('/', [LearnerController::class, 'learn'])->name('index');
    Route::get('/lessons', [LearnerController::class, 'lessonPath'])->name('lessons');
    Route::get('/lessons/{lesson}', [LearnerController::class, 'lessonPlayer'])->name('lessons.show');
    Route::get('/vocabulary', [LearnerController::class, 'vocabulary'])->name('vocabulary');
    Route::get('/vocabulary/review', [LearnerController::class, 'flashcardReview'])->name('vocabulary.review');
    Route::get('/grammar', [LearnerController::class, 'grammar'])->name('grammar');
    Route::get('/grammar/{rule}', [LearnerController::class, 'grammarRule'])->name('grammar.show');
    Route::get('/reading', [LearnerController::class, 'reading'])->name('reading');
    Route::get('/reading/{id}', [LearnerController::class, 'readingReader'])->name('reading.show');
});

// AI companion tab
Route::prefix('ai')->name('ai.')->group(function () {
    Route::get('/', [LearnerController::class, 'ai'])->name('index');
    Route::get('/chat', [LearnerController::class, 'aiChat'])->name('chat');
    Route::get('/writing', [LearnerController::class, 'aiWriting'])->name('writing');
});

// Practice hub + practice flows
Route::prefix('practice')->name('practice.')->group(function () {
    Route::get('/', [LearnerController::class, 'practice'])->name('index');
    Route::get('/pronunciation', [LearnerController::class, 'pronunciation'])->name('pronunciation');
    Route::get('/listening', [LearnerController::class, 'listening'])->name('listening');
    Route::get('/writing', [LearnerController::class, 'writingDesk'])->name('writing');
    Route::get('/quiz', [LearnerController::class, 'quizCenter'])->name('quiz');
    Route::get('/quiz/session', [LearnerController::class, 'quizSession'])->name('quiz.session');
    Route::get('/phrasebook', [LearnerController::class, 'phrasebook'])->name('phrasebook');
    Route::get('/mistakes', [LearnerController::class, 'mistakeDoctor'])->name('mistakes');
});

// Profile sub-screens (main /profile stays with ProfileController)
Route::prefix('profile')->name('profile.')->group(function () {
    Route::get('/progress', [LearnerController::class, 'progress'])->name('progress');
    Route::get('/study-plan', [LearnerController::class, 'studyPlan'])->name('study-plan');
    Route::get('/settings', [LearnerController::class, 'settings'])->name('settings');
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

