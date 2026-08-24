<?php

namespace Database\Seeders;

use App\Models\EasyRise\Client;
use App\Models\EasyRise\Job;
use App\Models\EasyRise\ScopeItem;
use App\Models\EasyRise\Proposal;
use App\Models\EasyRise\IncomeEntry;
use App\Models\EasyRise\Document;
use App\Models\EasyRise\Niche;
use App\Models\EasyRise\ChecklistItem;
use App\Models\EasyRise\Plan;
use App\Models\EasyRise\Review;
use App\Models\EasyRise\EasyRiseSetting;
use App\Models\EasyRise\ReminderLog;
use App\Models\Subscriber;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EasyRiseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Create subscriber (the auth entity in this app)
        $subscriber = Subscriber::firstOrCreate(
            ['msisdn' => '8801712345678'],
            ['name' => 'আরিফুল ইসলাম']
        );

        // Create active subscription
        Subscription::updateOrCreate(
            ['msisdn' => '8801712345678', 'status' => Subscription::STATUS_ACTIVE],
            [
                'starts_at' => now()->subDays(30),
                'ends_at' => null,
                'channel' => 'web',
                'last_message' => 'seeded for testing',
            ]
        );

        // Create a user record for easy-rise tables (foreign key to users table)
        $user = User::firstOrCreate(
            ['email' => 'ariful@easyrise.dev'],
            [
                'name' => 'আরিফুল ইসলাম',
                'password' => bcrypt('password'),
            ]
        );

        // ── Clients ──
        $clients = Client::insert([
            ['user_id' => $user->id, 'name' => 'Rahim Corp', 'source' => 'fiverr', 'marketplace' => 'Fiverr', 'created_at' => now()->subDays(60)],
            ['user_id' => $user->id, 'name' => 'TechStart LLC', 'source' => 'upwork', 'marketplace' => 'Upwork', 'created_at' => now()->subDays(45)],
            ['user_id' => $user->id, 'name' => 'GreenLeaf Co', 'source' => 'fiverr', 'marketplace' => 'Fiverr', 'created_at' => now()->subDays(30)],
            ['user_id' => $user->id, 'name' => 'FoodPanda BD', 'source' => 'direct', 'marketplace' => 'Direct', 'created_at' => now()->subDays(20)],
            ['user_id' => $user->id, 'name' => 'Sunny Studios', 'source' => 'peopleperhour', 'marketplace' => 'PeoplePerHour', 'created_at' => now()->subDays(15)],
        ]);

        $clientIds = Client::where('user_id', $user->id)->pluck('id');

        // ── Jobs ──
        $jobData = [
            ['client_id' => $clientIds[0], 'title' => 'লোগো ডিজাইন', 'status' => 'closed', 'deadline' => Carbon::now()->subDays(10), 'agreed_paisa' => 1500000, 'currency' => 'BDT', 'concepts' => 3, 'revisions' => 2],
            ['client_id' => $clientIds[1], 'title' => 'ওয়েবসাইট রিডিজাইন', 'status' => 'active', 'deadline' => Carbon::now()->addDays(5), 'agreed_paisa' => 5000000, 'currency' => 'BDT', 'concepts' => 2, 'revisions' => 3],
            ['client_id' => $clientIds[2], 'title' => 'সোশ্যাল মিডিয়া পোস্ট', 'status' => 'delivered', 'deadline' => Carbon::now()->subDays(3), 'agreed_paisa' => 800000, 'currency' => 'BDT', 'concepts' => 5, 'revisions' => 1],
            ['client_id' => $clientIds[3], 'title' => 'ব্রোশার ডিজাইন', 'status' => 'awaiting_payment', 'deadline' => Carbon::now()->subDays(7), 'agreed_paisa' => 2000000, 'currency' => 'BDT', 'concepts' => 2, 'revisions' => 2],
            ['client_id' => $clientIds[4], 'title' => 'UI/UX কনসালটেশন', 'status' => 'prospect', 'deadline' => Carbon::now()->addDays(14), 'agreed_paisa' => 3000000, 'currency' => 'BDT', 'concepts' => 1, 'revisions' => 0],
            ['client_id' => $clientIds[0], 'title' => 'প্রোডাক্ট ফটোগ্রাফি', 'status' => 'applied', 'deadline' => Carbon::now()->addDays(10), 'agreed_paisa' => 1200000, 'currency' => 'BDT', 'concepts' => 4, 'revisions' => 1],
        ];

        foreach ($jobData as $j) {
            Job::create(array_merge($j, ['user_id' => $user->id, 'created_at' => now()->subDays(rand(5, 50))]));
        }

        $jobIds = Job::where('user_id', $user->id)->pluck('id');

        // ── Scope Items ──
        $scopeData = [
            ['job_id' => $jobIds[1], 'date' => Carbon::now()->subDays(4), 'description' => 'হোমপেজ ওয়্যারফ্রেম', 'hours' => 3.5],
            ['job_id' => $jobIds[1], 'date' => Carbon::now()->subDays(3), 'description' => 'মকআপ তৈরি', 'hours' => 5.0],
            ['job_id' => $jobIds[1], 'date' => Carbon::now()->subDays(1), 'description' => 'রিভিশন ১', 'hours' => 2.0],
            ['job_id' => $jobIds[2], 'date' => Carbon::now()->subDays(5), 'description' => '৫টি পোস্ট ডিজাইন', 'hours' => 4.0],
            ['job_id' => $jobIds[3], 'date' => Carbon::now()->subDays(10), 'description' => 'ব্রোশার লেআউট', 'hours' => 6.0],
        ];

        foreach ($scopeData as $s) {
            ScopeItem::create(array_merge($s, ['user_id' => $user->id, 'created_at' => now()]));
        }

        // ── Proposals ──
        $proposalData = [
            ['job_id' => $jobIds[0], 'sent_at' => Carbon::now()->subDays(55), 'marketplace' => 'Fiverr', 'job_type' => 'লোগো', 'quoted_paisa' => 1500000, 'outcome' => 'won'],
            ['job_id' => $jobIds[1], 'sent_at' => Carbon::now()->subDays(40), 'marketplace' => 'Upwork', 'job_type' => 'ওয়েবসাইট', 'quoted_paisa' => 5000000, 'outcome' => 'won'],
            ['job_id' => $jobIds[2], 'sent_at' => Carbon::now()->subDays(28), 'marketplace' => 'Fiverr', 'job_type' => 'সোশ্যাল মিডিয়া', 'quoted_paisa' => 800000, 'outcome' => 'won'],
            ['job_id' => $jobIds[3], 'sent_at' => Carbon::now()->subDays(18), 'marketplace' => 'Direct', 'job_type' => 'ল্যান্ডিং পেজ', 'quoted_paisa' => 2000000, 'outcome' => 'won'],
            ['job_id' => null, 'sent_at' => Carbon::now()->subDays(12), 'marketplace' => 'Fiverr', 'job_type' => 'কন্টেন্ট', 'quoted_paisa' => 600000, 'outcome' => 'lost'],
            ['job_id' => null, 'sent_at' => Carbon::now()->subDays(8), 'marketplace' => 'Upwork', 'job_type' => 'লোগো', 'quoted_paisa' => 900000, 'outcome' => 'sent'],
        ];

        foreach ($proposalData as $p) {
            Proposal::create(array_merge($p, ['user_id' => $user->id]));
        }

        // ── Income Entries ──
        $incomeData = [
            ['job_id' => $jobIds[0], 'date' => Carbon::now()->subDays(8), 'currency' => 'BDT', 'amount_paisa' => 1500000, 'rate' => 120.00, 'channel' => 'bKash'],
            ['job_id' => $jobIds[2], 'date' => Carbon::now()->subDays(2), 'currency' => 'BDT', 'amount_paisa' => 800000, 'rate' => 110.00, 'channel' => 'Nagad'],
            ['job_id' => $jobIds[1], 'date' => Carbon::now()->subDays(20), 'currency' => 'USD', 'amount_paisa' => 2500000, 'rate' => 121.50, 'channel' => 'Payoneer'],
            ['job_id' => null, 'date' => Carbon::now()->subDays(35), 'currency' => 'BDT', 'amount_paisa' => 500000, 'rate' => 115.00, 'channel' => 'bKash'],
        ];

        foreach ($incomeData as $i) {
            IncomeEntry::create(array_merge($i, ['user_id' => $user->id, 'created_at' => now()]));
        }

        // ── Documents ──
        $docData = [
            ['purpose' => 'পাসপোর্ট', 'name' => 'পাসপোর্ট স্ক্যান', 'status' => 'valid', 'expiry_date' => Carbon::now()->addYears(5), 'note' => ''],
            ['purpose' => 'NID', 'name' => 'জাতীয় পরিচয়পত্র', 'status' => 'valid', 'expiry_date' => null, 'note' => ''],
            ['purpose' => 'TIN', 'name' => 'TIN সার্টিফিকেট', 'status' => 'missing', 'expiry_date' => null, 'note' => 'তৈরি করা হয়নি'],
            ['purpose' => 'ব্যাংক স্টেটমেন্ট', 'name' => 'প্রথম আমানত ব্যাংক স্টেটমেন্ট', 'status' => 'expired', 'expiry_date' => Carbon::now()->subMonths(2), 'note' => 'আপডেট প্রয়োজন'],
            ['purpose' => 'ভিসা', 'name' => 'ভিসা কপি', 'status' => 'missing', 'expiry_date' => null, 'note' => ''],
        ];

        foreach ($docData as $d) {
            Document::create(array_merge($d, ['user_id' => $user->id, 'created_at' => now()]));
        }

        // ── Niches ──
        $nicheData = [
            ['name' => 'লোগো ডিজাইন', 'profiles_found' => 12500, 'jobs_posted_7d' => 340, 'rate_min' => 500000, 'rate_max' => 5000000, 'skill' => 8, 'score' => 78, 'band' => 'ভালো'],
            ['name' => 'ওয়েবসাইট ডিজাইন', 'profiles_found' => 8200, 'jobs_posted_7d' => 210, 'rate_min' => 1000000, 'rate_max' => 15000000, 'skill' => 7, 'score' => 65, 'band' => 'মাঝারি'],
            ['name' => 'সোশ্যাল মিডিয়া', 'profiles_found' => 22000, 'jobs_posted_7d' => 520, 'rate_min' => 200000, 'rate_max' => 2000000, 'skill' => 6, 'score' => 52, 'band' => 'গড়'],
            ['name' => 'UI/UX ডিজাইন', 'profiles_found' => 4500, 'jobs_posted_7d' => 95, 'rate_min' => 2000000, 'rate_max' => 25000000, 'skill' => 8, 'score' => 72, 'band' => 'ভালো'],
        ];

        foreach ($nicheData as $n) {
            Niche::create(array_merge($n, ['user_id' => $user->id, 'created_at' => now()]));
        }

        // ── Checklist Items ──
        $checklistItems = [
            ['item_id' => 'profile_photo', 'done' => true],
            ['item_id' => 'profile_title', 'done' => true],
            ['item_id' => 'profile_description', 'done' => false],
            ['item_id' => 'profile_skills', 'done' => true],
            ['item_id' => 'portfolio_3_samples', 'done' => false],
            ['item_id' => 'portfolio_case_study', 'done' => false],
            ['item_id' => 'portfolio_video_intro', 'done' => false],
            ['item_id' => 'email_verified', 'done' => true],
            ['item_id' => 'phone_verified', 'done' => true],
            ['item_id' => 'response_time', 'done' => false],
        ];

        foreach ($checklistItems as $c) {
            ChecklistItem::create(array_merge($c, ['user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()]));
        }

        // ── Plans ──
        Plan::create([
            'user_id' => $user->id,
            'niche' => 'লোগো ডিজাইন',
            'hours' => 30,
            'experience' => 'শুরু',
            'english' => 'মাঝারি',
            'deadline' => Carbon::now()->addDays(90),
            'created_at' => now(),
        ]);

        // ── Reviews ──
        Review::create([
            'user_id' => $user->id,
            'headline' => 'Rahim Corp — লোগো ডিজাইন',
            'overview' => 'খুব ভালো কাজ করেছেন। সময়মতো ডেলিভারি।',
            'samples' => '৩টি কনসেপ্ট দিয়েছিলেন, সব ভালো ছিল।',
            'result' => 'ক্লায়েন্ট ৫ স্টার দিয়েছেন।',
            'created_at' => now(),
        ]);

        // ── Settings ──
        $settings = [
            'working_hours' => '40',
            'min_rate_paisa' => '500000',
            'currency' => 'BDT',
            'language' => 'bn',
            'ladder_stage' => '3',
            'reminder_day' => 'friday',
        ];

        foreach ($settings as $k => $v) {
            EasyRiseSetting::create([
                'user_id' => $user->id,
                'key' => $k,
                'value' => $v,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ── Reminder Logs ──
        ReminderLog::create([
            'user_id' => $user->id,
            'job_id' => $jobIds[3],
            'step' => 'payment_reminder_1',
            'sent_at' => Carbon::now()->subDays(5),
            'created_at' => now(),
        ]);

        $this->command->info("✅ Easy Rise seeded: 1 user, 5 clients, 6 jobs, 5 scope items, 6 proposals, 4 income entries, 5 documents, 4 niches, 10 checklist items, 1 plan, 1 review, 6 settings, 1 reminder log");
    }
}
