"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db, doc, getDoc } from "lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

// --- Types ---
type OrderStatus =
  | "payment_processing"
  | "payment_approved"
  | "on_delivery"
  | "delivered";

interface OrderItem {
  id?: string;
  _id?: string;
  name: string;
  brand: string;
  qty: number;
  price: number;
  image?: string;
}

interface Order {
  id?: string;
  _id?: string;
  timestamp: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  logistics: number;
  total: number;
  destination: string;
}

// --- SWR Fetcher ---
const fetcher = async (url: string): Promise<Order[]> => {
  if (!auth?.currentUser) {
    throw new Error("UNAUTHORIZED");
  }
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

const PIPELINE_STAGES: { key: OrderStatus; label: string }[] = [
  { key: "payment_processing", label: "Payment Processing" },
  { key: "payment_approved", label: "Payment Approved" },
  { key: "on_delivery", label: "On Delivery" },
  { key: "delivered", label: "Delivered" },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [userCreatedDate, setUserCreatedDate] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loadingOnboarding, setLoadingOnboarding] = useState(true);

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

  // Fetch onboarding data from Firebase
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
        setLoadingOnboarding(false);
      }
    };

    if (authReady) {
      fetchOnboardingData();
    }
  }, [authReady]);

  const {
    data: orders,
    error,
    isLoading,
  } = useSWR<Order[]>(authReady ? "/api/orders" : null, fetcher, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      router.replace("/sign-in?next=/account");
    }
  }, [error, router]);

  const formatDate = (isoString: string) => {
    if (!isoString) return { date: "N/A", time: "" };
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-black selection:text-white flex flex-col items-center overflow-hidden">
      {/* Top Navigation - Glassmorphism */}
      <div className="sticky top-0 z-50 w-full bg-[#f5f5f7]/70 backdrop-blur-xl border-b border-gray-200/50 flex justify-center">
        <div className="w-full max-w-3xl px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Logo Brand Frame */}
          <Link href="/" className="flex items-center h-5">
            <img
              src="/morin.svg"
              alt="Sainto Logo"
              className="h-full w-auto object-contain opacity-80"
            />
          </Link>
        </div>
      </div>

      <div className="w-full max-w-3xl px-6 pt-12 flex-1 overflow-y-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="mb-10"
        >
          <h1 className="text-3xl font-semibold tracking-tight mb-1">
            Account Overview
          </h1>
          <p className="text-[#86868b] text-sm">{userEmail ?? "Loading..."}</p>
        </motion.header>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.1 }}
          className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8"
        >
          <div className="p-7 flex items-center gap-5">
            {userPhotoURL ? (
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={userPhotoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white text-2xl font-semibold">
                {userName?.charAt(0).toUpperCase() ||
                  userEmail?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#1d1d1f]">
                {userName || "User"}
              </h2>
              <p className="text-sm text-[#86868b]">{userEmail}</p>
              {userCreatedDate && (
                <p className="text-xs text-[#86868b] mt-1">
                  Member since {userCreatedDate}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </motion.div>

        {/* Onboarding Data Card */}
        {onboardingData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.15 }}
            className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8"
          >
            <div className="p-7">
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-6">
                Your Profile Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {onboardingData.role && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">Role</p>
                    <p className="text-sm font-medium text-[#1d1d1f] capitalize">
                      {onboardingData.role}
                    </p>
                  </div>
                )}

                {onboardingData.school && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">School</p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.school}
                    </p>
                  </div>
                )}

                {onboardingData.graduationYear && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      Graduation Year
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.graduationYear}
                    </p>
                  </div>
                )}

                {onboardingData.childGraduationYear && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      Child's Graduation Year
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.childGraduationYear}
                    </p>
                  </div>
                )}

                {onboardingData.studentsTutored && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      Students Tutored
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.studentsTutored}
                    </p>
                  </div>
                )}

                {onboardingData.schoolSatStudents && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      School SAT Students
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.schoolSatStudents}
                    </p>
                  </div>
                )}

                {onboardingData.bestRwScore && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      Best Reading & Writing Score
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.bestRwScore}
                    </p>
                  </div>
                )}

                {onboardingData.bestMathScore && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      Best Math Score
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.bestMathScore}
                    </p>
                  </div>
                )}

                {onboardingData.bestTotalScore && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      Best Total Score
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.bestTotalScore}
                    </p>
                  </div>
                )}

                {onboardingData.goalScore && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">Goal Score</p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.goalScore}
                    </p>
                  </div>
                )}

                {onboardingData.howDidYouHear && (
                  <div>
                    <p className="text-xs text-[#86868b] mb-1">
                      How did you hear about us
                    </p>
                    <p className="text-sm font-medium text-[#1d1d1f]">
                      {onboardingData.howDidYouHear}
                    </p>
                  </div>
                )}

                {onboardingData.satTestDates &&
                  onboardingData.satTestDates.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-[#86868b] mb-1">
                        SAT Test Dates
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.satTestDates.map(
                          (date: string, index: number) => (
                            <span
                              key={index}
                              className="text-sm font-medium text-[#1d1d1f] bg-gray-100 px-3 py-1 rounded-full"
                            >
                              {date}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Data Grid */}
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {/* Loading state */}
            {isLoading && authReady && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full py-24 flex justify-center"
              >
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#1d1d1f] rounded-full animate-spin" />
              </motion.div>
            )}

            {/* Error state */}
            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full py-24 flex flex-col items-center gap-3 text-center"
              >
                <p className="text-sm font-medium text-[#1d1d1f]">
                  Couldn't load your orders
                </p>
                <p className="text-xs text-[#86868b]">
                  Check your connection and try again.
                </p>
              </motion.div>
            )}

            {/* No orders state */}
            {!isLoading && !error && (!orders || orders.length === 0) && (
              <motion.div
                key="no-orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full py-24 flex flex-col items-center gap-3 text-center"
              >
                <p className="text-sm font-medium text-[#1d1d1f]">
                  No orders yet
                </p>
                <p className="text-xs text-[#86868b]">
                  When you place an order, it will appear here.
                </p>
              </motion.div>
            )}

            {/* Orders list */}
            {!isLoading &&
              !error &&
              orders &&
              orders.length > 0 &&
              orders.map((order, index) => {
                const { date, time } = formatDate(order.timestamp);
                const currentStageIndex = PIPELINE_STAGES.findIndex(
                  (s) => s.key === order.status,
                );
                const isComplete = order.status === "delivered";

                return (
                  <motion.div
                    key={order.id ?? order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springTransition, delay: index * 0.1 }}
                    layout
                    className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col"
                  >
                    {/* Top: Meta Data */}
                    <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-semibold text-[#1d1d1f] mb-0.5">
                          Order {order.id ?? order._id}
                        </div>
                        <div className="text-xs text-[#86868b]">
                          {date !== "N/A"
                            ? `${date} at ${time}`
                            : "Date Pending"}
                        </div>
                      </div>

                      <button className="bg-[#1d1d1f] hover:bg-black transition-colors text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1.5">
                        {isComplete ? "Receipt" : "Track"}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Middle: Receipt Structure */}
                    <div className="p-7">
                      <div className="flex flex-col gap-5">
                        {order.items.map((item) => (
                          <div
                            key={item.id ?? item._id ?? item.name}
                            className="flex justify-between items-start"
                          >
                            <Link
                              href={`/product/${item.id ?? item._id}`}
                              className="flex gap-4 items-center hover:opacity-75 transition-opacity"
                            >
                              {item.image && (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-[#1d1d1f]">
                                  {item.name}
                                </div>
                                <div className="text-xs text-[#86868b] mt-0.5">
                                  {item.brand} &nbsp;·&nbsp; Qty {item.qty}
                                </div>
                              </div>
                            </Link>
                            <div className="text-sm font-medium text-[#1d1d1f]">
                              ₮ {(item.price ?? 0).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-2.5 text-xs text-[#86868b]">
                        <div className="flex justify-between pl-5">
                          <span>Subtotal</span>
                          <span>
                            ₮ {(order.subtotal ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between pl-5">
                          <span>Logistics</span>
                          <span>
                            ₮ {(order.logistics ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between pl-5 text-[#1d1d1f] font-semibold mt-1 pt-1 text-sm">
                          <span>Total</span>
                          <span>₮ {(order.total ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Pipeline & Destination */}
                    <div className="bg-[#f9f9f9] border-t border-gray-100 p-7 flex flex-col md:flex-row justify-between gap-8">
                      {/* Destination */}
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-1.5">
                          Destination
                        </p>
                        <p className="text-sm text-[#1d1d1f] leading-relaxed max-w-[200px]">
                          {order.destination}
                        </p>
                      </div>

                      {/* Pipeline timeline */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 z-0 rounded-full" />

                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#007AFF] z-0 transition-all duration-700 ease-in-out"
                            style={{
                              width: `${
                                (currentStageIndex /
                                  (PIPELINE_STAGES.length - 1)) *
                                100
                              }%`,
                            }}
                          />

                          {PIPELINE_STAGES.map((stage, i) => {
                            const isActive = i === currentStageIndex;
                            const isPast = i < currentStageIndex;

                            return (
                              <div
                                key={stage.key}
                                className="relative z-10 flex flex-col items-center gap-2"
                              >
                                <div
                                  className={`w-3 h-3 rounded-full border-2 bg-white transition-colors duration-300 ${
                                    isActive || isPast
                                      ? "border-[#007AFF]"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {(isActive || isPast) && (
                                    <div className="w-full h-full bg-[#007AFF] rounded-full scale-[0.6]" />
                                  )}
                                </div>
                                <div
                                  className={`absolute top-5 w-24 text-center text-[10px] font-medium ${
                                    isActive
                                      ? "text-[#1d1d1f]"
                                      : isPast
                                        ? "text-[#86868b]"
                                        : "text-gray-400"
                                  }`}
                                >
                                  {stage.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
