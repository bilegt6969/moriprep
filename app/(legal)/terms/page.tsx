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
        minHeight: "100vh",
        width: "100vw",
        background: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
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
              The rules and guidelines that govern your use of Sainto.
            </p>
          </motion.div>

          <div style={contentStyle}>
            <Section variants={itemVariants} title="1. Acceptance of Terms">
              <p>
                By accessing and using Sainto, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our platform. These terms may be updated periodically,
                and your continued use constitutes acceptance of any changes.
              </p>
            </Section>

            <Section variants={itemVariants} title="2. User Responsibilities">
              <p>As a user of Sainto, you agree to:</p>
              <ul style={listStyle}>
                <li>
                  Provide accurate and truthful information when creating your
                  account and listing items.
                </li>
                <li>
                  Only list items that you legally own and have the right to
                  sell.
                </li>
                <li>
                  Conduct all transactions in good faith and honor your
                  commitments to buyers and sellers.
                </li>
                <li>
                  Maintain the security of your account and notify us
                  immediately of any unauthorized access.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="3. Transaction Guidelines">
              <p>
                Sainto facilitates C2C transactions between users. All payments
                are processed through secure bank transfers using unique
                transaction codes. By using our platform, you acknowledge that:
              </p>
              <ul style={listStyle}>
                <li>
                  Sainto acts as an intermediary and is not responsible for the
                  quality or condition of items sold.
                </li>
                <li>
                  Delivery logistics are coordinated through trusted partners,
                  and delivery times may vary.
                </li>
                <li>
                  Disputes between buyers and sellers should be resolved through
                  our support channel following our dispute resolution process.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="4. Prohibited Activities">
              <p>You may not use Sainto to:</p>
              <ul style={listStyle}>
                <li>List counterfeit, stolen, or illegal items.</li>
                <li>Engage in fraudulent transactions or scams.</li>
                <li>Harass, abuse, or harm other users.</li>
                <li>Use the platform for any illegal purpose.</li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="5. Limitation of Liability">
              <p>
                Sainto is provided "as is" without warranties of any kind. We
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
                  "Updated transaction guidelines to reflect direct banking integration.",
                  "Added clarity on dispute resolution process.",
                ]}
              />
              <ChangelogItem
                version="v1.1.0"
                date="February 15, 2025"
                changes={[
                  "Revised terms for C2C marketplace model.",
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
