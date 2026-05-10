<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create {email} {--password=} {--name=} {--phone=}', function () {
    $email = (string) $this->argument('email');
    $name = (string) ($this->option('name') ?: 'Admin');
    $phone = (string) ($this->option('phone') ?: '');

    $password = (string) ($this->option('password') ?: '');
    if ($password === '') {
        $password = Str::random(16);
        $this->warn('No password provided. Generated password: '.$password);
    }

    $user = User::query()->firstOrNew(['email' => $email]);
    $user->name = $name;
    $user->phone = $phone;
    $user->is_admin = true;
    $user->password = Hash::make($password);
    $user->save();

    $this->info('Admin user ready: '.$email);
})->purpose('Create or update an admin user');
