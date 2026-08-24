"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { SignInButton } from "./sign-in-button";

interface NavLink {
  label: string;
  href: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: NavLink[];
}

// Apple's actual public system easing — used everywhere, nothing else.
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export default function MobileMenu({ isOpen, setIsOpen, categories }: Props) {
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setIsCompaniesOpen(false), 400);
  };

  const companyLinks =
    categories && categories.length > 0
      ? categories
      : [
          { label: "About", href: "/info/story" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/contact" },
        ];

  const primaryLinks = [
    { label: "DSAT", href: "/practice" },
    { label: "Coding", href: "https://bytecode-smoky.vercel.app/" },
  ];

  return (
    <Transition show={isOpen}>
      <Dialog onClose={handleClose} className="relative z-50">
        {/* Backdrop — soft, deep blur. Also the click-outside-to-close zone. */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-white/70 backdrop-blur-2xl"
            style={{ transitionTimingFunction: EASE, willChange: "opacity" }}
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Full-bleed sheet, slides down from the very top like apple.com's nav */}
        <Transition.Child
          as={Fragment}
          enter="transition-all duration-500"
          enterFrom="opacity-0 -translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all duration-350"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-4"
        >
          <Dialog.Panel
            className="fixed inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-y-auto bg-white/95 backdrop-blur-xl"
            style={{
              transitionTimingFunction: EASE,
              willChange: "transform, opacity",
              WebkitOverflowScrolling: "touch", // iOS momentum scroll
            }}
          >
            {/* Close */}
            <div className="flex justify-end px-6 pt-6 sm:px-10">
              <button
                onClick={handleClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] text-black transition-all duration-300 active:scale-90 active:bg-black/[0.08]"
                style={{ transitionTimingFunction: EASE }}
              >
                <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </div>

            {/* Primary nav */}
            <nav className="flex flex-col px-6 pt-6 sm:px-10">
              {primaryLinks.map((link, i) => (
                <div
                  key={link.href}
                  className="border-b border-black/[0.06]"
                  style={{
                    transitionProperty: "opacity, transform",
                    transitionDuration: "600ms",
                    transitionTimingFunction: EASE,
                    transitionDelay: isOpen ? `${90 + i * 60}ms` : "0ms",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(10px)",
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={handleClose}
                    className="flex items-center py-5 text-[28px] font-medium tracking-[-0.02em] text-[#1d1d1f] transition-colors active:text-black/50 sm:text-[32px]"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}

              {/* Company disclosure */}
              <div
                className="border-b border-black/[0.06]"
                style={{
                  transitionProperty: "opacity, transform",
                  transitionDuration: "600ms",
                  transitionTimingFunction: EASE,
                  transitionDelay: isOpen ? "210ms" : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(10px)",
                }}
              >
                <button
                  onClick={() => setIsCompaniesOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-5 text-left text-[28px] font-medium tracking-[-0.02em] text-[#1d1d1f] sm:text-[32px]"
                >
                  Company
                  <ChevronDown
                    className="h-5 w-5 text-black/40 transition-transform duration-500"
                    strokeWidth={1.75}
                    style={{
                      transitionTimingFunction: EASE,
                      transform: isCompaniesOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                <div
                  className="grid overflow-hidden transition-all duration-500"
                  style={{
                    gridTemplateRows: isCompaniesOpen ? "1fr" : "0fr",
                    transitionTimingFunction: EASE,
                  }}
                >
                  <div className="overflow-hidden">
                    <ul className="flex flex-col gap-1 pb-6 pl-1 pt-1">
                      {companyLinks.map((item, i) => (
                        <li
                          key={item.href}
                          style={{
                            transitionProperty: "opacity, transform",
                            transitionDuration: "400ms",
                            transitionTimingFunction: EASE,
                            transitionDelay: isCompaniesOpen
                              ? `${i * 50}ms`
                              : "0ms",
                            opacity: isCompaniesOpen ? 1 : 0,
                            transform: isCompaniesOpen
                              ? "translateY(0)"
                              : "translateY(6px)",
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={handleClose}
                            className="flex py-2.5 text-[18px] font-normal text-black/55 transition-colors active:text-black/80"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </nav>

            {/* Sign in — sits apart, like Apple's account row */}
            <div
              className="mt-auto px-6 pb-10 pt-8 sm:px-10"
              style={{
                transitionProperty: "opacity, transform",
                transitionDuration: "600ms",
                transitionTimingFunction: EASE,
                transitionDelay: isOpen ? "270ms" : "0ms",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {/* min-h stops this pill resizing if/when SignInButton's real content mounts late — see note in chat */}
              <div className="min-h-[56px] sm:min-h-[52px]">
                <SignInButton
                  className="flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-[17px] font-medium text-white transition-all duration-300 active:scale-[0.97] active:bg-black/85 sm:w-fit sm:px-8"
                  onClickAction={handleClose}
                />
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
