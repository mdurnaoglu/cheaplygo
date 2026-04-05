import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER;

type GroupedPrice = {
  price: number;
  departure_at: string;
  link: string;
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

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildSearchResultsUrl({
  origin,
  destination,
  departDate,
  returnDate,
  tripMode
}: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  tripMode: "oneway" | "roundtrip";
}) {
  const url = new URL("https://www.aviasales.com/flights/");
  if (MARKER) {
    url.searchParams.set("marker", MARKER);
  }
  url.searchParams.set("adults", "1");
  url.searchParams.set("children", "0");
  url.searchParams.set("infants", "0");
  url.searchParams.set("trip_class", "0");
  url.searchParams.set("currency", "EUR");
  url.searchParams.set("locale", "en");
  url.searchParams.set("segments[0][origin_iata]", origin);
  url.searchParams.set("segments[0][destination_iata]", destination);
  url.searchParams.set("segments[0][depart_date]", departDate);

  if (tripMode === "roundtrip" && returnDate) {
    url.searchParams.set("segments[1][origin_iata]", destination);
    url.searchParams.set("segments[1][destination_iata]", origin);
    url.searchParams.set("segments[1][depart_date]", returnDate);
  }

  return url.toString();
}

async function fetchGroupedPrice(
  origin: string,
  destination: string,
  departureAt: string
) {
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
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`Travelpayouts API failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Record<string, GroupedPrice>;
  };

  return Object.values(payload.data ?? {});
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const mode = searchParams.get("mode");
  const tripMode = searchParams.get("tripMode");
  const exactDate = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "origin and destination are required" },
      { status: 400 }
    );
  }

  try {
    let prices: GroupedPrice[] = [];

    if (mode === "exact" && exactDate) {
      prices = await fetchGroupedPrice(origin, destination, exactDate);
    } else {
      const monthlyResults = await Promise.all(
        Array.from({ length: 6 }, (_, index) =>
          fetchGroupedPrice(origin, destination, monthOffset(index))
        )
      );
      prices = monthlyResults.flat();
    }

    const valid = prices
      .filter((item) => item.link && item.departure_at && Number.isFinite(item.price))
      .sort((a, b) => a.price - b.price);

    const best = valid[0];

    if (!best) {
      return NextResponse.json(
        { error: "No live fares found for this route" },
        { status: 404 }
      );
    }

    const bestDepartDate = best.departure_at.slice(0, 10);
    const safeReturnDate =
      tripMode === "roundtrip"
        ? mode === "exact" && returnDate && returnDate >= bestDepartDate
          ? returnDate
          : addDays(bestDepartDate, 4)
        : undefined;

    const url = buildSearchResultsUrl({
      origin,
      destination,
      departDate: mode === "exact" && exactDate ? exactDate : bestDepartDate,
      returnDate: safeReturnDate,
      tripMode: tripMode === "oneway" ? "oneway" : "roundtrip"
    });

    return NextResponse.json({
      price: best.price,
      departureAt: best.departure_at,
      url
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected API integration error"
      },
      { status: 500 }
    );
  }
}
