export const GOOGLE_MEASUREMENT_ID = "G-GRRNV5R8D3";
export const GOOGLE_ADSENSE_CLIENT_ID = "ca-pub-7635259663086747";

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
