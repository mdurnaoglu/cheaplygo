import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { LanguageProvider } from "@/components/language-provider";
import {
  GOOGLE_ADSENSE_CLIENT_ID,
  GOOGLE_MEASUREMENT_ID
} from "@/lib/analytics";
import { getSiteOrigin } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  title: {
    default: "CheaplyGo | Budget-Smart Trip Planner and Flight Deals",
    template: "%s | CheaplyGo"
  },
  description:
    "CheaplyGo helps travelers compare budget-smart trips with live flight logic, stay ideas, visa context, and destination guides.",
  applicationName: "CheaplyGo",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: "CheaplyGo | Budget-Smart Trip Planner and Flight Deals",
    description:
      "Compare smarter trip ideas with live flight logic, stay suggestions, and destination planning support.",
    siteName: "CheaplyGo"
  },
  twitter: {
    card: "summary_large_image",
    title: "CheaplyGo | Budget-Smart Trip Planner and Flight Deals",
    description:
      "Plan smarter trips with live flight logic, stay ideas, and destination-specific travel guidance."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_MEASUREMENT_ID}');`
          }}
        />
        <script
          {...({
            nowprocket: "",
            "data-noptimize": "1",
            "data-cfasync": "false",
            "data-wpfc-render": "false",
            "seraph-accel-crit": "1",
            "data-no-defer": "1"
          } as Record<string, string>)}
          dangerouslySetInnerHTML={{
            __html: `(function () {
  var script = document.createElement("script");
  script.async = 1;
  script.src = 'https://emrldco.com/NTE1Mzg0.js?t=515384';
  document.head.appendChild(script);
})();`
          }}
        />
      </head>
      <body className={`${inter.className} bg-page text-ink antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
        <AnalyticsTracker />
      </body>
    </html>
  );
}
