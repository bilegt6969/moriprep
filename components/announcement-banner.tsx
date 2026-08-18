"use client";

import { useRef, useState } from "react";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Create refs to target the exact running animations
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  // Smoothly alter the playback speed without recalculating the animation timeline
  const setPlaybackRate = (rate: number) => {
    [track1Ref, track2Ref].forEach((track) => {
      track.current?.getAnimations().forEach((anim) => {
        anim.playbackRate = rate;
      });
    });
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 font-sans select-none">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee-track {
          animation: marquee-scroll 12s linear infinite;
          will-change: transform;
        }
        .text-mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15px, black calc(100% - 15px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 15px, black calc(100% - 15px), transparent 100%);
        }
      `,
        }}
      />

      {/* Main Glassmorphism Banner */}
      <a
        href="/join"
        onMouseEnter={() => setPlaybackRate(0.25)} // Slows down to 25% speed
        onMouseLeave={() => setPlaybackRate(1)} // Returns to normal speed
        className="group relative flex h-[25px] w-[280px] cursor-pointer items-center rounded-full border border-white/20 bg-[#007AFF] pl-2.5 pr-2 shadow-[0_8px_32px_0_rgba(0,122,255,0.2)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[0.96] hover:bg-[#007AFF]/80 active:scale-[0.94]"
      >
        {/* Isolated Marquee Mask */}
        <div className="text-mask-edges relative mr-1.5 flex h-full flex-1 items-center overflow-hidden">
          {/* TRACK 1 */}
          <div
            ref={track1Ref}
            className="animate-marquee-track flex shrink-0 items-center text-[10px] tracking-wide text-white"
          >
            <div className="flex shrink-0 items-center pr-4">
              <span className="font-medium opacity-90">
                Nonprofit Edu initiative
              </span>
              <span className="ml-4 font-semibold opacity-100">
                we need volunteers!
              </span>
            </div>
            <div className="flex shrink-0 items-center pr-4">
              <span className="font-medium opacity-90">
                Nonprofit Edu initiative
              </span>
              <span className="ml-4 font-semibold opacity-100">
                we need volunteers!
              </span>
            </div>
            <div className="flex shrink-0 items-center pr-4">
              <span className="font-medium opacity-90">
                Nonprofit Edu initiative
              </span>
              <span className="ml-4 font-semibold opacity-100">
                we need volunteers!
              </span>
            </div>
          </div>

          {/* TRACK 2 */}
          <div
            ref={track2Ref}
            aria-hidden="true"
            className="animate-marquee-track flex shrink-0 items-center text-[10px] tracking-wide text-white"
          >
            <div className="flex shrink-0 items-center pr-4">
              <span className="font-medium opacity-90">
                Nonprofit Edu initiative
              </span>
              <span className="ml-4 font-semibold opacity-100">
                we need volunteers!
              </span>
            </div>
            <div className="flex shrink-0 items-center pr-4">
              <span className="font-medium opacity-90">
                Nonprofit Edu initiative
              </span>
              <span className="ml-4 font-semibold opacity-100">
                we need volunteers!
              </span>
            </div>
            <div className="flex shrink-0 items-center pr-4">
              <span className="font-medium opacity-90">
                Nonprofit Edu initiative
              </span>
              <span className="ml-4 font-semibold opacity-100">
                we need volunteers!
              </span>
            </div>
          </div>
        </div>

        {/* 45-Degree Animated Arrow */}
        <div className="flex shrink-0 items-center justify-center">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
      </a>

      {/* Frosted Glass Close Island */}
      <button
        onClick={() => setIsVisible(false)}
        aria-label="Close banner"
        className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full border border-neutral-200/50 bg-[#F5F5F5]/60 text-neutral-500 shadow-sm backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[0.96] hover:bg-[#E5E5E5]/70 hover:text-neutral-800 active:scale-[0.92]"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
