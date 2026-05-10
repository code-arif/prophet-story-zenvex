@extends('layouts.app')

@section('content')
<div class="grid grid-2">
    <div class="card">
        <h1 style="margin-top:0;">First login</h1>
        <p class="muted" style="margin-top:0;">Verify your Bangladesh phone number to continue.</p>

        <div class="card" style="background:#0b1220;">
            <h3 style="margin-top:0;">Phone verification</h3>
            <p class="muted" style="margin-top:-6px;">We will send a 6-digit OTP to your phone.</p>

            <form method="post" action="{{ route('login.sendOtp') }}" class="grid" style="gap:10px;">
                @csrf
                <label class="muted">Mobile number (BD)</label>
                <input name="msisdn" value="{{ old('msisdn') }}" placeholder="+8801XXXXXXXXX or 01XXXXXXXXX">
                <button class="btn" type="submit">Send OTP</button>
            </form>

            <div class="muted" style="font-size:13px; margin-top:12px;">
                Accepted formats: <strong>+8801XXXXXXXXX</strong>, <strong>01XXXXXXXXX</strong>, <strong>8801XXXXXXXXX</strong>
            </div>
        </div>
    </div>

    <div class="card">
        <h2 style="margin-top:0;">Why we ask for this</h2>
        <ul class="muted" style="line-height:1.8; margin:0; padding-left:18px;">
            <li>Your subscription is tied to your phone number.</li>
            <li>Articles remain locked unless the subscription is active.</li>
            <li>OTP keeps access linked to your number.</li>
        </ul>

        <div style="margin-top:14px;">
            <a class="btn secondary" href="{{ route('home') }}">Back to home</a>
        </div>
    </div>
</div>
@endsection
