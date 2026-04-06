"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  useLanguage,
  type Currency,
  type Language
} from "@/components/language-provider";

const navItems = ["Trip Planner", "Smart Trips", "How It Works", "Inspiration"];

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
  { value: "tr", label: "TR" }
];

const currencyOptions: Array<{ value: Currency; label: string }> = [
  { value: "USD", label: "USD" },
  { value: "RUB", label: "RUB" },
  { value: "TRY", label: "TRY" }
];

export function Header() {
  const { language, setLanguage, currency, setCurrency } = useLanguage();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const currencyMenuRef = useRef<HTMLDivElement | null>(null);
  const labels =
    language === "ru"
      ? {
          nav: ["Планировщик", "Умные поездки", "Как это работает", "Вдохновение"],
          cta: "Спланировать поездку"
        }
      : language === "tr"
        ? {
            nav: ["Seyahat Planlayıcı", "Akıllı Rotalar", "Nasıl Çalışır", "İlham"],
            cta: "Seyahatimi Planla"
          }
        : {
            nav: navItems,
            cta: "Plan My Trip"
          };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
      if (!currencyMenuRef.current?.contains(event.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-6 lg:px-8">
        <div className="flex items-center text-[1.75rem] font-extrabold tracking-[-0.05em] text-white">
          cheaplygo
          <span className="ml-1 inline-block h-3 w-3 rounded-full bg-chartreuse" />
        </div>

        <nav className="hidden items-center gap-10 text-sm font-semibold text-white lg:flex">
          {navItems.map((item, index) => (
            <a
              key={item}
              href={
                item === "Trip Planner"
                  ? "/planner"
                  : item === "Smart Trips"
                    ? "#smart-trips"
                    : item === "How It Works"
                      ? "#how-it-works"
                      : "#inspiration"
              }
              className="text-white/95 transition hover:text-white"
            >
              <span className="relative">
                {labels.nav[index]}
                {index === 0 ? (
                  <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-chartreuse" />
                ) : null}
              </span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div ref={languageMenuRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setCurrencyMenuOpen(false);
                setLanguageMenuOpen((open) => !open);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/14"
            >
              {language.toUpperCase()}
              <ChevronDown
                className={`h-4 w-4 transition ${languageMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {languageMenuOpen ? (
              <div className="absolute right-0 mt-2 min-w-[7rem] rounded-2xl border border-white/15 bg-slateBlue/70 p-1.5 text-white shadow-xl backdrop-blur-xl">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setLanguage(option.value);
                      setLanguageMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                      language === option.value
                        ? "bg-white text-slateBlue"
                        : "text-white/88 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    {language === option.value ? <span>•</span> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div ref={currencyMenuRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setLanguageMenuOpen(false);
                setCurrencyMenuOpen((open) => !open);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/14"
            >
              {currency}
              <ChevronDown
                className={`h-4 w-4 transition ${currencyMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {currencyMenuOpen ? (
              <div className="absolute right-0 mt-2 min-w-[7rem] rounded-2xl border border-white/15 bg-slateBlue/70 p-1.5 text-white shadow-xl backdrop-blur-xl">
                {currencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setCurrency(option.value);
                      setCurrencyMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                      currency === option.value
                        ? "bg-white text-slateBlue"
                        : "text-white/88 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    {currency === option.value ? <span>•</span> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <a
            href="/planner"
            className="inline-flex items-center rounded-full bg-chartreuse px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
          >
            {labels.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
