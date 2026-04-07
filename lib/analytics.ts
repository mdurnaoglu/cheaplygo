export const GOOGLE_MEASUREMENT_ID = "G-GRRNV5R8D3";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}
