<?php

namespace App\Http\Controllers\Learner;

use App\Models\Learner\AiScenario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * RealtimeController — OpenAI Realtime API ephemeral-token bridge for the
 * learner voice assistant (WebRTC voice chat).
 *
 * The Realtime API key never reaches the client: the browser POSTs here for
 * a short-lived client_secret, then connects directly to OpenAI over WebRTC.
 * The system prompt (English-tutor instructions) is pinned server-side and
 * made scenario-aware from the optional scenario slug, so the same overlay
 * works for every AI সঙ্গী conversation (interview, shopping, doctor, …).
 */
class RealtimeController extends BaseController
{
    /**
     * POST /ai/realtime/token — mint a short-lived OpenAI Realtime token.
     *
     * Body: { scenario?: string, level?: 'beginner'|'intermediate' } — the
     * scenario slug (defaults to open chat) and the speaking level the AI
     * should use. When no level is sent the learner's placement level is used.
     */
    public function getToken(Request $request): JsonResponse
    {
        $apiKey = (string) config('services.voice_ai.api_key');
        $model = (string) config('services.voice_ai.model', 'gpt-realtime');

        if ($apiKey === '') {
            return response()->json(['error' => 'AI Voice API key not configured'], 500);
        }

        $validated = $request->validate([
            'scenario' => ['nullable', 'string', 'max:80'],
            // Lenient: any non-matching value falls back via resolveSpeakingLevel
            // instead of hard-failing (an empty string must not 422 the request).
            'level' => ['nullable', 'string', 'max:20'],
        ]);
        $scenarioSlug = trim((string) ($validated['scenario'] ?? ''));
        $level = $this->resolveSpeakingLevel($request, (string) ($validated['level'] ?? ''));

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])->post(
                rtrim((string) config('services.voice_ai.base_url', 'https://api.openai.com/v1'), '/') . '/realtime/client_secrets',
                [
                    'session' => [
                        'model' => $model,
                        'type'  => 'realtime',
                        // NOTE: the client_secrets endpoint rejects extra session
                        // fields like 'voice' — the voice is applied client-side
                        // via the 'oai-events' data channel (session.update).
                        'instructions' => $this->getSystemInstructions($scenarioSlug, $level),
                    ],
                ]
            );

            if ($response->failed()) {
                Log::error('OpenAI Realtime Token Error (Learn)', [
                    'status' => $response->status(),
                    'body'   => $response->json(),
                ]);

                return response()->json([
                    'error'   => 'Failed to fetch ephemeral token',
                    'details' => $response->json(),
                ], $response->status());
            }

            $data = $response->json();
            $token = $data['client_secret']['value'] ?? $data['value'] ?? null;

            if (!$token) {
                Log::error('Unexpected token response (Learn)', $data);

                return response()->json(['error' => 'Unexpected response structure'], 500);
            }

            return response()->json([
                'client_secret' => ['value' => $token],
            ]);
        } catch (\Throwable $e) {
            Log::error('Realtime Token Exception (Learn): ' . $e->getMessage());

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Resolve the speaking level: the client's explicit choice wins; otherwise
     * map the learner's placement level (A1/A2 → beginner, B1+ → intermediate).
     */
    protected function resolveSpeakingLevel(Request $request, string $clientLevel = ''): string
    {
        if (in_array($clientLevel, ['beginner', 'intermediate'], true)) {
            return $clientLevel;
        }

        $level = strtoupper((string) ($this->subscriber($request)->level ?? ''));

        return in_array($level, ['B1', 'B2', 'C1', 'C2'], true) ? 'intermediate' : 'beginner';
    }

    /**
     * System instructions for the realtime session — an English conversation
     * partner for the Learn English app. Written for the ear: replies are
     * spoken aloud, so no markdown/lists/emojis and short sentences.
     *
     * @param string $scenarioSlug optional scenario slug from the client
     * @param string $level 'beginner' or 'intermediate' — how complex the AI's English should be
     */
    protected function getSystemInstructions(string $scenarioSlug = '', string $level = 'beginner'): string
    {
        $scenario = $scenarioSlug !== ''
            ? AiScenario::query()->where('slug', $scenarioSlug)->where('is_active', true)->first()
            : null;

        $scenarioLine = '';
        if ($scenario) {
            $scenarioLine = 'The current practice scenario is "' . $scenario->title_en . '" (' . $scenario->title_bn . ').'
                . ' Play this role naturally (e.g. interviewer, shopkeeper, doctor, airport staff, friend, or free conversation)'
                . " and gently steer the learner through it.\n";
        }

        $levelLine = $level === 'intermediate'
            ? "SPEAKING LEVEL: intermediate (মাঝারি) — speak at a natural pace with moderately rich vocabulary; short idioms are fine and sentences can be a little longer.\n"
            : "SPEAKING LEVEL: beginner (নতুন) — use very simple, everyday vocabulary; keep sentences short (8-12 words); speak slowly and clearly; avoid idioms, slang and complex grammar; repeat key words if helpful.\n";

        return <<<EOT
You are "AI সঙ্গী" (AI Companion), a warm, patient bilingual English-Bengali conversation partner inside the Learn English app for Bengali users.
You are having a spoken conversation with a learner who is practicing English.

Rules (hard):
- This reply will be read aloud, so write for the ear: short sentences, no markdown, no bullet lists, no emojis, no parentheses or special symbols.
- Keep every reply under 50 words, friendly and conversational. Ask a follow-up question so the conversation continues.
- LANGUAGE — match the learner's language naturally:
  * When the learner speaks English, always reply in simple, natural English and keep the practice going.
  * When the learner speaks Bengali, reply in warm, clear Bengali (like a friendly tutor) and encourage them to try the English sentence too — you may add the simple English translation of your key question.
- If the learner makes a small grammar or pronunciation mistake, gently model the correct form inside your own reply. Do not give a grammar lecture unless the learner asks.
- Never translate the learner's sentence word-by-word; respond as a natural conversation partner.
$levelLine$scenarioLine
Keep the tone encouraging — the goal is confident, fluent speaking practice.
EOT;
    }
}
