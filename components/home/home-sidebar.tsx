"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_CATEGORIES = [
  { label: "All", href: "/search" },
  { label: "New Arrivals", href: "/search?q=new" },
  { label: "Clothing", href: "/search?q=clothing" },
  { label: "Accessories", href: "/search?q=accessories" },
  { label: "Shoes", href: "/search?q=shoes" },
];

const BRANDS = [
  { label: "Moscot", href: "/search?q=Moscot" },
  { label: "Maison Margiela", href: "/search?q=Maison+Margiela" },
  { label: "Based", href: "/search?q=Based" },
  { label: "Goyard", href: "/search?q=Goyard" },
  { label: "Apple", href: "/search?q=Apple" },
  { label: "Logitech", href: "/search?q=Logitech" },
];

function NavColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs text-neutral-500">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="block truncate text-[13px] leading-snug text-neutral-200 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeSidebar() {
  const siteName = process.env.SITE_NAME || "Sainto";
  const [year, setYear] = useState(2025);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <article className="flex h-full flex-col">
      <div className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl bg-black p-4 sm:p-5">
        <Link href="/" className="mb-4 inline-block" aria-label={siteName}>
          <Image
            src="/morin.svg"
            alt={siteName}
            width={1666}
            height={360}
            className="h-12 w-auto max-w-[16.5rem] object-contain object-left opacity-60 sm:h-[3.375rem] sm:max-w-[19.5rem]"
            priority
          />
        </Link>
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-2 gap-x-3 overflow-y-auto">
          <NavColumn title="Categories" items={[...NAV_CATEGORIES]} />
          <NavColumn title="Top brands" items={BRANDS} />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-sm italic leading-snug text-neutral-800">
          Official Plug of Swaggers
        </p>
        <p className="text-xs leading-relaxed text-neutral-500">
          Sainto by bytecode{" "}
        </p>
        <div className="space-y-0.5 pt-1 text-[11px] leading-relaxed text-neutral-400">
          <p>
            © {year} {siteName} → Beta 0.0.1
          </p>
          <a
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-600"
          ></a>
        </div>
      </div>
    </article>
  );
}
