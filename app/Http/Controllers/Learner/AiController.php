<?php

namespace App\Http\Controllers\Learner;

use App\Models\Learner\AiChatSession;
use App\Models\Learner\AiScenario;
use App\Services\Learner\AiCorrectionService;
use App\Services\Learner\AiProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

/**
 * AiController — the AI সঙ্গী tab (screens 17, 18, 19).
 *
 * When FIT_AI_* credentials are configured (config/services.php) the real
 * LLM (AiProvider) drives writing feedback and chat replies; otherwise it
 * falls back to the offline rule-based engine (AiCorrectionService) so the
 * surfaces keep working without external keys.
 */
class AiController extends BaseController
{
    /** Screen 17 — scenario picker. */
    public function ai(Request $request)
    {
        $subscriber = $this->subscriber($request);

        $scenarios = AiScenario::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'slug' => $s->slug,
                'bn' => $s->title_bn,
                'en' => $s->title_en,
                'iconKey' => $s->icon_key,
                'href' => route('ai.chat', $s->slug),
            ])
            ->values()
            ->all();

        $last = $subscriber->aiChatSessions()
            ->whereNotNull('scenario_id')
            ->with('scenario')
            ->orderByDesc('updated_at')
            ->first();

        return Inertia::render('Learner/Ai/Index', [
            'scenarios' => $scenarios,
            'lastSession' => $last ? [
                'scenarioBn' => $last->scenario?->title_bn ?: 'AI সঙ্গী',
                'relative' => $last->updated_at->diffForHumans(),
                'href' => route('ai.chat', $last->scenario?->slug ?: 'open-chat'),
            ] : null,
        ]);
    }

    /** Screen 18 — chat session for a scenario. */
    public function aiChat(Request $request, $scenario = null)
    {
        $subscriber = $this->subscriber($request);
        $scenario = AiScenario::query()
            ->where('slug', $scenario)
            ->orWhere(fn ($q) => $q->where('id', (int) $scenario ?: -1))
            ->where('is_active', true)
            ->first();

        if (!$scenario) {
            $scenario = AiScenario::query()->where('is_active', true)->orderBy('sort_order')->first();
        }

        $session = $subscriber->aiChatSessions()
            ->where('scenario_id', $scenario->id)
            ->orderByDesc('updated_at')
            ->first();

        $messages = $session?->messages ?: $scenario->opening;

        return Inertia::render('Learner/Ai/Chat', [
            'scenario' => [
                'id' => $scenario->id,
                'slug' => $scenario->slug,
                'bn' => $scenario->title_bn,
                'en' => $scenario->title_en,
            ],
            'messages' => $messages,
            'sessionId' => $session?->id,
        ]);
    }

    /** POST — send a chat message (JSON API for the chat UI). */
    public function chatSend(Request $request, AiCorrectionService $ai, AiProvider $provider)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'scenario_id' => ['required', 'integer'],
        ]);

        $subscriber = $this->subscriber($request);
        $scenario = AiScenario::query()->findOrFail($validated['scenario_id']);

        $session = $subscriber->aiChatSessions()
            ->where('scenario_id', $scenario->id)
            ->orderByDesc('updated_at')
            ->first();

        $messages = $session?->messages ?: $scenario->opening;

        // Find the correction before appending the learner message.
        $learnerMistakes = $ai->findMistakes($validated['message']);
        $learnerMessage = ['role' => 'learner', 'text' => $validated['message']];
        if ($learnerMistakes !== []) {
            $m = $learnerMistakes[0];
            $learnerMessage['correction'] = [
                'wrong' => $m['wrong'],
                'right' => $m['corrected'],
                'reasonBn' => $m['reasonBn'],
            ];
        }
        $messages[] = $learnerMessage;

        // Real LLM reply when configured; canned rule-based turn otherwise.
        $reply = $provider->isConfigured()
            ? $provider->tutorReply($messages, (string) $scenario->title_en, (string) $scenario->level)
            : null;
        if ($reply === null) {
            $turn = $ai->chatTurn($scenario, $validated['message'], $messages);
            $reply = ['reply' => $turn['reply']];
        }
        $messages[] = ['role' => 'ai', 'text' => $reply['reply']];

        if ($session) {
            $session->forceFill(['messages' => $messages, 'last_activity_at' => now()])->save();
        } else {
            $session = AiChatSession::create([
                'subscriber_id' => $subscriber->id,
                'scenario_id' => $scenario->id,
                'messages' => $messages,
                'last_activity_at' => now(),
            ]);
        }

        return response()->json([
            'ok' => true,
            'sessionId' => $session->id,
            'messages' => $messages,
        ]);
    }

    /** POST — reset the current scenario conversation. */
    public function chatReset(Request $request)
    {
        $validated = $request->validate(['scenario_id' => ['required', 'integer']]);
        $subscriber = $this->subscriber($request);

        $subscriber->aiChatSessions()
            ->where('scenario_id', $validated['scenario_id'])
            ->delete();

        return response()->json(['ok' => true]);
    }

    /** Screen 19 — writing feedback (renders; the check is a JSON POST). */
    public function aiWriting(Request $request)
    {
        $subscriber = $this->subscriber($request);

        // Recent drafts that already have AI feedback — tap to review, re-check
        // and continue from the same draft.
        $drafts = $subscriber->drafts()
            ->whereNotNull('feedback')
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'title' => $d->title ?: 'খসড়া',
                'body' => $d->body,
                'feedback' => $d->feedback,
            ])
            ->values()
            ->all();

        return Inertia::render('Learner/Ai/Writing', [
            'sample' => 'I am agree with your plan. We have discussed about the project last week. He don’t like the new office. She has been working here since 2019.',
            'drafts' => $drafts,
        ]);
    }

    /** POST — review a piece of writing (JSON API). */
    public function writingCheck(Request $request, AiCorrectionService $ai, AiProvider $provider)
    {
        $validated = $request->validate([
            'text' => ['required', 'string', 'max:5000'],
            'draft_id' => ['nullable', 'integer'],
        ]);
        $text = $validated['text'];
        $subscriber = $this->subscriber($request);

        // Real LLM review when credentials are configured; the rule-based
        // engine stays as the offline fallback (no external keys required).
        $usedAi = false;
        $result = [];
        if ($provider->isConfigured()) {
            $review = $provider->reviewWriting($text);
            if ($review !== null) {
                $usedAi = true;
                $result = $review;
            }
        }
        if (!$usedAi) {
            $result = $ai->reviewWriting($text);
        }

        // Persist the review on the draft it belongs to so learners can
        // reopen the draft later and review past feedback.
        if (!empty($validated['draft_id'])) {
            $draft = $subscriber->drafts()->find($validated['draft_id']);
            if ($draft) {
                $draft->forceFill([
                    'feedback' => array_merge($result, [
                        'ai' => $usedAi,
                        'checked_at' => now()->toIso8601String(),
                        'checked_text' => $text,
                    ]),
                ])->save();
            }
        }

        return response()->json(array_merge(['ok' => true, 'ai' => $usedAi], $result));
    }

    /** POST — save a checked draft (with its feedback) to the Writing Desk. */
    public function writingSave(Request $request)
    {
        $validated = $request->validate([
            'text' => ['required', 'string', 'max:5000'],
            'title' => ['nullable', 'string', 'max:120'],
            'feedback' => ['nullable', 'array'],
            'draft_id' => ['nullable', 'integer'],
        ]);

        $subscriber = $this->subscriber($request);

        $feedback = is_array($validated['feedback'] ?? null)
            ? array_merge($validated['feedback'], [
                'checked_text' => $validated['text'],
                'checked_at' => $validated['feedback']['checked_at'] ?? now()->toIso8601String(),
            ])
            : null;

        // Update the draft the text came from (ownership-scoped) or create
        // a fresh draft when the learner started from scratch.
        $draft = !empty($validated['draft_id'])
            ? $subscriber->drafts()->find($validated['draft_id'])
            : null;

        if ($draft) {
            $draft->forceFill([
                'title' => $validated['title'] ?? $draft->title,
                'body' => $validated['text'],
                'feedback' => $feedback,
            ])->save();
        } else {
            $draft = $subscriber->drafts()->create([
                'title' => $validated['title'] ?: 'AI লেখা যাচাই',
                'body' => $validated['text'],
                'feedback' => $feedback,
            ]);
        }

        return response()->json(['ok' => true, 'draftId' => $draft->id]);
    }

    /** Redirect helper kept for the AI hub tile when no session exists. */
    public function firstScenario()
    {
        $scenario = AiScenario::query()->where('is_active', true)->orderBy('sort_order')->first();

        return Redirect::route('ai.chat', $scenario?->slug ?: 'open-chat');
    }
}
