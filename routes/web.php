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
use App\Http\Controllers\Admin\AdminLessonController;
use App\Http\Controllers\Admin\AdminVocabController;
use App\Http\Controllers\Admin\AdminQuizController;
use App\Http\Controllers\Admin\AdminReadingController;
use App\Http\Controllers\AppDownloadController;
use App\Http\Controllers\FirstLoginController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Learner\OnboardingController;
use App\Http\Controllers\Learner\HomeController as LearnerHomeController;
use App\Http\Controllers\Learner\LearnController;
use App\Http\Controllers\Learner\AiController;
use App\Http\Controllers\Learner\PracticeController;
use App\Http\Controllers\Learner\ProfileController as LearnerProfileController;
use Illuminate\Support\Facades\Route;

// Public route — the landing page (/) is open to everyone.
Route::get('/', HomeController::class)->name('home');

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
// "Learn English" learner app — full backend (auth required after login).
// Flow: login → new user → profile setup → placement test → result → home.
// Admin & public routes above stay untouched.
// ─────────────────────────────────────────────────────────────────────
Route::get('/welcome', [OnboardingController::class, 'welcome'])->name('welcome');

// Onboarding (only reachable once logged in)
Route::middleware('learner')->prefix('welcome')->name('welcome.')->group(function () {
    Route::get('/profile', [OnboardingController::class, 'profileSetup'])->name('profile');
    Route::post('/profile', [OnboardingController::class, 'saveProfile'])->name('profile.save');
    Route::post('/profile/skip', [OnboardingController::class, 'skipProfile'])->name('profile.skip');
    Route::get('/placement', [OnboardingController::class, 'placement'])->name('placement');
    Route::post('/placement/submit', [OnboardingController::class, 'submitPlacement'])->name('placement.submit');
    Route::get('/placement/result', [OnboardingController::class, 'placementResult'])->name('placement.result');
});

// Learner app (everything behind subscriber login)
Route::middleware('learner')->group(function () {
    Route::get('/home', LearnerHomeController::class)->name('learner.home');

    // Learn hub + learning flows
    Route::prefix('learn')->name('learn.')->group(function () {
        Route::get('/', [LearnController::class, 'learn'])->name('index');
        Route::get('/lessons', [LearnController::class, 'lessonPath'])->name('lessons');
        Route::get('/lessons/{lesson}', [LearnController::class, 'lessonPlayer'])->name('lessons.show');
        Route::post('/lessons/{lesson}/complete', [LearnController::class, 'completeLesson'])->name('lessons.complete');
        Route::get('/vocabulary', [LearnController::class, 'vocabulary'])->name('vocabulary');
        Route::get('/vocabulary/review', [LearnController::class, 'flashcardReview'])->name('vocabulary.review');
        Route::post('/vocabulary/rate', [LearnController::class, 'rateCard'])->name('vocabulary.rate');
        Route::post('/vocabulary/save-word', [LearnController::class, 'saveWord'])->name('vocabulary.save-word');
        Route::get('/grammar', [LearnController::class, 'grammar'])->name('grammar');
        Route::get('/grammar/{rule}', [LearnController::class, 'grammarRule'])->name('grammar.show');
        Route::get('/reading', [LearnController::class, 'reading'])->name('reading');
        Route::get('/reading/{id}', [LearnController::class, 'readingReader'])->name('reading.show');
        Route::post('/reading/{id}/complete', [LearnController::class, 'completeReading'])->name('reading.complete');
    });

    // AI companion tab
    Route::prefix('ai')->name('ai.')->group(function () {
        Route::get('/', [AiController::class, 'ai'])->name('index');
        Route::get('/chat', [AiController::class, 'firstScenario'])->name('chat.index');
        Route::get('/chat/{scenario}', [AiController::class, 'aiChat'])->name('chat');
        // AI endpoints call the paid LLM — keep them throttled (12/min).
        Route::post('/chat/send', [AiController::class, 'chatSend'])->name('chat.send')->middleware('throttle:12,1');
        Route::post('/chat/reset', [AiController::class, 'chatReset'])->name('chat.reset');
        Route::get('/writing', [AiController::class, 'aiWriting'])->name('writing');
        Route::post('/writing/check', [AiController::class, 'writingCheck'])->name('writing.check')->middleware('throttle:12,1');
        Route::post('/writing/save', [AiController::class, 'writingSave'])->name('writing.save');
    });

    // Practice hub + practice flows
    Route::prefix('practice')->name('practice.')->group(function () {
        Route::get('/', [PracticeController::class, 'practice'])->name('index');
        Route::get('/pronunciation', [PracticeController::class, 'pronunciation'])->name('pronunciation');
        Route::get('/listening', [PracticeController::class, 'listening'])->name('listening');
        Route::get('/writing', [PracticeController::class, 'writingDesk'])->name('writing');
        Route::post('/writing/save-draft', [PracticeController::class, 'saveDraft'])->name('writing.save-draft');
        Route::get('/quiz', [PracticeController::class, 'quizCenter'])->name('quiz');
        Route::get('/quiz/session/{quiz?}', [PracticeController::class, 'quizSession'])->name('quiz.session');
        Route::post('/quiz/attempt', [PracticeController::class, 'submitQuiz'])->name('quiz.attempt');
        Route::get('/phrasebook', [PracticeController::class, 'phrasebook'])->name('phrasebook');
        Route::post('/phrasebook/toggle', [PracticeController::class, 'togglePhrase'])->name('phrasebook.toggle');
        Route::get('/mistakes', [PracticeController::class, 'mistakeDoctor'])->name('mistakes');
        Route::post('/mistakes/check', [PracticeController::class, 'checkMistake'])->name('mistakes.check');
    });

    // Profile sub-screens (main /profile stays with ProfileController)
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/progress', [LearnerProfileController::class, 'progress'])->name('progress');
        Route::get('/study-plan', [LearnerProfileController::class, 'studyPlan'])->name('study-plan');
        // Plan generation calls the paid LLM — keep it throttled (10/min).
        Route::post('/study-plan/generate', [LearnerProfileController::class, 'generatePlan'])->name('study-plan.generate')->middleware('throttle:10,1');
        Route::post('/study-plan/toggle-task', [LearnerProfileController::class, 'togglePlanTask'])->name('study-plan.toggle');
        Route::get('/settings', [LearnerProfileController::class, 'settings'])->name('settings');
        Route::post('/settings', [LearnerProfileController::class, 'saveSettings'])->name('settings.save');
        Route::get('/export', [LearnerProfileController::class, 'export'])->name('export');
    });
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

        // Learn English learner content (lessons, decks, quizzes, reading)
        Route::prefix('learner')->name('learner.')->group(function () {
            Route::resource('lessons', AdminLessonController::class)->except(['show']);
            Route::resource('vocabulary', AdminVocabController::class)->except(['show']);
            Route::resource('quizzes', AdminQuizController::class)->except(['show']);
            Route::resource('reading', AdminReadingController::class)->except(['show']);
        });
    });
});

Route::middleware('subscribed')->group(function () {
    Route::get('/news', [ArticleController::class, 'index'])->name('news.index');
});

