"use client";

import { RefreshCw } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-24 font-sans selection:bg-gray-200">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* Minimalist Icon mimicking SF Symbols */}
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
          <RefreshCw className="h-6 w-6 text-gray-800" strokeWidth={1.5} />
        </div>

        {/* Clean, tight-tracked typography typical of Apple UI */}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-4">
          Something went wrong.
        </h1>

        <p className="text-[17px] text-gray-500 mb-10 leading-relaxed max-w-sm">
          We encountered an unexpected error. This might be temporary, so please
          try again.
        </p>

        {/* Action Buttons: Pill-shaped, monochromatic, subtle hover states */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-16">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
          >
            Try Again
          </button>

          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full active:scale-[0.98] transition-all duration-200"
          >
            Return Home
          </a>
        </div>

        {/* Footer Text */}
        <p className="text-xs font-medium text-gray-400 tracking-wider uppercase">
          Mori Prep • DSAT Practice Platform
        </p>
      </div>
    </div>
  );
}
