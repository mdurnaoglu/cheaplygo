"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, PlaneTakeoff } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

type MarketKey = "turkey" | "russia" | "germany";

type DealItem = {
  id: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  priceEur: number;
  departureAt: string;
  url: string;
};

const currencyConfig = {
  USD: { locale: "en-US", currency: "USD", rateFromEur: 1.09 },
  RUB: { locale: "ru-RU", currency: "RUB", rateFromEur: 101.5 },
  TRY: { locale: "tr-TR", currency: "TRY", rateFromEur: 41.2 }
} as const;

export function FlightDealsStrip() {
  const { language, currency } = useLanguage();
  const [market, setMarket] = useState<MarketKey>("turkey");
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const copy = useMemo(
    () =>
      language === "ru"
        ? {
            label: "Актуальные перелёты",
            title: "Дешёвые перелёты, которые можно открыть сразу",
            description:
              "Мы кэшируем самые дешёвые найденные тарифы по готовым направлениям и обновляем их для каждой стартовой страны.",
            loading: "Подбираем дешёвые перелёты...",
            error: "Сейчас не удалось загрузить дешёвые перелёты.",
            cta: "Открыть перелёт",
            from: "Из",
            dealsFrom: "дешёвые перелёты из",
            countries: {
              turkey: "Турция",
              russia: "Россия",
              germany: "Германия"
            }
          }
        : language === "tr"
          ? {
              label: "Fırsat uçuşlar",
              title: "Hemen açabileceğin en ucuz uçuşlar",
              description:
                "Hazır destinasyon listeleri için en düşük canlı ücretleri cache’liyoruz ve her çıkış ülkesi için güncelliyoruz.",
              loading: "Fırsat uçuşlar yükleniyor...",
              error: "Fırsat uçuşlar şu an yüklenemedi.",
              cta: "Uçuşu aç",
              from: "Kalkış",
              dealsFrom: "çıkışlı fırsat uçuşlar",
              countries: {
                turkey: "Türkiye",
                russia: "Rusya",
                germany: "Almanya"
              }
            }
          : {
              label: "Deal flights",
              title: "Cheapest flights you can open instantly",
              description:
                "We cache the lowest live fares across ready-made destinations and refresh them per departure country.",
              loading: "Loading cheapest flights...",
              error: "Cheapest flights could not be loaded right now.",
              cta: "Open flight",
              from: "From",
              dealsFrom: "cheap flights from",
              countries: {
                turkey: "Turkey",
                russia: "Russia",
                germany: "Germany"
              }
            },
    [language]
  );

  useEffect(() => {
    if (language === "ru") {
      setMarket("russia");
    } else if (language === "tr") {
      setMarket("turkey");
    } else {
      setMarket("germany");
    }
  }, [language]);

  useEffect(() => {
    let cancelled = false;

    const loadDeals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/flight-deals?market=${market}`);
        const payload = (await response.json()) as { deals?: DealItem[]; error?: string };

        if (!response.ok || !payload.deals) {
          throw new Error(payload.error ?? "Could not load deals");
        }

        if (!cancelled) {
          setDeals(payload.deals);
        }
      } catch (error) {
        if (!cancelled) {
          setDeals([]);
          setError(error instanceof Error ? error.message : "Could not load deals");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadDeals();
    return () => {
      cancelled = true;
    };
  }, [market]);

  const formatPrice = (basePriceEur: number) => {
    const current = currencyConfig[currency];
    return new Intl.NumberFormat(current.locale, {
      style: "currency",
      currency: current.currency,
      maximumFractionDigits: 0
    }).format(basePriceEur * current.rateFromEur);
  };

  const scrollTrack = (direction: "left" | "right") => {
    if (!trackRef.current) {
      return;
    }

    trackRef.current.scrollBy({
      left: direction === "right" ? 980 : -980,
      behavior: "smooth"
    });
  };

  return (
    <div className="mb-10 rounded-[2rem] bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {copy.label}
          </p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-ink sm:text-4xl">
            {copy.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">{copy.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(copy.countries) as MarketKey[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMarket(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                market === item
                  ? "bg-chartreuse text-black"
                  : "border border-slate-200 bg-white text-slateBlue hover:border-chartreuse/40"
              }`}
            >
              {copy.countries[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-500">
          {copy.countries[market]} {copy.dealsFrom}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTrack("left")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slateBlue transition hover:border-chartreuse hover:text-ink"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack("right")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slateBlue transition hover:border-chartreuse hover:text-ink"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-[1.5rem] bg-slate-50 px-5 py-6 text-sm font-medium text-slate-500">
          {copy.loading}
        </div>
      ) : error ? (
        <div className="mt-5 rounded-[1.5rem] bg-slate-50 px-5 py-6 text-sm font-medium text-slate-500">
          {copy.error}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {deals.map((deal) => (
            <article
              key={deal.id}
              className="min-w-[18rem] flex-1 snap-start rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 md:min-w-[15rem] lg:min-w-[calc((100%-3rem)/4)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {copy.from}
                  </p>
                  <h4 className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-ink">
                    {deal.originCity} - {deal.destinationCity}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">{deal.destinationCountry}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-chartreuse text-black">
                  <PlaneTakeoff className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-4xl font-black tracking-[-0.05em] text-slateBlue">
                  {formatPrice(deal.priceEur)}
                </p>
                <p className="mt-2 text-sm text-slate-500">{deal.departureAt.slice(0, 10)}</p>
              </div>

              <a
                href={deal.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-chartreuse px-4 py-3 text-sm font-bold text-black transition hover:brightness-95"
              >
                {copy.cta}
                <ChevronRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
