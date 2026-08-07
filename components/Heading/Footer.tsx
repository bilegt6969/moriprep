"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface FooterProps {
  siteName?: string;
}

const SITE_NAME_DEFAULT = "Mori Prep";

const footerLinks = [
  { label: "Our Story", href: "/info/story" },
  { label: "Community", href: "/community" },
  { label: "Contribute", href: "/info/contribute" },
];

const footerLinks2 = [
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/info/cookie-policy" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/opennote.me",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M6.66341 2C4.09074 2 1.99805 4.09464 1.99805 6.66797V13.3346C1.99805 15.9073 4.09268 18 6.66602 18H13.3327C15.9053 18 17.998 15.9054 17.998 13.332V6.66536C17.998 4.0927 15.9034 2 13.3301 2H6.66341ZM14.6647 4.66667C15.0327 4.66667 15.3314 4.96533 15.3314 5.33333C15.3314 5.70133 15.0327 6 14.6647 6C14.2967 6 13.998 5.70133 13.998 5.33333C13.998 4.96533 14.2967 4.66667 14.6647 4.66667ZM9.99805 6C12.204 6 13.998 7.794 13.998 10C13.998 12.206 12.204 14 9.99805 14C7.79205 14 5.99805 12.206 5.99805 10C5.99805 7.794 7.79205 6 9.99805 6ZM9.99805 7.33333C9.2908 7.33333 8.61253 7.61428 8.11243 8.11438C7.61233 8.61448 7.33138 9.29276 7.33138 10C7.33138 10.7072 7.61233 11.3855 8.11243 11.8856C8.61253 12.3857 9.2908 12.6667 9.99805 12.6667C10.7053 12.6667 11.3836 12.3857 11.8837 11.8856C12.3838 11.3855 12.6647 10.7072 12.6647 10C12.6647 9.29276 12.3838 8.61448 11.8837 8.11438C11.3836 7.61428 10.7053 7.33333 9.99805 7.33333Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@opennoteedu",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.99674 2.66797C7.20608 2.66797 3.58398 3.36719 3.58398 3.36719L3.57487 3.3776C2.30385 3.58088 1.33008 4.67305 1.33008 6.0013V10.0013V10.0026V14.0013V14.0026C1.33132 14.637 1.55866 15.2501 1.97128 15.7319C2.3839 16.2138 2.95476 16.5327 3.58138 16.6315L3.58398 16.6354C3.58398 16.6354 7.20608 17.3359 9.99674 17.3359C12.7874 17.3359 16.4095 16.6354 16.4095 16.6354L16.4108 16.6341C17.0381 16.5355 17.6096 16.2163 18.0226 15.7339C18.4355 15.2515 18.6627 14.6376 18.6634 14.0026V14.0013V10.0026V10.0013V6.0013C18.6625 5.36672 18.4353 4.75327 18.0226 4.27117C17.61 3.78908 17.0389 3.46994 16.4121 3.37109L16.4095 3.36719C16.4095 3.36719 12.7874 2.66797 9.99674 2.66797ZM7.99674 6.93359L13.3301 10.0013L7.99674 13.069V6.93359Z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/opennote",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M2.76289 2.40039L8.44961 10.691L2.48633 17.6004H3.75742L9.01289 11.5113L13.1895 17.6004H17.1949L11.2441 8.92539L16.8762 2.40039H15.6059L10.6816 8.10508L6.76836 2.40039H2.76289Z" />
      </svg>
    ),
  },
];

const slowEase = [0.16, 1, 0.3, 1] as const;

const muiStaggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

