@extends('layouts.app')

@section('content')
<div class="card">
    <h1 style="margin-top:0;">Articles</h1>
    <p class="muted">Subscriber-only full content.</p>

    <div class="grid">
        @foreach($articles as $a)
            <div class="card" style="background:#0b1220;">
                <div class="muted" style="font-size:12px;">{{ optional($a->published_at)->format('Y-m-d H:i') }}</div>
                <h3 style="margin:6px 0 6px;"><a href="{{ route('articles.show', $a) }}">{{ $a->title }}</a></h3>
                <div class="muted">{{ $a->excerpt }}</div>
            </div>
        @endforeach
    </div>

    <div style="margin-top:14px;">
        {{ $articles->links() }}
    </div>
</div>
@endsection
