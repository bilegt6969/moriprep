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

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: customEase },
  },
};

const testimonials = [
  {
    name: "Bat-Erdene",
    role: "Pilot Cohort Student",
    quote:
      "BytePrep's DSAT strategies were specifically designed for Mongolian students. The curriculum alignment made all the difference—I improved my score by 150 points in just 3 months.",
    initialScore: 1340,
    finalScore: 1490,
    scoreIncrease: 150,
    color: "orange",
  },
  {
    name: "Soyombo",
    role: "ByteCode Graduate",
    quote:
      "I went from knowing nothing about coding to building a full-stack application. The real-world projects through ByteLabs gave me the confidence to apply for tech internships.",
    initialScore: 1190,
    finalScore: 1470,
    scoreIncrease: 280,
    color: "green",
  },
  {
    name: "Mai H.",
    role: "OnePrep User",
    quote:
      "I like that the explanations actually make sense. Some other platforms just give you the answer but this one breaks it down.",
    initialScore: 1300,
    finalScore: 1550,
    scoreIncrease: 250,
    color: "pink",
  },
];

export function CommunitySection() {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-24 flex flex-col items-center"
        >
          <h2 className="text-5xl md:text-7xl font-semibold text-[#1d1d1f] tracking-tighter mb-6">
            Built by Students,
            <br />
            For Students.
          </h2>
          <p className="text-xl md:text-2xl text-[#86868b] font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">
            Our community of Mongolian students is growing every day. Here's
            what they're achieving.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 relative border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative z-10">
                {/* Score Tag */}
                <div
                  className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${
                    testimonial.color === "orange"
                      ? "bg-orange-100 text-orange-700"
                      : testimonial.color === "green"
                        ? "bg-green-100 text-green-700"
                        : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {testimonial.initialScore} → {testimonial.finalScore} +
                  {testimonial.scoreIncrease} points
                </div>

                {/* Avatar and Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center text-lg font-semibold text-neutral-600">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1d1d1f]">
                      {testimonial.name}
                    </h3>
                    <p className="text-[#86868b] text-xs">{testimonial.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-[#515154] leading-relaxed text-sm">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center mt-16">
          <Link
            href="/info/story"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-neutral-900 text-white font-semibold text-lg hover:bg-neutral-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Read Our Founder's Story
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
