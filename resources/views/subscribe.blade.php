@extends('layouts.app')

@section('content')
<div class="grid grid-2">
    <div class="card">
        <h1 style="margin-top:0;">Subscription</h1>
        <p class="muted">All article content is protected by subscription.</p>

        <h3>Identify your phone</h3>
        <form method="post" action="{{ route('subscribe.identify') }}" class="grid" style="gap:10px;">
            @csrf
            <label class="muted">MSISDN (example: +8801XXXXXXXXX)</label>
            <input name="msisdn" value="{{ old('msisdn', $msisdn) }}" placeholder="+8801...">
            <button class="btn" type="submit">Save phone</button>
        </form>

        @if($msisdn)
            <form method="post" action="{{ route('subscribe.logout') }}" style="margin-top:10px;">
                @csrf
                <button class="btn secondary" type="submit">Clear phone</button>
            </form>
        @endif

        <hr style="border:0; border-top:1px solid #1f2937; margin:18px 0;">

        <h3>Manage subscription</h3>
        @if(!$msisdn)
            <div class="muted">Identify your phone above to continue.</div>
        @else
            @if(!empty($isActive))
                <div class="muted">You are currently subscribed.</div>
                <form method="post" action="{{ route('subscribe.cancel') }}" style="margin-top:10px;">
                    @csrf
                    <button class="btn secondary" type="submit">Cancel subscription</button>
                </form>
            @else
                <div class="muted">You are not subscribed yet.</div>
                <form method="post" action="{{ route('subscribe.activate') }}" style="margin-top:10px;">
                    @csrf
                    <button class="btn" type="submit">Subscribe now</button>
                </form>
            @endif
        @endif
    </div>

    <div class="card">
        <h2 style="margin-top:0;">Status</h2>

        @if(!$msisdn)
            <div class="muted">No phone identified yet.</div>
        @else
            <div class="muted">Phone: <strong>{{ $msisdn }}</strong></div>
            <div style="margin-top:10px;">
                @if($subscription)
                    <div>Status: <strong>{{ $subscription->status }}</strong></div>
                    <div class="muted" style="font-size:13px;">Channel: {{ $subscription->channel ?? '-' }}</div>
                    <div class="muted" style="font-size:13px;">Updated: {{ $subscription->updated_at }}</div>
                    <div class="muted" style="font-size:13px;">Last msg: {{ $subscription->last_message ?? '-' }}</div>
                @else
                    <div class="muted">No subscription record found yet.</div>
                @endif
            </div>

            <div style="margin-top:14px;">
                <a class="btn" href="{{ route('articles.index') }}">Go to articles</a>
            </div>
        @endif
    </div>
</div>
@endsection
