"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: customEase },
  },
};

interface RoleSelectionProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const roles: {
  value: UserRole;
  label: string;
  description: string;
  image: string;
}[] = [
  {
    value: "student",
    label: "Student",
    description: "I'm preparing for the SAT",
    image: "/character/student.png",
  },
  {
    value: "parent",
    label: "Parent",
    description: "Helping my child prepare",
    image: "/character/parent.png",
  },
  {
    value: "tutor",
    label: "Tutor",
    description: "Teaching SAT preparation",
    image: "/character/tutor.png",
  },
  {
    value: "teacher",
    label: "Teacher",
    description: "In a school setting",
    image: "/character/teacher.png",
  },
];

export function RoleSelection({
  data,
  updateData,
  onNext,
}: RoleSelectionProps) {
  const handleSelect = (role: UserRole) => {
    updateData({ role });
    // Don't auto-advance, let user click Next button
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: customEase }}
        className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4"
      >
        Who are you? <span className="text-red-500">*</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: customEase }}
        className="text-lg text-neutral-500 mb-12"
      >
        Select your role to personalize your experience
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {roles.map((role, index) => (
          <motion.button
            key={role.value}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.4,
              delay: 0.2 + index * 0.1,
              ease: customEase,
            }}
            onClick={() => handleSelect(role.value)}
            className={`p-6 rounded-2xl border transition-all duration-300 text-left group hover:shadow-lg hover:shadow-neutral-200/50 ${
              data.role === role.value
                ? "border-neutral-900 bg-neutral-50 shadow-md"
                : "border-neutral-200 bg-white hover:border-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                <NextImage
                  src={role.image}
                  alt={role.label}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-900 block mb-1 underline">
                  {role.label}
                </span>
                <span className="text-sm text-neutral-500 group-hover:text-neutral-600">
                  {role.description}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
