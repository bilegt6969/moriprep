import type { DSATQuestion } from "@/types/dsat";

export type Section = "Reading and Writing" | "Math";

export interface ModuleRecord {
  section: Section;
  module: 1 | 2;
  /** Module 2 routing result ("Easy" | "Medium" | "Hard"), null for module 1 */
  difficulty: string | null;
  questions: DSATQuestion[];
  /** question index -> answer the student chose / typed */
  answers: Record<number, string>;
  /** question_ids the student flagged */
  marked: string[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  testName: string;
  date: string;
  modules: ModuleRecord[];
}

/* ------------------------------ correctness ------------------------------ */

const norm = (s: unknown) =>
  String(s ?? "")
    .trim()
    .replace(/,/g, "")
    .toLowerCase();

// Tolerates a few common field names for the answer key.
const rawCorrect = (q: any) =>
  q.correct_answer ??
  q.correctAnswer ??
  q.correct_choice ??
  q.correctChoice ??
  q.answer ??
  q.correct;

/** For multiple-choice questions, returns the choice key (A/B/C/D) that is correct. */
export function getCorrectKey(q: any): string | null {
  const choices = q.choices ? Object.entries(q.choices) : [];
  if (!choices.length) return null;
  const raw = rawCorrect(q);
  if (raw == null) return null;
  const r = norm(raw);
  const byKey = choices.find(([k]) => norm(k) === r);
  if (byKey) return byKey[0];
  const byText = choices.find(([, v]) => norm(v) === r);
  return byText ? byText[0] : null;
}

/** Human-readable correct answer (used for student-produced responses). */
export function getCorrectDisplay(q: any): string {
  if (q.accepted_answers?.length) return q.accepted_answers.join("  or  ");
  const key = getCorrectKey(q);
  if (key) return key;
  const raw = rawCorrect(q);
  return raw == null ? "Not available" : String(raw);
}

export function isAnswerCorrect(q: any, a?: string): boolean {
  if (a == null || String(a).trim() === "") return false;
  if (q.accepted_answers?.length) {
    return q.accepted_answers.some((x: string) => norm(x) === norm(a));
  }
  const key = getCorrectKey(q);
  if (key !== null) return norm(key) === norm(a);
  const raw = rawCorrect(q);
  return raw != null && norm(raw) === norm(a);
}

/* -------------------------------- analysis -------------------------------- */

export interface Tally {
  correct: number;
  total: number;
  skipped: number;
}
const tally = (): Tally => ({ correct: 0, total: 0, skipped: 0 });
const add = (t: Tally, ok: boolean, skipped: boolean) => {
  t.total++;
  if (skipped) t.skipped++;
  else if (ok) t.correct++;
};

export const pct = (t: Tally) =>
  t.total ? Math.round((t.correct / t.total) * 100) : 0;

export function summarize(attempt: TestAttempt) {
  const overall = tally();
  const sections: Record<Section, Tally> = {
    "Reading and Writing": tally(),
    Math: tally(),
  };
  const domains: Record<Section, Record<string, Tally>> = {
    "Reading and Writing": {},
    Math: {},
  };
  const difficulty: Record<string, Tally> = {};
  const skills: Record<string, Tally & { section: Section; domain: string }> =
    {};
  const modules = attempt.modules.map((rec) => {
    const t = tally();
    rec.questions.forEach((q: any, i) => {
      const ans = rec.answers[i];
      const skipped = ans == null || String(ans).trim() === "";
      const ok = isAnswerCorrect(q, ans);

      add(t, ok, skipped);
      add(overall, ok, skipped);
      add(sections[rec.section], ok, skipped);

      const d = q.domain || "Other";
      add((domains[rec.section][d] ??= tally()), ok, skipped);

      const diff = q.difficulty || "Unrated";
      add((difficulty[diff] ??= tally()), ok, skipped);

      const s = q.skill || "General";
      const key = `${rec.section}::${s}`;
      add(
        (skills[key] ??= { ...tally(), section: rec.section, domain: d }),
        ok,
        skipped,
      );
    });
    return { rec, tally: t };
  });

  const skillList = Object.entries(skills).map(([key, v]) => ({
    name: key.split("::")[1],
    ...v,
  }));

  return { overall, sections, domains, difficulty, modules, skillList };
}

/* -------------------------------- storage --------------------------------- */
// Swap these four functions for Firestore calls if you want attempts to sync
// across devices. The components only depend on this API.

const storageKey = (uid?: string | null) => `satAttempts:${uid || "guest"}`;
const MAX_ATTEMPTS = 10;

export function loadAttempts(uid?: string | null): TestAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(uid));
    const list = raw ? (JSON.parse(raw) as TestAttempt[]) : [];
    return list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  } catch {
    return [];
  }
}

export function hasAttempt(id: string, uid?: string | null) {
  return loadAttempts(uid).some((a) => a.id === id);
}

export function saveAttempt(
  attempt: TestAttempt,
  uid?: string | null,
): boolean {
  if (typeof window === "undefined") return false;
  let list = loadAttempts(uid).filter((a) => a.id !== attempt.id);
  list = [attempt, ...list].slice(0, MAX_ATTEMPTS);
  // If storage is full, drop the oldest attempts until it fits.
  while (list.length > 0) {
    try {
      localStorage.setItem(storageKey(uid), JSON.stringify(list));
      return true;
    } catch {
      if (list.length === 1) return false;
      list = list.slice(0, -1);
    }
  }
  return false;
}

export function deleteAttempt(id: string, uid?: string | null) {
  if (typeof window === "undefined") return;
  const list = loadAttempts(uid).filter((a) => a.id !== id);
  localStorage.setItem(storageKey(uid), JSON.stringify(list));
}

export function newAttemptId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
