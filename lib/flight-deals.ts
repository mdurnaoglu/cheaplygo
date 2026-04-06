export type VisaTag = "schengen" | "visa-free" | "e-visa";
export type MarketKey = "turkey" | "russia" | "germany";

export type DestinationSeed = {
  code: string;
  city: string;
  country: string;
  visaTag: VisaTag;
};

export const DEAL_MARKETS: Record<
  MarketKey,
  {
    slug: string;
    originCode: string;
    originCity: string;
    originCountry: string;
    displayName: {
      tr: string;
      en: string;
      ru: string;
    };
    summary: {
      tr: string;
      en: string;
      ru: string;
    };
    destinations: DestinationSeed[];
  }
> = {
  turkey: {
    slug: "turkiye",
    originCode: "IST",
    originCity: "Istanbul",
    originCountry: "Turkey",
    displayName: {
      tr: "Türkiye",
      en: "Turkey",
      ru: "Турция"
    },
    summary: {
      tr: "Türkiye kalkışlı en uygun yurtdışı uçuşları, cache'lenmiş canlı fiyatlarla inceleyin.",
      en: "Explore the best outbound flight deals from Turkey with cached live fares.",
      ru: "Изучайте лучшие вылеты из Турции с кэшированными живыми тарифами."
    },
    destinations: [
      { code: "BER", city: "Berlin", country: "Germany", visaTag: "schengen" },
      { code: "BEG", city: "Belgrade", country: "Serbia", visaTag: "visa-free" },
      { code: "TBS", city: "Tbilisi", country: "Georgia", visaTag: "visa-free" },
      { code: "BCN", city: "Barcelona", country: "Spain", visaTag: "schengen" },
      { code: "BUD", city: "Budapest", country: "Hungary", visaTag: "schengen" },
      { code: "FCO", city: "Rome", country: "Italy", visaTag: "schengen" },
      { code: "PAR", city: "Paris", country: "France", visaTag: "schengen" },
      { code: "VIE", city: "Vienna", country: "Austria", visaTag: "schengen" },
      { code: "ATH", city: "Athens", country: "Greece", visaTag: "schengen" },
      { code: "PRG", city: "Prague", country: "Czechia", visaTag: "schengen" }
    ]
  },
  russia: {
    slug: "rusya",
    originCode: "MOW",
    originCity: "Moscow",
    originCountry: "Russia",
    displayName: {
      tr: "Rusya",
      en: "Russia",
      ru: "Россия"
    },
    summary: {
      tr: "Rusya kalkışlı fırsat uçuşlarını hızlıca açın ve en düşük yurtdışı ücretlerini görün.",
      en: "Open outbound flight deals from Russia and compare the lowest cached international fares.",
      ru: "Открывайте выгодные вылеты из России и сравнивайте самые низкие международные тарифы."
    },
    destinations: [
      { code: "AER", city: "Sochi", country: "Russia", visaTag: "visa-free" },
      { code: "LED", city: "Saint Petersburg", country: "Russia", visaTag: "visa-free" },
      { code: "KGD", city: "Kaliningrad", country: "Russia", visaTag: "visa-free" },
      { code: "KZN", city: "Kazan", country: "Russia", visaTag: "visa-free" },
      { code: "DXB", city: "Dubai", country: "UAE", visaTag: "visa-free" },
      { code: "IST", city: "Istanbul", country: "Turkey", visaTag: "visa-free" },
      { code: "TBS", city: "Tbilisi", country: "Georgia", visaTag: "visa-free" },
      { code: "EVN", city: "Yerevan", country: "Armenia", visaTag: "visa-free" },
      { code: "BEG", city: "Belgrade", country: "Serbia", visaTag: "visa-free" },
      { code: "BAK", city: "Baku", country: "Azerbaijan", visaTag: "e-visa" }
    ]
  },
  germany: {
    slug: "almanya",
    originCode: "BER",
    originCity: "Berlin",
    originCountry: "Germany",
    displayName: {
      tr: "Almanya",
      en: "Germany",
      ru: "Германия"
    },
    summary: {
      tr: "Almanya çıkışlı popüler rotalarda cache'lenmiş canlı fiyatlarla en iyi fırsatları bulun.",
      en: "See the strongest outbound deals from Germany with cached live fares on popular routes.",
      ru: "Смотрите лучшие вылеты из Германии с кэшированными живыми тарифами по популярным направлениям."
    },
    destinations: [
      { code: "BCN", city: "Barcelona", country: "Spain", visaTag: "visa-free" },
      { code: "BEG", city: "Belgrade", country: "Serbia", visaTag: "visa-free" },
      { code: "BUD", city: "Budapest", country: "Hungary", visaTag: "visa-free" },
      { code: "TBS", city: "Tbilisi", country: "Georgia", visaTag: "visa-free" },
      { code: "IST", city: "Istanbul", country: "Turkey", visaTag: "visa-free" },
      { code: "FCO", city: "Rome", country: "Italy", visaTag: "visa-free" },
      { code: "ATH", city: "Athens", country: "Greece", visaTag: "visa-free" },
      { code: "LIS", city: "Lisbon", country: "Portugal", visaTag: "visa-free" },
      { code: "PRG", city: "Prague", country: "Czechia", visaTag: "visa-free" },
      { code: "VIE", city: "Vienna", country: "Austria", visaTag: "visa-free" }
    ]
  }
};

export const DEAL_MARKET_ORDER: MarketKey[] = ["turkey", "russia", "germany"];

export function isMarketKey(value: string): value is MarketKey {
  return value in DEAL_MARKETS;
}

export function getMarketBySlug(slug: string) {
  return DEAL_MARKET_ORDER.find((market) => DEAL_MARKETS[market].slug === slug) ?? null;
}
