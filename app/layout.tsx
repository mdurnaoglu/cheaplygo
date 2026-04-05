import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
