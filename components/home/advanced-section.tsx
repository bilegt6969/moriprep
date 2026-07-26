"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: customEase },
  },
};

const advancedFeatures = [
  {
    title: "ByteLabs",
    subtitle: "Real-World Experience",
    description:
      "Learning to code is only step one. ByteLabs is where you apply your skills to real client projects. With 30+ projects delivered through Bytecode Tech Team, you'll build a portfolio that actually gets you hired.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    href: "/labs",
    // Inspired by the dark gradient pricing card (Screenshot 2026-07-21 at 12.43.36.jpg)
    theme: {
      card: "bg-neutral-900 border border-neutral-800 shadow-2xl",
      icon: "text-white",
      title: "text-white font-serif",
      subtitle:
        "text-neutral-500 uppercase tracking-widest text-[10px] font-bold",
      desc: "text-neutral-400 font-sans",
      button: "bg-white text-black hover:bg-neutral-200",
    },
  },
  {
    title: "The Byte Network",
    subtitle: "Knowledge Exchange",
    description:
      "A self-sustaining ecosystem of Mongolia's top-tier talent. Connect with a peer-to-peer marketplace where you can trade 1-on-1 tutoring, collaborate on SaaS side-projects, and build a network.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
    href: "/network",
    // Soft tinted background inspired by the savings calculator panel (Screenshot 2026-07-21 at 12.43.51.jpg)
    theme: {
      card: "bg-[#f2f9f9] border border-[#e0efef] shadow-sm",
      icon: "text-black",
      title: "text-black font-serif",
      subtitle: "text-gray-400 uppercase tracking-widest text-[10px] font-bold",
      desc: "text-gray-600 font-sans",
      button: "bg-black text-white hover:bg-neutral-800",
    },
  },
];

export function AdvancedSection() {
  return (
    <section className="py-32 px-6 pb-48 bg-[#fafafa] overflow-hidden selection:bg-black selection:text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div
          variants={cardVariants}
          className="text-center mb-24 flex flex-col items-center"
        >
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-6 block">
            Advanced Programs
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-black tracking-tight leading-[1.1] mb-6">
            Beyond the
            <br />
            classroom.
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
            This isn't just a textbook—it's a launchpad for careers. Apply your
            skills, build your portfolio, and grow your network.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {advancedFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group h-full"
            >
              <Link href={feature.href} className="block h-full outline-none">
                <div
                  className={`h-full p-10 md:p-12 rounded-[2rem] transition-all duration-500 flex flex-col relative overflow-hidden group-hover:-translate-y-1 ${feature.theme.card}`}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div
                      className={`mb-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transform origin-left transition-all duration-500 ${feature.theme.icon}`}
                    >
                      {feature.icon}
                    </div>

                    {/* Text Content */}
                    <h4 className={`mb-3 ${feature.theme.subtitle}`}>
                      {feature.subtitle}
                    </h4>
                    <h3
                      className={`text-4xl tracking-tight mb-5 ${feature.theme.title}`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`leading-relaxed flex-grow text-[16px] mb-12 ${feature.theme.desc}`}
                    >
                      {feature.description}
                    </p>

                    {/* Minimalist Button */}
                    <div
                      className={`mt-auto rounded-full px-8 py-3.5 inline-flex items-center justify-center w-max text-sm font-medium transition-colors duration-300 shadow-sm ${feature.theme.button}`}
                    >
                      {feature.title === "ByteLabs"
                        ? "Build Your First Project"
                        : "Join the Network"}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
