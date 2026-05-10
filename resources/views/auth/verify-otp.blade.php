@extends('layouts.app')

@section('content')
<div class="grid grid-2">
    <div class="card">
        <h1 style="margin-top:0;">Verify OTP</h1>
        <p class="muted" style="margin-top:0;">We sent a 6-digit code to <strong>{{ $pending }}</strong>.</p>

        <div class="card" style="background:#0b1220;">
            <form method="post" action="{{ route('login.verify') }}" class="grid" style="gap:10px;">
                @csrf
                <label class="muted">OTP</label>
                <input name="otp" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="123456">
                <button class="btn" type="submit">Verify & continue</button>
            </form>

            <form method="post" action="{{ route('login.sendOtp') }}" style="margin-top:12px;">
                @csrf
                <input type="hidden" name="msisdn" value="{{ $pending }}">
                <button class="btn secondary" type="submit">Resend OTP</button>
            </form>
        </div>

        <div class="muted" style="font-size:13px; margin-top:12px;">
            OTP expires in 5 minutes.
        </div>
    </div>

    <div class="card">
        <h2 style="margin-top:0;">Troubleshooting</h2>
        <div class="muted" style="line-height:1.8;">
            If you don’t receive the OTP, check that BDApps credentials are set in <strong>.env</strong>.
            In local mode, you may see a DEV OTP message.
        </div>

        <div style="margin-top:14px;">
            <a class="btn secondary" href="{{ route('login.show') }}">Change phone</a>
        </div>
    </div>
</div>
@endsection
