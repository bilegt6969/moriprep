"use client";

import Navbar from "components/Heading/Navbar";
import Image, { ImageProps } from "next/image";
import { FC, ReactNode, useState } from "react";

// --- Custom Image with Skeleton ---

interface ImageWithSkeletonProps extends ImageProps {
  wrapperClassName?: string;
  skeletonClassName?: string;
}

const ImageWithSkeleton: FC<ImageWithSkeletonProps> = ({
  wrapperClassName = "",
  skeletonClassName = "",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div
      className={`relative ${props.fill ? "h-full w-full" : ""} ${wrapperClassName}`}
    >
      {/* Skeleton Pulse Layer — now also clears on error so it can't spin
          forever if the image 404s or otherwise fails to load. */}
      {!isLoaded && !isError && (
        <div
          className={`absolute inset-0 z-0 animate-pulse bg-gray-200 ${skeletonClassName}`}
          aria-hidden="true"
        />
      )}

      {/* Fallback shown when the image errors, instead of leaving a
          permanently-pulsing skeleton with nothing behind it. */}
      {isError && (
        <div
          className={`absolute inset-0 z-0 flex items-center justify-center bg-gray-100 text-gray-400 ${skeletonClassName}`}
          role="img"
          aria-label={props.alt || "Image failed to load"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M4 16l4.5-4.5a2 2 0 012.8 0L15 15l1.2-1.2a2 2 0 012.8 0L21 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Actual Image */}
      {!isError && (
        <Image
          {...props}
          className={`${props.className || ""} relative z-10 transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={(e) => {
            setIsLoaded(true);
            if (props.onLoad) props.onLoad(e);
          }}
          onError={(e) => {
            setIsError(true);
            if (props.onError) props.onError(e);
          }}
        />
      )}
    </div>
  );
};

// --- Shared Reusable Assets ---

const CheckIcon: FC<{ className?: string }> = ({
  className = "text-current",
}) => (
  <svg
    width="18"
    height="14"
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mt-[6px] min-w-[18px] ${className}`}
    aria-hidden="true"
  >
    <path
      d="M1 6.76191L6.33333 12L17 1"
      stroke="currentColor"
      strokeWidth="2.25"
    />
  </svg>
);

const PlayIcon: FC = () => (
  <svg
    width="26"
    height="28"
    viewBox="0 0 26 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute z-10 drop-shadow-md"
    aria-hidden="true"
  >
    <path
      d="M4 5.29857L4 18.7014C4 21.0333 6.54391 22.4736 8.54349 21.2739L19.7125 14.5725C21.6546 13.4073 21.6546 10.5927 19.7125 9.42752L8.54349 2.72609C6.54392 1.52635 4 2.96669 4 5.29857Z"
      fill="white"
    />
  </svg>
);

// --- Interface Definitions ---

interface ShowcaseProps {
  badge: string;
  badgeColorClass: string;
  title: ReactNode;
  description: string;
  bulletPoints: string[];
  demoTitle: string;
  demoSubtitle?: string;
  demoThumbnailSrc: string;
  videoSrc?: string;
  imageSrc: string;
  reversed?: boolean;
}

// --- Video with loading/error state ---
// Previously the video branch had no loading state at all (no skeleton,
// no fallback), unlike the image branch right next to it. This brings it
// in line: shows the poster area as a skeleton until the video reports it
// can play, and falls back to the poster image if the video errors.
const VideoWithSkeleton: FC<{ src: string; poster: string }> = ({
  src,
  poster,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isError, setIsError] = useState(false);

  if (isError) {
    return (
      <ImageWithSkeleton
        src={poster}
        alt="Video preview"
        width={1200}
        height={800}
        wrapperClassName="w-full"
        className="h-auto w-full object-cover"
        skeletonClassName="aspect-[4/3] w-full"
      />
    );
  }

  return (
    <div className="relative w-full">
      {!isReady && (
        <div
          className="absolute inset-0 z-0 animate-pulse bg-gray-200 aspect-[4/3] w-full"
          aria-hidden="true"
        />
      )}
      <video
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        className={`relative z-10 h-auto w-full object-cover transition-opacity duration-500 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        onCanPlay={() => setIsReady(true)}
        onError={() => setIsError(true)}
      />
    </div>
  );
};

// --- Reusable Showcase Section Component ---

export const FeatureShowcase: FC<ShowcaseProps> = ({
  badge,
  badgeColorClass,
  title,
  description,
  bulletPoints,
  demoTitle,
  demoSubtitle = "Watch the demo",
  demoThumbnailSrc,
  videoSrc = "",
  imageSrc,
  reversed = false,
}) => {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-y-16 px-4 py-12 md:grid-cols-2 md:gap-x-[5.75rem] md:px-6 lg:px-10 pt-12 border-t-2 border-[#f2f0ed]">
        {/* Text Content Column */}
        <div
          className={`flex flex-col gap-4 ${reversed ? "md:order-2" : "md:order-1"}`}
        >
          <p
            className={`text-[14px] font-semibold leading-[20px] tracking-[-0.09px] ${badgeColorClass}`}
          >
            {badge}
          </p>

          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[36px] font-medium leading-[1.1] tracking-[-1.35px] text-[#121212] md:text-[44px] md:leading-[48px]">
              {title}
            </h2>
            <p className="text-[17px] leading-[27px] tracking-[-0.3px] text-[#494440] md:text-[19px]">
              {description}
            </p>
          </div>

          <ul
            className={`m-0 flex flex-col gap-4 py-2 text-[#494440] ${badgeColorClass}`}
          >
            {bulletPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-[0.9375rem] whitespace-nowrap"
              >
                <CheckIcon />
                <span className="text-[17px] font-medium leading-[26px] tracking-[-0.22px] text-[#121212]">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* Watch Demo Button */}
          <button
            type="button"
            className="-ml-3 mt-2 flex w-fit items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <div className="relative flex items-center justify-center">
              <PlayIcon />
              <div className="relative h-[44px] w-[78px] overflow-hidden rounded-md bg-gray-100">
                <ImageWithSkeleton
                  src={demoThumbnailSrc}
                  alt={`${demoTitle} thumbnail`}
                  fill
                  // Explicit `sizes` — the previous version omitted this on a
                  // `fill` image, which makes Next.js fall back to serving
                  // the largest available image regardless of the ~78px
                  // rendered width (wasted bandwidth + a console warning).
                  sizes="78px"
                  className="object-cover"
                  skeletonClassName="rounded-md"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[3px]">
              <h3 className="text-[15px] font-semibold tracking-[-0.09px] text-[#121212]">
                {demoTitle}
              </h3>
              <span className="text-[14px] text-[#494440]/50">
                {demoSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Media / Gray Padded Container (Redesigned) */}
        <div
          className={`flex items-center justify-center ${reversed ? "md:order-1" : "md:order-2"}`}
        >
          <div className="relative flex w-full max-w-[700px] items-center justify-center">
            {/* Gray background padding with no shadows */}
            <div className="relative w-full rounded-[24px] bg-[#fafafa] p-2 sm:p-3 lg:p-4">
              {/* Inner image/video container with its own rounded corners */}
              <div className="relative w-full overflow-hidden rounded-[12px] bg-white">
                {videoSrc ? (
                  <VideoWithSkeleton src={videoSrc} poster={imageSrc} />
                ) : (
                  <ImageWithSkeleton
                    src={imageSrc}
                    alt="App interface preview"
                    width={1200}
                    height={800}
                    wrapperClassName="w-full"
                    className="h-auto w-full object-cover"
                    skeletonClassName="aspect-[4/3] w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main Showcase Section Component ---
//
// NOTE (not fixed here, needs a decision from you): DSATShowcase and the
// default-exported FeaturesPage below render the *same* two sections but
// point at different asset paths for what looks like the same images
// (`/assets/image.png` / `/assets/image copy.png` vs
// `/videos/promo-watch.png` / `/videos/promo-activity.png`). That's almost
// certainly a copy/paste leftover — whichever path doesn't actually exist
// in `public/` will silently fail to load (now at least shown as the
// fallback state above instead of hanging forever). Worth confirming which
// set of paths is the real one and deleting the other component.

export function DSATShowcase() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar siteName="mori Prep" categories={[]} showBanner={true} />
      {/* Question Bank Practice Section */}
      <FeatureShowcase
        badge="Practice"
        badgeColorClass="text-[#10B981]" // Tailwind Emerald-500
        title={
          <>
            Practice the domains{" "}
            <span className="text-[#10B981]">you care about.</span>
          </>
        }
        description="Filter thousands of official College Board DSAT practice questions by domain, topic, and difficulty to target your exact study needs."
        bulletPoints={[
          "All DSAT Domains",
          "Instant Explanations",
          "Bluebook-Style UI",
        ]}
        demoTitle="Question Bank Demo"
        demoThumbnailSrc="/assets/image.png"
        imageSrc="/assets/image.png"
        reversed={false}
      />

      {/* Performance Analytics Section */}
      <FeatureShowcase
        badge="Analytics"
        badgeColorClass="text-[#F97316]" // Tailwind Orange-500
        title={
          <>
            Test performance you{" "}
            <span className="text-[#F97316]">can understand.</span>
          </>
        }
        description="Clear domain accuracy breakdowns and real-time pacing metrics. No confusing test jargon—just instant clarity on what to review next."
        bulletPoints={[
          "Domain Accuracy Tracking",
          "Weak Spot Identification",
          "Real-Time Pacing Metrics",
        ]}
        demoTitle="Analytics Overview"
        demoThumbnailSrc="/assets/image copy.png"
        imageSrc="/assets/image copy.png"
        reversed={true}
      />
    </main>
  );
}

export default function FeaturesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Question Bank Practice Section */}
      <FeatureShowcase
        badge="Practice"
        badgeColorClass="text-[#10B981]" // Tailwind Emerald-500
        title={
          <>
            Practice the domains{" "}
            <span className="text-[#10B981]">you care about.</span>
          </>
        }
        description="Filter thousands of official College Board DSAT practice questions by domain, topic, and difficulty to target your exact study needs."
        bulletPoints={[
          "All DSAT Domains",
          "Instant Explanations",
          "Bluebook-Style UI",
        ]}
        demoTitle="Question Bank Demo"
        demoThumbnailSrc="/videos/promo-watch.png"
        imageSrc="/videos/promo-watch.png"
        reversed={false}
      />

      {/* Performance Analytics Section */}
      <FeatureShowcase
        badge="Analytics"
        badgeColorClass="text-[#F97316]" // Tailwind Orange-500
        title={
          <>
            Test performance you{" "}
            <span className="text-[#F97316]">can understand.</span>
          </>
        }
        description="Clear domain accuracy breakdowns and real-time pacing metrics. No confusing test jargon—just instant clarity on what to review next."
        bulletPoints={[
          "Domain Accuracy Tracking",
          "Weak Spot Identification",
          "Real-Time Pacing Metrics",
        ]}
        demoTitle="Analytics Overview"
        demoThumbnailSrc="/videos/promo-activity.png"
        imageSrc="/videos/promo-activity.png"
        reversed={true}
      />
    </main>
  );
}
