# Sports News Platform

A modern Laravel-based subscription content management system with BDApps integration for Bangladesh telecoms. Built with Laravel 12, Inertia.js, and React.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [BDApps Integration](#-bdapps-integration)
- [Subscription System](#-subscription-system)
- [Role-Based Permissions](#-role-based-permissions)
- [Development](#-development)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### Content Management
- **Article Management**: Rich text editor (TipTap) with media support
- **Category System**: Organize articles into categories
- **Page Builder**: Create static pages (About, Privacy, etc.)
- **Media Library**: Upload and manage images with ImageKit CDN integration
- **SEO-Friendly**: Meta tags, slugs, and sitemap support

### Subscription System
- **Multi-Channel Subscription**: SMS, USSD, Web, Admin
- **OTP Authentication**: Platform-based OTP via BDApps
- **Guest Mode**: Optional guest browsing for feed pages
- **Active Subscription Check**: Skip OTP for already-subscribed users
- **SMS Notifications**: Auto-send subscription confirmations
- **Subscription Sync**: Keep web portal in sync with mobile subscriptions

### User Management
- **Role-Based Access Control**: Admin, Moderator, Editor roles
- **Permission System**: Granular permissions for each feature
- **Admin Dashboard**: Comprehensive admin panel
- **User Analytics**: Track subscribers and subscription metrics

### BDApps Integration
- **SMS Integration**: Send/receive SMS via BDApps API
- **USSD Integration**: Interactive USSD menu for subscriptions
- **OTP Service**: Platform-based OTP for secure authentication
- **Webhook Support**: Real-time subscription notifications
- **Event Logging**: Track all BDApps API interactions

## 🛠 Tech Stack

### Backend
- **Laravel 12**: PHP framework
- **PHP 8.2+**: Latest PHP version
- **MySQL/SQLite**: Database
- **Queue System**: Background job processing

### Frontend
- **React 19**: UI library
- **Inertia.js**: Modern monolith approach
- **Tailwind CSS 4**: Utility-first CSS
- **TipTap**: Rich text editor
- **Lucide Icons**: Icon library
- **Chart.js**: Analytics charts

### Services
- **ImageKit**: CDN for image hosting and optimization
- **BDApps**: Bangladesh telecom integration

## 📦 Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- Bun (or npm/yarn)
- MySQL or SQLite
- BDApps account (for production)

## 🚀 Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Sports

# Install PHP dependencies
composer install

# Install JavaScript dependencies
bun install
# or: npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup

**For SQLite (Development):**
```bash
# Create database file
touch database/database.sqlite

# Update .env
DB_CONNECTION=sqlite
```

**For MySQL (Production):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 4. Run Migrations and Seeders

```bash
# Run migrations
php artisan migrate

# Seed initial data (roles, permissions, settings, admin user)
php artisan db:seed

# Or run specific seeders
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=AdminUserSeeder
```

### 5. Build Frontend Assets

```bash
# Build for production
bun run build

# Or run development server
bun run dev
```

### 6. Start the Application

**Development (concurrent servers):**
```bash
composer dev
# Starts: Laravel server, queue worker, logs, and Vite dev server
```

**Production:**
```bash
# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start server
php artisan serve

# Start queue worker (in separate terminal)
php artisan queue:work --tries=3
```

## ⚙️ Configuration

### Essential Environment Variables

```env
# Application
APP_NAME="Sports News"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=sports_db
DB_USERNAME=root
DB_PASSWORD=

# Queue (use database or redis)
QUEUE_CONNECTION=database

# Filesystem (use imagekit for CDN)
FILESYSTEM_DISK=imagekit

# ImageKit Configuration
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
IMAGEKIT_PUBLIC_KEY=public_xxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
IMAGEKIT_PATH=/sports

# BDApps Configuration
BDAPPS_SMS_URL=https://developer.bdapps.com/sms/send
BDAPPS_USSD_URL=https://developer.bdapps.com/ussd/send
BDAPPS_OTP_REQUEST_URL=https://developer.bdapps.com/otp/send
BDAPPS_OTP_VERIFY_URL=https://developer.bdapps.com/subscription/getSubscription
BDAPPS_APP_ID=APP_XXXXX
BDAPPS_PASSWORD=your_password
BDAPPS_SOURCE_ADDRESS=12345
BDAPPS_USE_PLATFORM_OTP=true
```

### Default Admin Credentials

After seeding, log in with:
- **Email**: `admin@example.com`
- **Password**: `password`

⚠️ **Change these credentials immediately in production!**

## 📱 BDApps Integration

### Overview
BDApps is Bangladesh's leading mobile application platform. This system integrates with BDApps for:
- SMS-based subscription management
- USSD menu interactions
- OTP authentication
- SMS notifications

### Configuration Methods

**Option 1: Database Settings (Recommended)**
1. Go to Admin Dashboard → Settings → BDApps
2. Enter your APP_ID and Password
3. Save settings

**Option 2: Environment Variables**
Add to `.env`:
```env
BDAPPS_APP_ID=APP_134847
BDAPPS_PASSWORD=your_bdapps_password
BDAPPS_USE_PLATFORM_OTP=true
```

### Subscription Channels

#### 1. SMS Subscription
Users send SMS to subscribe:
```
SMS: SUB
To: <short code>
```

**Webhook**: `POST /api/webhooks/sms`

**Response Flow**:
1. BDApps sends webhook with subscription request
2. System creates/updates subscriber
3. Creates active subscription record
4. Sends confirmation SMS

#### 2. USSD Subscription
Users dial USSD code:
```
Dial: *XXX#
Menu: 1. Subscribe | 2. Cancel
```

**Webhook**: `POST /api/webhooks/ussd`

**Response Flow**:
1. BDApps sends MO (Mobile Originated) request
2. System shows menu
3. User selects option
4. System sends MT (Mobile Terminated) response
5. Updates subscription status

#### 3. Web Subscription
Users access web portal:
```
URL: /subscribe
Login: OTP-based authentication
Action: Auto-subscribe on first login
```

**Flow**:
1. User enters phone number
2. System sends OTP via BDApps
3. User enters OTP
4. System verifies OTP
5. User is logged in and subscribed

#### 4. Admin Subscription
Admin manually manages subscriptions:
```
Admin → Subscribers → Activate/Cancel
```

### OTP Authentication

**Request OTP**:
```php
POST /login/verify
{
  "msisdn": "8801XXXXXXXXX"
}
```

**Verify OTP**:
```php
POST /login/otp
{
  "msisdn": "8801XXXXXXXXX",
  "otp": "123456"
}
```

**Important Notes**:
- Phone numbers must be in format: `8801XXXXXXXXX` (no + or 0)
- OTP is valid for 5 minutes
- Already subscribed users skip OTP on web portal

### Event Logging
All BDApps API calls are logged in `bdapps_events` table:
- Request/response payloads
- Status codes
- Timestamps
- Error tracking

## 🔐 Subscription System

### Subscription States
- `active`: User has active subscription
- `canceled`: User has canceled subscription

### Subscription Flow

#### First-Time User
1. **Visit Site** → Shown feed/categories (if guest mode enabled)
2. **Click Article** → Redirected to login
3. **Enter Phone** → OTP sent
4. **Enter OTP** → Auto-subscribed + logged in
5. **Access Content** → Full access granted

#### Returning Subscriber
1. **Visit Site** → Shown feed
2. **Click Article** → Check subscription status
3. **Has Active Subscription** → Skip OTP, instant login
4. **No Active Subscription** → Require OTP

#### Subscription Cancellation
1. **User Action**: Send SMS "STOP", USSD menu, or web portal
2. **System**: Mark subscription as canceled
3. **Notification**: Send cancellation confirmation SMS
4. **Access**: Restricted to guest mode (if enabled)

### Guest Mode

Configure in database settings:
- **Enabled**: Guests can browse feeds, must subscribe for articles
- **Disabled**: All users must login and subscribe

**Guest Permissions**:
- ✅ View home page
- ✅ View category pages
- ✅ View article listings
- ❌ Read article details
- ❌ Use search
- ❌ Save articles

## 👥 Role-Based Permissions

### Default Roles

#### 🔴 Admin (Full Access)
- **Content**: Create, edit, delete articles, categories, pages
- **Users**: Manage admin users and assign roles
- **Subscribers**: View and manage all subscriptions
- **Settings**: Edit all system settings
- **Media**: Upload and manage media files
- **SMS**: Send bulk SMS notifications
- **Analytics**: View all metrics and reports

#### 🔵 Moderator (Content & User Management)
- **Content**: Create, edit, delete articles, categories, pages
- **Users**: View users (cannot modify)
- **Subscribers**: View and manage subscriptions
- **SMS**: Send SMS notifications
- **Media**: Upload and manage media files
- **Settings**: View settings (read-only)

#### 🟢 Editor (Content Only)
- **Content**: Create and edit articles
- **Categories**: Manage categories
- **Media**: Upload and manage media files
- **No Access**: Users, subscribers, settings, SMS

### Permission Management

**Assign Role to User**:
```bash
php artisan tinker
$user = App\Models\User::find(1);
$user->roles()->attach(Role::where('name', 'moderator')->first());
```

**Check Permissions**:
```php
// In code
if ($user->hasPermission('create_articles')) {
    // Allow action
}

// In Blade/Inertia
@can('create_articles')
    <!-- Show content -->
@endcan
```

**Available Permissions**:
- `view_articles`, `create_articles`, `edit_articles`, `delete_articles`
- `view_users`, `create_users`, `edit_users`, `delete_users`
- `view_subscribers`, `manage_subscriptions`
- `view_settings`, `edit_settings`
- `manage_categories`, `manage_media`, `send_sms`

### Protecting Routes

```php
// Require specific role
Route::middleware('role:admin,moderator')->group(function () {
    Route::get('/admin/users', [AdminUserController::class, 'index']);
});

// Require specific permission
Route::middleware('permission:create_articles')->group(function () {
    Route::post('/admin/articles', [ArticleController::class, 'store']);
});
```

## 💻 Development

### Development Server

```bash
# Start all services (Laravel + Queue + Logs + Vite)
composer dev

# Or start individually:
php artisan serve          # Laravel server (port 8000)
php artisan queue:listen   # Queue worker
php artisan pail          # Real-time logs
bun run dev               # Vite dev server
```

### Code Quality

```bash
# Run tests
composer test
# or: php artisan test

# Code formatting (Laravel Pint)
./vendor/bin/pint

# Clear caches
php artisan optimize:clear
```

### Database Management

```bash
# Create new migration
php artisan make:migration create_table_name

# Create model with migration
php artisan make:model ModelName -m

# Rollback last migration
php artisan migrate:rollback

# Reset and reseed database
php artisan migrate:fresh --seed
```

### Seeder Classes
- `RoleSeeder`: Creates admin, moderator, editor roles
- `PermissionSeeder`: Creates all permissions and assigns to roles
- `AdminUserSeeder`: Creates default admin user
- `SettingSeeder`: Creates default system settings
- `BdAppsSettingsSeeder`: Creates BDApps configuration

## 🔌 API Endpoints

### Public Endpoints

```http
# Homepage
GET /

# Category page
GET /categories/{slug}

# Article detail (requires subscription)
GET /articles/{slug}

# Search (requires subscription)
GET /search?q=keyword
```

### Authentication

```http
# Request OTP
POST /login/verify
Content-Type: application/json
{
  "msisdn": "8801XXXXXXXXX"
}

# Verify OTP
POST /login/otp
Content-Type: application/json
{
  "msisdn": "8801XXXXXXXXX",
  "otp": "123456"
}

# Logout
POST /logout
```

### Webhook Endpoints (BDApps)

```http
# SMS Webhook
POST /api/webhooks/sms
Content-Type: application/json
{
  "sourceAddress": "tel:+8801XXXXXXXXX",
  "applicationId": "APP_XXXXX",
  "message": "SUB",
  "requestId": "unique_id"
}

# USSD Webhook
POST /api/webhooks/ussd
Content-Type: application/json
{
  "sessionId": "session_id",
  "msisdn": "tel:+8801XXXXXXXXX",
  "ussdOperation": "mo-init",
  "message": "1"
}

# Subscription Notification
POST /api/webhooks/notify
Content-Type: application/json
{
  "subscriberId": "tel:+8801XXXXXXXXX",
  "status": "REGISTERED",
  "frequency": "daily",
  "applicationId": "APP_XXXXX"
}
```

### Admin API (authenticated)

```http
# Get subscribers
GET /admin/subscribers

# Send SMS
POST /admin/sms/send
Content-Type: application/json
{
  "msisdn": "8801XXXXXXXXX",
  "message": "Your message here"
}
```

## 🐛 Troubleshooting

### OTP Not Sending

**Symptoms**: "OTP request failed" error

**Solutions**:
1. Check BDApps credentials in `.env` or database settings
2. Verify phone number format: `8801XXXXXXXXX` (no + or 0 prefix)
3. Check `bdapps_events` table for error details
4. Ensure `BDAPPS_USE_PLATFORM_OTP=true` is set
5. Verify server can make HTTPS requests (check SSL certificates)

```bash
# Test credentials
php artisan tinker
>>> config('services.bdapps.app_id')
>>> config('services.bdapps.password')
```

### Images Not Loading

**Symptoms**: Broken images or 404 errors

**Solutions**:
1. **Using ImageKit**: Verify credentials in `.env`
2. **Using Local Storage**: Run `php artisan storage:link`
3. Check `FILESYSTEM_DISK` setting in `.env`
4. Verify uploaded files exist in storage

```bash
# For local storage
php artisan storage:link

# Check ImageKit config
php artisan tinker
>>> config('filesystems.disks.imagekit')
```

### Queue Jobs Not Processing

**Symptoms**: SMS not sending, background tasks stuck

**Solutions**:
1. Ensure queue worker is running: `php artisan queue:work`
2. Check queue connection in `.env`: `QUEUE_CONNECTION=database`
3. View failed jobs: `php artisan queue:failed`
4. Retry failed jobs: `php artisan queue:retry all`

```bash
# Start queue worker
php artisan queue:work --tries=3 --timeout=90

# Monitor queue in real-time
php artisan queue:listen
```

### Permission Denied Errors

**Symptoms**: "Unauthorized" or "403 Forbidden" errors

**Solutions**:
1. Check user's assigned roles
2. Verify permissions attached to role
3. Ensure middleware is applied correctly

```bash
# Check user roles and permissions
php artisan tinker
>>> $user = App\Models\User::find(1);
>>> $user->roles->pluck('name');
>>> $user->getAllPermissions();
```

### Database Migration Errors

**Symptoms**: Migration fails or columns already exist

**Solutions**:
```bash
# Reset database (WARNING: deletes all data)
php artisan migrate:fresh

# Rollback last migration
php artisan migrate:rollback

# Check migration status
php artisan migrate:status
```

### Build/Compilation Errors

**Frontend build fails**:
```bash
# Clear node modules and reinstall
rm -rf node_modules
rm bun.lockb  # or package-lock.json
bun install

# Clear Vite cache
rm -rf public/build
bun run build
```

**Laravel optimization**:
```bash
# Clear all caches
php artisan optimize:clear

# Individual cache clearing
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check Laravel logs: `storage/logs/laravel.log`
4. Contact system administrator

---

**Built with ❤️ using Laravel, React, and Tailwind CSS**

If you use the `php-app` TAP API library (recommended), also set:

- `BDAPPS_SMS_DELIVERY_STATUS_REQUEST`
- `BDAPPS_SMS_CHARGING_AMOUNT`
- `BDAPPS_SMS_ENCODING`
- `BDAPPS_SMS_VERSION`
- `BDAPPS_SMS_BINARY_HEADER`
- `BDAPPS_USSD_ENCODING`
- `BDAPPS_USSD_VERSION`
- `BDAPPS_USSD_CHARGING_AMOUNT`

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
