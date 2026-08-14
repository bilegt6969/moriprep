"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfService() {
  // Apple-style easing curve (Ease Out Expo)
  const ease = [0.16, 1, 0.3, 1] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease },
    },
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "#ffffff",
        color: "#222",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Glassmorphic Top Navigation */}
      <div className="w-full bg-[#f4f4f6]/70 backdrop-blur-xl border-b border-gray-200/50 flex justify-center sticky top-0 z-50">
        <div className="w-full max-w-[800px] px-10 py-4 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <Link href="/">
            <div className="flex items-center h-5 cursor-pointer">
              <img
                src="/morin.svg"
                alt="Brand Logo"
                className="h-full w-auto object-contain opacity-80"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
          padding: "56px 40px",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={cardStyle}
        >
          <motion.div
            variants={itemVariants}
            style={{ marginBottom: 56, textAlign: "center" }}
          >
            <h1
              style={{
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: "0 0 12px 0",
                color: "#111",
              }}
            >
              Terms of Service
            </h1>
            <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
              The rules and guidelines that govern your use of Mori Prep.
            </p>
          </motion.div>

          <div style={contentStyle}>
            <Section variants={itemVariants} title="1. Acceptance of Terms">
              <p>
                By accessing and using Mori Prep, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our platform. These terms may be updated periodically,
                and your continued use constitutes acceptance of any changes.
              </p>
            </Section>

            <Section variants={itemVariants} title="2. User Responsibilities">
              <p>As a user of Mori Prep, you agree to:</p>
              <ul style={listStyle}>
                <li>
                  Provide accurate and truthful information when creating your
                  account and entering your academic details.
                </li>
                <li>
                  Use the platform solely for SAT preparation and educational
                  purposes.
                </li>
                <li>
                  Maintain the security of your account and notify us
                  immediately of any unauthorized access.
                </li>
                <li>
                  Respect the intellectual property rights of our educational
                  content.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="3. Service Guidelines">
              <p>
                Mori Prep provides personalized SAT preparation services. By
                using our platform, you acknowledge that:
              </p>
              <ul style={listStyle}>
                <li>
                  Our study plans and recommendations are based on the
                  information you provide.
                </li>
                <li>
                  Your progress tracking depends on regular engagement with the
                  platform.
                </li>
                <li>
                  Educational content is provided for personal study purposes
                  only.
                </li>
                <li>
                  Results may vary based on individual effort and aptitude.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="4. Prohibited Activities">
              <p>You may not use Mori Prep to:</p>
              <ul style={listStyle}>
                <li>Share account credentials with others.</li>
                <li>Copy or redistribute our educational content.</li>
                <li>
                  Use the platform for any illegal or unauthorized purpose.
                </li>
                <li>Attempt to circumvent our payment or access systems.</li>
                <li>Harass, abuse, or harm other users or staff.</li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="5. Limitation of Liability">
              <p>
                Mori Prep is provided "as is" without warranties of any kind. We
                are not liable for any indirect, incidental, or consequential
                damages arising from your use of the platform. Our total
                liability is limited to the amount you paid for the service, if
                any.
              </p>
            </Section>

            <Section variants={itemVariants} title="6. Account Termination">
              <p>
                We reserve the right to suspend or terminate your account if you
                violate these terms or engage in prohibited activities. Upon
                termination, your right to use the platform will immediately
                cease.
              </p>
            </Section>
          </div>

          <motion.hr variants={itemVariants} style={dividerStyle} />

          {/* Changelog Section */}
          <motion.div variants={itemVariants}>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: "0 0 32px 0",
                color: "#111",
              }}
            >
              Changelog
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <ChangelogItem
                version="v1.2.0"
                date="May 30, 2026"
                changes={[
                  "Updated service guidelines for personalized SAT preparation.",
                  "Added clarity on educational content usage rights.",
                ]}
              />
              <ChangelogItem
                version="v1.1.0"
                date="February 15, 2025"
                changes={[
                  "Revised terms for comprehensive SAT preparation services.",
                  "Added user responsibilities section.",
                ]}
              />
              <ChangelogItem
                version="v1.0.0"
                date="July 10, 2024"
                changes={["Initial publication of Terms of Service."]}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Sub-components

function Section({
  title,
  children,
  variants,
}: {
  title: string;
  children: React.ReactNode;
  variants: any;
}) {
  return (
    <motion.div variants={variants} style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          margin: "0 0 16px 0",
          color: "#111",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          color: "#555",
          lineHeight: 1.6,
          fontSize: 15,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function ChangelogItem({
  version,
  date,
  changes,
}: {
  version: string;
  date: string;
  changes: string[];
}) {
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div style={{ width: 120, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
          {version}
        </div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{date}</div>
      </div>

      <div style={{ flex: 1, minWidth: 250 }}>
        <ul style={{ ...listStyle, margin: 0 }}>
          {changes.map((change, i) => (
            <li
              key={i}
              style={{
                marginBottom: 12,
                color: "#555",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {change}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Styles

const cardStyle: React.CSSProperties = {
  padding: "24px 0",
  boxSizing: "border-box",
};

const contentStyle: React.CSSProperties = {
  marginBottom: 48,
};

const listStyle: React.CSSProperties = {
  margin: "4px 0",
  paddingLeft: 20,
};

const dividerStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #f0f0f3",
  margin: "56px 0",
};
