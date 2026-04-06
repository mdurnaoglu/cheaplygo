"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage, type Language } from "@/components/language-provider";

const navItems = ["Trip Planner", "Smart Trips", "How It Works", "Inspiration"];

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
  { value: "tr", label: "TR" }
];

export function Header() {
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const labels =
    language === "ru"
      ? {
          nav: ["Планировщик", "Умные поездки", "Как это работает", "Вдохновение"],
          cta: "Спланировать поездку"
        }
      : language === "tr"
        ? {
            nav: ["Trip Planner", "Akıllı Tripler", "Nasıl Çalışır", "İlham"],
            cta: "Tripimi Planla"
          }
        : {
            nav: navItems,
            cta: "Plan My Trip"
          };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
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
          <div ref={menuRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/14"
            >
              {language.toUpperCase()}
              <ChevronDown
                className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-2 min-w-[7rem] rounded-2xl border border-white/15 bg-slateBlue/70 p-1.5 text-white shadow-xl backdrop-blur-xl">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setLanguage(option.value);
                      setMenuOpen(false);
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
