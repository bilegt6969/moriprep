"use client";

import AppNavbar from "components/Heading/app-navbar";
import { useBannerVisible } from "hooks/use-banner-visible";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PracticeLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isBannerVisible = useBannerVisible();

  // Hide navbar and footer for practice session pages
  const isPracticeSession =
    pathname?.startsWith("/practice/rw") &&
    (pathname?.includes("/practice") ||
      pathname?.includes("/setup") ||
      searchParams.has("domains") ||
      searchParams.has("difficulties"));

  if (isPracticeSession) {
    return <>{children}</>;
  }

  return (
    <>
      <AppNavbar
        siteName="Mori Prep"
        categories={[
          { label: "Home", href: "/home" },
          { label: "Practice", href: "/practice" },
          { label: "Lessons", href: "/lessons" },
          { label: "Analytics", href: "/analytics" },
        ]}
      />
      <div className={isBannerVisible ? "pt-24" : ""}>{children}</div>
    </>
  );
}

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          Loading...
        </div>
      }
    >
      <PracticeLayoutContent>{children}</PracticeLayoutContent>
    </Suspense>
  );
}
