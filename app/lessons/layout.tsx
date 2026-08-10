"use client";

import Footer from "components/Heading/Footer";
import AppNavbar from "components/Heading/app-navbar";
import { usePathname } from "next/navigation";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLessonDetail = pathname?.match(/^\/lessons\/[^/]+$/);

  return (
    <>
      {!isLessonDetail && (
        <AppNavbar
          siteName="Mori Prep"
          categories={[
            { label: "Home", href: "/home" },
            { label: "Practice", href: "/practice" },
            { label: "Lessons", href: "/lessons" },
            { label: "Analytics", href: "/analytics" },
          ]}
          showBanner={false}
        />
      )}
      {children}
      <Footer siteName="Mori Prep" />
    </>
  );
}
