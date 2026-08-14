"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full bg-white border-b border-gray-200 flex justify-center sticky top-0 z-50">
      <div className="w-full max-w-300 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-sm">
          <Link
            href="/resources"
            className="text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Lessons
          </Link>

          <ChevronRight
            className="h-4 w-4 shrink-0 text-neutral-400"
            strokeWidth={2}
          />

          <span className="truncate font-medium text-neutral-900">
            Craft and Structure
          </span>
        </div>

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
