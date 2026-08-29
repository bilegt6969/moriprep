"use client";

import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";

// Dynamic blog data for Mori Prep / Bytecode initiatives
const BLOG_POSTS = [
  {
    slug: "closing-dsat-information-gap",
    title: "Closing the DSAT Information Gap in Mongolia",
    date: "13 May, 2026",
    excerpt:
      "Why Bytecode built Mori Prep as a non-profit open education initiative to ensure that financial status never stands between a Mongolian student and world-class higher education. We are bringing structured test prep, open lessons, and strategy guides to everyone for free.",
    image: "/blog/closing-gap.png",
  },
  {
    slug: "integrating-college-board-question-bank",
    title: "Integrating the Official College Board Question Bank",
    date: "2 April, 2026",
    excerpt:
      "How we brought thousands of official Digital SAT practice questions, multi-stage adaptive testing logic, and curated prep resources under one seamless, 100% free dashboard built for student success.",
    image: "/blog/collegeboard.png",
  },
];

// Same skeleton/error pattern as ImageWithSkeleton in FeatureShowcase and
// MockupImage in SendReceiveSwap: pulse while loading, graceful fallback
// (instead of a silent broken-image box) if the post's cover image 404s.
const BlogCoverImage: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-[#FBFAF9] rounded-xl mb-[5px] z-10 aspect-[2160/1140]">
      {!isLoaded && !isError && (
        <div
          className="absolute inset-0 z-0 animate-pulse bg-gray-200"
          aria-hidden="true"
        />
      )}

      {isError && (
        <div
          className="absolute inset-0 z-0 flex items-center justify-center bg-gray-100 text-gray-400"
          role="img"
          aria-label={`${alt} failed to load`}
        >
          <svg
            width="28"
            height="28"
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

      {!isError && (
        <Image
          src={src}
          alt={alt}
          fill
          // Missing previously — with `fill` and no `sizes`, Next.js serves
          // the largest configured image size regardless of the actual
          // rendered card width (roughly half the container on desktop,
          // full width on mobile).
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-transform duration-[220ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02] ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  );
};

export default function LatestFromMoriPrep() {
  return (
    // Outer section with the specific padding and max-width logic from the CSS
    <section>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 pt-[7.75rem] border-t-2 border-[#f2f0ed]">
        {/* Heading with precise typography values */}
        <h1 className="font-medium text-[44px] leading-[48px] tracking-[-1.35px] text-[#121212] m-0">
          The latest from Bytecode & Mori Prep
        </h1>

        {/* Grid Container */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-[36px] pt-[2.75rem] pb-[76px] relative list-none">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block w-full group pb-9"
              >
                <div className="flex flex-col gap-5">
                  {/* Image Container & Date */}
                  <div className="flex flex-col gap-6">
                    <BlogCoverImage src={post.image} alt={post.title} />

                    <div className="flex items-center gap-[10px] w-full text-[#888888]">
                      <p className="text-[15px] m-0">Published {post.date}</p>
                    </div>
                  </div>

                  {/* Text Content Container */}
                  <div className="flex flex-col gap-3">
                    <h5 className="text-[20px] font-medium leading-snug text-[#121212] m-0">
                      {post.title}
                    </h5>

                    {/* Excerpt with 3-line clamp */}
                    <div className="overflow-hidden">
                      <p className="text-[16px] leading-relaxed text-[#474645] m-0 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
