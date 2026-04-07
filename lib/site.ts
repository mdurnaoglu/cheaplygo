const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string) {
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
}

export function getSiteUrl() {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    FALLBACK_SITE_URL;

  return normalizeSiteUrl(value);
}

export function getSiteOrigin() {
  return new URL(getSiteUrl());
}
