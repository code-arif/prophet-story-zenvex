<?php

/**
 * Web Routes
 * 
 * This file defines all web routes for the application.
 * Routes are organized into groups with appropriate middleware:
 * - Guest access: For public pages when guest mode is enabled
 * - Authenticated: For user profile and subscription management
 * - Admin: For admin panel routes (with role/permission checks)
 * 
 * The application uses Inertia.js for rendering Vue.js pages.
 */

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminContentLookupController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminBulkSmsController;
use App\Http\Controllers\Admin\AdminLogsController;
use App\Http\Controllers\Admin\AdminMetricsController;
use App\Http\Controllers\Admin\AdminPageController;
use App\Http\Controllers\Admin\AdminPageBuilderController;
use App\Http\Controllers\Admin\AdminPostTypeController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminSubscriptionController;
use App\Http\Controllers\Admin\AdminSubscriberController;
use App\Http\Controllers\Admin\AdminMediaController;
use App\Http\Controllers\Admin\AdminTaxonomyController;
use App\Http\Controllers\Admin\AdminContentManagerController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\AppDownloadController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\FirstLoginController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use App\Models\MediaFile;
use Illuminate\Support\Facades\Storage;

use App\Http\Controllers\PrayerTimesController;

use Inertia\Inertia;

// ============================================
// Public Routes (Guest Access)
// These routes are accessible to guests when guest mode is enabled
// ============================================
Route::middleware('guest.access')->group(function () {
    Route::get('/', HomeController::class)->name('home');           // Homepage (configurable)
    Route::get('/feed', FeedController::class)->name('feed');       // Article feed
    Route::get('/category/{slug}', HomeController::class)->name('category'); // Category page
});

// ============================================
// Authenticated User Routes
// These routes require user to be logged in (via MSISDN session)
// ============================================
Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::post('/subscribe', [ProfileController::class, 'subscribe'])->name('profile.subscribe');
Route::post('/unsubscribe', [ProfileController::class, 'unsubscribe'])->name('profile.unsubscribe');
Route::match(['get', 'post'], '/logout', [ProfileController::class, 'logout'])->name('profile.logout');

// Static pages
Route::get('/about', fn () => Inertia::render('Static/About'))->name('about');
Route::get('/help', fn () => Inertia::render('Static/Help'))->name('help');

// App download routes
Route::get('/app', [AppDownloadController::class, 'show'])->name('app.download');
Route::get('/app/download', [AppDownloadController::class, 'download'])->name('app.download.file');
// Public APK link (clean URL for direct download)
Route::get('/apk/{filename}', [AppDownloadController::class, 'publicDownload'])->name('apk.public');
Route::get('/p/{slug}', [PageController::class, 'show'])->name('pages.show');

// Article navigation endpoints (JSON)
Route::get('/articles/next/{article}', [ArticleController::class, 'next'])->name('articles.next');
Route::get('/articles/previous/{article}', [ArticleController::class, 'previous'])->name('articles.previous');
Route::get('/articles/suggested', [ArticleController::class, 'suggested'])->name('articles.suggested');

// Authentication routes
Route::get('/login', [FirstLoginController::class, 'show'])->name('login.show');
Route::get('/guest', [FirstLoginController::class, 'guest'])->name('guest.start');
Route::post('/login/send-otp', [FirstLoginController::class, 'sendOtp'])->name('login.sendOtp');
Route::get('/login/verify', [FirstLoginController::class, 'verifyShow'])->name('login.verify.show');
Route::post('/login/verify', [FirstLoginController::class, 'verify'])->name('login.verify');

