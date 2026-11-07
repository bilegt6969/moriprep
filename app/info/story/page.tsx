"use client";

import Navbar from "components/Heading/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import Script from "next/script";

const customEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

const founders = [
  {
    name: "Bilegt Amartuvshin",
    role: "Co-Founder",
    src: "/people/bilegt-amartuvshin.jpg",
    objectPosition: "center",
  },
  {
    name: "Gundsambuu Ganzil",
    role: "Co-Founder",
    src: "/people/Gundsambuu.png",
    objectPosition: "top",
  },
];

export default function MissionPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mori Prep",
            url: "https://moriprep.xyz",
            logo: "https://moriprep.xyz/logo.png",
            description: "Mori Prep is a free, non-profit learning platform helping students prepare for the Digital SAT and develop the skills to create, innovate, and solve problems.",
            founders: [
              {
                "@type": "Person",
                name: "Bilegt Amartuvshin",
                image: "https://moriprep.xyz/people/bilegt-amartuvshin.jpg",
                jobTitle: "Co-Founder",
                description: "Co-founder of Mori Prep, building free education for Mongolia",
              },
              {
                "@type": "Person",
                name: "Gundsambuu Ganzil",
                image: "https://moriprep.xyz/people/Gundsambuu.png",
                jobTitle: "Co-Founder",
                description: "Co-founder of Mori Prep, building free education for Mongolia",
              },
            ],
            sameAs: ["https://moriprep.xyz"],
          }),
        }}
      />
      <Navbar siteName="Byte" categories={[]} />
      <section className="relative bg-white min-h-screen">
        {/* Hero section with image */}
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: customEase }}
            className="mb-12"
          >
            <img
              src="/profit.jpg"
              alt="Education > Profit"
              width={400}
              height={400}
              className="mx-auto w-1/2 aspect-square object-cover rounded-3xl"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: customEase, delay: 0.1 }}
            className="font-eb-garamond font-slim text-5xl md:text-7xl tracking-tight text-neutral-900 leading-[1.1]"
          >
            Open Education
            <br />
            For All.
          </motion.h1>
        </div>

        {/* Story */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl px-6 pb-20 space-y-6 text-left text-lg leading-relaxed text-neutral-600"
        >
          <motion.p variants={textVariants}>
            Every student has questions they want to answer, problems they want
            to solve, and ideas they want to build.
          </motion.p>
          <motion.p variants={textVariants}>
            But access to quality education is still limited by language,
            location, and cost.
          </motion.p>
          <motion.p variants={textVariants}>
            We started{" "}
            <Link
              href="https://moriprep.xyz/"
              className="underline decoration-2 decoration-gray-300 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Mori Prep
            </Link>{" "}
            in the summer of 2023 with a simple belief:
          </motion.p>
          <motion.p
            variants={textVariants}
            className="text-3xl font-slim italic tracking-tight text-neutral-900"
          >
            "A student's potential should never depend on their ability to pay."
          </motion.p>
          <motion.p variants={textVariants}>
            We saw talented Mongolian students struggle to learn programming
            because the best resources were often inaccessible. Later, we
            discovered the same challenge existed in test preparation —
            especially for the SAT, where quality guidance often comes with a
            high price tag.
          </motion.p>
          <motion.p variants={textVariants}>
            So we built the platform we wished we had.
          </motion.p>
          <motion.p variants={textVariants}>
            Mori Prep is a free, non-profit learning platform helping students
            prepare for the Digital SAT and develop the skills to create,
            innovate, and solve problems.
          </motion.p>
          <motion.p variants={textVariants}>
            We don't believe education is about memorizing answers.
          </motion.p>
          <motion.p variants={textVariants}>
            It's about learning how to think. How to solve difficult problems.
            How to learn independently. How to build things that matter.
          </motion.p>
          <motion.p
            variants={textVariants}
            className="text-2xl font-slim italic tracking-tight text-neutral-900"
          >
            Built by students, for students.
          </motion.p>
          <motion.p variants={textVariants}>
            We believe the next generation of engineers, founders, and creators
            can come from anywhere. And we're here to make sure they have the
            opportunity to prove it.
          </motion.p>
          <motion.p
            variants={textVariants}
            className="text-2xl font-slim italic tracking-tight text-neutral-900"
          >
            Want to build with us?
          </motion.p>
          <motion.p variants={textVariants}>
            We seasonally welcome students who want to contribute to our mission
            — whether through coding, design, content creation, curriculum
            development, or new ideas.
          </motion.p>
          <motion.p variants={textVariants}>
            Together, we can build something that matters.
          </motion.p>
          <motion.p variants={textVariants}>
            Welcome to the future of learning.
          </motion.p>
          <motion.p
            variants={textVariants}
            className="mt-12 text-neutral-400 font-medium"
          >
            — Bilegt & Gundsambuu
          </motion.p>
        </motion.div>

        {/* Founders */}
        <div className="mx-auto max-w-3xl px-6 pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: customEase }}
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {founders.map((person) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: customEase }}
                className="flex flex-col items-center text-center"
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={person.src}
                    alt={person.name}
                    width={300}
                    height={300}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-cover"
                    style={{ objectPosition: person.objectPosition }}
                  />
                </div>
                <h3 className="mt-4 font-eb-garamond text-xl text-neutral-900">
                  {person.name}
                </h3>
                <p className="text-sm text-neutral-500">{person.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
