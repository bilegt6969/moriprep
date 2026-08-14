"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "hooks/use-reduced-motion";
import { LockIcon } from "lucide-react";
import { useState } from "react";
import { PracticeConfigPopup } from "./practice-config-popup";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: customEase },
  },
};

const practiceAreas = [
  {
    id: "reading-writing",
    title: "Curated Reading & Writing",
    description:
      "1,492 questions spanning all four College Board domains. Our system adapts to your reading comprehension level.",
    badgeText: "Reading & Writing",
    backgroundImage:
      "https://i.pinimg.com/1200x/53/c6/51/53c651e328f47c98471df7e1bd00bbcc.jpg",
    available: true,
    buttonText: "Start Practicing",
  },
  {
    id: "math",
    title: "Expert Mathematics",
    description:
      "2,390 questions covering advanced algebra and data analysis. Enter any topic, and we'll supply the perfect problem set.",
    badgeText: "Mathematics",
    backgroundImage:
      "https://i.pinimg.com/1200x/30/ba/54/30ba54fb8790cd4b1504b17c4138ef9b.jpg",
    available: false,
    buttonText: "Coming Soon",
  },
];

export function DSATPracticeCards() {
  const reduce = useReducedMotion();
  const [isConfigPopupOpen, setIsConfigPopupOpen] = useState(false);

  const handleStartPractice = (config: any) => {
    // Convert config to URL params and navigate
    const params = new URLSearchParams();

    if (config.difficulties.length > 0) {
      params.set("difficulties", config.difficulties.join(","));
    }
    if (config.domains.length > 0) {
      params.set("domains", config.domains.join(","));
    }
    if (config.skills.length > 0) {
      params.set("skills", config.skills.join(","));
    }

    const queryString = params.toString();
    const url = `/practice/rw${queryString ? `?${queryString}` : ""}`;

    // Navigate to the practice page with config
    window.location.href = url;
  };

  return (
    <>
      {/* Updated design matching landing page */}
      <section className="min-h-screen w-full px-4 py-16 md:px-6 lg:px-10 bg-white relative overflow-hidden">
        {/* Background gradient matching landing page */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-orange-50 opacity-50" />

        {/* Header Section - matching Hero style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center mb-12 relative z-10"
        >
          <h1
            className="text-[44px] md:text-[68px] font-medium leading-[1.1] tracking-tight mb-4"
            style={{
              color: "var(--heading)",
            }}
          >
            Practice at <span className="text-[1.15em] font-light">mori</span>{" "}
            Prep
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{
              letterSpacing: "-0.01em",
              color: "var(--body-muted)",
            }}
          >
            Your personalized Digital SAT practice experience. Choose your
            domain and start improving today.
          </p>
        </motion.div>

        {/* Cards Grid - matching Explore bento grid style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="grid md:grid-cols-2 gap-4 md:gap-5 w-full">
            {practiceAreas.map((area) => (
              <motion.div
                key={area.id}
                variants={scaleIn}
                whileHover={reduce || !area.available ? undefined : { y: -6 }}
                transition={{ duration: 0.5, ease: customEase }}
                className="flex h-full"
              >
                {/* Card container matching landing page bento style */}
                <div className="w-full flex flex-col bg-[#fafafa] p-5 md:p-6 rounded-3xl shadow-sm ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-md">
                  {/* Visual Stage Container */}
                  <div className="w-full aspect-[16/10] md:aspect-[1.8/1.1] rounded-2xl overflow-hidden flex items-center justify-center relative bg-neutral-100/50 mb-5">
                    {/* Heavy blur applied to the image */}
                    <div
                      className="absolute inset-[-15%] bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${area.backgroundImage})`,
                        filter: "blur(30px) saturate(1.4)",
                        transform: "scale(1.1)",
                      }}
                    />

                    {/* Light overlay */}
                    <div className="absolute inset-0 bg-white/10" />

                    {/* Centered Overlay Text */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: customEase,
                      }}
                      className="relative z-10 text-center px-4"
                    >
                      <p className="text-white text-[20px] md:text-[24px] font-medium tracking-tight drop-shadow-md">
                        {area.badgeText}
                      </p>
                    </motion.div>
                  </div>

                  {/* Text & Button Content */}
                  <div className="flex flex-col items-center text-center flex-1">
                    <h3
                      className="text-[18px] md:text-[20px] font-medium mb-2"
                      style={{
                        color: "var(--heading)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {area.title}
                    </h3>
                    <p
                      className="text-[15px] md:text-[16px] leading-relaxed mb-5 max-w-[280px]"
                      style={{
                        letterSpacing: "-0.01em",
                        color: "var(--body-muted)",
                      }}
                    >
                      {area.description}
                    </p>

                    <div className="mt-auto w-full flex justify-center">
                      {area.available ? (
                        area.id === "reading-writing" ? (
                          <button
                            onClick={() => setIsConfigPopupOpen(true)}
                            className="inline-flex items-center justify-center px-6 md:px-8 py-3 text-white rounded-full font-medium text-[17px] leading-none tracking-tight transition-colors duration-100 relative z-10"
                            style={{
                              borderRadius: "32px",
                              height: "3rem",
                              letterSpacing: "-0.01375rem",
                              backgroundColor: "rgba(23, 23, 23, 0.8)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(18, 18, 18, 0.9)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "rgba(23, 23, 23, 0.8)")
                            }
                          >
                            {area.buttonText}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center justify-center px-6 md:px-8 py-3 text-white rounded-full font-medium text-[17px] leading-none tracking-tight transition-colors duration-100 relative z-10 opacity-50 cursor-not-allowed"
                            style={{
                              borderRadius: "32px",
                              height: "3rem",
                              letterSpacing: "-0.01375rem",
                              backgroundColor: "rgba(23, 23, 23, 0.8)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            {area.buttonText}
                          </button>
                        )
                      ) : (
                        <div className="inline-flex items-center justify-center px-6 md:px-8 py-3 bg-transparent border border-neutral-200 text-neutral-500 rounded-full font-medium text-[17px] gap-2 cursor-not-allowed">
                          <LockIcon className="w-4 h-4 stroke-[2]" />
                          {area.buttonText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <PracticeConfigPopup
        isOpen={isConfigPopupOpen}
        onClose={() => setIsConfigPopupOpen(false)}
        onStartPractice={handleStartPractice}
      />
    </>
  );
}
