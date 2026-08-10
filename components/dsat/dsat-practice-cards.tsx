"use client";

import { motion } from "framer-motion";
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
      {/* Fit within viewport without scrolling */}
      <section className="h-[calc(100vh-80px)] w-full px-6 pt-20 bg-white text-neutral-900 font-sans selection:bg-neutral-200 selection:text-neutral-900 flex flex-col items-center relative overflow-hidden">
        {/* Subtle Background Blobs (matching the left pinkish glow) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[5%] left-[-5%] w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[100px]" />
          <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[90px]" />
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: customEase }}
          className="flex flex-col items-center text-center max-w-[600px] mx-auto mb-4 md:mb-6 relative z-10"
        >
          <h1 className="text-[28px] md:text-[36px] font-semibold tracking-tight text-[#111111] mb-3 md:mb-4 leading-[1.1]">
            The Perfect Score,
            <br /> Tailored to You
          </h1>

          <p className="text-[#666666] text-[13px] md:text-[14px] leading-relaxed max-w-[480px]">
            Our platform combines extensive test knowledge with cutting-edge
            algorithms to offer question recommendations that suit your unique
            weaknesses. Here's how we transform your study journey:
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-[900px] mx-auto relative z-10"
        >
          <div className="grid md:grid-cols-2 gap-4 md:gap-5 w-full">
            {practiceAreas.map((area) => (
              <motion.div
                key={area.id}
                variants={scaleIn}
                whileHover={area.available ? { y: -6 } : {}}
                transition={{ duration: 0.5, ease: customEase }}
                className="flex h-full"
              >
                {/* Outer Card Container */}
                <div className="w-full flex flex-col bg-white p-2.5 pb-4 md:p-2.5 md:pb-5 rounded-[1.5rem] md:rounded-[1.75rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-200/60 transition-shadow duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
                  {/* Visual Stage Container (Blurred Backgrounds) */}
                  <div className="w-full aspect-[16/10] md:aspect-[1.8/1.1] rounded-[1.25rem] md:rounded-[1.5rem] overflow-hidden flex items-center justify-center relative bg-neutral-100/50">
                    {/* Heavy blur applied to the image */}
                    <div
                      className="absolute inset-[-15%] bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${area.backgroundImage})`,
                        filter: "blur(30px) saturate(1.4)",
                        transform: "scale(1.1)",
                      }}
                    />

                    {/* Very subtle light overlay to ensure text pops without darkening the image */}
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

                  {/* Text & Button Content below the image */}
                  <div className="flex flex-col items-center text-center px-3 pt-4 md:pt-5 flex-1">
                    <h3 className="text-[16px] md:text-[18px] font-semibold tracking-tight mb-1.5 md:mb-2 text-[#111111]">
                      {area.title}
                    </h3>
                    <p className="text-[#666666] text-[12px] md:text-[13px] leading-relaxed mb-4 md:mb-5 max-w-[280px]">
                      {area.description}
                    </p>

                    <div className="mt-auto w-full flex justify-center">
                      {area.available ? (
                        area.id === "reading-writing" ? (
                          <button
                            onClick={() => setIsConfigPopupOpen(true)}
                            className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 bg-[#111111] text-white rounded-full font-medium text-[13px] transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]"
                          >
                            {area.buttonText}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 bg-[#111111] text-white rounded-full font-medium text-[13px] transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] opacity-50 cursor-not-allowed"
                          >
                            {area.buttonText}
                          </button>
                        )
                      ) : (
                        <div className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 bg-transparent border border-neutral-200 text-neutral-500 rounded-full font-medium text-[13px] gap-2 cursor-not-allowed">
                          <LockIcon className="w-3.5 h-3.5 stroke-[2]" />
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
