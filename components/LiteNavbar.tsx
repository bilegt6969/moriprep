"use client";

import Link from "next/link";

export default function LiteNavbar() {
  return (
    <div className="w-full bg-white border-b border-gray-200 flex justify-center sticky top-0 z-50">
      <div className="w-full max-w-[800px] px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors bg-transparent border-none cursor-pointer p-0 group"
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
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="transition-colors duration-300 ease-out">Back</span>
        </button>

        <Link href="/" className="flex items-center h-5 cursor-pointer">
          <img
            src="/morin.svg"
            alt="Brand Logo"
            className="h-full w-auto object-contain opacity-80"
          />
        </Link>
      </div>
    </div>
  );
}
