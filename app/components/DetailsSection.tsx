"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * "Details that matter." section.
 *
 * - Pure CSS animations with spring-like physics via styled-jsx.
 * - Hardware accelerated (translate3d) to eliminate layout jank.
 * - Skeletons and Visuals cross-fade gracefully.
 */

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

type Detail = {
  id: string;
  eyebrow: string;
  body: string;
};

const DETAILS: Detail[] = [
  {
    id: "monitor",
    eyebrow: "Track Your Progress in Real-Time",
    body: "See your accuracy, pacing, and weak spots update live as you practice — no waiting, no guesswork about where you stand.",
  },
  {
    id: "protect",
    eyebrow: "Never Miss a Weak Spot",
    body: "Get flagged the moment a topic or domain is dragging your score down, so you know exactly what to review next.",
  },
  {
    id: "organise",
    eyebrow: "Organize Your Practice",
    body: "Sort questions by domain, topic, or difficulty. Bookmark the ones you want to revisit, and clear out what you've already mastered.",
  },
  {
    id: "clarity",
    eyebrow: "See Everything Clearly",
    body: "One dashboard for every domain — Reading & Writing, Math, and your overall Bluebook-style readiness — with a clean breakdown of where you stand.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Root component                                                            */
/* -------------------------------------------------------------------------- */

export default function DetailsThatMatter() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Slightly longer load to admire the skeleton shimmer
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="details">
      <div className="details__inner">
        <div className="details__heading">
          <h1>Details that matter.</h1>
          <p className="details__subtitle">
            We sweat the details, no matter how small.
          </p>
        </div>

        <div className="details__list">
          {DETAILS.map((d) => (
            <div className="details__row" key={d.id}>
              <div className="details__panel">
                <div
                  className={`details__layer ${
                    loading
                      ? "details__layer--active"
                      : "details__layer--hidden"
                  }`}
                >
                  <PanelSkeleton kind={d.id} />
                </div>
                <div
                  className={`details__layer ${
                    !loading
                      ? "details__layer--active"
                      : "details__layer--hidden"
                  }`}
                >
                  <PanelVisual kind={d.id} />
                </div>
              </div>
              <div className="details__copy">
                <p className="details__eyebrow">{d.eyebrow}</p>
                <p className="details__body">{d.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .details {
          --blue: #3784f4;
          --green: #44c67f;
          --yellow: #febe44;
          --heading: #1a1a1a;
          --body: #57534e;
          --body-muted: #8a8785;
          --panel-bg: #f6f6f4;
          --card-bg: #ffffff;
          background: #fff;
          padding: 96px 24px;
          color: var(--body);
          font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
        }

        .details__inner {
          max-width: 1160px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          justify-items: center;
          border-top: 2px solid #f2f0ed;
          padding-top: 96px;
        }

        .details__heading {
          align-self: start;
          position: sticky;
          top: 96px;
          text-align: center;
        }

        h1 {
          margin: 0;
          font-size: 44px;
          line-height: 48px;
          letter-spacing: -1.35px;
          font-weight: 500;
          color: #121212;
        }

        .details__subtitle {
          margin: 16px 0 0;
          font-size: 19px;
          line-height: 27px;
          letter-spacing: -0.3px;
          color: #4a4a4a;
          max-width: 32ch;
        }

        .details__list {
          display: flex;
          flex-direction: column;
          gap: 88px;
          width: 100%;
          max-width: 440px;
        }

        .details__row {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .details__panel {
          position: relative;
          height: 240px;
          border-radius: 24px;
          background: var(--panel-bg);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
        }

        .details__layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .details__layer--hidden {
          opacity: 0;
          pointer-events: none;
          transform: scale(0.96) translate3d(0, 4px, 0);
        }

        .details__layer--active {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1) translate3d(0, 0, 0);
        }

        .details__eyebrow {
          margin: 0 0 8px;
          font-size: 15px;
          font-weight: 700;
          color: var(--blue);
        }

        .details__body {
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: var(--body);
        }

        @media (max-width: 860px) {
          .details {
            padding: 64px 20px;
          }
          .details__inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .details__heading {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Skeleton placeholder                                                      */
/* -------------------------------------------------------------------------- */

function PanelSkeleton({ kind }: { kind: string }) {
  return (
    <div className="skeleton" aria-hidden="true" role="presentation">
      {kind === "monitor" && (
        <div className="skeleton__card">
          <span className="sk-blob sk-blob--round" />
          <div className="sk-lines">
            <span className="sk-blob sk-line sk-line--sm" />
            <span className="sk-blob sk-line sk-line--md" />
          </div>
          <span className="sk-blob sk-line sk-line--tag" />
        </div>
      )}

      {kind === "protect" && (
        <div className="skeleton__stat">
          <div className="skeleton__stat-top">
            <div className="skeleton__stat-copy">
              <span className="sk-blob sk-stat-label" />
              <span className="sk-blob sk-stat-value" />
            </div>
            <span className="sk-blob sk-stat-chip" />
          </div>
          <span className="sk-blob sk-stat-chart" />
          <span className="sk-blob sk-stat-tabs" />
        </div>
      )}

      {kind === "organise" && (
        <div className="skeleton__list">
          <div className="skeleton__card">
            <span className="sk-blob sk-blob--round" />
            <div className="sk-lines">
              <span className="sk-blob sk-line sk-line--sm" />
              <span className="sk-blob sk-line sk-line--md" />
            </div>
            <span className="sk-blob sk-line sk-line--tag" />
          </div>
          <div className="skeleton__card">
            <span className="sk-blob sk-blob--round" />
            <div className="sk-lines">
              <span className="sk-blob sk-line sk-line--sm" />
              <span className="sk-blob sk-line sk-line--md" />
            </div>
            <span className="sk-blob sk-line sk-line--tag" />
          </div>
        </div>
      )}

      {kind === "clarity" && (
        <div className="skeleton__grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <span className="sk-blob sk-tile" key={i} />
          ))}
        </div>
      )}

      <style jsx>{`
        .skeleton {
          width: 100%;
          height: 100%;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sk-blob {
          position: relative;
          overflow: hidden;
          background: #e7e6e3;
          border-radius: 12px;
        }
        .sk-blob::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translate3d(-100%, 0, 0);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translate3d(100%, 0, 0);
          }
        }

        .skeleton__card {
          width: 100%;
          max-width: 320px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--card-bg);
          border-radius: 18px;
          padding: 14px 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        .sk-blob--round {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .sk-lines {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sk-line {
          height: 10px;
        }
        .sk-line--sm {
          width: 45%;
        }
        .sk-line--md {
          width: 70%;
        }
        .sk-line--tag {
          width: 48px;
          height: 18px;
          flex-shrink: 0;
        }

        .skeleton__stat {
          width: min(340px, 100%);
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(23, 24, 26, 0.07);
        }
        .skeleton__stat .sk-blob {
          background: #e7e6e3;
        }
        .skeleton__stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .skeleton__stat-copy {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .sk-stat-label {
          width: 76px;
          height: 8px;
        }
        .sk-stat-value {
          width: 92px;
          height: 28px;
        }
        .sk-stat-chip {
          width: 52px;
          height: 22px;
          border-radius: 999px;
        }
        .sk-stat-chart {
          width: 100%;
          height: 72px;
          border-radius: 8px;
        }
        .sk-stat-tabs {
          width: 100%;
          height: 31px;
          border-radius: 999px;
        }

        .skeleton__list {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton__grid {
          width: 100%;
          max-width: 320px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .sk-tile {
          height: 90px;
          border-radius: 14px;
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Real, animated visuals (Redesigned & Polished)                            */
/* -------------------------------------------------------------------------- */

function PanelVisual({ kind }: { kind: string }) {
  return (
    <div className="visual-wrap" aria-hidden="true" role="presentation">
      {kind === "monitor" && <MonitorVisual />}
      {kind === "protect" && <ProtectVisual />}
      {kind === "organise" && <OrganiseVisual />}
      {kind === "clarity" && <ClarityVisual />}

      <style jsx>{`
        .visual-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

/* ---- 1. Track Your Progress: Premium floating dashboard cards --- */

const STUDY_CARDS = [
  {
    id: 0,
    code: "INFO",
    gradient: "linear-gradient(135deg, #1e293b, #475569)",
    shadow: "rgba(30,41,59,0.3)",
    label: "Information & Ideas",
    amount: "85% accuracy",
  },
  {
    id: 1,
    code: "ALG",
    gradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
    shadow: "rgba(37,99,235,0.3)",
    label: "Algebra",
    amount: "92% accuracy",
  },
  {
    id: 2,
    code: "SEC",
    gradient: "linear-gradient(135deg, #d97706, #fbbf24)",
    shadow: "rgba(217,119,6,0.3)",
    label: "Standard English Conventions",
    amount: "78% accuracy",
  },
  {
    id: 3,
    code: "ADV",
    gradient: "linear-gradient(135deg, #ea580c, #fb923c)",
    shadow: "rgba(234,88,12,0.3)",
    label: "Advanced Math",
    amount: "88% accuracy",
  },
];

function MonitorVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % STUDY_CARDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="monitor">
      {STUDY_CARDS.map((card, i) => {
        const isCurrent = i === active;
        const isNext = i === (active + 1) % 4;
        const isNextNext = i === (active + 2) % 4;
        const isPrev = i === (active - 1 + 4) % 4;

        let y = 0,
          scale = 1,
          opacity = 1,
          zIndex = 0;

        if (isCurrent) {
          y = 0;
          scale = 1;
          opacity = 1;
          zIndex = 3;
        } else if (isNext) {
          y = 16;
          scale = 0.92;
          opacity = 0.85;
          zIndex = 2;
        } else if (isNextNext) {
          y = 32;
          scale = 0.84;
          opacity = 0;
          zIndex = 1;
        } else if (isPrev) {
          y = -32;
          scale = 1.08;
          opacity = 0;
          zIndex = 4;
        }

        return (
          <div
            className="monitor__card"
            key={card.id}
            style={{
              transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
              opacity,
              zIndex,
            }}
          >
            <span
              className="monitor__code"
              style={{
                background: card.gradient,
                boxShadow: `0 4px 12px ${card.shadow}`,
              }}
            >
              {card.code}
            </span>
            <div className="monitor__text">
              <span className="monitor__domain">{card.label}</span>
              <span className="monitor__label">{card.code}</span>
            </div>
            <span className="monitor__amount">{card.amount}</span>
          </div>
        );
      })}

      <style jsx>{`
        .monitor {
          position: relative;
          width: 100%;
          max-width: 320px;
          height: 74px;
        }
        .monitor__card {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          gap: 14px;
          background: #ffffff;
          border-radius: 20px;
          padding: 0 16px;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.03),
            0 12px 32px -8px rgba(0, 0, 0, 0.08);
          transition:
            transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.8s ease;
          will-change: transform, opacity;
        }
        .monitor__code {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
        }
        .monitor__text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .monitor__label {
          font-size: 12px;
          color: var(--blue, #3784f4);
          font-weight: 600;
          opacity: 0.9;
        }
        .monitor__domain {
          font-size: 15px;
          font-weight: 600;
          color: var(--heading, #1a1a1a);
        }
        .monitor__amount {
          margin-left: auto;
          font-size: 14px;
          font-weight: 600;
          color: var(--body-muted, #8a8785);
        }
      `}</style>
    </div>
  );
}

/* ---- 2. Correctness by subject: Animated stat card and trend chart ---- */

const CORRECTNESS_DOMAINS = [
  {
    label: "RW",
    score: 84.2,
    change: 5.3,
    points: [52, 58, 56, 60, 62, 60, 68, 66, 72, 76, 80, 84.2],
  },
  {
    label: "Math",
    score: 78.6,
    change: 3.8,
    points: [45, 50, 48, 54, 57, 55, 62, 60, 68, 70, 74, 78.6],
  },
  {
    label: "All",
    score: 81.4,
    change: 4.6,
    points: [49, 54, 52, 58, 60, 59, 65, 63, 70, 73, 77, 81.4],
  },
] as const;

function getCorrectnessChartPaths(values: readonly number[]) {
  const width = 300;
  const height = 76;
  const paddingX = 4;
  const paddingY = 6;
  const points = values.map((value, index) => ({
    x: paddingX + (index / (values.length - 1)) * (width - paddingX * 2),
    y: height - paddingY - (value / 100) * (height - paddingY * 2),
  }));
  const line = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y} ${controlX} ${point.y} ${point.x} ${point.y}`;
  }, "");

  return {
    line,
    area: `${line} L ${width - paddingX} ${height} L ${paddingX} ${height} Z`,
    lastPoint: points[points.length - 1],
  };
}

function ProtectVisual() {
  const [activeDomain, setActiveDomain] = useState(0);
  const reduceMotion = useReducedMotion();
  const pauseAutoAdvanceUntil = useRef(0);
  const scoreValue = useMotionValue<number>(CORRECTNESS_DOMAINS[0].score);
  const changeValue = useMotionValue<number>(CORRECTNESS_DOMAINS[0].change);
  const scoreText = useTransform(scoreValue, (value) => `${value.toFixed(1)}%`);
  const changeText = useTransform(
    changeValue,
    (value) => `+${value.toFixed(1)}%`,
  );
  const selected = CORRECTNESS_DOMAINS[activeDomain];
  const chartPaths = getCorrectnessChartPaths(selected.points);
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 180, damping: 28 };

  useEffect(() => {
    const options = {
      duration: reduceMotion ? 0 : 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    };
    const scoreAnimation = animate(scoreValue, selected.score, options);
    const changeAnimation = animate(changeValue, selected.change, options);

    return () => {
      scoreAnimation.stop();
      changeAnimation.stop();
    };
  }, [changeValue, reduceMotion, scoreValue, selected.change, selected.score]);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      if (Date.now() < pauseAutoAdvanceUntil.current) return;
      setActiveDomain((current) => (current + 1) % CORRECTNESS_DOMAINS.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const selectDomain = (index: number) => {
    pauseAutoAdvanceUntil.current = Date.now() + 8000;
    setActiveDomain(index);
  };

  return (
    <div className="correctness-stat">
      <div className="correctness-stat__top">
        <div>
          <p className="correctness-stat__label">Correctness</p>
          <div className="correctness-stat__value">
            <motion.span>{scoreText}</motion.span>
          </div>
        </div>
        <motion.span className="correctness-stat__change">
          {changeText}
        </motion.span>
      </div>

      <div className="correctness-stat__chart-wrap">
        <motion.svg
          className="correctness-stat__chart"
          viewBox="0 0 300 76"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="correctness-chart-area"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stopColor="#34d17a" stopOpacity=".32" />
              <stop offset="1" stopColor="#34d17a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            initial={false}
            animate={{ d: chartPaths.area }}
            transition={transition}
            fill="url(#correctness-chart-area)"
          />
          <motion.path
            initial={false}
            animate={{ d: chartPaths.line }}
            transition={transition}
            fill="none"
            stroke="#34d17a"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <motion.circle
            initial={false}
            animate={{
              cx: chartPaths.lastPoint.x,
              cy: chartPaths.lastPoint.y,
            }}
            transition={transition}
            r="4.5"
            fill="#34d17a"
          />
        </motion.svg>
      </div>

      <div
        className="correctness-stat__segments"
        role="group"
        aria-label="Correctness by subject"
      >
        <motion.span
          className="correctness-stat__pill"
          animate={{ x: `${activeDomain * 100}%` }}
          transition={transition}
        />
        {CORRECTNESS_DOMAINS.map((domain, index) => (
          <button
            key={domain.label}
            type="button"
            className={
              index === activeDomain
                ? "correctness-stat__button on"
                : "correctness-stat__button"
            }
            aria-pressed={index === activeDomain}
            tabIndex={-1}
            onClick={() => selectDomain(index)}
          >
            {domain.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .correctness-stat {
          width: min(340px, calc(100% - 48px));
          padding: 16px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid rgba(23, 24, 26, 0.08);
          box-shadow: 0 12px 32px -8px rgba(23, 24, 26, 0.1);
          color: #17181a;
          font-family: Inter, "Helvetica Neue", Arial, sans-serif;
        }
        .correctness-stat__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .correctness-stat__label {
          margin: 0;
          color: #6f6e68;
          font-size: 12px;
          line-height: 16px;
        }
        .correctness-stat__value {
          position: relative;
          height: 38px;
          overflow: hidden;
          font-size: 32px;
          font-weight: 600;
          line-height: 38px;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .correctness-stat :global(.correctness-stat__change) {
          padding: 4px 9px;
          border-radius: 999px;
          background: rgba(52, 209, 122, 0.14);
          color: #15803d;
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .correctness-stat__chart-wrap {
          margin: 8px 0;
        }
        .correctness-stat :global(.correctness-stat__chart) {
          display: block;
          width: 100%;
          height: 76px;
          overflow: visible;
        }
        .correctness-stat__segments {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          padding: 3px;
          border-radius: 999px;
          background: rgba(23, 24, 26, 0.04);
        }
        .correctness-stat__button {
          position: relative;
          z-index: 1;
          padding: 7px 0;
          border: 0;
          background: none;
          color: #6f6e68;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.35s ease;
        }
        .correctness-stat__button.on {
          color: #17181a;
        }
        .correctness-stat__segments :global(.correctness-stat__pill) {
          position: absolute;
          top: 3px;
          bottom: 3px;
          left: 3px;
          width: calc((100% - 6px) / 3);
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 1px 5px rgba(23, 24, 26, 0.12);
        }
      `}</style>
    </div>
  );
}

/* ---- 3. Organize Your Practice: Polished interactive rows ------ */

const QUESTIONS = [
  {
    name: "Algebra",
    sub: "45 questions",
    value: "88% avg",
    change: "+12%",
    gradient: "linear-gradient(135deg, #1e293b, #475569)",
    glyph: "A",
  },
  {
    name: "Grammar",
    sub: "32 questions",
    value: "76% avg",
    change: "+8%",
    gradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
    glyph: "G",
  },
];

function OrganiseVisual() {
  const [starred, setStarred] = useState<number | null>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStarred((s) => (s === 0 ? 1 : s === 1 ? null : 0));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="organise">
      {QUESTIONS.map((t, i) => (
        <div className="organise__row" key={t.name}>
          <span className="organise__code" style={{ background: t.gradient }}>
            {t.glyph}
          </span>
          <div className="organise__text">
            <span className="organise__name">{t.name}</span>
            <span className="organise__sub">{t.sub}</span>
          </div>
          <button
            type="button"
            className={`organise__star${
              starred === i ? " organise__star--on" : ""
            }`}
            aria-label={`Bookmark ${t.name}`}
            tabIndex={-1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5 15 9l7 1-5 5 1.4 7L12 18.5 5.6 22 7 15 2 10l7-1 3-6.5Z"
                fill={starred === i ? "#febe44" : "none"}
                stroke={starred === i ? "#febe44" : "#cbd5e1"}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="organise__figures">
            <span className="organise__value">{t.value}</span>
            <span className="organise__change">{t.change}</span>
          </div>
        </div>
      ))}

      <style jsx>{`
        .organise {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .organise__row {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #ffffff;
          border-radius: 20px;
          padding: 14px 18px;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.03),
            0 8px 20px -8px rgba(0, 0, 0, 0.05);
          transition:
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.4s ease;
        }
        .organise__row:hover {
          transform: translate3d(0, -3px, 0);
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.04),
            0 12px 24px -8px rgba(0, 0, 0, 0.08);
        }
        .organise__code {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
        }
        .organise__text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .organise__name {
          font-size: 15px;
          font-weight: 600;
          color: var(--heading, #1a1a1a);
        }
        .organise__sub {
          font-size: 13px;
          color: var(--body-muted, #8a8785);
          margin-top: 3px;
        }
        .organise__star {
          margin-left: auto;
          background: none;
          border: none;
          padding: 4px;
          display: flex;
          cursor: default;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .organise__star--on {
          transform: scale(1.25) rotate(-10deg);
          filter: drop-shadow(0 4px 8px rgba(254, 190, 68, 0.4));
        }
        .organise__star svg path {
          transition:
            fill 0.4s ease,
            stroke 0.4s ease;
        }
        .organise__figures {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.25;
          min-width: 64px;
        }
        .organise__value {
          font-size: 14px;
          font-weight: 600;
          color: var(--heading, #1a1a1a);
        }
        .organise__change {
          font-size: 12px;
          font-weight: 600;
          color: var(--green, #44c67f);
          margin-top: 3px;
        }
      `}</style>
    </div>
  );
}

/* ---- 4. See Everything Clearly: App-like widgets with soft background tints ---- */

const GROUPS = [
  {
    name: "Info & Ideas",
    count: "R&W domain",
    bg: "#eff6ff",
    color: "#2563eb",
  },
  {
    name: "Craft & Structure",
    count: "R&W domain",
    bg: "#f1f5f9",
    color: "#334155",
  },
  { name: "Expression", count: "R&W domain", bg: "#fef3c7", color: "#d97706" },
  { name: "Algebra", count: "Math domain", bg: "#ecfdf5", color: "#059669" },
  {
    name: "Advanced Math",
    count: "Math domain",
    bg: "#eff6ff",
    color: "#2563eb",
  },
  { name: "Geometry", count: "Math domain", bg: "#fff7ed", color: "#ea580c" },
];

function ClarityVisual() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => setVisible(true), 800);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="clarity">
      {GROUPS.map((g, i) => {
        const delay = visible ? i * 50 : (GROUPS.length - 1 - i) * 30;
        return (
          <div
            className={`clarity__tile ${
              visible ? "clarity__tile--in" : "clarity__tile--out"
            }`}
            key={g.name}
            style={{
              transitionDelay: `${delay}ms`,
              background: g.bg,
            }}
          >
            <span
              className="clarity__dot"
              style={{ background: g.color, boxShadow: `0 0 8px ${g.color}66` }}
            />
            <span className="clarity__name" style={{ color: g.color }}>
              {g.name}
            </span>
            <span className="clarity__count">{g.count}</span>
          </div>
        );
      })}

      <style jsx>{`
        .clarity {
          width: 100%;
          max-width: 320px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .clarity__tile {
          border-radius: 16px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border: 1px solid rgba(0, 0, 0, 0.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition:
            opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform, opacity;
          word-break: break-word;
        }
        .clarity__tile--out {
          opacity: 0;
          transform: translate3d(0, 10px, 0) scale(0.92);
        }
        .clarity__tile--in {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
        .clarity__dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-bottom: 2px;
        }
        .clarity__name {
          font-size: 13px;
          line-height: 1.25;
          font-weight: 700;
        }
        .clarity__count {
          font-size: 11px;
          color: var(--body-muted, #8a8785);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
