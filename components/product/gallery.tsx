// components/product/gallery.tsx
"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { GridTileImage } from "components/grid/tile";
import { AnimatePresence, motion } from "framer-motion";
import { ImageGeneration } from "img-fx";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Upgraded easing curve for a smoother, more premium feel
const smoothEase = [0.32, 0.72, 0, 1] as const;

// Enhanced variants with deeper blur and smoother scaling
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "15%" : "-15%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(12px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.4, ease: smoothEase },
      scale: { duration: 0.4, ease: smoothEase },
      filter: { duration: 0.4, ease: smoothEase },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "15%" : "-15%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(12px)",
    transition: {
      x: { type: "spring" as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.3, ease: smoothEase },
      scale: { duration: 0.3, ease: smoothEase },
      filter: { duration: 0.3, ease: smoothEase },
    },
  }),
};

// Stable wrapper: only remounts ImageGeneration when `src` actually changes.
const StableImageEffect = ({
  src,
  altText,
}: {
  src: string;
  altText: string;
}) => {
  const imagesRef = useRef<string[]>([src]);
  if (imagesRef.current[0] !== src) {
    imagesRef.current = [src];
  }

  return (
    <ImageGeneration
      preset="pixels-organic"
      images={imagesRef.current}
      autoReveal
      className="h-full w-full"
    >
      <div
        className="h-full w-full rounded-[2.5rem]"
        aria-label={altText}
        role="img"
      />
    </ImageGeneration>
  );
};

