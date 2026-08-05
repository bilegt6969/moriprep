"use client";

import Footer from "components/Heading/Footer";
import Navbar from "components/Heading/Navbar";
import { useBannerVisible } from "hooks/use-banner-visible";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isBannerVisible = useBannerVisible();

  return (
    <>
      <Navbar
        siteName="Mori Prep"
        categories={[
          { label: "Home", href: "/home" },
          { label: "Practice", href: "/practice" },
          { label: "Lessons", href: "/lessons" },
          { label: "Analytics", href: "/analytics" },
        ]}
      />
      <div className={isBannerVisible ? "pt-24" : ""}>{children}</div>
      <Footer siteName="Mori Prep" />
    </>
  );
}
