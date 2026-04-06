import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER;

type GroupedPrice = {
  price: number;
  departure_at: string;
  link: string;
};

type DestinationSeed = {
  code: string;
  city: string;
  country: string;
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
      { code: "BER", city: "Berlin", country: "Germany" },
      { code: "BEG", city: "Belgrade", country: "Serbia" },
      { code: "TBS", city: "Tbilisi", country: "Georgia" },
      { code: "BCN", city: "Barcelona", country: "Spain" },
      { code: "BUD", city: "Budapest", country: "Hungary" },
      { code: "FCO", city: "Rome", country: "Italy" },
      { code: "PAR", city: "Paris", country: "France" },
      { code: "VIE", city: "Vienna", country: "Austria" },
      { code: "ATH", city: "Athens", country: "Greece" },
      { code: "PRG", city: "Prague", country: "Czechia" }
    ]
  },
  russia: {
    originCode: "MOW",
    originCity: "Moscow",
    originCountry: "Russia",
    destinations: [
      { code: "AER", city: "Sochi", country: "Russia" },
      { code: "LED", city: "Saint Petersburg", country: "Russia" },
      { code: "KGD", city: "Kaliningrad", country: "Russia" },
      { code: "KZN", city: "Kazan", country: "Russia" },
      { code: "DXB", city: "Dubai", country: "UAE" },
      { code: "IST", city: "Istanbul", country: "Turkey" },
      { code: "TBS", city: "Tbilisi", country: "Georgia" },
      { code: "EVN", city: "Yerevan", country: "Armenia" },
      { code: "BEG", city: "Belgrade", country: "Serbia" },
      { code: "BAK", city: "Baku", country: "Azerbaijan" }
    ]
  },
  germany: {
    originCode: "BER",
    originCity: "Berlin",
    originCountry: "Germany",
    destinations: [
      { code: "BCN", city: "Barcelona", country: "Spain" },
      { code: "BEG", city: "Belgrade", country: "Serbia" },
      { code: "BUD", city: "Budapest", country: "Hungary" },
      { code: "TBS", city: "Tbilisi", country: "Georgia" },
      { code: "IST", city: "Istanbul", country: "Turkey" },
      { code: "FCO", city: "Rome", country: "Italy" },
      { code: "ATH", city: "Athens", country: "Greece" },
      { code: "LIS", city: "Lisbon", country: "Portugal" },
      { code: "PRG", city: "Prague", country: "Czechia" },
      { code: "VIE", city: "Vienna", country: "Austria" }
    ]
  }
};

function monthOffset(offset: number) {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}

function buildAffiliateUrl(path: string) {
  const url = new URL(`https://www.aviasales.com${path}`);
  if (MARKER) {
    url.searchParams.set("marker", MARKER);
  }
  return url.toString();
}

async function fetchGroupedPrices(origin: string, destination: string, departureAt: string) {
  if (!TOKEN) {
    throw new Error("Missing TRAVELPAYOUTS_TOKEN");
  }

  const params = new URLSearchParams({
    origin,
    destination,
    departure_at: departureAt,
    group_by: "departure_at",
    currency: "eur",
    locale: "en",
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

  try {
    const deals = await Promise.all(
      selectedMarket.destinations.map(async (destination) => {
        const monthlyResults = await Promise.all(
          Array.from({ length: 4 }, (_, index) =>
            fetchGroupedPrices(selectedMarket.originCode, destination.code, monthOffset(index))
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
          priceEur: cheapest.price,
          departureAt: cheapest.departure_at,
          url: buildAffiliateUrl(cheapest.link)
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
