"use client";

import LiteNavbar from "components/LiteNavbar";
import { motion } from "framer-motion";

export default function TermsOfService() {
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
          {/* Large gap simulating the screenshot's spacing */}
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
              Terms of Service
            </h2>

            <p style={{ ...paragraphStyle, marginBottom: "32px" }}>
              <strong>Effective Date:</strong> July 31, 2026
            </p>

            <p style={paragraphStyle}>
              By accessing and using Mori Prep, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our platform. These terms may be updated periodically, and
              your continued use constitutes acceptance of any changes.
            </p>
          </motion.div>

          {/* Sections matching the "12. Contact Us" styling from the second screenshot */}
          <div style={{ marginTop: "40px" }}>
            <Section variants={itemVariants} title="1. Acceptance of Terms">
              <p style={paragraphStyle}>
                By accessing and using Mori Prep, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our platform. These terms may be updated periodically,
                and your continued use constitutes acceptance of any changes.
              </p>
            </Section>

            <Section variants={itemVariants} title="2. User Responsibilities">
              <p style={paragraphStyle}>
                As a user of Mori Prep, you agree to:
              </p>
              <ul style={listStyle}>
                <li style={listItemStyle}>
                  Provide accurate and truthful information when creating your
                  account.
                </li>
                <li style={listItemStyle}>
                  Use the platform for educational purposes and personal SAT
                  preparation.
                </li>
                <li style={listItemStyle}>
                  Respect the intellectual property rights of our content and
                  materials.
                </li>
                <li style={listItemStyle}>
                  Maintain the security of your account and notify us
                  immediately of any unauthorized access.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="3. Content and Materials">
              <p style={paragraphStyle}>
                All content on Mori Prep, including practice questions,
                explanations, and study materials, is protected by copyright.
                You may not:
              </p>
              <ul style={listStyle}>
                <li style={listItemStyle}>
                  Copy, distribute, or reproduce our content without permission.
                </li>
                <li style={listItemStyle}>
                  Use automated tools to scrape or harvest data from our
                  platform.
                </li>
                <li style={listItemStyle}>
                  Attempt to reverse engineer or circumvent our security
                  measures.
                </li>
              </ul>
            </Section>

            <Section variants={itemVariants} title="4. Account Suspension">
              <p style={paragraphStyle}>
                We reserve the right to suspend or terminate your account if you
                violate these terms or engage in prohibited activities. Upon
                termination, your right to use the platform will immediately
                cease.
              </p>
            </Section>

            <Section variants={itemVariants} title="5. Limitation of Liability">
              <p style={paragraphStyle}>
                Mori Prep is provided "as is" without warranties of any kind. We
                are not liable for any indirect, incidental, or consequential
                damages arising from your use of the platform. Our total
                liability is limited to the amount you paid for the service, if
                any.
              </p>
            </Section>

            <Section variants={itemVariants} title="Changelog">
              <p style={{ ...paragraphStyle, marginBottom: "8px" }}>
                <strong>v1.0.0</strong> — July 31, 2026
              </p>
              <ul style={listStyle}>
                <li style={listItemStyle}>
                  Initial publication of Terms of Service.
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

// Styles matching the screenshots

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
