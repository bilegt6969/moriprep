"use client";

import Navbar from "@/components/Heading/Navbar";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";

// Apple-style spring physics - critically damped for default UI
const springConfig = {
  type: "spring" as const,
  damping: 1.0,
  stiffness: 400,
  mass: 0.8,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springConfig,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
      ...springConfig,
    },
  },
};

const headingStyle = {
  letterSpacing: "-0.02em",
};

const bodyStyle = {
  letterSpacing: "-0.01em",
};

export default function JoinPage() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className="bg-white min-h-screen text-black font-sans selection:bg-neutral-200"
      style={{ fontFamily: "Geist Sans, system-ui, sans-serif" }}
      suppressHydrationWarning
    >
      <Navbar
        siteName="Mori Prep"
        categories={[
          { label: "Practice", href: "/practice" },
          { label: "Resources", href: "/resources" },
          { label: "About", href: "/info/story" },
          { label: "Contact", href: "/contact" },
        ]}
        showBanner={true}
      />

      <main className="relative pt-32 md:pt-48 pb-24 overflow-hidden">
        {/* 1. HERO SECTION */}
        <section className="container mx-auto px-6 md:px-12 max-w-5xl text-center mb-32">
          <motion.div
            initial={isMounted ? "hidden" : "visible"}
            animate="visible"
            variants={prefersReducedMotion ? {} : staggerContainer}
          >
            <motion.p
              variants={prefersReducedMotion ? {} : fadeUp}
              className="text-xs md:text-sm font-semibold tracking-widest uppercase mb-6 text-neutral-500"
              style={bodyStyle}
            >
              Join Our Team
            </motion.p>
            <motion.h1
              variants={prefersReducedMotion ? {} : fadeUp}
              className="text-5xl md:text-7xl lg:text-[80px] font-medium leading-tight tracking-tight mb-8"
              style={headingStyle}
            >
              Develop open, <br className="hidden md:block" />
              <span className="font-eb-garamond font-light tracking-tighter text-[1.1em]">
                accessible
              </span>{" "}
              education
            </motion.h1>
            <motion.p
              variants={prefersReducedMotion ? {} : fadeUp}
              className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 font-medium"
              style={bodyStyle}
            >
              We are a nonprofit educational initiative building Mongolia's
              first open Digital SAT platform.
            </motion.p>
            <motion.div variants={prefersReducedMotion ? {} : fadeUp}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href="/signup"
                  className="inline-block bg-black text-white px-8 py-3.5 rounded-full font-medium text-sm tracking-wide hover:bg-neutral-800 transition-colors"
                >
                  View open roles
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. INTRO STATEMENT */}
        <section className="container mx-auto px-6 md:px-12 max-w-4xl text-center mb-24">
          <motion.h2
            initial={isMounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={prefersReducedMotion ? {} : fadeUp}
            className="text-2xl md:text-4xl font-medium leading-relaxed tracking-tight"
            style={headingStyle}
          >
            We’re a team of students, educators, and developers dedicated to
            ensuring that quality test prep is a right, not a privilege.
          </motion.h2>
        </section>

        {/* 3. CORE PRINCIPLES / TEXT COLUMNS */}
        <section className="container mx-auto px-6 md:px-12 max-w-3xl mb-32">
          <motion.div
            initial={isMounted ? "hidden" : "visible"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={prefersReducedMotion ? {} : fadeUp}
            className="prose prose-lg text-neutral-800"
            style={bodyStyle}
          >
            <p className="mb-6">
              Mori Prep is committed to dismantling the financial barriers to
              higher education. To achieve this, we are looking for dedicated
              volunteers who share our vision.
            </p>
            <ul className="list-disc pl-5 space-y-4 marker:text-black">
              <li>
                <strong>Engineers and Developers:</strong> Help us architect a
                robust, scalable platform using modern web technologies like
                Next.js and React. You will be building tools directly used by
                thousands of students.
              </li>
              <li>
                <strong>Content Creators and Teachers:</strong> Craft
                high-quality, challenging practice questions and study guides
                that mirror the actual Digital SAT experience.
              </li>
              <li>
                <strong>Mentors:</strong> Guide students through the arduous
                college application process, sharing your own experiences to
                help them succeed.
              </li>
            </ul>
          </motion.div>
        </section>

        {/* 4. LARGE FEATURE IMAGE */}
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mb-32">
          <motion.div
            initial={
              isMounted ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }
            }
            whileInView={{ opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0.3 } : springConfig}
            viewport={{ once: true }}
            className="w-full aspect-[21/9] bg-neutral-200 rounded-lg overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3271&auto=format&fit=crop"
              alt="Students collaborating"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>

        {/* 5. BENEFITS 3-COLUMN GRID */}
        <section className="container mx-auto px-6 md:px-12 max-w-6xl mb-32">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-medium tracking-tight mb-4"
              style={headingStyle}
            >
              Benefits
            </h2>
            <p className="text-neutral-600" style={bodyStyle}>
              While these are volunteer positions, the rewards are substantial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-neutral-200 pt-12">
            <div>
              <h3 className="font-semibold text-lg mb-6" style={headingStyle}>
                Experience & Growth
              </h3>
              <ul className="space-y-4" style={bodyStyle}>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Real-world production experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Portfolio & resume building
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Mentorship from peers
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6" style={headingStyle}>
                Culture & Work
              </h3>
              <ul className="space-y-4" style={bodyStyle}>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    100% Remote flexibility
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Asynchronous collaboration
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Open, transparent environment
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6" style={headingStyle}>
                Social Impact
              </h3>
              <ul className="space-y-4" style={bodyStyle}>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Directly help Mongolian youth
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Contribute to open-source
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black text-xl leading-none">✓</span>{" "}
                  <span className="text-neutral-600 text-sm">
                    Shape the future of education
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. OPEN ROLES LISTING */}
        <section
          className="container mx-auto px-6 md:px-12 max-w-4xl mb-32"
          id="roles"
        >
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
            <h2
              className="text-3xl font-medium tracking-tight"
              style={headingStyle}
            >
              Open roles
            </h2>
            <p
              className="text-neutral-500 text-sm mt-2 md:mt-0"
              style={bodyStyle}
            >
              All roles are remote & volunteer
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <button className="flex items-center gap-2 border border-neutral-300 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-neutral-50 transition-colors">
              <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
              All Departments
            </button>
          </div>

          <div className="border-t border-black">
            {[
              {
                title: "Frontend Developer (React/Next.js)",
                dept: "Engineering",
              },
              { title: "Digital SAT Math Content Creator", dept: "Education" },
              {
                title: "Digital SAT Reading/Writing Creator",
                dept: "Education",
              },
              { title: "UI/UX Designer", dept: "Design" },
              { title: "Student Mentor & Advisor", dept: "Community" },
            ].map((job, i) => (
              <Link
                href="/apply"
                key={i}
                className="group block border-b border-neutral-200 py-6 hover:bg-neutral-50 transition-colors px-4 -mx-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h3
                    className="text-lg font-medium group-hover:text-neutral-600 transition-colors"
                    style={headingStyle}
                  >
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-6">
                    <span
                      className="text-sm text-neutral-500 hidden md:block"
                      style={bodyStyle}
                    >
                      {job.dept}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-400 group-hover:text-black transition-colors"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. ALTERNATING FEATURE BLOCKS */}
        <section className="container mx-auto px-6 md:px-12 max-w-6xl mb-32 space-y-32">
          {/* Block 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <h3
                className="text-2xl font-medium tracking-tight mb-4"
                style={headingStyle}
              >
                Engineering at Mori
              </h3>
              <p
                className="text-neutral-600 leading-relaxed mb-6"
                style={bodyStyle}
              >
                Join a fast-moving, passionate technical team. You will have the
                autonomy to make architectural decisions and build features from
                the ground up that directly impact students' learning curves.
              </p>
              <Link
                href="/apply"
                className="text-sm font-semibold underline underline-offset-4 hover:text-neutral-600"
                style={bodyStyle}
              >
                Read more
              </Link>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
                alt="Team collaborating"
                className="w-full aspect-[4/3] object-cover rounded-lg bg-neutral-100"
              />
            </div>
          </div>

          {/* Block 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="w-full md:w-1/2">
              <h3
                className="text-2xl font-medium tracking-tight mb-4"
                style={headingStyle}
              >
                Content & Curriculum
              </h3>
              <p
                className="text-neutral-600 leading-relaxed mb-6"
                style={bodyStyle}
              >
                Our curriculum is the heart of Mori Prep. Work with top scorers
                and educators to deconstruct the Digital SAT and create the most
                intuitive, effective study materials available in Mongolia.
              </p>
              <Link
                href="/apply"
                className="text-sm font-semibold underline underline-offset-4 hover:text-neutral-600"
                style={bodyStyle}
              >
                Read more
              </Link>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2940&auto=format&fit=crop"
                alt="Student studying"
                className="w-full aspect-[4/3] object-cover rounded-lg bg-neutral-100"
              />
            </div>
          </div>
        </section>

        {/* 8. LARGE QUOTE */}
        <section className="container mx-auto px-6 md:px-12 max-w-4xl text-center mb-32">
          <blockquote
            className="text-3xl md:text-5xl font-eb-garamond font-light leading-tight tracking-tighter mb-8 text-[1.05em]"
            style={headingStyle}
          >
            "We believe that high-quality test prep is a fundamental right, and
            technology is how we deliver it."
          </blockquote>
          <cite
            className="text-sm uppercase tracking-widest font-semibold text-neutral-500 not-italic"
            style={bodyStyle}
          >
            — The Mori Prep Team
          </cite>
        </section>

        {/* 9. BOTTOM CTA BOX */}
        <section className="container mx-auto px-4 md:px-6 max-w-6xl mb-12">
          <div className="bg-[#f7f7f8] py-24 px-6 text-center rounded-2xl">
            <h2
              className="text-3xl md:text-4xl font-medium tracking-tight mb-8"
              style={headingStyle}
            >
              Shape the future of education
            </h2>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                href="/signup"
                className="inline-block bg-black text-white px-8 py-3.5 rounded-full font-medium text-sm tracking-wide hover:bg-neutral-800 transition-colors"
              >
                Apply Now
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
