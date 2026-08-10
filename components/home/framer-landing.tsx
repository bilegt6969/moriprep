"use client";

import Link from "next/link";
import { useState } from "react";

export default function FramerLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-black text-white font-sans"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(0, 106, 255) 17.307692766189575%, rgb(0, 226, 71) 40.86538553237915%, rgb(248, 78, 80) 61.538463830947876%, rgb(241, 255, 120) 85.09615659713745%, rgb(0, 0, 0) 100%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/landing" className="flex items-center space-x-2">
              <div className="text-white font-bold text-xl">
                <svg
                  width="77"
                  height="17"
                  viewBox="0 0 77 16.745"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-auto"
                >
                  <path
                    d="M 19.228 10.36 C 19.438 10.36 19.525 10.629 19.354 10.751 L 11.5 16.379 C 11.168 16.617 10.77 16.745 10.362 16.745 L 2.791 16.745 C 2.368 16.745 2.196 16.2 2.543 15.958 L 10.285 10.555 C 10.467 10.428 10.684 10.36 10.906 10.36 Z M 59.06 4.891 C 60.556 4.891 61.711 5.303 62.524 6.128 C 63.35 6.94 63.763 8.034 63.763 9.408 L 63.763 15.843 L 60.783 15.843 L 60.783 9.964 C 60.783 9.175 60.568 8.577 60.137 8.171 C 59.718 7.753 59.102 7.544 58.288 7.544 C 57.475 7.544 56.852 7.753 56.422 8.171 C 56.003 8.577 55.793 9.175 55.793 9.964 L 55.793 15.843 L 52.814 15.843 L 52.814 8.028 L 51.342 8.028 L 51.342 5.088 L 54.358 5.088 L 54.358 6.845 L 55.111 6.845 C 55.53 6.224 56.057 5.746 56.691 5.411 C 57.325 5.065 58.115 4.891 59.06 4.891 Z M 44.61 15.842 L 41.63 15.842 L 41.63 0.786 L 44.61 0.786 L 44.61 15.842 Z M 68.797 8.942 L 68.869 8.942 L 73.105 5.088 L 76.659 5.088 L 72.082 9.211 L 77 15.842 L 73.518 15.842 L 69.982 11.021 L 68.797 11.989 L 68.797 15.842 L 65.817 15.842 L 65.817 0.786 L 68.797 0.786 L 68.797 8.941 Z"
                    fill="white"
                  />
                  <path
                    d="M 34.838 1.31 C 35.712 1.31 36.477 1.465 37.135 1.776 C 37.794 2.086 38.308 2.523 38.679 3.084 C 39.05 3.634 39.236 4.273 39.236 5.002 C 39.236 5.731 39.044 6.352 38.661 6.866 C 38.278 7.368 37.758 7.744 37.1 7.995 L 37.1 8.067 C 37.662 8.21 38.153 8.449 38.572 8.784 C 38.998 9.113 39.342 9.536 39.577 10.021 C 39.828 10.511 39.954 11.067 39.954 11.688 C 39.954 12.512 39.75 13.235 39.343 13.857 C 38.937 14.478 38.374 14.962 37.656 15.308 C 36.95 15.655 36.118 15.828 35.161 15.828 L 27.371 15.828 L 27.371 1.31 L 34.838 1.31 Z M 30.405 13.176 L 34.623 13.176 C 35.353 13.176 35.915 13.02 36.31 12.709 C 36.705 12.387 36.902 11.927 36.902 11.329 C 36.902 10.732 36.705 10.278 36.31 9.967 C 35.927 9.656 35.37 9.501 34.641 9.501 L 30.405 9.501 Z M 30.405 7.099 L 34.407 7.099 C 34.982 7.099 35.419 6.968 35.718 6.705 C 36.029 6.43 36.184 6.036 36.184 5.522 C 36.184 5.008 36.029 4.62 35.718 4.357 C 35.419 4.094 34.982 3.962 34.407 3.962 L 30.405 3.962 Z"
                    fill="white"
                  />
                  <path
                    d="M 49.847 15.86 L 46.868 15.86 L 46.868 5.105 L 49.847 5.105 Z M 18.606 0 C 18.95 0 19.281 0.136 19.525 0.379 C 19.768 0.622 19.906 0.953 19.906 1.297 L 19.906 7.989 C 19.906 8.334 19.768 8.664 19.525 8.907 C 19.281 9.15 18.95 9.287 18.606 9.286 L 11.87 9.286 C 11.526 9.287 11.195 9.15 10.952 8.907 C 10.708 8.664 10.571 8.334 10.57 7.989 L 10.57 1.297 C 10.571 0.58 11.153 -0.001 11.87 0 L 18.606 0 Z M 9.023 0.356 C 9.173 0.22 9.414 0.326 9.414 0.528 L 9.414 8.147 C 9.413 8.745 8.928 9.229 8.331 9.228 L 0.434 9.228 C 0.039 9.228 -0.15 8.744 0.141 8.477 Z M 48.357 0.786 C 48.812 0.786 49.195 0.947 49.506 1.27 C 49.829 1.58 49.991 1.963 49.991 2.417 C 49.991 2.871 49.829 3.259 49.506 3.582 C 49.195 3.893 48.812 4.048 48.357 4.048 C 47.903 4.048 47.514 3.893 47.191 3.582 C 46.88 3.259 46.724 2.871 46.724 2.417 C 46.724 1.963 46.88 1.58 47.191 1.27 C 47.514 0.947 47.903 0.786 48.357 0.786 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/landing/features"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Features
              </Link>

              <div className="relative group">
                <button className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1">
                  <span>Pages</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <Link
                href="/landing/pricing"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Pricing
              </Link>

              <a
                href="https://library.clonify.io/products/blink-saas-framer-template"
                target="_blank"
                rel="noopener"
                className="px-6 py-2 bg-[#0c0c0d] border border-[#1b1c26] text-white rounded-full hover:bg-[#1a1a1c] transition-colors"
                style={{
                  backgroundColor: "rgb(12, 12, 13)",
                  borderColor: "rgb(27, 28, 38)",
                }}
              >
                Buy template
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-4 pb-4">
              <Link
                href="/landing/features"
                className="block text-white hover:text-gray-300 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/landing/pricing"
                className="block text-white hover:text-gray-300 transition-colors"
              >
                Pricing
              </Link>
              <a
                href="https://library.clonify.io/products/blink-saas-framer-template"
                target="_blank"
                rel="noopener"
                className="block px-6 py-2 bg-[#0c0c0d] border border-[#1b1c26] text-white rounded-full text-center hover:bg-[#1a1a1c] transition-colors"
              >
                Buy template
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area - Placeholder for the rest of the Framer content */}
      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Framer Landing Page
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The full Framer components will be added here. Please provide the
              specific HTML structure from the browser inspection for the hero
              section, features, and other components you want converted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
