"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

const appleFontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

export function Hero() {
  const { language } = useLanguage();
  const copy =
    language === "ru"
      ? {
          eyebrowPrefix: "Планировщик путешествий нового поколения",
          eyebrowAccent: "для вашего бюджета",
          title: "Планируйте своё следующее путешествие умнее",
          cta: "Спланировать поездку"
        }
      : {
          eyebrowPrefix: "Next Generation",
          eyebrowAccent: "Trip Planner",
          title: "Plan your next Trip Smarter",
          cta: "Plan my trip"
        };

  return (
    <section className="px-4 pb-8 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
        <div className="relative min-h-[72vh] sm:min-h-[78vh]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-banner.jpg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,28,0.58)_0%,rgba(8,15,28,0.34)_36%,rgba(8,15,28,0.14)_62%,rgba(8,15,28,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,20,34,0.18)_0%,rgba(12,20,34,0.06)_34%,rgba(12,20,34,0.26)_100%)]" />

          <div className="relative flex min-h-[72vh] items-center justify-center sm:min-h-[78vh]">
            <div className="w-full px-6 py-16 text-center sm:px-10 lg:max-w-[56rem] lg:px-14">
              <p
                className="text-xs font-medium uppercase tracking-[0.28em] text-white sm:text-sm"
                style={{ fontFamily: appleFontStack }}
              >
                <span className="text-white">{copy.eyebrowPrefix} </span>
                <span className="text-chartreuse">{copy.eyebrowAccent}</span>
              </p>

              <h1
                className="mx-auto mt-4 max-w-[11ch] text-5xl font-semibold tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl"
                style={{ fontFamily: appleFontStack }}
              >
                {copy.title}
              </h1>

              <div className="mt-8">
                <Link
                  href="/planner"
                  className="inline-flex items-center gap-2 rounded-2xl bg-chartreuse px-7 py-4 text-base font-semibold text-black shadow-[0_16px_40px_rgba(201,255,5,0.24)] transition duration-200 hover:scale-[1.02] hover:bg-[#b9eb04]"
                  style={{ fontFamily: appleFontStack }}
                >
                  {copy.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
