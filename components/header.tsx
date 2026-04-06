"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import {
  useLanguage,
  type Currency,
  type Language
} from "@/components/language-provider";

const navItems = ["Trip Planner", "Deal Flights", "How It Works", "Inspiration"];

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

type HeaderProps = {
  theme?: "dark" | "light";
  context?: "home" | "blog";
  activeNav?: "planner" | "deal-flights" | "how-it-works" | "blog" | null;
};

export function Header({
  theme = "dark",
  context = "home",
  activeNav = "planner"
}: HeaderProps) {
  const { language, setLanguage, currency, setCurrency } = useLanguage();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const currencyMenuRef = useRef<HTMLDivElement | null>(null);
  const isDarkTheme = theme === "dark";
  const labels =
    language === "ru"
      ? {
          nav: ["Планировщик", "Выгодные перелёты", "Как это работает", "Вдохновение"],
          cta: "Спланировать поездку"
        }
      : language === "tr"
        ? {
            nav: ["Seyahat Planlayıcı", "Fırsat Uçuşlar", "Nasıl Çalışır", "İlham"],
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

  const navLinks =
    context === "blog"
      ? ["/planner", "/firsat-ucuslar", "/#how-it-works", "/blog"]
      : ["/planner", "/firsat-ucuslar", "#how-it-works", "#inspiration"];

  const navKeys = ["planner", "deal-flights", "how-it-works", "blog"] as const;

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-6 lg:px-8">
        <Link
          href="/"
          className={clsx(
            "flex items-center text-[1.75rem] font-extrabold tracking-[-0.05em]",
            isDarkTheme ? "text-white" : "text-ink"
          )}
        >
          cheaplygo
          <span className="ml-1 inline-block h-3 w-3 rounded-full bg-chartreuse" />
        </Link>

        <nav
          className={clsx(
            "hidden items-center gap-10 text-sm font-semibold lg:flex",
            isDarkTheme ? "text-white" : "text-ink"
          )}
        >
          {navItems.map((item, index) => (
            <a
              key={item}
              href={navLinks[index]}
              className={clsx(
                "transition",
                isDarkTheme ? "text-white/95 hover:text-white" : "text-slate-600 hover:text-ink"
              )}
            >
              <span className="relative">
                {labels.nav[index]}
                {activeNav === navKeys[index] ? (
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
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition",
                isDarkTheme
                  ? "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/14"
                  : "border border-slate-200 bg-white text-ink shadow-sm hover:border-slate-300"
              )}
            >
              {language.toUpperCase()}
              <ChevronDown
                className={`h-4 w-4 transition ${languageMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {languageMenuOpen ? (
              <div
                className={clsx(
                  "absolute right-0 mt-2 min-w-[7rem] rounded-2xl p-1.5 shadow-xl",
                  isDarkTheme
                    ? "border border-white/15 bg-slateBlue/70 text-white backdrop-blur-xl"
                    : "border border-slate-200 bg-white text-ink"
                )}
              >
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
                        ? isDarkTheme
                          ? "bg-white text-slateBlue"
                          : "bg-slateBlue text-white"
                        : isDarkTheme
                          ? "text-white/88 hover:bg-white/10 hover:text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-ink"
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
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition",
                isDarkTheme
                  ? "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/14"
                  : "border border-slate-200 bg-white text-ink shadow-sm hover:border-slate-300"
              )}
            >
              {currency}
              <ChevronDown
                className={`h-4 w-4 transition ${currencyMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {currencyMenuOpen ? (
              <div
                className={clsx(
                  "absolute right-0 mt-2 min-w-[7rem] rounded-2xl p-1.5 shadow-xl",
                  isDarkTheme
                    ? "border border-white/15 bg-slateBlue/70 text-white backdrop-blur-xl"
                    : "border border-slate-200 bg-white text-ink"
                )}
              >
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
                        ? isDarkTheme
                          ? "bg-white text-slateBlue"
                          : "bg-slateBlue text-white"
                        : isDarkTheme
                          ? "text-white/88 hover:bg-white/10 hover:text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-ink"
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
