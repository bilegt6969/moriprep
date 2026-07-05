"use client";

import { Dialog, Transition } from "@headlessui/react";
import type { NavLink } from "lib/navigation";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { SignInButton } from "./sign-in-button";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: NavLink[];
}

export default function MobileMenu({ isOpen, setIsOpen, categories }: Props) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsCategoriesOpen(false);
      setIsCompaniesOpen(false);
    }, 300);
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={handleClose} className="relative z-50">
        {/* Background Blur */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300 ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xl"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          {/* pt-16 keeps it docked near the top with breathing room */}
          <div className="flex min-h-full flex-col p-4 pt-16 sm:p-6">
            {/* Panel: Removed rounded corners entirely to make it square */}
            <Transition.Child
              as={Fragment}
              enter="transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              enterFrom="opacity-0 -translate-y-8 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="transition-all duration-300 ease-in-out"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 -translate-y-8 scale-95"
            >
              <Dialog.Panel className="relative w-full mt-3 rounded-[32px] bg-white pb-6 pt-5 shadow-2xl">
                <ul className="flex flex-col">
                  {/* Static Links */}
                  <li className="border-b border-neutral-200/70 px-6 py-5">
                    <Link
                      href="/"
                      onClick={handleClose}
                      className="flex items-center text-[26px] font-semibold tracking-tight text-black transition-colors hover:text-neutral-500"
                    >
                      Home
                    </Link>
                  </li>

                  {/* Categories Accordion */}
                  <li className="border-b border-neutral-200/70 px-6 py-5">
                    <div className="flex flex-col">
                      <button
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className="flex w-full items-center justify-between text-left text-[26px] font-semibold tracking-tight text-black"
                      >
                        Categories
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200">
                          {isCategoriesOpen ? (
                            <Minus
                              className="h-4 w-4 text-black"
                              strokeWidth={2.5}
                            />
                          ) : (
                            <Plus
                              className="h-4 w-4 text-black"
                              strokeWidth={2.5}
                            />
                          )}
                        </span>
                      </button>

                      {/* Accordion Content */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isCategoriesOpen
                            ? "grid-rows-[1fr] pt-5 opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="flex flex-col gap-4">
                            {categories.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={handleClose}
                                  className="text-[20px] font-medium text-neutral-800 transition-colors hover:text-neutral-500"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Companies Accordion */}
                  <li className="border-b border-neutral-200/70 px-6 py-5">
                    <div className="flex flex-col">
                      <button
                        onClick={() => setIsCompaniesOpen(!isCompaniesOpen)}
                        className="flex w-full items-center justify-between text-left text-[26px] font-semibold tracking-tight text-black"
                      >
                        Company
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200">
                          {isCompaniesOpen ? (
                            <Minus
                              className="h-4 w-4 text-black"
                              strokeWidth={2.5}
                            />
                          ) : (
                            <Plus
                              className="h-4 w-4 text-black"
                              strokeWidth={2.5}
                            />
                          )}
                        </span>
                      </button>

                      {/* Accordion Content */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isCompaniesOpen
                            ? "grid-rows-[1fr] pt-5 opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="flex flex-col gap-4">
                            {[
                              { label: "About", href: "/about" },
                              { label: "Blog", href: "/blog" },
                              { label: "Contact", href: "/contact" },
                            ].map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={handleClose}
                                  className="text-[20px] font-medium text-neutral-800 transition-colors hover:text-neutral-500"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>

                {/* Black Sign In Button */}
                <div className="mt-6 px-6 h-full">
                  <SignInButton
                    className="flex w-fit items-center gap-2 rounded-2xl px-5 py-3.5 text-lg font-medium text-white transition-colors hover:bg-neutral-800 active:scale-95"
                    onClick={handleClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
