"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  BookOpenText,
  ChevronDown,
  Compass,
  Globe,
  Map,
  PlaneTakeoff
} from "lucide-react";
import {
  buildStaySearchLink,
  getPopularRouteLinks,
  getPreferredMarket
} from "@/lib/explore";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getStayDealsForMarket } from "@/lib/explore";
import {
  useLanguage,
  type Currency,
  type Language
} from "@/components/language-provider";

const navItems = ["Trip Planner", "Smart Trips", "How It Works", "Discover"];

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
  activeNav?: "planner" | "smart-trips" | "how-it-works" | "discover" | null;
};

export function Header({
  theme = "dark",
  activeNav = "planner"
}: HeaderProps) {
  const { language, setLanguage, currency, setCurrency } = useLanguage();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const currencyMenuRef = useRef<HTMLDivElement | null>(null);
  const discoverMenuRef = useRef<HTMLDivElement | null>(null);
  const isDarkTheme = theme === "dark";

  const labels =
    language === "ru"
      ? {
          nav: ["Планировщик", "Умные поездки", "Как это работает", "Исследовать"],
          cta: "Спланировать поездку",
          offers: "Предложения",
          discover: "Открыть",
          domestic: "Популярные маршруты по стране",
          international: "Популярные зарубежные маршруты",
          flightDeals: "Выгодные перелёты",
          stayDeals: "Выгодные отели",
          blog: "Cheaplygo Blog",
          visa: "Визовый гид",
          idEntry: "Страны по ID",
          cheapStay: "Недорогие отели",
          flightMap: "Карта рейсов",
          open: "Открыть"
        }
      : language === "tr"
        ? {
            nav: ["Seyahat Planlayıcı", "Akıllı Rotalar", "Nasıl Çalışır", "Keşfet"],
            cta: "Seyahatimi Planla",
            offers: "Fırsatlar",
            discover: "Keşfet",
            domestic: "Yurt İçi Popüler Destinasyonlar",
            international: "Yurt Dışı Popüler Destinasyonlar",
            flightDeals: "Fırsat Uçuşlar",
            stayDeals: "Fırsat Konaklamalar",
            blog: "Cheaplygo Blog",
            visa: "Vize Rehberi",
            idEntry: "Kimlikle Girilen Ülkeler",
            cheapStay: "Ucuz Konaklamalı Ülkeler",
            flightMap: "Uçuş Haritası",
            open: "Aç"
          }
      : {
          nav: navItems,
          cta: "Plan My Trip",
          offers: "Offers",
          discover: "Explore",
          domestic: "Popular Domestic Destinations",
          international: "Popular International Destinations",
          flightDeals: "Deal Flights",
          stayDeals: "Deal Stays",
          blog: "Cheaplygo Blog",
          visa: "Visa Guide",
          idEntry: "ID Entry Countries",
          cheapStay: "Affordable Stay Countries",
          flightMap: "Flight Map",
          open: "Open"
        };

  const routeGroups = useMemo(
    () => getPopularRouteLinks(language, currency),
    [currency, language]
  );
  const preferredMarket = getPreferredMarket(language);
  const featuredStay = getStayDealsForMarket(preferredMarket)[0];

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
      if (!currencyMenuRef.current?.contains(event.target as Node)) {
        setCurrencyMenuOpen(false);
      }
      if (!discoverMenuRef.current?.contains(event.target as Node)) {
        setDiscoverOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const navLinks = ["/planner", "/#smart-trips", "/#how-it-works"] as const;
  const navKeys = ["planner", "smart-trips", "how-it-works", "discover"] as const;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
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
          {navItems.slice(0, 3).map((item, index) => (
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

          <div
            ref={discoverMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setDiscoverOpen((current) => {
                  const next = !current;
                  trackAnalyticsEvent("discover_menu_toggle", {
                    menu_state: next ? "open" : "closed",
                    menu_label: labels.nav[3],
                    page_path: window.location.pathname
                  });
                  return next;
                });
              }}
              className={clsx(
                "inline-flex items-center gap-2 transition",
                isDarkTheme ? "text-white/95 hover:text-white" : "text-slate-600 hover:text-ink"
              )}
            >
              <span className="relative">
                {labels.nav[3]}
                {activeNav === "discover" ? (
                  <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-chartreuse" />
                ) : null}
              </span>
              <ChevronDown className={clsx("h-4 w-4 transition", discoverOpen && "rotate-180")} />
            </button>

            {discoverOpen ? (
              <div
                onClick={(event) => event.stopPropagation()}
                className="pointer-events-auto absolute left-1/2 top-full z-50 mt-5 w-[min(1120px,calc(100vw-80px))] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_70px_rgba(15,23,42,0.18)]"
              >
                <div className="grid grid-cols-4">
                  <div className="border-r border-slate-200 p-8">
                    <div className="flex items-center gap-3 text-lg font-bold text-ink">
                      <Compass className="h-5 w-5 text-chartreuse" />
                      {labels.offers}
                    </div>
                    <div className="mt-8 space-y-5">
                      <Link
                        href="/firsat-ucuslar"
                        onClick={() => {
                          trackAnalyticsEvent("discover_menu_item_click", {
                            section: "offers",
                            item_name: "flight_deals",
                            destination_type: "internal"
                          });
                          setDiscoverOpen(false);
                        }}
                        className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                      >
                        {labels.flightDeals}
                      </Link>
                      <Link
                        href="/firsat-konaklamalar"
                        onClick={() => {
                          trackAnalyticsEvent("discover_menu_item_click", {
                            section: "offers",
                            item_name: "stay_deals",
                            destination_type: "internal"
                          });
                          setDiscoverOpen(false);
                        }}
                        className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                      >
                        {labels.stayDeals}
                      </Link>
                    </div>

                    <a
                      href={buildStaySearchLink({
                        city: featuredStay.city,
                        country: featuredStay.country
                      })}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        trackAnalyticsEvent("discover_menu_item_click", {
                          section: "offers",
                          item_name: "featured_stay_card",
                          destination_type: "external",
                          destination_city: featuredStay.city
                        });
                        setDiscoverOpen(false);
                      }}
                      className="mt-8 block overflow-hidden rounded-[1.5rem] border border-chartreuse/50 bg-[#fffbea]"
                    >
                      <img
                        src={featuredStay.image}
                        alt={featuredStay.city}
                        className="h-32 w-full object-cover"
                      />
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {labels.stayDeals}
                        </p>
                        <p className="mt-2 text-lg font-bold text-ink">
                          {featuredStay.city} {featuredStay.nightlyFrom}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {featuredStay.highlight}
                        </p>
                      </div>
                    </a>
                  </div>

                  <div className="border-r border-slate-200 p-8">
                    <div className="flex items-center gap-3 text-lg font-bold text-ink">
                      <BookOpenText className="h-5 w-5 text-chartreuse" />
                      {labels.discover}
                    </div>
                    <div className="mt-8 space-y-5">
                      <Link
                        href="/blog"
                        onClick={() => {
                          trackAnalyticsEvent("discover_menu_item_click", {
                            section: "discover",
                            item_name: "blog_hub",
                            destination_type: "internal"
                          });
                          setDiscoverOpen(false);
                        }}
                        className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                      >
                        {labels.blog}
                      </Link>
                      <Link
                        href="/vize-rehberi"
                        onClick={() => {
                          trackAnalyticsEvent("discover_menu_item_click", {
                            section: "discover",
                            item_name: "visa_guide",
                            destination_type: "internal"
                          });
                          setDiscoverOpen(false);
                        }}
                        className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                      >
                        {labels.visa}
                      </Link>
                      <Link
                        href="/kimlikle-gidilen-ulkeler"
                        onClick={() => {
                          trackAnalyticsEvent("discover_menu_item_click", {
                            section: "discover",
                            item_name: "id_entry_countries",
                            destination_type: "internal"
                          });
                          setDiscoverOpen(false);
                        }}
                        className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                      >
                        {labels.idEntry}
                      </Link>
                      <Link
                        href="/ucuz-konaklamali-ulkeler"
                        onClick={() => {
                          trackAnalyticsEvent("discover_menu_item_click", {
                            section: "discover",
                            item_name: "affordable_stay_countries",
                            destination_type: "internal"
                          });
                          setDiscoverOpen(false);
                        }}
                        className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                      >
                        {labels.cheapStay}
                      </Link>
                    </div>
                  </div>

                  <div className="border-r border-slate-200 p-8">
                    <div className="flex items-center gap-3 text-lg font-bold text-ink">
                      <Map className="h-5 w-5 text-chartreuse" />
                      {labels.domestic}
                    </div>
                    <a
                      href={routeGroups.domestic[0].href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        trackAnalyticsEvent("discover_menu_item_click", {
                          section: "domestic_destinations",
                          item_name: "flight_map",
                          destination_type: "external",
                          origin_city: routeGroups.originCity
                        });
                        setDiscoverOpen(false);
                      }}
                      className="mt-8 flex items-center justify-between rounded-[1.25rem] border border-chartreuse/60 bg-[#fffbea] px-5 py-4 font-bold text-slateBlue"
                    >
                      {labels.flightMap}
                      <PlaneTakeoff className="h-5 w-5" />
                    </a>
                    <div className="mt-6 space-y-4">
                      {routeGroups.domestic.map((route) => (
                        <a
                          key={route.label}
                          href={route.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            trackAnalyticsEvent("aviasales_route_click", {
                              section: "domestic_destinations",
                              route_label: route.label,
                              origin_city: routeGroups.originCity
                            });
                            setDiscoverOpen(false);
                          }}
                          className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                        >
                          {route.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-3 text-lg font-bold text-ink">
                      <Globe className="h-5 w-5 text-chartreuse" />
                      {labels.international}
                    </div>
                    <a
                      href={routeGroups.international[0].href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        trackAnalyticsEvent("discover_menu_item_click", {
                          section: "international_destinations",
                          item_name: "flight_map",
                          destination_type: "external",
                          origin_city: routeGroups.originCity
                        });
                        setDiscoverOpen(false);
                      }}
                      className="mt-8 flex items-center justify-between rounded-[1.25rem] border border-chartreuse/60 bg-[#fffbea] px-5 py-4 font-bold text-slateBlue"
                    >
                      {labels.flightMap}
                      <PlaneTakeoff className="h-5 w-5" />
                    </a>
                    <div className="mt-6 space-y-4">
                      {routeGroups.international.map((route) => (
                        <a
                          key={route.label}
                          href={route.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            trackAnalyticsEvent("aviasales_route_click", {
                              section: "international_destinations",
                              route_label: route.label,
                              origin_city: routeGroups.originCity
                            });
                            setDiscoverOpen(false);
                          }}
                          className="block text-[1.1rem] font-semibold text-slate-700 transition hover:text-slateBlue"
                        >
                          {route.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <div ref={languageMenuRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setCurrencyMenuOpen(false);
                setDiscoverOpen(false);
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
                setDiscoverOpen(false);
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
