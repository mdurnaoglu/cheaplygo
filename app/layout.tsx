import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { LanguageProvider } from "@/components/language-provider";
import { GOOGLE_MEASUREMENT_ID } from "@/lib/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "cheaplygo",
  description: "Discover hidden cheap flight deals from Istanbul and beyond."
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
