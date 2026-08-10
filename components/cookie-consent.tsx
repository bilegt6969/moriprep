"use client";

import { cn } from "lib/cn";
import {
    CONSENT_COOKIE,
    getClientConsent,
    hasAnalyticsConsent,
    setClientConsent,
    type CookieConsentValue,
} from "lib/cookies/consent";
import Link from "next/link";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const ENTER_MS = 550;
const EXIT_MS = 650;

type CookieConsentContextValue = {
  consent: CookieConsentValue | null;
  ready: boolean;
  hasAnalyticsConsent: boolean;
  accept: () => void;
  reject: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider",
    );
  }
  return context;
}

function CookieConsentOverlay({
  entered,
  onAccept,
  onReject,
}: {
  entered: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-[105]",
          "transition-[opacity,backdrop-filter,background-color] ease-in-out",
          entered
            ? "bg-white/30 opacity-100 backdrop-blur-md"
            : "bg-white/0 opacity-0 backdrop-blur-none",
        )}
        style={{ transitionDuration: `${entered ? ENTER_MS : EXIT_MS}ms` }}
      />
      <div
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-desc"
        className={cn(
          "pointer-events-none fixed inset-x-4 bottom-4 z-[110] mx-auto max-w-lg sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2",
          "transition-[opacity,transform] ease-in-out",
          entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
        style={{ transitionDuration: `${entered ? ENTER_MS : EXIT_MS}ms` }}
      >
        <div className="pointer-events-auto rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg shadow-neutral-900/5">
          <h2
            id="cookie-consent-title"
            className="text-base font-semibold tracking-tight text-neutral-900"
          >
            Cookies
          </h2>
          <p
            id="cookie-consent-desc"
            className="mt-2 text-sm leading-relaxed text-neutral-500"
          >
            We use cookies to personalize content, run ads, and analyze traffic.
            Read our{" "}
            <Link
              href="/cookie-policy"
              className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-900 hover:decoration-neutral-500"
            >
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onReject}
              className="flex-1 rounded-full bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setConsent(getClientConsent());
    setReady(true);
  }, []);

  const needsBanner = ready && consent === null;

  useEffect(() => {
    if (!needsBanner) return;

    setMounted(true);
    const enterId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });

    return () => cancelAnimationFrame(enterId);
  }, [needsBanner]);

  useEffect(() => {
    if (!mounted) return;
    // Removed body overflow hidden to prevent blocking page scrolling
    // const prev = document.body.style.overflow;
    // document.body.style.overflow = "hidden";
    // return () => {
    //   document.body.style.overflow = prev;
    // };
  }, [mounted]);

  const resolveConsent = useCallback((value: CookieConsentValue) => {
    setEntered(false);

    window.setTimeout(() => {
      setClientConsent(value);
      setConsent(value);
      setMounted(false);
    }, EXIT_MS);
  }, []);

  const accept = useCallback(
    () => resolveConsent("accepted"),
    [resolveConsent],
  );
  const reject = useCallback(
    () => resolveConsent("rejected"),
    [resolveConsent],
  );

  const value = useMemo(
    () => ({
      consent,
      ready,
      hasAnalyticsConsent: hasAnalyticsConsent(consent),
      accept,
      reject,
    }),
    [accept, consent, ready, reject],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {mounted ? (
        <CookieConsentOverlay
          entered={entered}
          onAccept={accept}
          onReject={reject}
        />
      ) : null}
    </CookieConsentContext.Provider>
  );
}

export { CONSENT_COOKIE };
