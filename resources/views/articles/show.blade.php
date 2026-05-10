@extends('layouts.app')

@section('content')
<div class="card">
    <div class="muted" style="font-size:12px;">{{ optional($article->published_at)->format('Y-m-d H:i') }}</div>
    <h1 style="margin:6px 0 10px;">{{ $article->title }}</h1>

    @if($article->excerpt)
        <p class="muted">{{ $article->excerpt }}</p>
    @endif

    <div style="white-space:pre-wrap; line-height:1.6;">{!! $article->body !!}</div>

    <div style="margin-top:16px;">
        <a class="btn secondary" href="{{ route('articles.index') }}">Back</a>
    </div>
</div>
@endsection
