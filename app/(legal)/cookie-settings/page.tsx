"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function CookieSettings() {
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

  const [settings, setSettings] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    if (key === "necessary") return; // Necessary cookies cannot be disabled
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
              Cookie Settings
            </h1>
            <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
              Manage your cookie preferences to control how we collect data.
            </p>
          </motion.div>

          <div style={contentStyle}>
            <Section variants={itemVariants} title="1. Necessary Cookies">
              <p>
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
              <p>
                These cookies enable enhanced functionality and personalization,
                such as videos and live chats. They can be set by us or by
                third-party providers whose services we have added to our pages.
              </p>
              <CookieToggle
                label="Enabled"
                checked={settings.functional}
                onToggle={() => handleToggle("functional")}
              />
            </Section>

            <Section variants={itemVariants} title="3. Analytics Cookies">
              <p>
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
              <p>
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
                  // Save cookie preferences
                  console.log("Cookie preferences saved:", settings);
                  alert("Your cookie preferences have been saved.");
                }}
              >
                Save Preferences
              </button>
            </motion.div>
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
                  "Added granular cookie control options.",
                  "Improved cookie consent management UI.",
                ]}
              />
              <ChangelogItem
                version="v1.1.0"
                date="February 15, 2025"
                changes={[
                  "Updated cookie categories to comply with new regulations.",
                  "Added marketing cookie option.",
                ]}
              />
              <ChangelogItem
                version="v1.0.0"
                date="July 10, 2024"
                changes={["Initial publication of Cookie Settings."]}
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
