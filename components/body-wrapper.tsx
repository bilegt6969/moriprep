"use client";

import { Analytics } from "@vercel/analytics/next";
import { AuthSessionSync } from "components/auth/auth-session-sync";
import { CookieConsentProvider } from "components/cookie-consent";
import { PageTransition } from "components/page-transition";
import { Providers } from "components/providers/tooltip-provider";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function BodyWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't apply page transition on practice pages (single-page app experience)
  // or landing page (to keep navbar sticky)
  const shouldTransition =
    !pathname?.startsWith("/practice") && pathname !== "/";

  return (
    <>
      <Providers>
        <CookieConsentProvider>
          <AuthSessionSync />
          {shouldTransition ? (
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
          ) : (
            <main>{children}</main>
          )}
        </CookieConsentProvider>
      </Providers>
      <Analytics />
    </>
  );
}
