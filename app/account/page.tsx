"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db, doc, getDoc } from "lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const springTransition = {
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

const SkeletonCard = () => (
  <div className="bg-[#f5f5f5] rounded-[32px] p-6 w-full animate-pulse flex flex-col gap-4">
    <div className="flex items-center gap-4">
      <div className="w-[60px] h-[60px] rounded-full bg-[#e5e5ea]" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-5 bg-[#e5e5ea] rounded-md w-1/3" />
        <div className="h-4 bg-[#e5e5ea] rounded-md w-1/4" />
      </div>
    </div>
    <div className="h-[1px] bg-[#e5e5ea] w-full my-2" />
    <div className="h-4 bg-[#e5e5ea] rounded-md w-1/2" />
    <div className="h-4 bg-[#e5e5ea] rounded-md w-2/5" />
  </div>
);

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [userCreatedDate, setUserCreatedDate] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/sign-in?next=/account");
        return;
      }
      setUserEmail(user.email);
      setUserName(user.displayName);
      setUserPhotoURL(user.photoURL);
      if (user.metadata?.creationTime) {
        const createdDate = new Date(user.metadata.creationTime);
        setUserCreatedDate(
          createdDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        );
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchOnboardingData = async () => {
      if (!auth?.currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setOnboardingData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    if (authReady) fetchOnboardingData();
  }, [authReady]);

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#2c2c2e] font-sans selection:bg-[#8e8e93] selection:text-white flex flex-col items-center">
      {/* Top Navigation */}
      <div className="w-full bg-white/80 backdrop-blur-xl flex justify-center sticky top-0 z-50 border-b border-black/5">
        <div className="w-full max-w-3xl px-6 py-3 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-[17px] font-medium text-[#8e8e93] hover:text-[#2c2c2e] active:scale-95 transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <Link
            href="/"
            className="flex items-center h-6 hover:opacity-70 transition-opacity"
          >
            <img
              src="/morin.svg"
              alt="Sainto Logo"
              className="h-full w-auto object-contain opacity-80"
            />
          </Link>
        </div>
      </div>

      <div className="w-full max-w-3xl px-6 pt-8 pb-24 flex-1">
        {/* Profile & Onboarding Section */}
        <AnimatePresence mode="wait">
          {loadingProfile ? (
            <motion.div
              key="profile-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonCard />
            </motion.div>
          ) : (
            <motion.div
              key="profile-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springTransition}
              className="bg-[#f5f5f5] rounded-[32px] p-6 sm:p-8 flex flex-col gap-8 shadow-sm"
            >
              {/* Identity Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  {userPhotoURL ? (
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden shadow-sm border-2 border-white">
                      <img
                        src={userPhotoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-full bg-[#d1d1d6] flex items-center justify-center text-white text-3xl font-semibold shadow-sm border-2 border-white">
                      {userName?.charAt(0).toUpperCase() ||
                        userEmail?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <h2 className="text-[24px] font-semibold tracking-tight text-[#2c2c2e] leading-tight">
                      {userName || "Your Account"}
                    </h2>
                    <p className="text-[16px] font-medium text-[#8e8e93]">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[15px] font-semibold text-[#ff3b30] hover:bg-[#ff3b30]/10 bg-white px-5 py-2.5 rounded-full shadow-sm transition-all active:scale-95"
                >
                  Log out
                </button>
              </div>

              {/* Combined Attributes Grid */}
              <div className="pt-6 border-t border-black/5">
                <h3 className="text-[13px] font-bold text-[#8e8e93] uppercase tracking-wider mb-5">
                  Profile Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  {userCreatedDate && (
                    <StatRow
                      label="Member Since"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                      text={userCreatedDate}
                    />
                  )}
                  {onboardingData?.role && (
                    <StatRow
                      label="Account Role"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                      text={
                        onboardingData.role.charAt(0).toUpperCase() +
                        onboardingData.role.slice(1)
                      }
                    />
                  )}
                  {onboardingData?.school && (
                    <StatRow
                      label="Institution"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002c-.874.494-1.99.494-2.864 0a49.949 49.949 0 00-9.902-3.912.75.75 0 01-.231-1.337A60.65 60.65 0 0111.7 2.805z" />
                          <path d="M13.06 15.473a4.84 4.84 0 01-2.12 0 49.031 49.031 0 01-8.323-2.428v3.315c0 1.954 1.488 3.731 3.518 4.159 1.84.389 3.82.593 5.865.593 2.046 0 4.025-.204 5.865-.593 2.03-.428 3.518-2.205 3.518-4.159V13.045a49.031 49.031 0 01-8.323 2.428zM19.128 10.457a49.19 49.19 0 01-7.128 2.308v4.992c0 .356.248.665.595.733.912.18 1.848.291 2.805.321V10.457z" />
                        </svg>
                      }
                      text={onboardingData.school}
                    />
                  )}
                  {onboardingData?.graduationYear && (
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
                      text={`Class of ${onboardingData.graduationYear}`}
                    />
                  )}
                  {onboardingData?.bestTotalScore && (
                    <StatRow
                      label="Top Score"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l4.5-6.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                      text={onboardingData.bestTotalScore}
                    />
                  )}
                  {onboardingData?.goalScore && (
                    <StatRow
                      label="Target Score"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                      text={onboardingData.goalScore}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
