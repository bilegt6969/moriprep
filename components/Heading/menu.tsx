"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "lib/cn";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

interface NavLink {
  label: string;
  href: string;
  description?: string;
}

// Match website's island-motion easing
const islandTiming =
  "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

const linkClass = cn(
  "text-[13px] font-medium tracking-wide text-neutral-500 hover:text-neutral-500",
  islandTiming,
);

interface CompanyLink {
  label: string;
  href: string;
  description: string;
}

const companyLinks: CompanyLink[] = [
  {
    label: "About",
    href: "/info/story",
    description:
      "Learn about our mission to build Mongolia's education ecosystem.",
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Read our latest insights and updates.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch with our team for questions and partnerships.",
  },
];

export default function Menu({
  categories,
  handleMenuOpenChangeAction,
}: {
  categories: NavLink[];
  handleMenuOpenChangeAction?: (open: boolean) => void;
}) {
  const handleValueChange = useCallback(
    (value: string) => {
      const isOpen = value !== "";
      // Only call the action if the value actually changed to prevent unnecessary re-renders
      if (handleMenuOpenChangeAction) {
        handleMenuOpenChangeAction(isOpen);
      }
    },
    [handleMenuOpenChangeAction],
  );

  return (
    <NavigationMenu.Root
      onValueChange={handleValueChange}
      className="relative hidden lg:block"
      delayDuration={0}
    >
      <NavigationMenu.List className="flex items-center gap-8">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/practice" className={linkClass}>
              Practice
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <a
              href="https://bytecode-smoky.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Coding
            </a>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(
              linkClass,
              "group inline-flex items-center gap-1.5 bg-transparent outline-none data-[state=open]:text-neutral-400",
            )}
          >
            Company
            <ChevronDown
              className={cn(
                "h-3 w-3 opacity-60 group-data-[state=open]:rotate-180",
                islandTiming,
              )}
              aria-hidden
            />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content
            className={cn(
              "fixed left-1/2 top-[56px] -translate-x-1/2 z-[99999]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-100",
              "data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2",
              "origin-top",
              islandTiming,
            )}
          >
            {/* Main Panel Container - using island-surface design system */}
            <div className="island-surface relative z-30 w-[540px] overflow-hidden rounded-2xl p-6">
              <div className="flex gap-6">
                {/* Left Side: Context / Overview */}
                <div className="flex w-[36%] flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                      Overview
                    </p>
                    <h3 className="mt-2.5 text-[13px] font-medium leading-relaxed tracking-tight text-neutral-900">
                      The complete operating system for your future.
                    </h3>
                  </div>
                  <Link
                    href="/about"
                    className="mt-6 text-[12px] font-medium text-neutral-800 transition-colors hover:text-neutral-500"
                  >
                    Learn more &rarr;
                  </Link>
                </div>

                {/* Symmetrical Divider */}
                <div className="w-px bg-neutral-200/50" />

                {/* Right Side: Clean Typographic Links */}
                <div className="flex-1">
                  <p className="mb-2 pl-3 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                    Explore
                  </p>
                  <ul className="space-y-0.5">
                    {companyLinks.map((item) => (
                      <li key={item.href}>
                        <NavigationMenu.Link asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "group block rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-black/5",
                              islandTiming,
                            )}
                          >
                            <span className="block text-[13px] font-medium text-neutral-700 transition-colors group-hover:text-neutral-500">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[12px] font-normal leading-snug text-neutral-500">
                              {item.description}
                            </span>
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
