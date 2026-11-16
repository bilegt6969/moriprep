"use client";

import type { DSATQuestion } from "@/types/dsat";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useMemo } from "react";

type PassageContentProps = {
  question: DSATQuestion;
  imageZoomLevels?: Record<number, number>;
  onAdjustImageZoom?: (index: number, delta: number) => void;
};

export default function PassageContent({
  question,
  imageZoomLevels = {},
  onAdjustImageZoom,
}: PassageContentProps) {
  const passage = useMemo(() => {
    if (!question.passage) return null;

    let htmlContent = question.passage;
    if (question.has_underline && question.underlined_text) {
      htmlContent = htmlContent.replace(
        question.underlined_text,
        `<u class="bg-gray-200 px-1">${question.underlined_text}</u>`,
      );
    }

    if (htmlContent.includes("Text 1") && htmlContent.includes("Text 2")) {
      const parts = htmlContent.split("Text 2");
      const text1Part = parts[0].replace(
        "Text 1",
        "<strong>Text 1</strong><br><br>",
      );
      const text2Part = parts[1]
        ? `<br><br><strong>Text 2</strong><br><br>${parts[1]}`
        : "";
      htmlContent = text1Part + text2Part;
    }

    return (
      <>
        {question.introduction && (
          <div
            className="mb-6 text-[17px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 sm:text-[19px] font-serif"
            dangerouslySetInnerHTML={{ __html: question.introduction }}
          />
        )}
        <div
          className={`mb-6 text-[17px] leading-[1.7] text-[#1C1C1E] dark:text-gray-100 sm:text-[19px] font-serif ${question.introduction ? "pl-12" : ""}`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </>
    );
  }, [
    question.passage,
    question.introduction,
    question.has_underline,
    question.underlined_text,
  ]);

  return (
    <>
      {question.has_graphic && question.graphics.length > 0 && (
        <div className="my-4">
          {question.graphics.map((graphic, index) => {
            const zoom = imageZoomLevels[index] ?? 100;
            const imagePath =
              typeof graphic === "object" && graphic !== null
                ? graphic.image_path
                : undefined;

            return (
              <div key={index} className="mb-6 flex items-start gap-3">
                {imagePath && (
                  <div className="min-w-0 flex-1 overflow-auto">
                    <img
                      src={`/questions_charts/${imagePath.split("/").pop()}`}
                      alt="Question graphic"
                      style={{ width: `${zoom}%` }}
                      className="h-auto rounded-lg border border-gray-200 transition-[width] duration-150"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                {onAdjustImageZoom && (
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onAdjustImageZoom(index, 20)}
                      disabled={zoom >= 200}
                      aria-label="Zoom in"
                      className="flex size-9 items-center justify-center rounded-full border-2 border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ZoomIn size={16} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustImageZoom(index, -20)}
                      disabled={zoom <= 50}
                      aria-label="Zoom out"
                      className="flex size-9 items-center justify-center rounded-full border-2 border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ZoomOut size={16} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {passage}
    </>
  );
}
