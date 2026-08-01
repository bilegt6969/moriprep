"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { auth, db } from "lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const customEase = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [timeToExam, setTimeToExam] = useState<any>(null);
  const [isEditingExamDate, setIsEditingExamDate] = useState(false);
  const [newExamDate, setNewExamDate] = useState<string>("");
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [newScore, setNewScore] = useState<string>("");

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (!user) {
        router.replace("/sign-in?next=/home");
        return;
      }
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          if (data.satTestDates && data.satTestDates.length > 0) {
            const nextExamDate = new Date(data.satTestDates[0]);
            const now = new Date();
            const diff = nextExamDate.getTime() - now.getTime();

            if (diff > 0) {
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
              );
              const minutes = Math.floor(
                (diff % (1000 * 60 * 60)) / (1000 * 60),
              );

              setTimeToExam({
                days,
                hours,
                minutes,
                examDate: nextExamDate,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return "Good late night";
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="w-6 h-6 border-2 border-[#E5E5EA] border-t-[#0071E3] rounded-full animate-spin" />
      </div>
    );
  }

  const userName = userData?.name || userData?.email?.split("@")[0] || "User";

  const currentScore =
    userData?.bestTotalScore ||
    (userData?.bestRwScore && userData?.bestMathScore
      ? userData.bestRwScore + userData.bestMathScore
      : userData?.bestRwScore || "-");

  const handleExamDateUpdate = async () => {
    if (!auth?.currentUser || !newExamDate) return;

    try {
      const examDate = new Date(newExamDate);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        satTestDates: [examDate.toISOString()],
      });

      // Recalculate time to exam
      const now = new Date();
      const diff = examDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeToExam({
          days,
          hours,
          minutes,
          examDate,
        });
      }

      setIsEditingExamDate(false);
      setNewExamDate("");
    } catch (error) {
      console.error("Error updating exam date:", error);
    }
  };

  const handleScoreUpdate = async () => {
    if (!auth?.currentUser || newScore === "") return;

    try {
      const scoreValue = parseInt(newScore);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        bestTotalScore: scoreValue,
      });

      setUserData({ ...userData, bestTotalScore: scoreValue });
      setIsEditingScore(false);
      setNewScore("");
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <section className="min-h-screen bg-[#F5F5F7] font-sans pt-24 pb-20 px-6 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: customEase }}
        className="max-w-[1200px] mx-auto w-full"
      >
        {/* Apple-style Typography Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F] mb-2 leading-tight">
            {getGreeting()}, {userName}.
          </h1>
          <p className="text-lg text-[#86868B] font-medium tracking-tight">
            Ready to continue your SAT preparation?
          </p>
        </div>

        {/* Asymmetrical Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[220px]">
          {/* Primary Action Card (Spans 2x2 on Desktop) */}
          <Link
            href="/practice"
            className="block group lg:col-span-2 lg:row-span-2"
          >
            <motion.div
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.4, ease: customEase }}
              className="w-full h-full rounded-[32px] bg-[#1D1D1F] p-8 md:p-10 flex flex-col justify-between overflow-hidden relative shadow-md"
            >
              {/* Subtle ambient glow inside the dark card */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <span className="text-white/60 font-semibold text-sm tracking-widest uppercase mb-2 block">
                  Next Session
                </span>
                <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight max-w-[80%]">
                  Resume your practice.
                </h2>
              </div>

              <div className="relative z-10 flex justify-end">
                <div className="w-16 h-16 bg-white text-[#1D1D1F] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 translate-x-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Countdown Card (Spans 2 columns, 1 row) */}
          <div className="lg:col-span-2 lg:row-span-1 rounded-[32px] bg-white p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02]">
            <div className="flex justify-between items-start">
              <span className="text-[#86868B] font-medium text-lg tracking-tight">
                Exam Countdown
              </span>
              {isEditingExamDate ? (
                <input
                  type="date"
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  className="text-[#1D1D1F] font-medium bg-[#F5F5F7] px-3 py-1 rounded-full text-sm border border-[#E5E5EA] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              ) : (
                timeToExam && (
                  <span className="text-[#1D1D1F] font-medium bg-[#F5F5F7] px-3 py-1 rounded-full text-sm">
                    {timeToExam.examDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-6xl md:text-7xl font-semibold text-[#1D1D1F] tracking-tighter leading-none">
                {timeToExam ? String(timeToExam.days) : "-"}
              </span>
              <span className="text-2xl font-medium text-[#86868B] tracking-tight">
                days left
              </span>
            </div>

            <div className="flex gap-2">
              {isEditingExamDate ? (
                <>
                  <button
                    onClick={handleExamDateUpdate}
                    className="text-[#0071E3] hover:text-[#0077ED] text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingExamDate(false);
                      setNewExamDate("");
                    }}
                    className="text-[#86868B] hover:text-[#1D1D1F] text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsEditingExamDate(true);
                    setNewExamDate(
                      timeToExam?.examDate
                        ? timeToExam.examDate.toISOString().split("T")[0]
                        : "",
                    );
                  }}
                  className="text-[#0071E3] hover:text-[#0077ED] text-sm font-medium transition-colors"
                >
                  Edit date →
                </button>
              )}
            </div>
          </div>

          {/* Current Score Card (1x1 square) */}
          <div className="lg:col-span-1 lg:row-span-1 rounded-[32px] bg-white p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02]">
            <span className="text-[#86868B] font-medium text-lg tracking-tight">
              Current Score
            </span>

            <div>
              {isEditingScore ? (
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="text-5xl font-semibold text-[#1D1D1F] tracking-tighter block mb-1 w-full bg-transparent border-b-2 border-[#E5E5EA] focus:outline-none focus:border-[#0071E3]"
                  placeholder="Enter score"
                />
              ) : (
                <span className="text-5xl font-semibold text-[#1D1D1F] tracking-tighter block mb-1">
                  {currentScore}
                </span>
              )}
              {isEditingScore ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleScoreUpdate}
                    className="text-[#0071E3] hover:text-[#0077ED] text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingScore(false);
                      setNewScore("");
                    }}
                    className="text-[#86868B] hover:text-[#1D1D1F] text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsEditingScore(true);
                    setNewScore(
                      String(currentScore !== "-" ? currentScore : ""),
                    );
                  }}
                  className="text-[#0071E3] hover:text-[#0077ED] text-sm font-medium transition-colors"
                >
                  Update score →
                </button>
              )}
            </div>
          </div>

          {/* Target Score Card (1x1 square) */}
          <div className="lg:col-span-1 lg:row-span-1 rounded-[32px] bg-white p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.02]">
            <span className="text-[#86868B] font-medium text-lg tracking-tight">
              Target Score
            </span>

            <div>
              <span className="text-5xl font-semibold text-[#1D1D1F] tracking-tighter block mb-1">
                {userData?.goalScore || "-"}
              </span>
              <button className="text-[#0071E3] hover:text-[#0077ED] text-sm font-medium transition-colors">
                Edit goal →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
