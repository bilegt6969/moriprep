"use client";

import { auth } from "@/lib/firebase";
import { AppNavbar } from "components/Heading/app-navbar";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PracticeTestLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if this is an actual practice test session (has test parameter)
  const isPracticeSession = searchParams.has("test");

  // Check authentication for practice-test pages
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathname?.startsWith("/practice-test")) {
        router.push("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Only show navbar with sidebar when not in an actual practice test session
  if (isPracticeSession) {
    return <>{children}</>;
  }

  return <AppNavbar>{children}</AppNavbar>;
}

export default function PracticeTestLayout({
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
      <PracticeTestLayoutContent>{children}</PracticeTestLayoutContent>
    </Suspense>
  );
}
