<?php

namespace App\Providers;

use App\Services\AppSettings;
use App\Services\ImageKitStorage;
use App\Services\ImageKitFilesystemAdapter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;

/**
 * AppServiceProvider - Main service provider for the application
 * 
 * This provider handles:
 * - Registration of custom filesystem drivers (ImageKit)
 * - Loading database-backed settings into Laravel's config
 * - Overriding mail and BdApps configuration from database
 * 
 * The boot() method applies settings from the database to the config,
 * allowing admins to change settings via the UI without editing .env files.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * 
     * Use this method to bind services into the service container.
     * Currently empty - services are registered elsewhere or auto-discovered.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     * 
     * This method:
     * 1. Registers the custom ImageKit filesystem driver
     * 2. Loads integration settings from database into config
     * 3. Overrides mail and BdApps settings with database values
     * 
     * Note: Environment variables take precedence in production.
     * Database settings are for admin UI convenience.
     */
    public function boot(): void
    {
        // Register ImageKit disk driver
        Storage::extend('imagekit', function ($app, $config) {
            $adapter = new ImageKitStorage($config);
            $driver = new Filesystem($adapter);
            return new ImageKitFilesystemAdapter($driver, $adapter, $config);
        });

        // Apply DB-backed integration settings (best-effort).
        // Keep env vars as the primary source in production; DB overrides are for admin UI convenience.
        if (!Schema::hasTable('settings')) {
            return;
        }

        /** @var AppSettings $settings */
        $settings = app(AppSettings::class);
        $integrations = $settings->integrations();

        if (($integrations['mailer'] ?? '') !== '') {
            config(['mail.default' => $integrations['mailer']]);
        }

        if (($integrations['smtp_host'] ?? '') !== '') {
            config(['mail.mailers.smtp.host' => $integrations['smtp_host']]);
        }
        if (($integrations['smtp_port'] ?? '') !== '') {
            config(['mail.mailers.smtp.port' => (int) $integrations['smtp_port']]);
        }
        if (($integrations['smtp_username'] ?? '') !== '') {
            config(['mail.mailers.smtp.username' => $integrations['smtp_username']]);
        }
        if (($integrations['smtp_password'] ?? '') !== '') {
            config(['mail.mailers.smtp.password' => $integrations['smtp_password']]);
        }
        if (($integrations['mail_from_address'] ?? '') !== '') {
            config(['mail.from.address' => $integrations['mail_from_address']]);
        }
        if (($integrations['mail_from_name'] ?? '') !== '') {
            config(['mail.from.name' => $integrations['mail_from_name']]);
        }

        // BDApps (used by BdAppsSmsService)
        if (($integrations['bdapps_base_url'] ?? '') !== '') {
            config(['services.bdapps.base_url' => $integrations['bdapps_base_url']]);
        }
        if (($integrations['bdapps_sms_url'] ?? '') !== '') {
            config(['services.bdapps.sms_url' => $integrations['bdapps_sms_url']]);
        }
        if (($integrations['bdapps_ussd_url'] ?? '') !== '') {
            config(['services.bdapps.ussd_url' => $integrations['bdapps_ussd_url']]);
        }
        if (($integrations['bdapps_app_id'] ?? '') !== '') {
            config(['services.bdapps.app_id' => $integrations['bdapps_app_id']]);
        }
        if (($integrations['bdapps_password'] ?? '') !== '') {
            config(['services.bdapps.password' => $integrations['bdapps_password']]);
        }
        if (($integrations['bdapps_source_address'] ?? '') !== '') {
            config(['services.bdapps.source_address' => $integrations['bdapps_source_address']]);
        }
        $dbPlatformSub = app(\App\Services\AppSettings::class)->get('integrations.bdapps_use_platform_subscription');
        if ($dbPlatformSub !== null) {
            config(['services.bdapps.use_platform_subscription' => (bool) $dbPlatformSub]);
        }
    }
}
