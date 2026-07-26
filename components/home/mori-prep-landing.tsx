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

const textVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: customEase },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: customEase, delay: 0.4 },
  },
};

export function MoriPrepLanding() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 via-white to-neutral-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[15%] left-[10%] w-150 h-150 bg-neutral-200/20 rounded-full blur-[150px] will-change-transform"
          />
          <motion.div
            animate={{
              x: [0, -60, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-[15%] right-[10%] w-175 h-175 bg-neutral-300/15 rounded-full blur-[150px] will-change-transform"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20"
        >
          <motion.div variants={textVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200/80 text-sm font-medium text-neutral-600 mb-6 transition-all duration-300 hover:shadow-md hover:border-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
              </span>
              100% Free. Forever.
            </span>
          </motion.div>

          <motion.h1
            variants={textVariants}
            className="text-5xl md:text-7xl font-slim tracking-tighter text-neutral-900 mb-6 leading-[1.05] font-eb-garamond"
          >
            Mori Prep
            <br />
            <span className="text-neutral-800">Master the dSAT.</span>
          </motion.h1>

          <motion.p
            variants={textVariants}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-snug font-normal"
          >
            World-class Digital SAT preparation. Built for Mongolia. Completely
            free.
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div variants={buttonVariants}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-neutral-900 text-white font-medium text-lg hover:bg-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10"
              >
                Start Learning Free
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: customEase }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-slim tracking-tight text-neutral-900 mb-8 leading-[1.1] font-eb-garamond">
            Mori Prep empowers 🧑‍🎓 students, 💸 parents, and 🎯 dreamers to
            master complex, official, and high-stakes dSAT questions without the
            premium price tag.
          </h2>
        </motion.div>
      </section>

      {/* Origin Section */}
      <section className="py-32 px-6 bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: customEase }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-slim tracking-tight text-neutral-900 mb-6 leading-[1.1] font-eb-garamond">
            We believe world-class education shouldn't have a price tag. Or a
            language barrier.
          </h2>
          <p className="text-lg text-neutral-600 leading-relaxed">
            We couldn't find a single premium dSAT platform built for
            Mongolia—so we engineered it ourselves.
          </p>
        </motion.div>
      </section>

      {/* Key Value Props */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Official questions. Real results.
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                No guesswork, no outdated PDFs. Drill with official College
                Board-style Math and Reading & Writing questions, formatted
                exactly like the real test environment.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg">
              <div className="text-4xl mb-4">🇲🇳</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Complex concepts. Native language.
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Because doing math is hard enough without translating it in your
                head first. Master the hardest strategies with crystal-clear
                video lessons taught entirely in Mongolian.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                100% Free. No catches.
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                No paywalls. No premium tiers. Just beautifully crafted,
                high-quality education built to level the playing field for
                every student in Mongolia.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
            className="text-3xl md:text-4xl font-slim tracking-tight text-neutral-900 mb-16 text-center font-eb-garamond"
          >
            How It Works
          </motion.h2>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.1 }}
              className="flex gap-6"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Sign up in seconds.
                </h3>
                <p className="text-neutral-600">
                  Just an email. No credit cards, no friction.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
              className="flex gap-6"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Learn natively.
                </h3>
                <p className="text-neutral-600">
                  Watch bite-sized, cinematic lessons breaking down core dSAT
                  strategies.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.3 }}
              className="flex gap-6"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Practice perfectly.
                </h3>
                <p className="text-neutral-600">
                  Drill the question bank, track your analytics, and pinpoint
                  exactly where to improve.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact / Specs Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
            className="grid md:grid-cols-3 gap-16 text-center"
          >
            <div>
              <div className="text-6xl md:text-7xl font-slim tracking-tight text-neutral-900 mb-4 font-eb-garamond">
                0₮
              </div>
              <p className="text-neutral-600 text-lg">Total cost, forever.</p>
            </div>

            <div>
              <div className="text-6xl md:text-7xl font-slim tracking-tight text-neutral-900 mb-4 font-eb-garamond">
                1st
              </div>
              <p className="text-neutral-600 text-lg">
                Native Mongolian prep platform.
              </p>
            </div>

            <div>
              <div className="text-6xl md:text-7xl font-slim tracking-tight text-neutral-900 mb-4 font-eb-garamond">
                100%
              </div>
              <p className="text-neutral-600 text-lg">
                Official College Board alignment.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
            className="mt-20 text-center"
          >
            <blockquote className="text-2xl md:text-3xl font-slim tracking-tight text-neutral-900 leading-relaxed font-eb-garamond">
              "Your dream university shouldn't be locked behind a $2,000 prep
              course."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
            className="text-3xl md:text-4xl font-slim tracking-tight text-neutral-900 mb-16 text-center font-eb-garamond"
          >
            FAQ
          </motion.h2>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.1 }}
              className="border-b border-neutral-200 pb-8"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Q: Is Mori Prep actually free?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                A: Completely. We are a non-profit educational initiative. No
                hidden fees, no trial periods. Just free.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
              className="border-b border-neutral-200 pb-8"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Q: Why learn in Mongolian for an English test?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                A: The test is in English, but understanding the core logic
                shouldn't be a translation exercise. We teach the strategy in
                your native language so it clicks instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Q: Is the platform up to date?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                A: Yes. Our question bank is strictly aligned with the current
                Digital SAT format for both Math and Reading & Writing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: customEase }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-slim tracking-tight text-neutral-900 mb-8 leading-[1.1] font-eb-garamond">
            Ready to master the dSAT?
          </h2>
          <p className="text-lg text-neutral-600 mb-10">
            Join thousands of students in Mongolia preparing for their dream
            universities.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-neutral-900 text-white font-medium text-lg hover:bg-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10"
          >
            Start Learning Free
          </Link>
        </motion.div>
      </section>
    </>
  );
}
