"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GOOGLE_MEASUREMENT_ID } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function trackPageView(url: string) {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("config", GOOGLE_MEASUREMENT_ID, {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title
  });
}

function trackClick(target: HTMLElement) {
  if (typeof window.gtag !== "function") {
    return;
  }

  const text = target.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const href = target instanceof HTMLAnchorElement ? target.href : "";
  const eventName = target instanceof HTMLAnchorElement ? "link_click" : "button_click";

  window.gtag("event", eventName, {
    element_text: text.slice(0, 120) || "unlabeled",
    element_id: target.id || undefined,
    element_classes: target.className || undefined,
    link_url: href || undefined,
    page_path: window.location.pathname
  });
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const url = `${pathname}${window.location.search}`;
    trackPageView(url);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest("a, button, [role='button']");

      if (!(clickable instanceof HTMLElement)) {
        return;
      }

      trackClick(clickable);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