// ============================================
// Admin Routes
// All admin routes are prefixed with /admin and use 'admin.' route names
// Middleware: 'admin' ensures user has admin role
// ============================================
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin authentication (no middleware - public)
    Route::get('/login', [AdminAuthController::class, 'show'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    Route::match(['get', 'post'], '/logout', [AdminAuthController::class, 'logout'])->name('logout')->middleware('auth');

    // Protected admin routes (requires user to be authenticated)
    Route::middleware('auth')->group(function () {
        // Dashboard - accessible to all admin roles (admin, moderator, editor)
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        // ============================================
        // Settings Routes (Admin only)
        // These routes require the 'admin' role
        // ============================================
        // ============================================
        // Settings Routes
        // ============================================
        Route::redirect('/settings', '/admin/settings/general')->name('settings');
        
        // General settings
        Route::get('/settings/general', [AdminSettingsController::class, 'general'])->name('settings.general');
        Route::post('/settings/general', [AdminSettingsController::class, 'saveGeneral'])->name('settings.general.save');

        Route::get('/settings/theme', [AdminSettingsController::class, 'theme'])->name('settings.theme');
        Route::post('/settings/theme', [AdminSettingsController::class, 'saveTheme'])->name('settings.theme.save');

        Route::get('/settings/profile', [AdminSettingsController::class, 'profile'])->name('settings.profile');
        Route::post('/settings/profile', [AdminSettingsController::class, 'saveProfile'])->name('settings.profile.save');
        Route::get('/settings/integrations', [AdminSettingsController::class, 'integrations'])->name('settings.integrations');
        Route::post('/settings/integrations', [AdminSettingsController::class, 'saveIntegrations'])->name('settings.integrations.save');

        Route::get('/settings/bdapps', [AdminSettingsController::class, 'bdapps'])->name('settings.bdapps');
        Route::post('/settings/bdapps/test-sms', [AdminSettingsController::class, 'bdappsTestSms'])->name('settings.bdapps.testSms');
        Route::post('/settings/bdapps/notifications', [AdminSettingsController::class, 'saveBdappsNotifications'])->name('settings.bdapps.notifications.save');

        Route::get('/settings/ussd-menu', [AdminSettingsController::class, 'ussdMenu'])->name('settings.ussdMenu');
        Route::post('/settings/ussd-menu', [AdminSettingsController::class, 'saveUssdMenu'])->name('settings.ussdMenu.save');

        Route::get('/settings/footer', [AdminSettingsController::class, 'footer'])->name('settings.footer');
        Route::post('/settings/footer', [AdminSettingsController::class, 'saveFooter'])->name('settings.footer.save');

        Route::get('/settings/widgets', [AdminSettingsController::class, 'widgets'])->name('settings.widgets');
        Route::post('/settings/widgets', [AdminSettingsController::class, 'saveWidgets'])->name('settings.widgets.save');

        // Optimization / Cache management
        Route::get('/settings/optimize', [AdminSettingsController::class, 'optimize'])->name('settings.optimize');
        Route::post('/settings/optimize/clear-cache', [AdminSettingsController::class, 'clearCache'])->name('settings.optimize.clearCache');
        Route::post('/settings/optimize/clear-views', [AdminSettingsController::class, 'clearViews'])->name('settings.optimize.clearViews');
        Route::post('/settings/optimize/clear-config', [AdminSettingsController::class, 'clearConfig'])->name('settings.optimize.clearConfig');
        Route::post('/settings/optimize/clear-routes', [AdminSettingsController::class, 'clearRoutes'])->name('settings.optimize.clearRoutes');
        Route::post('/settings/optimize/clear-all', [AdminSettingsController::class, 'optimizeApp'])->name('settings.optimize.clearAll');
        Route::post('/settings/optimize/cache-config', [AdminSettingsController::class, 'cacheConfig'])->name('settings.optimize.cacheConfig');
        Route::post('/settings/optimize/cache-routes', [AdminSettingsController::class, 'cacheRoutes'])->name('settings.optimize.cacheRoutes');
        Route::post('/settings/optimize/cache-views', [AdminSettingsController::class, 'cacheViews'])->name('settings.optimize.cacheViews');

        // Backup & Restore
        Route::get('/settings/optimize/backup-settings', [AdminSettingsController::class, 'backupSettings'])->name('settings.optimize.backupSettings');
        Route::get('/settings/optimize/backup-content', [AdminSettingsController::class, 'backupContent'])->name('settings.optimize.backupContent');
        Route::get('/settings/optimize/backup-pages', [AdminSettingsController::class, 'backupPages'])->name('settings.optimize.backupPages');
        Route::get('/settings/optimize/backup-menu', [AdminSettingsController::class, 'backupMenu'])->name('settings.optimize.backupMenu');
        Route::get('/settings/optimize/backup-all', [AdminSettingsController::class, 'backupAll'])->name('settings.optimize.backupAll');
        Route::post('/settings/optimize/restore', [AdminSettingsController::class, 'restore'])->name('settings.optimize.restore');
        Route::post('/settings/optimize/reset', [AdminSettingsController::class, 'reset'])->name('settings.optimize.reset');

        // User navigation menu builder
        Route::get('/settings/menu', [AdminSettingsController::class, 'userMenu'])->name('settings.userMenu');
        Route::post('/settings/menu', [AdminSettingsController::class, 'saveUserMenu'])->name('settings.userMenu.save');

        // Admin sidebar menu (advanced JSON editor)
        Route::get('/settings/menu/admin', [AdminSettingsController::class, 'menu'])->name('settings.menu');
        Route::post('/settings/menu/admin', [AdminSettingsController::class, 'saveMenu'])->name('settings.menu.save');



        // Content Manager
        Route::get('/content-manager', [AdminContentManagerController::class, 'index'])->name('content-manager.index');
        Route::delete('/content-manager/{type}/{id}', [AdminContentManagerController::class, 'destroy'])->name('content-manager.destroy');

        // Pages
        Route::get('/pages', [AdminPageController::class, 'index'])->name('pages.index');
        Route::get('/pages/create', [AdminPageController::class, 'create'])->name('pages.create');
        Route::post('/pages', [AdminPageController::class, 'store'])->name('pages.store');
        Route::get('/pages/{page}/edit', [AdminPageController::class, 'edit'])->name('pages.edit');
        Route::put('/pages/{page}', [AdminPageController::class, 'update'])->name('pages.update');
        Route::delete('/pages/{page}', [AdminPageController::class, 'destroy'])->name('pages.destroy');

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

        // Post Types
        Route::get('/post-types', [AdminPostTypeController::class, 'index'])->name('post-types.index');
        Route::get('/post-types/create', [AdminPostTypeController::class, 'create'])->name('post-types.create');
        Route::post('/post-types', [AdminPostTypeController::class, 'store'])->name('post-types.store');
        Route::get('/post-types/{postType}/edit', [AdminPostTypeController::class, 'edit'])->name('post-types.edit');
        Route::put('/post-types/{postType}', [AdminPostTypeController::class, 'update'])->name('post-types.update');
        Route::delete('/post-types/{postType}', [AdminPostTypeController::class, 'destroy'])->name('post-types.destroy');

        // Taxonomies
        Route::get('/taxonomies', [AdminTaxonomyController::class, 'index'])->name('taxonomies.index');
        Route::get('/taxonomies/create', [AdminTaxonomyController::class, 'create'])->name('taxonomies.create');
        Route::post('/taxonomies', [AdminTaxonomyController::class, 'store'])->name('taxonomies.store');
        Route::get('/taxonomies/{taxonomy}/edit', [AdminTaxonomyController::class, 'edit'])->name('taxonomies.edit');
        Route::put('/taxonomies/{taxonomy}', [AdminTaxonomyController::class, 'update'])->name('taxonomies.update');
        Route::delete('/taxonomies/{taxonomy}', [AdminTaxonomyController::class, 'destroy'])->name('taxonomies.destroy');

        // Page Builder redirects
        Route::get('/page-builder', fn () => redirect('/admin/pages'))->name('page-builder.index');
        Route::get('/page-builder/create', fn () => redirect('/admin/pages/create'))->name('page-builder.create');
        Route::get('/page-builder/{page}/edit', fn ($page) => redirect("/admin/pages/{$page}/edit"))->name('page-builder.edit');

        // Logs
        Route::get('/logs', [AdminLogsController::class, 'index'])->name('logs.index');

        // Metrics
        Route::get('/metrics', [AdminMetricsController::class, 'index'])->name('metrics.index');

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
    });
});

Route::middleware('subscribed')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{article:slug}', [ArticleController::class, 'show'])->name('articles.show');
    Route::get('/news', [ArticleController::class, 'index'])->name('news.index');
    Route::get('/news/{article:slug}', [ArticleController::class, 'show'])->name('news.show');
    Route::get('/search', SearchController::class)->name('search');
    Route::get('/saved', fn () => Inertia::render('Saved/Index'))->name('saved');
});


//demo route for some testing
Route::get('/demo', function () {

    return "Demo route works";
})->name('demo');

