"use client";

import { HelpPopover } from "@/components/ui/help-popover";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { auth, db } from "lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

// --- Reusable Components ---
const StatRow = ({
  icon,
  text,
  label,
}: {
  icon: React.ReactNode;
  text: string;
  label?: string;
}) => (
  <div className="flex items-start gap-3.5 group">
    <div className="w-[24px] h-[24px] shrink-0 flex items-center justify-center text-[#8e8e93] group-hover:text-[#2c2c2e] transition-colors mt-0.5">
      {icon}
    </div>
    <div className="flex flex-col">
      {label && (
        <span className="text-[13px] font-medium text-[#8e8e93] mb-0.5">
          {label}
        </span>
      )}
      <span className="text-[17px] font-medium text-[#2c2c2e]">{text}</span>
    </div>
  </div>
);

// --- Minimalist Icons matching the reference image style ---
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
    <path
      fillRule="evenodd"
      d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
      clipRule="evenodd"
    />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[24px] h-[24px]">
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
    // Load cached data from localStorage immediately
    const cachedUserData = localStorage.getItem("cachedUserData");
    if (cachedUserData) {
      try {
        setUserData(JSON.parse(cachedUserData));
      } catch (e) {
        console.error("Error parsing cached user data:", e);
      }
    }

    const fetchUserData = async () => {
      if (!auth?.currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          // Cache the data for instant loading on navigation
          localStorage.setItem("cachedUserData", JSON.stringify(data));

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
    <section className="min-h-screen bg-white font-sans pt-0 pb-20 px-6 md:px-12 lg:px-24">
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

          {/* Minimalist Stats List Card (Matching Account Page Design) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#f5f5f5] rounded-[32px] p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider">
                Profile Details
              </h3>
              <HelpPopover
                title="Profile Details"
                content="View and manage your exam date, target score, and other personal information."
                position="left"
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {/* Exam Countdown */}
              <StatRow
                label="Exam Date"
                icon={<CalendarIcon />}
                text={
                  timeToExam
                    ? `${timeToExam.days} Days until Exam`
                    : isAuthenticated
                      ? "Set Exam Date"
                      : "Sign in to set exam date"
                }
              />

              {/* Current Score */}
              <StatRow
                label="Current Score"
                icon={<TrophyIcon />}
                text={
                  currentScore !== "-"
                    ? String(currentScore)
                    : isAuthenticated
                      ? "Add Score"
                      : "Sign in to track score"
                }
              />

              {/* Target Score */}
              {userData?.goalScore && (
                <StatRow
                  label="Target Score"
                  icon={<TargetIcon />}
                  text={userData.goalScore}
                />
              )}

              {/* School */}
              {userData?.school && (
                <StatRow
                  label="Institution"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002c-.874.494-1.99.494-2.864 0a49.949 49.949 0 00-9.902-3.912.75.75 0 01-.231-1.337A60.65 60.65 0 0111.7 2.805z" />
                      <path d="M13.06 15.473a4.84 4.84 0 01-2.12 0 49.031 49.031 0 01-8.323-2.428v3.315c0 1.954 1.488 3.731 3.518 4.159 1.84.389 3.82.593 5.865.593 2.046 0 4.025-.204 5.865-.593 2.03-.428 3.518-2.205 3.518-4.159V13.045a49.031 49.031 0 01-8.323 2.428zM19.128 10.457a49.19 49.19 0 01-7.128 2.308v4.992c0 .356.248.665.595.733.912.18 1.848.291 2.805.321V10.457z" />
                    </svg>
                  }
                  text={userData.school}
                />
              )}

              {/* Graduation Year */}
              {userData?.graduationYear && (
                <StatRow
                  label="Graduation"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                      <path
                        fillRule="evenodd"
                        d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  text={`Class of ${userData.graduationYear}`}
                />
              )}
            </div>

            {/* Score Breakdown */}
            {isAuthenticated &&
              (userData?.bestRwScore || userData?.bestMathScore) && (
                <div className="pt-6 border-t border-black/5">
                  <div className="space-y-3">
                    {userData?.bestRwScore && (
                      <div className="flex justify-between items-center">
                        <span className="text-[15px] text-[#909094]">
                          Reading & Writing
                        </span>
                        <span className="text-[15px] font-medium text-[#1D1D1F]">
                          {userData.bestRwScore}
                        </span>
                      </div>
                    )}
                    {userData?.bestMathScore && (
                      <div className="flex justify-between items-center">
                        <span className="text-[15px] text-[#909094]">Math</span>
                        <span className="text-[15px] font-medium text-[#1D1D1F]">
                          {userData.bestMathScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Progress to Goal */}
            {isAuthenticated && userData?.goalScore && currentScore !== "-" && (
              <div className="pt-6 border-t border-black/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[15px] text-[#909094]">
                    Progress to Goal
                  </span>
                  <span className="text-[15px] font-medium text-[#1D1D1F]">
                    {Math.round(
                      (parseInt(currentScore) / userData.goalScore) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-[#e5e5e5] rounded-full h-1.5">
                  <div
                    className="bg-[#0071E3] h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (parseInt(currentScore) / userData.goalScore) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Domain Performance Summary */}
            {isAuthenticated && userData?.domainPerformance && (
              <div className="pt-6 border-t border-black/5">
                <div className="text-[15px] text-[#909094] mb-3">
                  Domain Performance
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(userData.domainPerformance)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-white rounded-lg p-2 border border-black/5"
                      >
                        <div className="text-[13px] text-[#909094] capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-[16px] font-medium text-[#1D1D1F]">
                          {String(value)}/7
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
