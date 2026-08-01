"use client";

import LiteNavbar from "components/LiteNavbar";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
    hidden: { y: 16, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease },
    },
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#ffffff",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#111",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LiteNavbar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          padding: "56px 24px",
          overflowY: "auto",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} style={{ marginTop: "64px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                margin: "0 0 24px 0",
                color: "#000",
              }}
            >
              Privacy Policy
            </h2>

            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#333",
                margin: "0 0 32px 0",
              }}
            >
              <strong>Effective Date:</strong> July 31, 2026
            </p>

            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#333",
                margin: "0 0 16px 0",
              }}
            >
              When you interact with our platform, we collect information that
              helps us facilitate your SAT preparation. This includes your
              contact details (name, email), learning progress, and practice
              test history.
            </p>
          </motion.div>

          <div style={{ marginTop: "40px" }}>
            <Section variants={itemVariants} title="1. Information We Collect">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                When you interact with our platform, we collect information that
                helps us facilitate your SAT preparation. This includes your
                contact details (name, email), learning progress, and practice
                test history.
              </p>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                We do not store sensitive financial information on our servers;
                all payments are processed through secure third-party payment
                processors.
              </p>
            </Section>

            <Section variants={itemVariants} title="2. How We Use Your Data">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                Your data is utilized strictly to:
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "24px" }}>
                <li
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  Track your learning progress and provide personalized
                  recommendations.
                </li>
                <li
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  Generate practice tests and analyze your performance.
                </li>
                <li
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  Improve our platform's features and user experience.
                </li>
                <li
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  Send you relevant updates about your SAT preparation journey.
                </li>
              </ul>
            </Section>

            <Section
              variants={itemVariants}
              title="3. Data Sharing & Disclosure"
            >
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                We value your privacy. We do not sell your personal data to
                third parties. Information is only shared with trusted service
                providers necessary to operate our platform or when legally
                required.
              </p>
            </Section>

            <Section variants={itemVariants} title="4. Your Rights">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                You have the right to access, modify, or delete your personal
                information at any time. If you wish to manage your data or
                delete your account, please contact our support team.
              </p>
            </Section>

            <Section variants={itemVariants} title="Changelog">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 8px 0",
                }}
              >
                <strong>v1.0.0</strong> — July 31, 2026
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "24px" }}>
                <li
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  Initial publication of the Privacy Policy.
                </li>
              </ul>
            </Section>
          </div>
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
    <motion.div
      variants={variants}
      style={{ marginTop: "40px", marginBottom: "40px" }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          margin: "0 0 16px 0",
          color: "#000",
        }}
      >
        {title}
      </h3>
      <div>{children}</div>
    </motion.div>
  );
}

// Styles

const paragraphStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.6,
  color: "#333",
  margin: "0 0 16px 0",
};

const listStyle: React.CSSProperties = {
  margin: "0 0 16px 0",
  paddingLeft: "24px",
};

const listItemStyle: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.6,
  color: "#333",
  marginBottom: "8px",
};
