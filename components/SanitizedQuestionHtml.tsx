"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

const MATHML_SVG_TAGS = [
  "math",
  "mrow",
  "mi",
  "mn",
  "mo",
  "mfrac",
  "mfenced",
  "msup",
  "msub",
  "msubsup",
  "msqrt",
  "mroot",
  "mstyle",
  "mtext",
  "mspace",
  "mtable",
  "mtr",
  "mtd",
  "munder",
  "mover",
  "munderover",
  "menclose",
  "semantics",
  "annotation",
  "svg",
  "g",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
  "text",
  "tspan",
  "defs",
  "clipPath",
  "marker",
  "title",
  "desc",
  "symbol",
  "use",
  "linearGradient",
  "radialGradient",
  "stop",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const MATHML_SVG_ATTRIBUTES = [
  "alt",
  "alttext",
  "class",
  "src",
  "bevelled",
  "displaystyle",
  "xmlns",
  "xmlns:xlink",
  "viewBox",
  "preserveAspectRatio",
  "version",
  "d",
  "fill",
  "stroke",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-width",
  "points",
  "cx",
  "cy",
  "r",
  "x",
  "y",
  "width",
  "height",
  "transform",
  "clip-path",
  "font-size",
  "text-anchor",
  "offset",
  "stop-color",
  "xlink:href",
];

const RICH_CONTENT_CLASSES = [
  "[&_img.math-img]:inline-block",
  "[&_img.math-img]:h-auto",
  "[&_img.math-img]:max-h-[6em]",
  "[&_img.math-img]:max-w-full",
  "[&_img.math-img]:align-middle",
  "[&_table]:my-2",
  "[&_table]:border-collapse",
  "[&_td]:border",
  "[&_td]:px-2",
  "[&_td]:py-1",
  "[&_th]:border",
  "[&_th]:px-2",
  "[&_th]:py-1",
  "[&_th]:font-semibold",
].join(" ");

interface SanitizedQuestionHtmlProps {
  html: string;
  className?: string;
}

export function SanitizedQuestionHtml({
  html,
  className,
}: SanitizedQuestionHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    setSanitizedHtml(
      DOMPurify.sanitize(html, {
        ADD_TAGS: MATHML_SVG_TAGS,
        ADD_ATTR: MATHML_SVG_ATTRIBUTES,
        RETURN_TRUSTED_TYPE: false,
      }),
    );
  }, [html]);

  return (
    <div
      className={[RICH_CONTENT_CLASSES, className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
