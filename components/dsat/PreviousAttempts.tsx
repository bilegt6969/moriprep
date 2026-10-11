"use client";

import { auth } from "@/lib/firebase";
import {
  deleteAttempt,
  loadAttempts,
  pct,
  summarize,
  type TestAttempt,
} from "@/lib/test-attempts";
import { onAuthStateChanged } from "firebase/auth";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviousAttempts() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    if (!auth) {
      setAttempts(loadAttempts(null));
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
      setAttempts(loadAttempts(u?.uid));
    });
  }, []);

  if (attempts.length === 0) return null;

  return (
    <section aria-labelledby="previous-attempts" className="mt-12 md:mt-14">
      <h2
        id="previous-attempts"
        className="text-[28px] font-medium tracking-[-0.03em] text-[#1d1d1f] md:text-[32px]"
      >
        Previous attempts
      </h2>
      <p className="mt-2 mb-6 text-base text-[#86868b]" style={{ letterSpacing: "-0.01em" }}>
        Open an attempt to see your full analysis and review every question.
      </p>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {attempts.map((a) => {
          const s = summarize(a);
          const rw = s.sections["Reading and Writing"];
          const math = s.sections.Math;
          const d = new Date(a.date);
          return (
            <li key={a.id} className="relative">
              <button
                type="button"
                onClick={() => router.push(`/practice-test?attempt=${a.id}`)}
                className="group flex w-full flex-col rounded-[28px] bg-[#f5f5f7] p-6 text-left text-[#1d1d1f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0080FF]/50 md:p-7"
              >
                <p className="text-[15px] font-medium text-[#86868b]">
                  {d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <h3 className="mt-1 text-[22px] font-medium tracking-[-0.025em]">{a.testName}</h3>

                <p className="mt-5 text-[56px] font-medium leading-none tracking-[-0.04em] tabular-nums">
                  {pct(s.overall)}
                  <span className="text-[24px] text-[#86868b]">%</span>
                </p>
                <p className="mt-1 text-[14px] text-[#494440]">
                  {s.overall.correct} of {s.overall.total} correct
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    { label: "Reading & Writing", t: rw, c: "#10B981" },
                    { label: "Math", t: math, c: "#0080FF" },
                  ]
                    .filter((r) => r.t.total > 0)
                    .map((r) => (
                      <div key={r.label}>
                        <div className="mb-1.5 flex justify-between text-[13px] font-medium">
                          <span>{r.label}</span>
                          <span className="tabular-nums">{pct(r.t)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
                          <div className="h-full rounded-full" style={{ width: `${pct(r.t)}%`, backgroundColor: r.c }} />
                        </div>
                      </div>
                    ))}
                </div>

                <span className="mt-6 text-[15px] font-medium text-[#0071e3] group-hover:underline">
                  View analysis
                </span>
              </button>

              <button
                type="button"
                aria-label="Delete attempt"
                onClick={() => {
                  if (!confirm("Delete this attempt? This can't be undone.")) return;
                  deleteAttempt(a.id, uid);
                  setAttempts(loadAttempts(uid));
                }}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#86868b] transition-colors hover:bg-black/5 hover:text-rose-600"
              >
                <Trash2 size={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
