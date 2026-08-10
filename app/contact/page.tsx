"use client";

import Footer from "components/Heading/Footer";
import Navbar from "components/Heading/Navbar";
import React from "react";

export default function ContactPage() {
  return (
    <>
      <Navbar siteName="Mori Prep" categories={[]} showBanner={false} />
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-20">
        <div className="w-full max-w-[1200px] px-5 md:px-10 flex flex-col gap-4 animate-fade-in-up">
          {/* ── TOP ROW: Two Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Us Card */}
            <div className="bg-[#F5F5F7] rounded-[24px] p-12 md:p-20 flex flex-col items-center text-center transition-all duration-500 ease-out  hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-[32px] font-medium tracking-tight mb-3">
                Contact us
              </h2>
              <p className="text-base text-[#86868B] mb-10">
                We are here to help you if you have any question.
              </p>
              <a
                href="mailto:bilegt6969@gmail.com"
                className="inline-block bg-white border-none rounded-xl px-8 py-4 text-[15px] font-medium text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95"
              >
                Ask a question
              </a>
            </div>

            {/* Partner with LISA Card */}
            <div className="bg-[#F5F5F7] rounded-[24px] p-12 md:p-20 flex flex-col items-center text-center transition-all duration-500 ease-out  hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-[32px] font-medium tracking-tight mb-3">
                Partner with us
              </h2>
              <p className="text-base text-[#86868B] mb-10">
                Reach out to discuss partnership or collaboration.
              </p>
              <a
                href="mailto:bilegt6969@gmail.com"
                className="inline-block bg-white border-none rounded-xl px-8 py-4 text-[15px] font-medium text-[#1D1D1F] transition-all duration-300 ease-out hover:bg-white hover:scale-105 active:scale-95"
              >
                Make a business enquiry
              </a>
            </div>
          </div>

          {/* ── BOTTOM SECTION: Stay Tuned ── */}
          <div className="bg-[#F5F5F7] rounded-[24px] p-10 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center transition-all duration-500 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {/* Left: Text */}
            <div className="text-center md:pr-10 mb-6 md:mb-0">
              <h2 className="text-[32px] font-medium tracking-tight mb-4">
                Stay tuned
              </h2>
              <p className="text-base text-[#86868B] leading-relaxed max-w-[300px] mx-auto mb-6">
                Follow us for all the latest updates, announcements and more.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-[#1D1D1F]">bilegt6969@gmail.com</p>
                <p className="text-sm text-[#1D1D1F]">(+976) 9019 5589</p>
              </div>
            </div>

            {/* Right: Social Links */}
            <div className="flex flex-col">
              <SocialLink
                name="Facebook"
                href="https://www.facebook.com/sainto.store"
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                }
              />
              <SocialLink
                name="Instagram"
                href="https://www.instagram.com/sainto.app/"
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                }
              />
              <SocialLink
                name="TikTok"
                href="https://www.tiktok.com/@sainto.mn"
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                }
              />
              <SocialLink
                name="Linkedin"
                href="https://www.linkedin.com/company/108702260/admin/dashboard/"
                isLast
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Entrance Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <Footer siteName="Mori Prep" />
    </>
  );
}

// ── Helper Component for Social Links ──
function SocialLink({
  name,
  icon,
  href,
  isLast = false,
}: {
  name: string;
  icon: React.ReactNode;
  href: string;
  isLast?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center justify-between py-6 no-underline text-[#1D1D1F] cursor-pointer transition-all duration-300 ease-out hover:opacity-60 hover:translate-x-1 ${
        isLast ? "border-none" : "border-b border-[#E5E5EA]"
      }`}
    >
      <div className="flex items-center gap-5">
        <div className="text-[#86868B] transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <span className="text-base font-medium">{name}</span>
      </div>
      {/* Right Chevron Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#1D1D1F] transition-transform duration-300"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </a>
  );
}
