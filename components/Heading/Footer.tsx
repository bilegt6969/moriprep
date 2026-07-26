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
  { label: "Privacy Policy", href: "/info/privacy-policy" },
  { label: "Terms of Usage", href: "/info/toc" },
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
        useWhiteBg ? "bg-white" : "bg-[#fcfcfc]"
      }`}
    >
      {/* Dynamic CTA Banner */}
      {pathname === "/" && (
        <div className="px-4 sm:px-6 mb-24 lg:mb-32 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: slowEase }}
            className="max-w-[1200px] mx-auto relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#11162b] min-h-[400px] sm:min-h-[360px] flex items-center justify-center shadow-2xl"
          >
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <filter id="noiseFilter">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.85"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
              </svg>
            </div>
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <svg
                className="absolute -left-12 -top-12 w-64 h-64 text-[#1a2347]"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M0,0 L100,0 C70,30 50,70 0,100 Z" />
              </svg>
              <svg
                className="absolute -left-20 -bottom-16 w-96 h-96 text-[#1f306e]"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M0,100 L100,100 C80,60 40,30 0,0 Z" />
              </svg>
              <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#c8e3ff] rounded-[4rem] rotate-12 opacity-90 blur-[1px]" />
              <svg
                className="absolute -right-10 -bottom-10 w-[500px] h-[500px] text-[#2c4fa6]"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M100,100 L0,100 C30,70 50,20 100,0 Z" />
              </svg>
              <svg
                className="absolute -right-4 -top-10 w-72 h-72 text-[#4682e8]"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M100,0 L100,100 C60,60 20,40 0,0 Z" />
              </svg>
              <div className="absolute -right-8 -bottom-12 w-48 h-32 bg-[#c8e3ff] rounded-full rotate-[-15deg] opacity-90" />
              <svg
                className="absolute left-[30%] -bottom-12 w-80 h-48 text-[#1a2b66]"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M0,100 C20,40 60,30 100,100 Z" />
              </svg>
            </div>

            <div className="relative z-10 text-center px-6 max-w-3xl py-12">
              <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 tracking-tight leading-tight">
                Join a growing community of 500+ ambitious Mongolian students
                building their future.
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signin"
                  className="w-full sm:w-auto px-8 py-3 rounded-full border border-white/40 text-white font-medium hover:bg-white/10 transition-colors duration-300 text-center"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-[#11162b] font-medium hover:bg-gray-100 transition-colors duration-300 text-center"
                >
                  Sign up for free
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
            <p className="text-xs text-neutral-500 italic max-w-[180px] leading-relaxed">
              "Mani hed cn mongol shde, ghde ene bur goy shaah ed bgz te
              kshohguyu"
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
      <div className="relative w-full mt-16 md:mt-24 flex items-end justify-center z-0 h-[250px] sm:h-[300px] lg:h-[350px]">
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
