"use client";

import { AppNavbar } from "components/Heading/app-navbar";
import { usePathname } from "next/navigation";

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLessonDetail = pathname?.match(/^\/resources\/[^/]+$/);

  if (isLessonDetail) {
    return <>{children}</>;
  }

  return <AppNavbar>{children}</AppNavbar>;
}
