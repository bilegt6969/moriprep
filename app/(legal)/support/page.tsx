"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Support() {
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
              Support Center
            </h1>
            <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
              Get help with orders, account issues, and general inquiries.
            </p>
          </motion.div>

          <div style={contentStyle}>
            <Section variants={itemVariants} title="1. Contact Us">
              <p>
                Our support team is available to assist you with any questions
                or concerns. Reach out to us through:
              </p>
              <ul style={listStyle}>
                <li>
                  <strong>Email:</strong> bilegt6969@gmail.cpm
                </li>
                <li>
                  <strong>Phone:</strong> +976 9019-5589
                </li>
                <li>
                  <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
                  (Ulaanbaatar Time)
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="2. Common Issues">
              <p>Find quick solutions to frequently encountered problems:</p>
              <ul style={listStyle}>
                <li>
                  <strong>Order Not Received:</strong> Track your order using
                  the unique transaction code provided. If delivery is delayed
                  beyond the estimated time, contact our logistics partner.
                </li>
                <li>
                  <strong>Payment Issues:</strong> Ensure your bank transfer was
                  successful. If you encounter errors, verify the transaction
                  code and contact your bank.
                </li>
                <li>
                  <strong>Account Access:</strong> If you cannot log in, use the
                  "Forgot Password" feature or contact support for account
                  recovery.
                </li>
                <li>
                  <strong>Item Quality:</strong> If an item does not match its
                  description, initiate a dispute within 48 hours of delivery.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="3. Dispute Resolution">
              <p>
                If you have a dispute with a buyer or seller, follow these
                steps:
              </p>
              <ul style={listStyle}>
                <li>
                  Contact the other party directly to resolve the issue
                  amicably.
                </li>
                <li>
                  If unresolved, submit a dispute request through our support
                  channel with evidence (photos, messages, transaction details).
                </li>
                <li>
                  Our team will review the case and mediate a fair resolution
                  within 5-7 business days.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="4. Returns & Refunds">
              <p>
                Returns and refunds are handled on a case-by-case basis. To
                request a return:
              </p>
              <ul style={listStyle}>
                <li>
                  Ensure the item is in the same condition as received and
                  initiate the request within 7 days of delivery.
                </li>
                <li>
                  Provide proof of the issue (photos, videos) to support your
                  claim.
                </li>
                <li>
                  Refunds are processed via the original payment method once the
                  return is approved and received.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="5. FAQ">
              <p>
                <strong>Q: How long does delivery take?</strong>
                <br />
                A: Delivery typically takes 2-5 business days within
                Ulaanbaatar, depending on the item and location.
              </p>
              <p>
                <strong>Q: Is my payment information secure?</strong>
                <br />
                A: Yes, we use secure bank transfers with unique transaction
                codes. We never store your bank login details.
              </p>
              <p>
                <strong>Q: Can I cancel an order?</strong>
                <br />
                A: Orders can be cancelled before the seller confirms shipment.
                After confirmation, cancellation depends on the seller's policy.
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
                  "Updated contact information and support hours.",
                  "Added FAQ section for common inquiries.",
                ]}
              />
              <ChangelogItem
                version="v1.1.0"
                date="February 15, 2025"
                changes={[
                  "Expanded dispute resolution process.",
                  "Added returns and refunds policy.",
                ]}
              />
              <ChangelogItem
                version="v1.0.0"
                date="July 10, 2024"
                changes={["Initial publication of Support Center."]}
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
