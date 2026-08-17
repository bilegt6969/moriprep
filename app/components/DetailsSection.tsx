"use client";

import { useEffect, useState } from "react";

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

      {kind === "protect" && <span className="sk-blob sk-pill" />}

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

        .sk-pill {
          width: 190px;
          height: 48px;
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
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .sk-tile {
          aspect-ratio: 1;
          border-radius: 16px;
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Real, animated visuals                                                    */
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

/* ---- 1. Track Your Progress: A 4-state infinite card stack with physical departures --- */

// Added a 4th card to make the bottom-entry rotation buttery smooth
const STUDY_CARDS = [
  {
    id: 0,
    code: "INFO",
    color: "#25292E",
    label: "Information & Ideas",
    amount: "85% accuracy",
  },
  {
    id: 1,
    code: "ALG",
    color: "#2775CA",
    label: "Algebra",
    amount: "92% accuracy",
  },
  {
    id: 2,
    code: "SEC",
    color: "#FEBE44",
    label: "Standard English Conventions",
    amount: "78% accuracy",
  },
  {
    id: 3,
    code: "ADV",
    color: "#F7931A",
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

        // Assign spring-like physics states based on position in queue
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
          y = 14;
          scale = 0.93;
          opacity = 0.8;
          zIndex = 2;
        } else if (isNextNext) {
          y = 28;
          scale = 0.86;
          opacity = 0;
          zIndex = 1;
        } else if (isPrev) {
          y = -28;
          scale = 1.05;
          opacity = 0;
          zIndex = 4; // Flies up and out!
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
            <span className="monitor__code" style={{ background: card.color }}>
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
          gap: 12px;
          background: var(--card-bg, #fff);
          border-radius: 18px;
          padding: 0 16px;
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.06),
            0 2px 6px rgba(0, 0, 0, 0.04);
          /* Premium spring transition */
          transition:
            transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.7s ease;
          will-change: transform, opacity;
        }
        .monitor__code {
          width: 36px;
          height: 36px;
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

/* ---- 2. Never Miss a Weak Spot: Seamless width & text slot-machine morph ---- */

function ProtectVisual() {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setComplete(false);
      const toComplete = setTimeout(() => setComplete(true), 1800);
      return toComplete;
    };
    let inner = cycle();
    const id = setInterval(() => {
      clearTimeout(inner);
      inner = cycle();
    }, 4000);
    return () => {
      clearInterval(id);
      clearTimeout(inner);
    };
  }, []);

  return (
    <div className="analysis">
      <div
        className={`analysis__pill${complete ? " analysis__pill--complete" : ""}`}
        style={{ width: complete ? "185px" : "220px" }}
      >
        <div className="analysis__icon-wrap">
          <span className={`analysis__spinner ${complete ? "hidden" : ""}`} />
          <svg
            className={`analysis__check ${!complete ? "hidden" : ""}`}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M2.5 7.3 5.6 10.4 11.5 3.6"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="analysis__text-wrap">
          <span
            className={`analysis__label analysis__label--analyzing ${
              complete ? "hidden" : ""
            }`}
          >
            Analyzing Weak Spots
          </span>
          <span
            className={`analysis__label analysis__label--complete ${
              !complete ? "hidden" : ""
            }`}
          >
            No Weak Spots Missed
          </span>
        </div>
      </div>

      <style jsx>{`
        .analysis {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .analysis__pill {
          position: relative;
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 14px;
          border-radius: 999px;
          background: rgba(55, 132, 244, 0.12);
          overflow: hidden;
          /* Smoothly animate the hardcoded width */
          transition:
            width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
            background 0.7s ease;
        }
        .analysis__pill--complete {
          background: rgba(68, 198, 127, 0.14);
        }
        .analysis__icon-wrap {
          position: relative;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--blue, #3784f4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition:
            background 0.7s ease,
            transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .analysis__pill--complete .analysis__icon-wrap {
          background: var(--green, #44c67f);
          transform: scale(1.1);
        }
        .analysis__spinner {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
          transition: opacity 0.4s ease;
        }
        .analysis__spinner.hidden {
          opacity: 0;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .analysis__check {
          position: absolute;
          transition:
            transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.4s ease;
        }
        .analysis__check.hidden {
          opacity: 0;
          transform: scale(0.4) rotate(-45deg);
        }
        .analysis__text-wrap {
          position: relative;
          flex: 1;
          height: 20px;
          margin-left: 10px;
        }
        .analysis__label {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 15px;
          font-weight: 600;
          white-space: nowrap;
          transition:
            opacity 0.5s ease,
            transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .analysis__label--analyzing {
          color: var(--blue, #3784f4);
          transform: translate3d(0, 0, 0);
        }
        /* Slot machine sliding effect */
        .analysis__label--analyzing.hidden {
          opacity: 0;
          transform: translate3d(0, -12px, 0);
        }
        .analysis__label--complete {
          color: var(--green, #44c67f);
          transform: translate3d(0, 0, 0);
        }
        .analysis__label--complete.hidden {
          opacity: 0;
          transform: translate3d(0, 12px, 0);
        }
      `}</style>
    </div>
  );
}

/* ---- 3. Organize Your Practice: Question rows with bouncy sequenced bookmarks ------ */

const QUESTIONS = [
  {
    name: "Algebra",
    sub: "45 questions",
    value: "88% avg",
    change: "+12%",
    color: "#25292E",
    glyph: "A",
  },
  {
    name: "Grammar",
    sub: "32 questions",
    value: "76% avg",
    change: "+8%",
    color: "#2775CA",
    glyph: "G",
  },
];

function OrganiseVisual() {
  const [starred, setStarred] = useState<number | null>(0);

  useEffect(() => {
    const id = setInterval(() => {
      // Toggle down the list smoothly
      setStarred((s) => (s === 0 ? 1 : s === 1 ? null : 0));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="organise">
      {QUESTIONS.map((t, i) => (
        <div className="organise__row" key={t.name}>
          <span className="organise__code" style={{ background: t.color }}>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5 15 9l7 1-5 5 1.4 7L12 18.5 5.6 22 7 15 2 10l7-1 3-6.5Z"
                fill={starred === i ? "#febe44" : "none"}
                stroke={starred === i ? "#febe44" : "#c7c5c2"}
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
          gap: 12px;
        }
        .organise__row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--card-bg, #fff);
          border-radius: 18px;
          padding: 12px 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          transition: transform 0.3s ease;
        }
        .organise__row:hover {
          transform: translate3d(0, -2px, 0);
        }
        .organise__code {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
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
          margin-top: 2px;
        }
        .organise__star {
          margin-left: auto;
          background: none;
          border: none;
          padding: 4px;
          display: flex;
          cursor: default;
          /* Extremely bouncy star */
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .organise__star--on {
          transform: scale(1.3) rotate(-12deg);
        }
        .organise__star svg path {
          transition:
            fill 0.3s ease,
            stroke 0.3s ease;
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
          color: var(--green, #44c67f);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}

/* ---- 4. See Everything Clearly: Staggered breathing domain tiles ---------------- */

const GROUPS = [
  { name: "Info & Ideas", count: "R&W domain", color: "var(--blue)" },
  { name: "Craft & Structure", count: "R&W domain", color: "#25292E" },
  { name: "Expression", count: "R&W domain", color: "var(--yellow)" },
  { name: "Algebra", count: "Math domain", color: "var(--green)" },
  { name: "Advanced Math", count: "Math domain", color: "#2775CA" },
  { name: "Geometry", count: "Math domain", color: "#F7931A" },
];

function ClarityVisual() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      // Allow them to waterfall out, then waterfall back in
      setVisible(false);
      setTimeout(() => setVisible(true), 800);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="clarity">
      {GROUPS.map((g, i) => {
        // Stagger in forwards, stagger out backwards
        const delay = visible ? i * 50 : (GROUPS.length - 1 - i) * 30;
        return (
          <div
            className={`clarity__tile ${
              visible ? "clarity__tile--in" : "clarity__tile--out"
            }`}
            key={g.name}
            style={{ transitionDelay: `${delay}ms` }}
          >
            <span className="clarity__dot" style={{ background: g.color }} />
            <span className="clarity__name">{g.name}</span>
            <span className="clarity__count">{g.count}</span>
          </div>
        );
      })}

      <style jsx>{`
        .clarity {
          width: 100%;
          max-width: 320px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .clarity__tile {
          background: var(--card-bg, #fff);
          border-radius: 16px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          /* Physics for the waterfall effect */
          transition:
            opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform, opacity;
        }
        .clarity__tile--out {
          opacity: 0;
          transform: translate3d(0, 8px, 0) scale(0.92);
        }
        .clarity__tile--in {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
        .clarity__dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
        }
        .clarity__name {
          font-size: 14px;
          font-weight: 600;
          color: var(--heading, #1a1a1a);
          margin-top: 4px;
        }
        .clarity__count {
          font-size: 12px;
          color: var(--body-muted, #8a8785);
        }
      `}</style>
    </div>
  );
}
