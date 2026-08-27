<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use App\Models\EasyRise\Job;
use App\Models\EasyRise\ReminderLog;
use App\Support\LearnerUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssistantController extends Controller
{
    public function index()
    {
        $user = LearnerUser::resolve();

        $jobs = [];
        if ($user) {
            $jobs = Job::where('user_id', $user->id)
                ->with('client')
                ->get()
                ->map(function ($j) {
                    $clientName = $j->client ? $j->client->name : 'Client';
                    return [
                        'id' => $j->id,
                        'label' => "{$j->title} — {$clientName}",
                        'title' => $j->title,
                        'client_name' => $clientName,
                    ];
                })
                ->toArray();
        }

        if (empty($jobs)) {
            $jobs = [
                ['id' => 1, 'label' => 'লোগো ডিজাইন — Ahmed Traders', 'title' => 'লোগো ডিজাইন', 'client_name' => 'Ahmed Traders'],
                ['id' => 2, 'label' => 'ওয়েবসাইট রিডিজাইন — TechBD', 'title' => 'ওয়েবসাইট রিডিজাইন', 'client_name' => 'TechBD'],
            ];
        }

        $situations = [
            ['id' => 'proposal', 'label' => 'প্রস্তাব লিখুন', 'prompt_preset' => 'আমি একটি নতুন লোগো ও ইউআই ডিজাইনের প্রস্তাব পাঠাতে চাই।'],
            ['id' => 'scope', 'label' => 'বাড়তি কাজে আপত্তি', 'prompt_preset' => 'ক্লায়েন্ট চুক্তির বাইরে বাড়তি কাজ চাচ্ছে, বিনয়ের সাথে অতিরিক্ত বাজেট দাবি করতে হবে।'],
            ['id' => 'delay', 'label' => 'দেরির খবর দিন', 'prompt_preset' => 'অনিবার্য কারণে কাজ শেষ হতে ২ দিন অতিরিক্ত লাগবে, ক্লায়েন্টকে আপডেট জানাতে চাই।'],
            ['id' => 'payment', 'label' => 'টাকার তাগাদা', 'prompt_preset' => 'কাজের বকেয়া বিল ১৫ দিন ধরে বাকি, কাজ স্থগিত করার বিনয়ী নোটিশ দেব।'],
            ['id' => 'handoff', 'label' => 'কাজ বুঝিয়ে দিন', 'prompt_preset' => 'কাজের সকল ফাইল ও ফাইনাল ডেলিভারি হ্যান্ডওভার নোট পাঠাব।'],
        ];

        return Inertia::render('Assistant/Index', [
            'jobs' => $jobs,
            'situations' => $situations,
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'situation' => 'nullable|string',
            'job_title' => 'nullable|string',
            'client_name' => 'nullable|string',
            'prompt' => 'nullable|string',
            'length' => 'nullable|string|in:short,detailed',
        ]);

        $client = $validated['client_name'] ?? 'Ahmed Traders';
        $jobTitle = $validated['job_title'] ?? 'লোগো ডিজাইন';
        $prompt = $validated['prompt'] ?? '';
        $isShort = ($validated['length'] ?? 'short') === 'short';

        if ($isShort) {
            $draftText = "Hi {$client} team,\n\nI have reviewed your requirements for {$jobTitle}. Based on the scope, I propose completing this in 3 days for ৳5,000. Please let me know if you would like to proceed.\n\nBest regards,\n[Your Name]";
            $explanations = [
                ['num' => 1, 'text' => 'এই লাইনটা দাম ও সময় একসাথে স্পষ্ট করে বলছে, যাতে ক্লায়েন্ট পরিষ্কার ধারণা পায়।'],
                ['num' => 2, 'text' => 'পেশাদারিত্ব বজায় রেখে কাজ শুরুর সম্মতি চাওয়া হয়েছে।'],
            ];
        } else {
            $draftText = "Hello {$client} Management,\n\nThank you for reaching out regarding the {$jobTitle} project. After thoroughly analyzing the provided project scope, here is my formal implementation proposal:\n\n1. Requirement Analysis & Conceptual Sketches (Day 1)\n2. High-fidelity Design & Revisions (Day 2)\n3. Asset Handoff & Source Files Delivery (Day 3)\n\nTotal Estimated Investment: ৳8,500 BDT.\nTimeline: 3 Business Days.\n\nIf this aligns with your expectations, please confirm and I will initiate the workspace immediately.\n\nWarm regards,\n[Your Name]";
            $explanations = [
                ['num' => 1, 'text' => 'কাজের প্রতিটি ধাপ আলাদা করে ভেঙ্গে বলা হয়েছে যেন ক্লায়েন্ট মূল্যকে কাজের সাথে মেলাতে পারে।'],
                ['num' => 2, 'text' => 'সময়সীমা ও মূল্য সুস্পষ্ট করে পেশাদার ফাইনাল ডেলিভারির অঙ্গীকার রাখা হয়েছে।'],
                ['num' => 3, 'text' => 'তাৎক্ষণিক কাজ শুরুর জন্য সরাসরি অ্যাকশন ড্রাইভ রাখা হয়েছে।'],
            ];
        }

        return response()->json([
            'status' => 'success',
            'draft' => $draftText,
            'client' => $client,
            'explanations' => $explanations,
        ]);
    }

    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array',
        ]);

        $msg = strtolower($validated['message']);

        if (str_contains($msg, 'দাম') || str_contains($msg, 'রেট') || str_contains($msg, 'budget')) {
            $reply = "ক্লায়েন্টকে মূল্য জানানোর সময় প্রজেক্টভিত্তিক ফিক্সড প্রাইস (Fixed Price) বলা ভালো। আপনার সময়ের হিসাব বের করতে আওয়ারলি ট্রু রেটের সাহায্য নিতে পারেন। যেমন: ৳৫,০০০ বাজেটে ৩ দিনের ডেডলাইন দিলে ক্লায়েন্ট সিদ্ধান্ত নিতে সুবিধা পাবে।";
        } elseif (str_contains($msg, 'দেরি') || str_contains($msg, 'delay')) {
            $reply = "দেরির ক্ষেত্রে ক্লায়েন্টকে অন্তত ২৪ ঘণ্টা আগে আপডেট জানানো উচিত। বার্তা লিখুন: 'প্রিয় ক্লায়েন্ট, কোয়ালিটি নিশ্চিত করতে অতিরিক্ত ২৪ ঘণ্টা সময় লাগছে। আগামী কাল বিকাল ৫টার মধ্যে ফাইনাল ফাইল পেয়ে যাবেন।'";
        } elseif (str_contains($msg, 'তাগাদা') || str_contains($msg, 'টাকা') || str_contains($msg, 'payment')) {
            $reply = "পেমেন্ট বিলম্বে প্রথমে ইনভয়েস রিমাইন্ডার দিন। ৭ দিন পার হলে স্পষ্ট বার্তা দিন এবং ১৪ দিন পার হলে কাজটি সাময়িকভাবে পজ করার নোটিশ দিন।";
        } else {
            $reply = "আপনার অনুরোধটি পেয়েছি! ফ্রিল্যান্সিং যোগাযোগ, প্রস্তাবনা তৈরি বা বাজেট নির্ধারণে যেকোনো সাহায্য করতে আমি প্রস্তুত। আপনার দরকারি বিষয়টি বিস্তারিত বলুন।";
        }

        return response()->json([
            'status' => 'success',
            'reply' => $reply,
        ]);
    }

    public function linkJob(Request $request)
    {
        $user = LearnerUser::resolve();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validated = $request->validate([
            'job_id' => 'required',
            'draft' => 'required|string',
        ]);

        $job = Job::where('user_id', $user->id)->find($validated['job_id']);
        if ($job) {
            ReminderLog::create([
                'user_id' => $user->id,
                'job_id' => $job->id,
                'type' => 'ai_assistant_draft',
                'message' => $validated['draft'],
                'sent_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'খসড়াটি কাজের নোটে সংযুক্ত করা হয়েছে!');
    }
}