function HomeFooter({
  siteName,
  useWhiteBg,
}: FooterProps & { useWhiteBg?: boolean }) {
  const SITE_NAME = siteName || SITE_NAME_DEFAULT;
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = mounted ? new Date().getFullYear() : 2026;

  return (
    <footer
      className={`pt-16 sm:pt-24 relative overflow-hidden selection:bg-neutral-200 border-t border-gray-200 ${
        useWhiteBg ? "bg-white" : "bg-[#fafafa]"
      }`}
    >
      {/* Dynamic CTA Banner */}

      {/* Balanced 4-Column Layout */}
      <motion.div
        variants={muiStaggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="container mx-auto px-6 lg:px-12 max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Logo & Slim Tagline */}
          <div className="flex flex-col items-start">
            <img src="/morin.svg" alt="Logo" className="h-10 w-auto mb-4" />
            <p className="text-xs text-neutral-500 max-w-[180px] leading-relaxed">
              Mori Prep is a student-built, non-profit platform making
              world-class education accessible to everyone.
            </p>
          </div>

          {/* Column 2: First Group of Links */}
          <div className="flex flex-col items-start">
            <ul className="flex flex-col gap-3.5 w-full">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Second Group of Links */}
          <div className="flex flex-col items-start">
            <ul className="flex flex-col gap-3.5 w-full">
              {footerLinks2.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[15px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Icons */}
          <div className="flex flex-col items-start md:items-end">
            <ul className="flex flex-row flex-nowrap gap-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    target="_blank"
                    href={social.href}
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200/60 text-neutral-700 transition-all duration-300 hover:bg-neutral-300 hover:text-black hover:-translate-y-0.5"
                    aria-label={`Link to ${social.name}`}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Footer Illustrations and Floating Copyright */}
      <div className="relative w-full mt-4 md:mt-8 flex items-end justify-center z-0 h-[150px] sm:h-[200px] lg:h-[250px]">
        <div className="absolute bottom-0 w-full flex items-end justify-center lg:justify-between pointer-events-none h-full">
          <img
            alt="Left drawing"
            loading="lazy"
            decoding="async"
            className="hidden lg:block animate-fade-in h-[75%] object-contain object-left opacity-90"
            src="/footer-left-visual.avif"
          />
          <img
            alt="Frog"
            loading="lazy"
            decoding="async"
            className="animate-fade-in w-full max-w-[300px] sm:max-w-[360px] object-contain object-bottom mb-[-2%]"
            src="/footer-center-visual.avif"
          />
          <img
            alt="Right drawing"
            loading="lazy"
            decoding="async"
            className="hidden lg:block animate-fade-in h-[75%] object-contain object-right opacity-90"
            src="/footer-right-visual.avif"
          />
        </div>

        <div className="absolute bottom-4 left-0 w-full flex justify-center z-20 px-4 pointer-events-auto">
          <div className="px-5 py-2 ">
            <p className="text-xs sm:text-sm font-medium text-neutral-600">
              © {year} {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SimpleFooter({ useWhiteBg }: { useWhiteBg?: boolean }) {
  return (
    <footer
      className={`relative w-full overflow-hidden pt-8 ${
        useWhiteBg ? "bg-white" : "bg-[#fcfcfc]"
      } pb-6`}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: slowEase }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="font-sans text-[12px] tracking-[0.04em] text-neutral-400/90 antialiased transition-colors duration-500 hover:text-neutral-600 select-none">
            That's all.
          </span>
          <span className="font-sans text-[12px] tracking-[0.04em] text-neutral-400/90 antialiased select-none">
            For now.
          </span>
        </motion.div>
      </div>
    </footer>
  );
}

export default function Footer({ siteName }: FooterProps) {
  const pathname = usePathname();

  const isCategoryPage = pathname?.startsWith("/category");
  const isSearchPage = pathname === "/search";
  const isAboutPage = pathname === "/about";
  const isBlogPage = pathname === "/blog";
  const isContactPage = pathname === "/contact";
  const isProductPage = pathname?.startsWith("/product/");

  const useWhiteBg =
    isAboutPage || isBlogPage || isContactPage || isProductPage;

  return isCategoryPage || isSearchPage ? (
    <SimpleFooter useWhiteBg={useWhiteBg} />
  ) : (
    <HomeFooter siteName={siteName} useWhiteBg={useWhiteBg} />
  );
}
