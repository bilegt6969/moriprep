"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

// --- Minimalist Icons matching the reference image style ---
const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-[26px] h-[26px] opacity-80"
  >
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-[26px] h-[26px] opacity-80"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 14.5a4.75 4.75 0 100-9.5 4.75 4.75 0 000 9.5zm0-2.25a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      clipRule="evenodd"
    />
  </svg>
);

const TrophyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-[26px] h-[26px] opacity-80"
  >
    <path
      fillRule="evenodd"
      d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l4.5-6.25z"
      clipRule="evenodd"
    />
  </svg>
);

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // States for Stats
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
      // Temporarily disabled auth check
      // if (!user) {
      //   router.replace("/sign-in?next=/home");
      //   return;
      // }
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
              setTimeToExam({ days, examDate: nextExamDate });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (isAuthenticated) fetchUserData();
  }, [isAuthenticated]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return "Good late night";
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const handleExamDateUpdate = async () => {
    if (!auth?.currentUser || !newExamDate) return;
    try {
      const examDate = new Date(newExamDate);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        satTestDates: [examDate.toISOString()],
      });
      const now = new Date();
      const diff = examDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setTimeToExam({ days, examDate });
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-[3px] border-[#E5E5EA] border-t-[#0071E3] rounded-full"
        />
      </div>
    );
  }

  const userName = userData?.name || userData?.email?.split("@")[0] || "Guest";
  const currentScore =
    userData?.bestTotalScore ||
    (userData?.bestRwScore && userData?.bestMathScore
      ? userData.bestRwScore + userData.bestMathScore
      : "-");

  return (
    <section className="min-h-screen bg-white font-sans pt-24 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F] mb-3 leading-tight">
            {getGreeting()}, {userName}.
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Action Card */}
          <Link href="/practice" className="block group outline-none h-full">
            <motion.div
              whileHover={{ scale: 0.985 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="w-full h-full min-h-[300px] rounded-[36px] bg-[#1c1c1e] p-8 md:p-10 flex flex-col justify-between overflow-hidden relative shadow-lg"
            >
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />
              <div className="relative z-10">
                <span className="text-white/50 font-semibold text-[13px] tracking-[0.2em] uppercase mb-3 block">
                  Next Session
                </span>
                <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1] max-w-[85%]">
                  Resume your practice.
                </h2>
              </div>
              <div className="relative z-10 flex justify-end">
                <div className="w-16 h-16 bg-white text-[#1D1D1F] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Minimalist Stats List Card (Matching the Reference Image) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#f5f5f5] rounded-[36px] p-8 md:p-10 flex flex-col justify-center gap-7"
          >
            {/* Exam Countdown Row */}
            <div className="flex items-center gap-4 text-[#909094]">
              <CalendarIcon />
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {isAuthenticated && isEditingExamDate ? (
                    <motion.div
                      key="edit-date"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="date"
                        value={newExamDate}
                        onChange={(e) => setNewExamDate(e.target.value)}
                        className="bg-white px-3 py-1.5 rounded-xl text-[#909094] font-medium text-[20px] outline-none border border-black/5"
                      />
                      <button
                        onClick={handleExamDateUpdate}
                        className="text-[#0071E3] font-medium text-[17px] hover:opacity-80"
                      >
                        Save
                      </button>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="view-date"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() =>
                        isAuthenticated && setIsEditingExamDate(true)
                      }
                      className={`text-[20px] md:text-[22px] font-medium tracking-tight transition-colors block ${isAuthenticated ? "cursor-pointer hover:text-[#2c2c2e]" : "cursor-default"}`}
                    >
                      {timeToExam
                        ? `${timeToExam.days} Days until Exam`
                        : isAuthenticated
                          ? "Set Exam Date"
                          : "Sign in to set exam date"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Current Score Row */}
            <div className="flex items-center gap-4 text-[#909094]">
              <TrophyIcon />
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {isAuthenticated && isEditingScore ? (
                    <motion.div
                      key="edit-score"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="flex items-center gap-3"
                    >
                      <input
                        type="number"
                        autoFocus
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                        placeholder="Score"
                        className="w-24 bg-white px-3 py-1.5 rounded-xl text-[#909094] font-medium text-[20px] outline-none border border-black/5"
                      />
                      <button
                        onClick={handleScoreUpdate}
                        className="text-[#0071E3] font-medium text-[17px] hover:opacity-80"
                      >
                        Save
                      </button>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="view-score"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => isAuthenticated && setIsEditingScore(true)}
                      className={`text-[20px] md:text-[22px] font-medium tracking-tight transition-colors block ${isAuthenticated ? "cursor-pointer hover:text-[#2c2c2e]" : "cursor-default"}`}
                    >
                      {currentScore !== "-"
                        ? `${currentScore} Current Score`
                        : isAuthenticated
                          ? "Add Current Score"
                          : "Sign in to track score"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Target Score Row */}
            <div className="flex items-center gap-4 text-[#909094]">
              <TargetIcon />
              <span className="text-[20px] md:text-[22px] font-medium tracking-tight cursor-pointer hover:text-[#2c2c2e] transition-colors block">
                {userData?.goalScore
                  ? `${userData.goalScore} Target Score`
                  : "Set Target Score"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
