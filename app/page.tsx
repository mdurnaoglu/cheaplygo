"use client";

import { Flame, MoveRight } from "lucide-react";
import { DealCard } from "@/components/deal-card";
import { FlightDealsStrip } from "@/components/flight-deals-strip";
import { Features } from "@/components/features";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { useLanguage } from "@/components/language-provider";

const deals = [
  {
    city: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    badge: "Smart Deal",
    duration: "2h 15m",
    basePriceEur: 39,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "Budapest",
    country: "Hungary",
    flag: "🇭🇺",
    badge: "Hot",
    duration: "2h 10m",
    basePriceEur: 49,
    image:
      "https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    badge: "Weekend Deal",
    duration: "3h 20m",
    basePriceEur: 59,
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    badge: "Trending",
    duration: "5h 15m",
    basePriceEur: 129,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80"
  }
];

const currencyConfig = {
  USD: { locale: "en-US", currency: "USD", rateFromEur: 1.09 },
  RUB: { locale: "ru-RU", currency: "RUB", rateFromEur: 101.5 },
  TRY: { locale: "tr-TR", currency: "TRY", rateFromEur: 41.2 }
} as const;

export default function Home() {
  const { language, currency } = useLanguage();
  const formatPrice = (basePriceEur: number) => {
    const current = currencyConfig[currency];
    return new Intl.NumberFormat(current.locale, {
      style: "currency",
      currency: current.currency,
      maximumFractionDigits: 0
    }).format(basePriceEur * current.rateFromEur);
  };

  const copy =
    language === "ru"
      ? {
          sectionLabel: "Вдохновение для планировщика",
          title: "Популярные идеи поездок, которые может подобрать планировщик",
          description:
            "Это примеры умных city-break вариантов. Сам планировщик идёт дальше и учитывает тайминг, визовый доступ и стиль проживания для каждого путешественника.",
          cta: "Открыть планировщик"
        }
      : language === "tr"
        ? {
            sectionLabel: "Planner ilhamı",
            title: "Planlayıcının keşfedebileceği popüler seyahat fikirleri",
            description:
              "Bunlar bütçe odaklı şehir kaçamağı örnekleri. Planlayıcı ise bunun ötesine geçip zamanlama, vize erişimi ve konaklama stilini her yolcuya göre uyarlar.",
            cta: "Seyahat planlayıcıyı aç"
          }
      : {
          sectionLabel: "Planner inspiration",
          title: "Popular trip ideas your planner can discover",
          description:
            "These are examples of budget-smart city breaks. The planner goes further by adapting timing, visa access, and stay style to each traveler.",
          cta: "Open trip planner"
        };

  return (
    <main className="pb-10">
      <div className="relative">
        <Header />
        <Hero />
      </div>

      <section id="smart-trips" className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FlightDealsStrip />

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-7 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chartreuse text-black">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {copy.sectionLabel}
                </p>
                <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-ink sm:text-4xl">
                  {copy.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {copy.description}
                </p>
              </div>
            </div>

            <a
              href="/planner"
              className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm transition hover:border-chartreuse hover:text-slateBlue"
            >
              {copy.cta}
              <MoveRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {deals.map(({ basePriceEur, ...deal }) => (
              <DealCard
                key={deal.city}
                {...deal}
                price={formatPrice(basePriceEur)}
              />
            ))}
          </div>
        </div>
      </section>

      <Features />
    </main>
  );
}
