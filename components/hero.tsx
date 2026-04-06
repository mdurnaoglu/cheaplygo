"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
          cta: "Спланировать поездку",
          secondaryCta: "или мгновенно забронировать билет"
        }
      : {
          eyebrowPrefix: "Next Generation",
          eyebrowAccent: "Trip Planner",
          title: "Plan your next Trip Smarter",
          cta: "Plan my trip",
          secondaryCta: "or Book your Ticket Instantly"
        };

  return (
    <section className="pb-8 pt-0">
      <div className="relative min-h-[82vh] sm:min-h-[92vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,12,22,0.64)_0%,rgba(7,12,22,0.32)_42%,rgba(7,12,22,0.12)_68%,rgba(7,12,22,0.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,22,0.42)_0%,rgba(7,12,22,0.08)_34%,rgba(7,12,22,0.28)_100%)]" />

        <div className="relative flex min-h-[82vh] items-center justify-center sm:min-h-[92vh]">
          <div className="w-full px-6 py-24 text-center sm:px-10 sm:py-28 lg:max-w-[72rem] lg:px-14 lg:py-32">
            <p
              className="text-sm font-medium uppercase tracking-[0.28em] text-white sm:text-[0.95rem]"
              style={{ fontFamily: appleFontStack }}
            >
              <span className="text-white">{copy.eyebrowPrefix} </span>
              <span className="text-chartreuse">{copy.eyebrowAccent}</span>
            </p>

            <h1
              className="mx-auto mt-6 max-w-[10.5ch] text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white sm:text-[5.4rem] lg:text-[6.35rem]"
              style={{ fontFamily: appleFontStack }}
            >
              {copy.title}
            </h1>

            <div className="mt-10">
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 rounded-2xl bg-chartreuse px-8 py-4 text-lg font-semibold text-black shadow-[0_16px_40px_rgba(201,255,5,0.24)] transition duration-200 hover:scale-[1.02] hover:bg-[#b9eb04]"
                style={{ fontFamily: appleFontStack }}
              >
                {copy.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 flex justify-center">
              <Link
                href="#smart-trips"
                className="group relative inline-flex items-center gap-2.5 pb-2 text-lg font-medium text-chartreuse transition hover:text-[#d8ff4a]"
                style={{ fontFamily: appleFontStack }}
              >
                <span>{copy.secondaryCta}</span>
                <ArrowUpRight className="h-4.5 w-4.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-chartreuse/95" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
