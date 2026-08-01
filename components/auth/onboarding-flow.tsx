"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { auth, db } from "lib/firebase";
import { useEffect, useState } from "react";
import { BestSatScoreSection } from "./steps/best-sat-score-section";
import { BestSatScoreTotal } from "./steps/best-sat-score-total";
import { ChildGraduationYear } from "./steps/child-graduation-year";
import { GoalScore } from "./steps/goal-score";
import { GraduationYear } from "./steps/graduation-year";
import { HowDidYouHear } from "./steps/how-did-you-hear";
import { RoleSelection } from "./steps/role-selection";
import { SatTestDates } from "./steps/sat-test-dates";
import { SchoolSatStudents } from "./steps/school-sat-students";
import { SchoolSearch } from "./steps/school-search";
import { StudentsTutored } from "./steps/students-tutored";

export type UserRole = "student" | "parent" | "tutor" | "teacher";

export interface OnboardingData {
  role?: UserRole;
  school?: string;
  graduationYear?: string;
  childGraduationYear?: string;
  studentsTutored?: string;
  schoolSatStudents?: string;
  satTestDates?: string[];
  bestRwScore?: number;
  bestMathScore?: number;
  bestTotalScore?: number;
  goalScore?: number;
  howDidYouHear?: string;
  name?: string;
  email?: string;
}

interface OnboardingFlowProps {
  onComplete?: () => void;
}

const customEase = [0.16, 1, 0.3, 1] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: customEase,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: customEase,
    },
  }),
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps = {}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firebase on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.currentUser) return;

      const currentUser = auth.currentUser;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setData((prev) => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || currentUser.email || "",
          }));
        } else {
          // If no user doc exists, create one with basic info
          await setDoc(doc(db, "users", currentUser.uid), {
            email: currentUser.email,
            createdAt: new Date().toISOString(),
          });
          setData((prev) => ({
            ...prev,
            email: currentUser.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Save onboarding data to Firebase
  const saveToFirebase = async () => {
    if (!auth?.currentUser) {
      console.error("No authenticated user found");
      return;
    }

    const currentUser = auth.currentUser;
    console.log("Saving onboarding data for user:", currentUser.uid);
    console.log("User email:", currentUser.email);

    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          ...data,
          email: currentUser.email,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      console.log("Onboarding data saved successfully");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
  };

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    await saveToFirebase();
    if (onComplete) {
      onComplete();
    }
  };

  // Keyboard support: Enter to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  const getTotalSteps = () => {
    if (!data.role) return 1;

    const baseSteps = 1; // Role selection

    switch (data.role) {
      case "student":
        return baseSteps + 5; // school, graduation, dates, best score, goal, how heard
      case "parent":
        return baseSteps + 3; // child graduation, dates, best score, goal, how heard
      case "tutor":
        return baseSteps + 4; // students tutored, dates, best score, goal, how heard
      case "teacher":
        return baseSteps + 4; // school sat students, dates, best score, goal, how heard
      default:
        return baseSteps;
    }
  };

  const getStepNumber = () => {
    if (!data.role) return 1;

    const baseSteps = 1;

    switch (data.role) {
      case "student":
        if (currentStep === baseSteps) return 1;
        if (currentStep === baseSteps + 1) return 2;
        if (currentStep === baseSteps + 2) return 3;
        if (currentStep === baseSteps + 3) return 4;
        if (currentStep === baseSteps + 4) return 5;
        if (currentStep === baseSteps + 5) return 6;
        return 1;
      case "parent":
        if (currentStep === baseSteps) return 1;
        if (currentStep === baseSteps + 1) return 2;
        if (currentStep === baseSteps + 2) return 3;
        if (currentStep === baseSteps + 3) return 4;
        return 1;
      case "tutor":
        if (currentStep === baseSteps) return 1;
        if (currentStep === baseSteps + 1) return 2;
        if (currentStep === baseSteps + 2) return 3;
        if (currentStep === baseSteps + 3) return 4;
        if (currentStep === baseSteps + 4) return 5;
        return 1;
      case "teacher":
        if (currentStep === baseSteps) return 1;
        if (currentStep === baseSteps + 1) return 2;
        if (currentStep === baseSteps + 2) return 3;
        if (currentStep === baseSteps + 3) return 4;
        if (currentStep === baseSteps + 4) return 5;
        return 1;
      default:
        return 1;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RoleSelection
            data={data}
            updateData={updateData}
            onNext={handleNext}
          />
        );
      case 1:
        if (data.role === "student") {
          return (
            <SchoolSearch
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else if (data.role === "parent") {
          return (
            <ChildGraduationYear
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else if (data.role === "tutor") {
          return (
            <StudentsTutored
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else if (data.role === "teacher") {
          return (
            <SchoolSatStudents
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
        break;
      case 2:
        if (data.role === "student") {
          return (
            <GraduationYear
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <SatTestDates
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
      case 3:
        if (data.role === "student") {
          return (
            <SatTestDates
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <BestSatScoreTotal
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
      case 4:
        if (data.role === "student") {
          return (
            <BestSatScoreSection
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <GoalScore
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
      case 5:
        if (data.role === "student") {
          return (
            <GoalScore
              data={data}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <HowDidYouHear
              data={data}
              updateData={updateData}
              onNext={handleComplete}
              onBack={handleBack}
            />
          );
        }
      case 6:
        if (data.role === "student") {
          return (
            <HowDidYouHear
              data={data}
              updateData={updateData}
              onNext={handleComplete}
              onBack={handleBack}
            />
          );
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="h-6 w-6 animate-spin text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            {data.role && currentStep > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-600">
                    Step {getStepNumber()} of {getTotalSteps()}
                  </span>
                  <span className="text-sm text-neutral-400">
                    {Math.round((getStepNumber() / getTotalSteps()) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(getStepNumber() / getTotalSteps()) * 100}%`,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full bg-neutral-900 rounded-full"
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
