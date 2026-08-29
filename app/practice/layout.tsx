"use client";

import { auth } from "@/lib/firebase";
import { AppNavbar } from "components/Heading/app-navbar";
import { onAuthStateChanged } from "firebase/auth";
import { useBannerVisible } from "hooks/use-banner-visible";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PracticeLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isBannerVisible = useBannerVisible();
  const router = useRouter();

  // Check if this is a practice session (has question_id) OR if on practice/rw page
  const isPracticeSession =
    searchParams.has("question_id") ||
    pathname?.includes("/practice/rw") ||
    pathname?.includes("/practice/math");

  // Check authentication for practice pages
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathname?.startsWith("/practice")) {
        router.push("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Only show navbar with sidebar when not in an actual practice session
  if (isPracticeSession) {
    return <>{children}</>;
  }

  return <AppNavbar>{children}</AppNavbar>;
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
