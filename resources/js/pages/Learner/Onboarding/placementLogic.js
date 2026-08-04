// Pure placement logic (Stitch feature 15) — UI-phase implementation.
// Rule-based by design decision: identical answers must always produce the
// same level. Thresholds are fixed constants (product decision, feature 15).

export const LEVELS = ['A1', 'A2', 'B1'];

// Bangla labels used on the result screen.
export const LEVEL_LABELS = { A1: 'শুরু', A2: 'প্রাথমিক', B1: 'মধ্যম' };

// The four skills shown as bars on the result screen.
export const SKILL_ORDER = ['reading', 'listening', 'writing', 'speaking'];
export const SKILL_LABELS = { reading: 'পড়া', listening: 'শোনা', writing: 'লেখা', speaking: 'বলা' };

// Fixed thresholds (0-5 → A1, 6-10 → A2, 11-15 → B1).
export function levelForScore(score) {
  if (score <= 5) return 'A1';
  if (score <= 10) return 'A2';
  return 'B1';
}

export function levelLabel(level) {
  return LEVEL_LABELS[level] || level;
}

/**
 * Score an array of answers (index per question) against the questions.
 * Returns { score, total, bySkill: Record<skill, { correct, total }> }.
 */
export function scorePlacement(answers, questions) {
  const bySkill = {};
  let correct = 0;

  questions.forEach((q, i) => {
    const skill = q.skill || 'reading';
    if (!bySkill[skill]) bySkill[skill] = { correct: 0, total: 0 };
    bySkill[skill].total += 1;
    if (Number(answers[i]) === Number(q.answer)) {
      bySkill[skill].correct += 1;
      correct += 1;
    }
  });

  return { score: correct, total: questions.length, bySkill };
}

/**
 * Percentage (0–100) for one skill.
 */
export function skillPercent(bySkill, skill) {
  const v = bySkill[skill];
  if (!v || v.total === 0) return 0;
  return Math.round((v.correct / v.total) * 100);
}

// Weakest-skill tie-break order: speaking → writing → listening → reading.
const WEAKEST_PRIORITY = { speaking: 0, writing: 1, listening: 2, reading: 3 };

/**
 * Skill with the lowest percentage; ties resolve toward speaking (then
 * writing, listening, reading), matching the Stitch rule.
 */
export function weakestSkill(bySkill) {
  let weakest = null;
  let weakestPct = Infinity;

  for (const [skill, v] of Object.entries(bySkill)) {
    const pct = v.total === 0 ? 0 : (v.correct / v.total) * 100;
    const priority = WEAKEST_PRIORITY[skill] ?? 99;
    const currentPriority = weakest ? WEAKEST_PRIORITY[weakest] ?? 99 : 99;

    if (pct < weakestPct || (pct === weakestPct && priority < currentPriority)) {
      weakest = skill;
      weakestPct = pct;
    }
  }

  return weakest;
}
