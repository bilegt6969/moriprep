"use client";

import Navbar from "components/Heading/Navbar";
import CTA from "../components/CTA";
import { Footer } from "../components/Footer";

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
          { label: "Lessons", href: "/resources" },
          { label: "Analytics", href: "/analytics" },
        ]}
        showBanner={false}
      />
      {children}
      <CTA />
      <Footer />
    </>
  );
}
