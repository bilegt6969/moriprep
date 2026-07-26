"use client";

import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { motion } from "framer-motion";
import Link from "next/link";

const customEase = [0.16, 1, 0.3, 1] as const;

export function MoriPrepSections() {
  return (
    <>
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
            f 🧑‍🎓 students, 💸 parents, and 🎯 dreamers to master complex,
            official, and high-stakes dSAT questions without the premium price
            tag.
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
          >
            <BouncyAccordion
              items={[
                {
                  id: "free",
                  title: "Is Mori Prep actually free?",
                  description:
                    "Completely. We are a non-profit educational initiative. No hidden fees, no trial periods. Just free.",
                },
                {
                  id: "mongolian",
                  title: "Why learn in Mongolian for an English test?",
                  description:
                    "The test is in English, but understanding the core logic shouldn't be a translation exercise. We teach the strategy in your native language so it clicks instantly.",
                },
                {
                  id: "up-to-date",
                  title: "Is the platform up to date?",
                  description:
                    "Yes. Our question bank is strictly aligned with the current Digital SAT format for both Math and Reading & Writing.",
                },
              ]}
              className="bg-neutral-100 rounded-3xl p-2"
              classNames={{
                item: "bg-white border border-neutral-200",
                trigger: "text-neutral-900",
                description: "text-neutral-600",
              }}
            />
          </motion.div>
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
