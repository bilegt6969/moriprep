"use client";

import React from "react";
import { MathExpression, Figure } from "@/types/dsat";

const TOKEN_RE = /⟦(MATH|FIG):([A-Za-z0-9_]+)⟧/g;
const ASSET_BASE = "/";

function inlineHeightEm(displayEm?: number | null): number {
  if (!displayEm || displayEm <= 0) return 1;
  const scaled = displayEm / 0.32;
  return Math.min(Math.max(scaled, 0.85), 4.5);
}

function isDisplayBlock(displayEm?: number | null): boolean {
  return (displayEm ?? 0) >= 0.9;
}

function renderMathMarkup(text: string, key: number): React.ReactNode {
  const parts = text.split(/\^\(([^)]*)\)/g);
  return (
    <span key={key} className="font-serif italic">
      {parts.map((part, i) =>
        i % 2 === 1 ? <sup key={i}>{part}</sup> : <React.Fragment key={i}>{part}</React.Fragment>
      )}
    </span>
  );
}

interface MathTextProps {
  text: string | null | undefined;
  mathExpressions?: MathExpression[];
  figures?: Figure[];
}

export function MathText({
  text,
  mathExpressions = [],
  figures = [],
}: MathTextProps) {
  if (!text) return null;

  const mathById = new Map(mathExpressions.map((m) => [m.id, m]));
  const figById = new Map(figures.map((f) => [f.id, f]));
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0,
    key = 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [, kind, id] = match;
    const item = kind === "MATH" ? mathById.get(id) : figById.get(id);

    if (item?.text && kind === "MATH" && !isDisplayBlock(item.display_em)) {
      nodes.push(renderMathMarkup(item.text, key++));
    } else if (item?.image_path) {
      const src = `${ASSET_BASE}${item.image_path}`;
      const aspect =
        item.width_pt && item.height_pt ? item.width_pt / item.height_pt : undefined;

      if (kind === "FIG" || isDisplayBlock(item.display_em)) {
        nodes.push(
          <span key={key++} className="my-4 flex justify-center">
            <img
              src={src}
              alt=""
              className="h-auto max-w-full"
              style={{ maxHeight: kind === "FIG" ? "22rem" : "6rem" }}
            />
          </span>
        );
      } else {
        const h = inlineHeightEm(item.display_em);
        nodes.push(
          <img
            key={key++}
            src={src}
            alt=""
            className="inline-block align-middle"
            style={{
              height: `${h}em`,
              width: aspect ? `${h * aspect}em` : "auto",
              margin: "0 0.15em",
            }}
          />
        );
      }
    } else {
      nodes.push(
        <span key={key++} className="text-gray-400">
          [{kind.toLowerCase()}]
        </span>
      );
    }

    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes}</>;
}
