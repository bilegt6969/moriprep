"use client";

import AppNavbar from "components/Heading/app-navbar";
import { useBannerVisible } from "hooks/use-banner-visible";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isBannerVisible = useBannerVisible();

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
