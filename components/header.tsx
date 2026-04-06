"use client";

import { useLanguage } from "@/components/language-provider";

const navItems = ["Trip Planner", "Smart Trips", "How It Works", "Inspiration"];

export function Header() {
  const { language, setLanguage } = useLanguage();
  const labels =
    language === "ru"
      ? {
          nav: ["Планировщик", "Умные поездки", "Как это работает", "Вдохновение"],
          cta: "Спланировать поездку"
        }
      : {
          nav: navItems,
          cta: "Plan My Trip"
        };

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
          <div className="hidden items-center rounded-full border border-white/25 bg-white/10 p-1 backdrop-blur-md sm:flex">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                language === "en" ? "bg-white text-slateBlue" : "text-white/88"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ru")}
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                language === "ru" ? "bg-white text-slateBlue" : "text-white/88"
              }`}
            >
              RU
            </button>
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
