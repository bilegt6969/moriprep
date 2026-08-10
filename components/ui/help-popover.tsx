"use client";

import { useEffect, useRef, useState } from "react";

interface HelpPopoverProps {
  title?: string;
  content?: string;
  linkText?: string;
  linkHref?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function HelpPopover({
  title = "Optimize Your Workflow",
  content = "Click here to streamline your tasks. Automate repetitive processes and focus on your priorities.",
  linkText = "Learn More",
  linkHref = "#",
  isOpen: controlledIsOpen,
  onOpenChange,
  children,
  position = "bottom",
}: HelpPopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-[11px] origin-bottom";
      case "left":
        return "right-full mr-[11px] origin-right";
      case "right":
        return "left-full ml-[11px] origin-left";
      default:
        return "top-full mt-[11px] origin-top";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "bottom-[-6px] rotate-45";
      case "left":
        return "right-[-6px] rotate-45";
      case "right":
        return "left-[-6px] rotate-45";
      default:
        return "top-[-6px] rotate-45";
    }
  };

  return (
    <div className="relative flex flex-col items-center" ref={popoverRef}>
      {children || (
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Help Tooltip"
          className="w-[22px] h-[22px] rounded-full bg-[#9CA3AF] text-white flex items-center justify-center text-[12.5px] font-medium hover:bg-[#828a99] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F4F6] z-20"
        >
          ?
        </button>
      )}

      <div
        className={`absolute ${getPositionClasses()} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top flex flex-col items-center z-10 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${getArrowClasses()} w-[12px] h-[12px] bg-white rounded-[2px] shadow-[0_0_8px_rgba(0,0,0,0.08)] z-0`}
        />

        <div className="relative bg-white rounded-[16px] w-[272px] p-[18px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08),_0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.03] text-left z-10">
          <div className="flex justify-between items-start mb-[7px]">
            <h3 className="text-[15px] font-semibold text-[#111827] tracking-tight leading-tight">
              {title}
            </h3>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors ml-2 -mr-1 -mt-1 p-1 focus:outline-none"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <p className="text-[14px] text-[#6B7280] leading-[1.45] mb-[12px]">
            {content}
          </p>

          {linkText && linkHref && (
            <a
              href={linkHref}
              className="inline-block text-[14px] font-semibold text-[#111827] underline decoration-1 underline-offset-[3px] hover:text-[#4B5563] transition-colors"
            >
              {linkText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