export function Gallery({
  images,
}: {
  images: { src: string; altText: string; scale?: number }[];
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [easterEggClicks, setEasterEggClicks] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [revealedSrcs, setRevealedSrcs] = useState<Set<string>>(new Set());

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isMobile) {
      setIsFullscreen((prev) => !prev);
    } else {
      if (!imageContainerRef.current) return;

      if (!document.fullscreenElement) {
        imageContainerRef.current.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`,
          );
        });
      } else {
        document.exitFullscreen();
      }
    }
  }, [isMobile]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      const next = ((index % images.length) + images.length) % images.length;
      setDirection(index > imageIndex ? 1 : -1);
      setImageIndex(next);
    },
    [imageIndex, images.length],
  );

  const currentSrc = images[imageIndex]?.src ?? "";
  const needsEffect = isMounted && !revealedSrcs.has(currentSrc);

  useEffect(() => {
    if (!needsEffect || !currentSrc) return;
    const id = setTimeout(() => {
      setRevealedSrcs((prev) => {
        if (prev.has(currentSrc)) return prev;
        const next = new Set(prev);
        next.add(currentSrc);
        return next;
      });
    }, 50);
    return () => clearTimeout(id);
  }, [currentSrc, needsEffect]);

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/5 hover:scale-110 active:scale-95";

  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div
        className="relative aspect-square w-full rounded-3xl bg-neutral-100"
        aria-hidden
      />
    );
  }

  const handleImageClick = () => {
    setEasterEggClicks((prev) => prev + 1);
    setTimeout(() => setEasterEggClicks(0), 2000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) goTo(nextImageIndex);
    else if (distance < -50) goTo(previousImageIndex);
  };

  return (
    <div className="w-full">
      {hasMultiple && (
        <div className="hidden" aria-hidden="true">
          <Image
            src={images[nextImageIndex]!.src}
            alt="preload-next"
            width={100}
            height={100}
            priority={true}
            fetchPriority="high"
          />
          <Image
            src={images[previousImageIndex]!.src}
            alt="preload-prev"
            width={100}
            height={100}
            priority={true}
            fetchPriority="high"
          />
        </div>
      )}

      {isMobile && isFullscreen && (
        <div className="fixed inset-0 z-[9998] bg-black flex flex-col">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Exit fullscreen"
            className="absolute top-5 right-5 z-[9999] flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex-1 overflow-y-auto snap-y snap-mandatory">
            {images.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="w-full snap-center flex items-center justify-center shrink-0"
              >
                <img
                  className="object-contain max-w-full max-h-full"
                  src={image.src}
                  alt={image.altText}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={clsx("flex gap-3", { "lg:flex-row lg:gap-5": hasMultiple })}
      >
        {hasMultiple ? (
          <ul className="hidden shrink-0 flex-col gap-3 lg:flex">
            {images.map((image, index) => {
              const isActive = index === imageIndex;
              return (
                <li key={`${image.src}-${index}`}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`View image ${index + 1} of ${images.length}`}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "relative h-[72px] w-[72px] overflow-hidden rounded-md transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isActive
                        ? "ring-2 ring-neutral-500 ring-offset-4 scale-105"
                        : "hover:scale-105 opacity-70 hover:opacity-100",
                    )}
                  >
                    <GridTileImage
                      alt={image.altText}
                      src={image.src}
                      width={72}
                      height={72}
                      active={isActive}
                      isInteractive={false}
                      className="h-full w-full object-cover"
                      scale={image.scale}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="min-w-0 flex-1">
          <motion.div
            ref={imageContainerRef}
            className={clsx(
              "relative w-full overflow-hidden bg-neutral-50 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] cursor-crosshair",
              isFullscreen
                ? "rounded-none h-full"
                : "aspect-square rounded-[2.5rem]",
            )}
            onClick={handleImageClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            animate={{
              rotateY: easterEggClicks >= 5 ? 360 : 0,
              scale: easterEggClicks >= 5 ? 0.8 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onAnimationComplete={() => {
              if (easterEggClicks >= 5) setEasterEggClicks(0);
            }}
          >
            {isMobile ? (
              <div className="absolute inset-0">
                {needsEffect ? (
                  <StableImageEffect
                    src={images[imageIndex]!.src}
                    altText={images[imageIndex]!.altText}
                  />
                ) : (
                  <Image
                    className={clsx(
                      "h-full w-full",
                      isFullscreen
                        ? "object-contain"
                        : "object-cover rounded-[2.5rem]",
                    )}
                    fill
                    sizes="(min-width: 1024px) 45vw, (min-width: 640px) 80vw, 100vw"
                    alt={images[imageIndex]!.altText}
                    src={images[imageIndex]!.src}
                    priority
                    quality={90}
                    style={{
                      padding: images[imageIndex]?.scale && images[imageIndex].scale > 1 
                        ? `${(1 - 1/images[imageIndex].scale) * 50}%` 
                        : undefined,
                    }}
                  />
                )}
              </div>
            ) : (
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.div
                  key={imageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  {needsEffect ? (
                    <StableImageEffect
                      src={images[imageIndex]!.src}
                      altText={images[imageIndex]!.altText}
                    />
                  ) : (
                    <Image
                      className={clsx(
                        "h-full w-full",
                        isFullscreen
                          ? "object-contain"
                          : "object-cover rounded-[2.5rem]",
                      )}
                      fill
                      sizes="(min-width: 1024px) 45vw, (min-width: 640px) 80vw, 100vw"
                      alt={images[imageIndex]!.altText}
                      src={images[imageIndex]!.src}
                      priority
                      quality={90}
                      style={{
                        padding: images[imageIndex]?.scale && images[imageIndex].scale > 1 
                          ? `${(1 - 1/images[imageIndex].scale) * 50}%` 
                          : undefined,
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {hasMultiple && (
              <>
                <Link
                  href="/"
                  className="lg:hidden absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-neutral-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25] transition-all hover:bg-white/80"
                >
                  <span className="text-base">←</span>
                  <span>Back</span>
                </Link>

                <div className="hidden lg:block absolute left-5 top-5 z-10 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold tabular-nums text-neutral-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25]">
                  {imageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Render fullscreen toggle and next/prev controls outside the hasMultiple check */}
            <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 rounded-full bg-white/70 p-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[24px] saturate-[1.25]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "View fullscreen"
                }
                className={buttonClassName}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </button>

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(previousImageIndex);
                    }}
                    aria-label="Previous product image"
                    className={buttonClassName}
                  >
                    <ArrowLeftIcon className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(nextImageIndex);
                    }}
                    aria-label="Next product image"
                    className={buttonClassName}
                  >
                    <ArrowRightIcon className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {hasMultiple ? (
            <ul className="mt-4 flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide lg:hidden">
              {images.map((image, index) => {
                const isActive = index === imageIndex;
                return (
                  <li
                    key={`${image.src}-${index}`}
                    className="h-20 w-20 shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      className={clsx(
                        "relative h-full w-full overflow-hidden rounded-2xl transition-all duration-300",
                        isActive
                          ? "ring-2 ring-neutral-900 ring-offset-2"
                          : "opacity-60",
                      )}
                    >
                      <GridTileImage
                        alt={image.altText}
                        src={image.src}
                        width={80}
                        height={80}
                        active={isActive}
                        isInteractive={false}
                        className="h-full w-full object-cover"
                        scale={image.scale}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
