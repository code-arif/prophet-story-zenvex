<?php

namespace App\Services\Learner;

use App\Models\Learner\AiScenario;
use App\Models\Learner\CommonMistake;

/**
 * AiCorrectionService — the offline rule-based "AI" engine behind the
 * Mistake Doctor, AI Writing Feedback and AI Chat. It matches learner text
 * against the seeded common-mistake patterns and produces the same
 * correction cards the UI already renders. A real LLM proxy can replace
 * this class later without touching the frontend.
 */
class AiCorrectionService
{
    /**
     * Find all seeded mistakes present in a piece of text.
     *
     * @return array<int, array{original:string, corrected:string, category:?string, reasonBn:string, wrong:string, right:string}>
     */
    public function findMistakes(string $text): array
    {
        $results = [];
        $patterns = CommonMistake::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        foreach ($patterns as $mistake) {
            $lower = mb_strtolower($text);
            if (!preg_match('/'.str_replace('/', '\/', $mistake->pattern).'/i', $lower)) {
                continue;
            }

            $wrong = $mistake->wrong;
            // Locate the actual matched phrase inside the user's text for a
            // faithful "original" highlight.
            $original = $this->locateOriginal($text, $mistake->pattern) ?: $wrong;
            $right = $this->applyFix($text, $mistake) ?: $mistake->correct;

            $results[] = [
                'original' => $original,
                'corrected' => $mistake->correct,
                'category' => $mistake->category ?: 'Grammar',
                'reasonBn' => $mistake->reason_bn,
                'wrong' => $wrong,
                'right' => $right,
                'examples' => $mistake->examples,
            ];
        }

        return $results;
    }

    /**
     * Full writing feedback payload: issues + corrected full text.
     */
    public function reviewWriting(string $text): array
    {
        $issues = $this->findMistakes($text);

        return [
            'issues' => $issues,
            'correctedText' => $this->correctText($text),
            'wordCount' => $this->countWords($text),
            'level' => $this->guessLevel($text),
        ];
    }

    /**
     * Apply every pattern fix to the text (used for "copy corrected text").
     */
    public function correctText(string $text): string
    {
        $patterns = CommonMistake::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $fixed = $text;
        foreach ($patterns as $mistake) {
            $lower = mb_strtolower($fixed);
            if (!preg_match('/'.str_replace('/', '\/', $mistake->pattern).'/i', $lower)) {
                continue;
            }
            $fixed = $this->applyFix($fixed, $mistake) ?: $fixed;
        }

        return $fixed;
    }

    /**
     * Build the next tutor reply for a chat session: continue the scenario's
     * canned replies and attach a correction card when a mistake is spotted.
     */
    public function chatTurn(AiScenario $scenario, string $learnerText, array $historyMessages): array
    {
        $aiCount = 0;
        foreach ($historyMessages as $msg) {
            if (($msg['role'] ?? '') === 'ai') {
                $aiCount++;
            }
        }

        $replies = $scenario->replies ?: [];
        $fallback = 'That sounds interesting! Could you tell me more?';
        $replyText = $replies[$aiCount] ?? $fallback;

        $mistakes = $this->findMistakes($learnerText);
        $correction = null;
        if ($mistakes !== []) {
            $first = $mistakes[0];
            $correction = [
                'wrong' => $first['wrong'],
                'right' => $first['corrected'],
                'reasonBn' => $first['reasonBn'],
            ];
        }

        return [
            'reply' => $replyText,
            'correction' => $correction,
        ];
    }

    public function countWords(string $text): int
    {
        $text = trim($text);
        return $text === '' ? 0 : count(preg_split('/\s+/', $text));
    }

    /** Simple length-based CEFR guess for the writing summary pill. */
    public function guessLevel(string $text): string
    {
        $words = $this->countWords($text);
        if ($words < 60) {
            return 'A1';
        }
        return $words < 160 ? 'A2' : 'B1';
    }

    private function locateOriginal(string $text, string $pattern): string
    {
        if (preg_match('/'.str_replace('/', '\/', $pattern).'/i', $text, $m)) {
            return $m[0];
        }

        return '';
    }

    /**
     * Replace the first occurrence of the pattern with the corrected phrase,
     * preserving the sentence structure. Falls back to the wrong→right swap.
     */
    private function applyFix(string $text, CommonMistake $mistake): ?string
    {
        $pattern = '/'.str_replace('/', '\/', $mistake->pattern).'/i';
        $replacement = $mistake->correct;

        // Simple case: pattern is a literal phrase.
        if (preg_match($pattern, $text)) {
            return preg_replace($pattern, $replacement, $text, 1);
        }

        return null;
    }
}
