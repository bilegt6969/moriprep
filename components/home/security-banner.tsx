"use client";

export function SecurityBanner() {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#fafafa] border border-gray-200 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 md:gap-0">
            {/* Left Column */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3 block">
                  SECURITY
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f] mb-1">
                  Secure by design.
                </h3>
                <p className="text-lg text-gray-500">Safe by default.</p>
              </div>
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black mt-6 transition-colors"
              >
                Learn more
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Middle Column */}
            <div className="md:px-8 flex flex-col">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
                SOC 2 Type II
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We're in our SOC 2 observation period, with estimated completion
                in Q3 2026.
              </p>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px bg-gray-200" />

            {/* Right Column */}
            <div className="md:px-8 flex flex-col">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">
                GDPR & ISO 27001
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We're working on compliance with GDPR and ISO 27001, with
                additional auditing available upon request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
