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

    let url = buildAffiliateUrl(best.link);

    if (tripMode === "roundtrip" && mode === "exact" && exactDate && returnDate) {
      const overrideUrl = new URL(url);
      overrideUrl.searchParams.set("depart_date", exactDate);
      overrideUrl.searchParams.set("return_date", returnDate);
      overrideUrl.searchParams.set("oneway", "0");
      url = overrideUrl.toString();
    }

    if (tripMode === "oneway") {
      const overrideUrl = new URL(url);
      overrideUrl.searchParams.set("oneway", "1");
      url = overrideUrl.toString();
    }

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
