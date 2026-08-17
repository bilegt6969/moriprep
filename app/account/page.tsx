"use client";

import { auth, db, doc, getDoc } from "@/lib/firebase";
import type { Auth } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// --- Reusable UI Components for the New Layout ---

const SettingsSection = ({
  title,
  description,
  children,
  isLast = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <div className={`py-8 ${!isLast ? "border-b border-gray-200/70" : ""}`}>
    <div className="max-w-2xl">
      <h3 className="text-[15px] font-semibold text-[#111827] mb-1">{title}</h3>
      <p className="text-[14px] text-gray-500 mb-5">{description}</p>
      {children}
    </div>
  </div>
);

const StaticInput = ({
  value,
}: {
  value: string | number | null | undefined;
}) => (
  <div className="bg-[#f3f4f6] text-[#111827] text-[14px] px-4 py-2.5 rounded-lg w-full max-w-md font-medium h-10 flex items-center">
    {value || "Not provided"}
  </div>
);

const SkeletonLayout = () => (
  <div className="w-full flex flex-col pt-8">
    <div className="h-10 bg-gray-200 rounded-md w-48 mb-8 shimmer" />
    <div className="flex gap-6 mb-8 border-b border-gray-200/70 pb-3">
      <div className="h-5 bg-gray-200 rounded w-16 shimmer" />
      <div className="h-5 bg-gray-200 rounded w-24 shimmer" />
      <div className="h-5 bg-gray-200 rounded w-16 shimmer" />
    </div>
    <div className="py-8 border-b border-gray-200/70">
      <div className="h-5 bg-gray-200 rounded w-24 mb-2 shimmer" />
      <div className="h-4 bg-gray-200 rounded w-64 mb-6 shimmer" />
      <div className="w-24 h-24 bg-gray-200 rounded-2xl shimmer" />
    </div>
    <div className="py-8 border-b border-gray-200/70">
      <div className="h-5 bg-gray-200 rounded w-32 mb-2 shimmer" />
      <div className="h-4 bg-gray-200 rounded w-72 mb-6 shimmer" />
      <div className="h-10 bg-gray-200 rounded-lg max-w-md shimmer" />
    </div>
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

  // Active tab state (mostly visual for this implementation)
  const [activeTab, setActiveTab] = useState("Account");

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
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
      if (!auth?.currentUser || !db) return;
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

  const tabs = ["Account", "Integrations", "Billing", "App Settings", "Other"];

  return (
    <div className="min-h-screen w-full bg-[#fafafa] sm:bg-white text-[#111827] font-sans selection:bg-gray-200 selection:text-black flex flex-col items-center">
      {/* Top Navigation (Preserved exactly as requested) */}
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

      <div className="w-full max-w-[800px] px-6 sm:px-10 pt-10 pb-24 flex-1">
        <AnimatePresence mode="wait">
          {loadingProfile ? (
            <motion.div
              key="profile-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLayout />
            </motion.div>
          ) : (
            <motion.div
              key="profile-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Header */}
              <h1 className="text-[32px] font-semibold tracking-tight text-[#111827] mb-8">
                Settings
              </h1>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200/70 mb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden -mx-6 px-6 sm:mx-0 sm:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-2 py-2 text-[14px] font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab
                        ? "text-[#111827]"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111827]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Content Sections */}
              <div className="flex flex-col">
                <SettingsSection
                  title="Avatar"
                  description="Choose how your profile is displayed."
                >
                  <div className="flex flex-col gap-3">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm bg-[#111827] flex items-center justify-center group">
                      {userPhotoURL ? (
                        <img
                          src={userPhotoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-3xl font-medium tracking-tight">
                          {userName
                            ? userName.substring(0, 2).toUpperCase()
                            : "U"}
                        </span>
                      )}

                      {/* Decorative Upload Badge to match the image */}
                      <button className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-black">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[13px] text-gray-500">
                      We recommend a size of at least 256x256 px.
                    </p>
                  </div>
                </SettingsSection>

                <SettingsSection
                  title="Account Name"
                  description="Visible to you and invited members of your workspace."
                >
                  <StaticInput value={userName} />
                </SettingsSection>

                <SettingsSection
                  title="Account Email"
                  description="Manage the email you use to sign in and receive updates."
                >
                  <div className="flex items-center gap-3">
                    <StaticInput value={userEmail} />
                    <button className="h-10 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[14px] font-medium text-[#111827] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors whitespace-nowrap">
                      Update
                    </button>
                  </div>
                </SettingsSection>

                {onboardingData?.school && (
                  <SettingsSection
                    title="Institution"
                    description="The primary school or institution you are currently attending."
                  >
                    <StaticInput value={onboardingData.school} />
                  </SettingsSection>
                )}

                {(onboardingData?.role || onboardingData?.graduationYear) && (
                  <SettingsSection
                    title="Academic Details"
                    description="Your current academic status and expected graduation."
                  >
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                      <div className="flex-1">
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                          Role
                        </label>
                        <StaticInput
                          value={
                            onboardingData.role
                              ? onboardingData.role.charAt(0).toUpperCase() +
                                onboardingData.role.slice(1)
                              : null
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                          Graduation Year
                        </label>
                        <StaticInput value={onboardingData.graduationYear} />
                      </div>
                    </div>
                  </SettingsSection>
                )}

                {(onboardingData?.bestTotalScore ||
                  onboardingData?.goalScore) && (
                  <SettingsSection
                    title="Test Scores"
                    description="Your current standing and target goals for standardized testing."
                  >
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                      <div className="flex-1">
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                          Top Score
                        </label>
                        <StaticInput value={onboardingData.bestTotalScore} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block ml-1">
                          Target Score
                        </label>
                        <StaticInput value={onboardingData.goalScore} />
                      </div>
                    </div>
                  </SettingsSection>
                )}

                <SettingsSection
                  title="Session Management"
                  description="Log out of your account on this device."
                  isLast={true}
                >
                  <button
                    onClick={handleLogout}
                    className="h-10 px-5 py-2 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 rounded-lg text-[14px] font-medium text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
                  >
                    Log out
                  </button>
                </SettingsSection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
