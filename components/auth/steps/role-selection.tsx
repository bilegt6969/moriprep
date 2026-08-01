"use client";

import { motion } from "framer-motion";
import { OnboardingData, UserRole } from "../onboarding-flow";

const customEase = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

interface RoleSelectionProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const roles: { value: UserRole; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "tutor", label: "Tutor" },
  { value: "teacher", label: "Teacher" },
];

export function RoleSelection({ data, updateData, onNext }: RoleSelectionProps) {
  const handleSelect = (role: UserRole) => {
    updateData({ role });
    onNext();
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-12">
        Who are you?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => handleSelect(role.value)}
            className="p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200 text-left group"
          >
            <span className="text-lg font-medium text-neutral-900 group-hover:text-neutral-700">
              {role.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
