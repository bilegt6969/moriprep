"use client";

import { useEffect, useState } from "react";

export function useBannerVisible() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    // Set initial value from localStorage after hydration
    const visible = localStorage.getItem("bannerVisible") !== "false";
    setIsBannerVisible(visible);

    const checkBanner = () => {
      const visible = localStorage.getItem("bannerVisible") !== "false";
      setIsBannerVisible(visible);
    };

    // Listen for custom event from banner
    const handleBannerChange = (e: CustomEvent) => {
      setIsBannerVisible(e.detail);
    };

    window.addEventListener(
      "banner-visibility-change",
      handleBannerChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "banner-visibility-change",
        handleBannerChange as EventListener,
      );
    };
  }, []);

  return isBannerVisible;
}
