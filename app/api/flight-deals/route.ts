import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER;
const allowedCurrencies = new Set(["usd", "eur", "rub", "try"]);
const allowedLocales = new Set(["en", "ru", "tr"]);

type GroupedPrice = {
  price: number;
  departure_at: string;
  link: string;
};

type DestinationSeed = {
  code: string;
  city: string;
  country: string;
  visaTag: "schengen" | "visa-free" | "e-visa";
};

type MarketKey = "turkey" | "russia" | "germany";

const DEAL_MARKETS: Record<
  MarketKey,
  {
    originCode: string;
    originCity: string;
    originCountry: string;
    destinations: DestinationSeed[];
  }
> = {
  turkey: {
    originCode: "IST",
    originCity: "Istanbul",
    originCountry: "Turkey",
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
    originCode: "MOW",
    originCity: "Moscow",
    originCountry: "Russia",
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
    originCode: "BER",
    originCity: "Berlin",
    originCountry: "Germany",
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

function monthOffset(offset: number) {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}

function buildAffiliateUrl(path: string, options?: { currency?: string; locale?: string }) {
  const url = new URL(`https://www.aviasales.com${path}`);
  if (MARKER) {
    url.searchParams.set("marker", MARKER);
  }
  if (options?.currency && allowedCurrencies.has(options.currency)) {
    url.searchParams.set("currency", options.currency);
  }
  if (options?.locale && allowedLocales.has(options.locale)) {
    url.searchParams.set("locale", options.locale);
  }
  return url.toString();
}

async function fetchGroupedPrices(
  origin: string,
  destination: string,
  departureAt: string,
  options?: { currency?: string; locale?: string }
) {
  if (!TOKEN) {
    throw new Error("Missing TRAVELPAYOUTS_TOKEN");
  }

  const params = new URLSearchParams({
    origin,
    destination,
    departure_at: departureAt,
    group_by: "departure_at",
    currency: options?.currency && allowedCurrencies.has(options.currency) ? options.currency : "eur",
    locale: options?.locale && allowedLocales.has(options.locale) ? options.locale : "en",
    token: TOKEN
  });

  const response = await fetch(
    `https://api.travelpayouts.com/aviasales/v3/grouped_prices?${params.toString()}`,
    { next: { revalidate: 21600 } }
  );

  if (!response.ok) {
    throw new Error(`Travelpayouts API failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Record<string, GroupedPrice>;
  };

  return Object.values(payload.data ?? {}).filter(
    (item) => item.link && item.departure_at && Number.isFinite(item.price)
  );
}

export async function GET(request: NextRequest) {
  const marketParam = request.nextUrl.searchParams.get("market") as MarketKey | null;
  const market = marketParam && marketParam in DEAL_MARKETS ? marketParam : "turkey";
  const selectedMarket = DEAL_MARKETS[market];
  const currency = request.nextUrl.searchParams.get("currency")?.toLowerCase() ?? "eur";
  const locale = request.nextUrl.searchParams.get("locale")?.toLowerCase() ?? "en";

  try {
    const deals = await Promise.all(
      selectedMarket.destinations.map(async (destination) => {
        const monthlyResults = await Promise.all(
          Array.from({ length: 4 }, (_, index) =>
            fetchGroupedPrices(selectedMarket.originCode, destination.code, monthOffset(index), {
              currency,
              locale
            })
          )
        );

        const cheapest = monthlyResults
          .flat()
          .sort((left, right) => left.price - right.price)[0];

        if (!cheapest) {
          return null;
        }

        return {
          id: `${selectedMarket.originCode}-${destination.code}`,
          originCode: selectedMarket.originCode,
          originCity: selectedMarket.originCity,
          originCountry: selectedMarket.originCountry,
          destinationCode: destination.code,
          destinationCity: destination.city,
          destinationCountry: destination.country,
          visaTag: destination.visaTag,
          price: cheapest.price,
          currency,
          departureAt: cheapest.departure_at,
          url: buildAffiliateUrl(cheapest.link, { currency, locale })
        };
      })
    );

    return NextResponse.json(
      {
        market,
        originCity: selectedMarket.originCity,
        deals: deals.filter(Boolean)
      },
      {
        headers: {
          "Cache-Control": "s-maxage=21600, stale-while-revalidate=86400"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not build flight deals"
      },
      { status: 500 }
    );
  }
}
