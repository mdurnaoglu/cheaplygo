"use client";

import { Flame, MoveRight } from "lucide-react";
import { DealCard } from "@/components/deal-card";
import { FlightDealsStrip } from "@/components/flight-deals-strip";
import { Features } from "@/components/features";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { useLanguage } from "@/components/language-provider";

type HomePageProps = {
  featuredBlog: {
    slug: string;
    title: string;
    description: string;
    excerpt: string;
    image: string;
    imageAlt: string;
    readTime: string;
  };
};

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

export function HomePage({ featuredBlog }: HomePageProps) {
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
          heroHeadline: "Умные планы поездок и выгодные авиабилеты",
          title: "Популярные идеи поездок, которые может подобрать планировщик",
          description:
            "Это примеры умных city-break вариантов. Сам планировщик идёт дальше и учитывает тайминг, визовый доступ и стиль проживания для каждого путешественника.",
          cta: "Открыть планировщик",
          blogLabel: "Блог",
          blogTitle: "Блог merkezi için seçilmiş giriş kartı",
          blogCta: "Tüm yazıları aç"
        }
      : language === "tr"
        ? {
            sectionLabel: "Planner ilhamı",
            heroHeadline: "Akıllı seyahat planları ve fırsat uçak biletleri",
            title: "Planlayıcının keşfedebileceği popüler seyahat fikirleri",
            description:
              "Bunlar bütçe odaklı şehir kaçamağı örnekleri. Planlayıcı ise bunun ötesine geçip zamanlama, vize erişimi ve konaklama stilini her yolcuya göre uyarlar.",
            cta: "Seyahat planlayıcıyı aç",
            blogLabel: "Blog",
            blogTitle: "Buradan blog ana sayfasina gecis yap",
            blogCta: "Tum bloglari gor"
          }
      : {
          sectionLabel: "Planner inspiration",
          heroHeadline: "Smart trip plans and flight deals",
          title: "Popular trip ideas your planner can discover",
          description:
            "These are examples of budget-smart city breaks. The planner goes further by adapting timing, visa access, and stay style to each traveler.",
          cta: "Open trip planner",
          blogLabel: "Blog",
          blogTitle: "Use this entry card to open the full blog hub",
          blogCta: "See all blog posts"
        };

  return (
    <main className="pb-10">
      <div className="relative">
        <Header />
        <Hero />
      </div>

      <section className="relative px-4 pt-3 sm:px-6 sm:pt-5 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/95 px-6 py-7 shadow-[0_22px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:px-8 sm:py-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#c9ff05_0%,#dfff66_35%,#326273_100%)]" />
            <div className="absolute -right-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-chartreuse/10 blur-2xl" />
            <div className="absolute -left-6 top-6 h-16 w-16 rounded-full border border-slate-200/80" />

            <h1 className="relative max-w-5xl text-balance text-2xl font-black leading-[1.08] tracking-[-0.05em] text-ink sm:text-3xl lg:text-[2.6rem]">
              {copy.heroHeadline}
            </h1>
          </div>
        </div>
      </section>

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

          <div id="inspiration" className="mt-8">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                <div
                  className="min-h-[280px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${featuredBlog.image}')` }}
                  aria-label={featuredBlog.imageAlt}
                />
                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {copy.blogLabel}
                    </p>
                    <h3 className="mt-3 max-w-[18ch] text-3xl font-extrabold tracking-[-0.05em] text-ink">
                      {copy.blogTitle}
                    </h3>
                    <h4 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-slateBlue">
                      {featuredBlog.title}
                    </h4>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {featuredBlog.readTime}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <a
                    href="/blog"
                    className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-slateBlue px-5 py-3 text-sm font-bold text-white transition hover:bg-[#264756]"
                  >
                    {copy.blogCta}
                    <MoveRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features />
    </main>
  );
}
