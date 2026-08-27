<?php

namespace App\Http\Controllers\EasyRise;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RealtimeController extends Controller
{
    /**
     * Request an ephemeral token from OpenAI's Realtime API for client-side WebRTC.
     *
     * @return JsonResponse
     */
    public function getToken(): JsonResponse
    {
        $apiKey = (string) (config('services.easy_voice.api_key') ?: config('services.voice_ai.api_key') ?: config('services.fit_voice.api_key'));
        $model  = (string) config('services.easy_voice.model', 'gpt-realtime');
        $voice  = (string) config('services.easy_voice.voice', 'coral');

        if (empty($apiKey)) {
            return response()->json(['error' => 'AI Voice API key not configured'], 500);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])->post('https://api.openai.com/v1/realtime/client_secrets', [
                'session' => [
                    'model' => $model,
                    'type'  => 'realtime',
                    'instructions' => $this->getSystemInstructions(),
                ],
            ]);

            if ($response->failed()) {
                Log::error('OpenAI Realtime Token Error (EasyRise)', [
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
                Log::error('Unexpected token response (EasyRise)', $data);
                return response()->json(['error' => 'Unexpected response structure'], 500);
            }

            return response()->json([
                'client_secret' => ['value' => $token],
                'voice'         => $voice,
                'model'         => $model,
            ]);
        } catch (\Exception $e) {
            Log::error('Realtime Token Exception (EasyRise): ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * System prompt instructions tailored for the Easy Rise app.
     *
     * @return string
     */
    protected function getSystemInstructions(): string
    {
        return <<<EOT
You are "Easy Rise Voice Assistant" (ইজি রাইজ ভয়েস সহকারী), a supportive, highly knowledgeable business, freelancing, and career assistant for Bengali freelancers and professionals. Help users with:
- Client proposals, messaging drafts, and negotiation strategies.
- Pricing jobs, hourly rate calculation, and project scope management.
- Professional workplace communication, handling delayed payments, and client boundaries.
- Career growth, skill selection, and productivity.

Guidelines:
- Respond in Bengali (বাংলা), keep your speech clear, natural, polite, and encouraging.
- Provide concise, practical advice suitable for spoken voice interaction.
EOT;
    }
}
