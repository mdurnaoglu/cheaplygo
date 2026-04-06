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
          titleTop: "Планируйте",
          titleBottom: "следующее путешествие умнее",
          cta: "Спланировать поездку",
          secondaryCta: "или мгновенно забронировать билет",
          trustPrefix: "Без входа. Без карты.",
          trustEmphasis: "Просто начните."
        }
      : language === "tr"
        ? {
            eyebrowPrefix: "Yeni Nesil",
            eyebrowAccent: "Trip Planner",
            titleTop: "Bir Sonraki",
            titleBottom: "Tripini Akıllıca Planla",
            cta: "Tripimi planla",
            secondaryCta: "veya Biletini Anında Al",
            trustPrefix: "Login yok. Kredi kartı yok.",
            trustEmphasis: "Just Start."
          }
      : {
          eyebrowPrefix: "Next Generation",
          eyebrowAccent: "Trip Planner",
          titleTop: "Plan your",
          titleBottom: "Next Trip Smarter",
          cta: "Plan my trip",
          secondaryCta: "or Book your Ticket Instantly",
          trustPrefix: "No login. No credit card.",
          trustEmphasis: "Just Start."
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
              className="mx-auto mt-6 max-w-[11.5ch] text-[3.6rem] font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-[5rem] lg:text-[5.9rem]"
              style={{ fontFamily: appleFontStack }}
            >
              <span className="block">{copy.titleTop}</span>
              <span className="block">{copy.titleBottom}</span>
            </h1>

            <p
              className="mt-8 text-base text-white sm:text-lg"
              style={{ fontFamily: appleFontStack }}
            >
              <span>{copy.trustPrefix} </span>
              <strong className="font-semibold text-chartreuse">{copy.trustEmphasis}</strong>
            </p>

            <div className="mt-8">
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
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-5 w-5 fill-current transition group-hover:scale-75 group-hover:opacity-0"
                  >
                    <path d="M11.16 1.76a.75.75 0 0 0-1.34-.14L4.63 9.4a.75.75 0 0 0 .63 1.17h3.18l-1.1 7.33a.75.75 0 0 0 1.37.49l6.66-9.96a.75.75 0 0 0-.62-1.17h-3.12l-.47-5.5Z" />
                  </svg>
                  <ArrowUpRight className="absolute h-4.5 w-4.5 translate-y-0.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px bg-chartreuse/95" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
