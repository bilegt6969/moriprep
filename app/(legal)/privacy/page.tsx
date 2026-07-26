"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
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
        minHeight: "100vh",
        width: "100vw",
        background: "#ffffff", // Pure white for the main page
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        color: "#222",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Glassmorphic Top Navigation - Retaining original color */}
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

          {/* Pushed to the right by justify-between */}
          <Link href="/" className="flex items-center h-5 cursor-pointer">
            <img
              src="/morin.svg"
              alt="Brand Logo"
              className="h-full w-auto object-contain opacity-80"
            />
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
              Privacy & Policy
            </h1>
            <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
              How we handle your data to keep Sainto secure and reliable.
            </p>
          </motion.div>

          <div style={contentStyle}>
            <Section variants={itemVariants} title="1. Information We Collect">
              <p>
                When you interact with our platform, we collect information that
                helps us facilitate secure C2C transactions. This includes your
                contact details (name, email, phone number), delivery
                coordinates across Ulaanbaatar, and transaction history.
              </p>
              <p>
                We do not store sensitive bank login details on our servers;
                bank transfers are authenticated using secure, unique
                transaction codes generated per order.
              </p>
            </Section>

            <Section variants={itemVariants} title="2. How We Use Your Data">
              <p>Your data is utilized strictly to:</p>
              <ul style={listStyle}>
                <li>Process and verify your marketplace transactions.</li>
                <li>Coordinate seamless logistics and dispatch updates.</li>
                <li>
                  Prevent fraud and ensure the authenticity of listed apparel
                  and goods.
                </li>
                <li>Improve our UI/UX and overall platform stability.</li>
              </ul>
            </Section>

            <Section
              variants={itemVariants}
              title="3. Data Sharing & Disclosure"
            >
              <p>
                We value your privacy. We do not sell your personal data to
                third parties. Information is only shared with trusted
                logistical partners necessary to deliver your orders or when
                legally required to protect our community.
              </p>
            </Section>

            <Section variants={itemVariants} title="4. Your Rights">
              <p>
                You have the right to access, modify, or delete your personal
                information at any time. If you wish to wipe your account
                history or manage your active data footprint, please contact our
                support team.
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
                  "Updated data handling protocols for direct banking channels.",
                  "Clarified language regarding unique transaction code generation.",
                ]}
              />
              <ChangelogItem
                version="v1.1.0"
                date="February 15, 2025"
                changes={[
                  "Revised terms to reflect the transition to a full C2C fashion marketplace structure.",
                  "Added clauses for peer-to-peer authenticated retail disputes.",
                ]}
              />
              <ChangelogItem
                version="v1.0.0"
                date="July 10, 2024"
                changes={["Initial publication of the Privacy Policy."]}
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
  // Removed the background and heavy shadow since the page is already white.
  // We keep a clean layout to fit the Apple aesthetic.
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
