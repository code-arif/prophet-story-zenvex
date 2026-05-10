@extends('layouts.app')

@section('content')
<div class="grid grid-2">
    <div class="card">
        <h1 style="margin:0 0 8px;">Today’s coverage</h1>
        <p class="muted" style="margin:0 0 16px;">All full articles require an active subscription.</p>

        <div class="grid">
            @forelse($latest as $a)
                <div class="card" style="background:#0b1220;">
                    <div class="muted" style="font-size:12px;">{{ optional($a->published_at)->format('Y-m-d H:i') }}</div>
                    <h3 style="margin:6px 0 6px;"><a href="{{ route('articles.show', $a) }}">{{ $a->title }}</a></h3>
                    <div class="muted">{{ $a->excerpt }}</div>
                </div>
            @empty
                <div class="muted">No articles yet.</div>
            @endforelse
        </div>
    </div>

    <div class="card">
        <h2 style="margin-top:0;">Subscribe</h2>
        <p class="muted">To activate, use SMS or USSD (operator configured).</p>
        <div style="margin:12px 0;">
            <a class="btn" href="{{ route('profile') }}">Profile page</a>
        </div>
        <p class="muted" style="font-size:13px;">For local testing, identify a phone number on the subscription page, then trigger subscription via webhook.</p>
    </div>
</div>
@endsection
