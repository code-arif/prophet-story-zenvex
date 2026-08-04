<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * LearnerController — renders the "Learn English" learner UI (Stitch design).
 *
 * UI-phase controller: every method returns the matching Inertia page. The
 * pages are props-driven, so once the backend lands, each method here gains
 * its real data payload (progress, lessons, decks, quiz history, …) without
 * touching the frontend.
 */
class LearnerController extends Controller
{
    // ── Onboarding (screens 01, 04, 05, 06) ────────────────────────────

    public function welcome()
    {
        return Inertia::render('Learner/Onboarding/Welcome');
    }

    public function profileSetup()
    {
        return Inertia::render('Learner/Onboarding/ProfileSetup');
    }

    public function placement()
    {
        return Inertia::render('Learner/Onboarding/Placement');
    }

    public function placementResult(Request $request)
    {
        return Inertia::render('Learner/Onboarding/PlacementResult', [
            'score' => (int) $request->query('score', 8),
            'total' => (int) $request->query('total', 15),
            'level' => (string) $request->query('level', 'A2'),
        ]);
    }

    // ── Home hub (screen 07) ───────────────────────────────────────────

    public function home()
    {
        return Inertia::render('Learner/Home');
    }

    // ── Learn hub + learning flows (screens 08–16) ─────────────────────

    public function learn()
    {
        return Inertia::render('Learner/Learn/Index');
    }

    public function lessonPath()
    {
        return Inertia::render('Learner/Learn/LessonPath');
    }

    public function lessonPlayer($lesson)
    {
        return Inertia::render('Learner/Learn/LessonPlayer', ['lessonId' => $lesson]);
    }

    public function vocabulary()
    {
        return Inertia::render('Learner/Learn/Vocabulary');
    }

    public function flashcardReview()
    {
        return Inertia::render('Learner/Learn/FlashcardReview');
    }

    public function grammar()
    {
        return Inertia::render('Learner/Learn/Grammar');
    }

    public function grammarRule($rule)
    {
        return Inertia::render('Learner/Learn/GrammarRule', ['rule' => $rule]);
    }

    public function reading()
    {
        return Inertia::render('Learner/Learn/Reading');
    }

    public function readingReader($id)
    {
        return Inertia::render('Learner/Learn/ReadingReader', ['passageId' => $id]);
    }

    // ── AI tab (screens 17, 18, 19) ────────────────────────────────────

    public function ai()
    {
        return Inertia::render('Learner/Ai/Index');
    }

    public function aiChat()
    {
        return Inertia::render('Learner/Ai/Chat');
    }

    public function aiWriting()
    {
        return Inertia::render('Learner/Ai/Writing');
    }

    // ── Practice hub + practice flows (screens 20–27) ──────────────────

    public function practice()
    {
        return Inertia::render('Learner/Practice/Index');
    }

    public function pronunciation()
    {
        return Inertia::render('Learner/Practice/Pronunciation');
    }

    public function listening()
    {
        return Inertia::render('Learner/Practice/Listening');
    }

    public function writingDesk()
    {
        return Inertia::render('Learner/Practice/WritingDesk');
    }

    public function quizCenter()
    {
        return Inertia::render('Learner/Practice/QuizCenter');
    }

    public function quizSession()
    {
        return Inertia::render('Learner/Practice/QuizSession');
    }

    public function phrasebook()
    {
        return Inertia::render('Learner/Practice/Phrasebook');
    }

    public function mistakeDoctor()
    {
        return Inertia::render('Learner/Practice/MistakeDoctor');
    }

    // ── Profile tab (screens 29, 30, 31) ───────────────────────────────

    public function progress()
    {
        return Inertia::render('Learner/Profile/Progress');
    }

    public function studyPlan()
    {
        return Inertia::render('Learner/Profile/StudyPlan');
    }

    public function settings()
    {
        return Inertia::render('Learner/Profile/Settings');
    }
}
