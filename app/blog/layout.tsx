"use client";

import Footer from "components/Heading/Footer";
import Navbar from "components/Heading/Navbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        showBanner={false}
      />
      {children}
      <Footer siteName="Mori Prep" />
    </>
  );
}
