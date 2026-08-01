"use client";

import LiteNavbar from "components/LiteNavbar";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CookiePolicy() {
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

  const [settings, setSettings] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    if (key === "necessary") return;
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
              Cookie Policy
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
              Manage your cookie preferences to control how we collect data.
            </p>
          </motion.div>

          <div style={{ marginTop: "40px" }}>
            <Section variants={itemVariants} title="1. Necessary Cookies">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                These cookies are essential for the website to function
                properly. They enable core functionality such as security,
                network management, and accessibility. You cannot disable these
                cookies.
              </p>
              <CookieToggle
                label="Required"
                checked={settings.necessary}
                disabled={true}
              />
            </Section>

            <Section variants={itemVariants} title="2. Functional Cookies">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                These cookies enable enhanced functionality and personalization,
                such as remembering your preferences and progress. They can be
                set by us or by third-party providers whose services we have
                added to our pages.
              </p>
              <CookieToggle
                label="Enabled"
                checked={settings.functional}
                onToggle={() => handleToggle("functional")}
              />
            </Section>

            <Section variants={itemVariants} title="3. Analytics Cookies">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                These cookies allow us to count visits and traffic sources so we
                can measure and improve the performance of our site. They help
                us understand which pages are the most and least popular and see
                how visitors move around the site.
              </p>
              <CookieToggle
                label="Enabled"
                checked={settings.analytics}
                onToggle={() => handleToggle("analytics")}
              />
            </Section>

            <Section variants={itemVariants} title="4. Marketing Cookies">
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#333",
                  margin: "0 0 16px 0",
                }}
              >
                These cookies may be set through our site by our advertising
                partners. They may be used by those companies to build a profile
                of your interests and show you relevant adverts on other sites.
              </p>
              <CookieToggle
                label="Enabled"
                checked={settings.marketing}
                onToggle={() => handleToggle("marketing")}
              />
            </Section>

            <motion.div variants={itemVariants}>
              <button
                style={{
                  width: "100%",
                  padding: "16px 32px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#111",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#333";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111";
                }}
                onClick={() => {
                  console.log("Cookie preferences saved:", settings);
                  alert("Your cookie preferences have been saved.");
                }}
              >
                Save Preferences
              </button>
            </motion.div>
          </div>

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
                Initial publication of Cookie Policy.
              </li>
            </ul>
          </Section>
        </motion.div>
      </div>
    </div>
  );
}

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

function CookieToggle({
  label,
  checked,
  onToggle,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: disabled ? "#f5f5f7" : "#fff",
        border: "1px solid #e5e5e7",
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "#d1d1d6";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e5e7";
      }}
    >
      <div
        style={{
          width: 44,
          height: 24,
          background: checked ? "#34c759" : "#e5e5e7",
          borderRadius: 12,
          position: "relative",
          transition: "background 0.2s ease",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: 2,
            left: checked ? 22 : 2,
            transition: "left 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>
        {label}
      </span>
    </button>
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
