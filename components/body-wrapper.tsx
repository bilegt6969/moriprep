"use client";

import { Analytics } from "@vercel/analytics/next";
import { AuthSessionSync } from "components/auth/auth-session-sync";
import { CookieConsentProvider } from "components/cookie-consent";
import { Providers } from "components/providers/tooltip-provider";
import { PageTransition } from "components/page-transition";
import { ReactNode } from "react";

export function BodyWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <Providers>
        <CookieConsentProvider>
          <AuthSessionSync />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
        </CookieConsentProvider>
      </Providers>
      <Analytics />
    </>
  );
}
