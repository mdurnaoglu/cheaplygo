import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER;
const allowedCurrencies = new Set(["usd", "eur", "rub", "try"]);
const allowedLocales = new Set(["en", "ru", "tr"]);

type GroupedPrice = {
  price: number;
  departure_at: string;
  return_at?: string;
  link: string;
  transfers?: number;
  return_transfers?: number;
};

function toDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getTripDurationDays(departureAt?: string, returnAt?: string) {
  const departure = toDate(departureAt);
  const returning = toDate(returnAt);

  if (!departure || !returning) {
    return null;
  }

  return Math.round(
    (returning.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function rankPrices(
  prices: GroupedPrice[],
  options?: {
    targetDepartureAt?: string | null;
    targetReturnAt?: string | null;
  }
) {
  const targetDeparture = toDate(options?.targetDepartureAt ?? undefined);
  const targetReturn = toDate(options?.targetReturnAt ?? undefined);
  const targetDuration = getTripDurationDays(
    options?.targetDepartureAt ?? undefined,
    options?.targetReturnAt ?? undefined
  );

  return [...prices].sort((left, right) => {
    const leftDeparture = toDate(left.departure_at);
    const rightDeparture = toDate(right.departure_at);
    const leftReturn = toDate(left.return_at);
    const rightReturn = toDate(right.return_at);

    const leftDepartureDistance = targetDeparture && leftDeparture
      ? Math.abs(leftDeparture.getTime() - targetDeparture.getTime())
      : 0;
    const rightDepartureDistance = targetDeparture && rightDeparture
      ? Math.abs(rightDeparture.getTime() - targetDeparture.getTime())
      : 0;

    if (leftDepartureDistance !== rightDepartureDistance) {
      return leftDepartureDistance - rightDepartureDistance;
    }

    const leftDurationDistance =
      targetDuration !== null
        ? Math.abs(
            (getTripDurationDays(left.departure_at, left.return_at) ?? targetDuration) -
              targetDuration
          )
        : 0;
    const rightDurationDistance =
      targetDuration !== null
        ? Math.abs(
            (getTripDurationDays(right.departure_at, right.return_at) ?? targetDuration) -
              targetDuration
          )
        : 0;

    if (leftDurationDistance !== rightDurationDistance) {
      return leftDurationDistance - rightDurationDistance;
    }

    const leftReturnDistance =
      targetReturn && leftReturn
        ? Math.abs(leftReturn.getTime() - targetReturn.getTime())
        : 0;
    const rightReturnDistance =
      targetReturn && rightReturn
        ? Math.abs(rightReturn.getTime() - targetReturn.getTime())
        : 0;

    if (leftReturnDistance !== rightReturnDistance) {
      return leftReturnDistance - rightReturnDistance;
    }

    return left.price - right.price;
  });
}

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

async function fetchGroupedPrice(
  origin: string,
  destination: string,
  departureAt: string,
  options?: {
    returnAt?: string;
    minTripDuration?: string;
    maxTripDuration?: string;
    direct?: boolean;
    currency?: string;
    locale?: string;
  }
) {
  if (!TOKEN) {
    throw new Error("Missing TRAVELPAYOUTS_TOKEN");
  }

  const params = new URLSearchParams({
    origin,
    destination,
    departure_at: departureAt,
    group_by: "departure_at",
    direct: options?.direct ? "true" : "false",
    currency: options?.currency && allowedCurrencies.has(options.currency) ? options.currency : "eur",
    locale: options?.locale && allowedLocales.has(options.locale) ? options.locale : "en",
    token: TOKEN
  });

  if (options?.returnAt) {
    params.set("return_at", options.returnAt);
  }

  if (options?.minTripDuration) {
    params.set("min_trip_duration", options.minTripDuration);
  }

  if (options?.maxTripDuration) {
    params.set("max_trip_duration", options.maxTripDuration);
  }

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

function filterPricesByConnection(
  prices: GroupedPrice[],
  preference: string | null
) {
  if (preference === "nonstop-only") {
    return prices.filter(
      (item) => (item.transfers ?? 0) === 0 && (item.return_transfers ?? 0) === 0
    );
  }

  if (preference === "connecting-only") {
    return prices.filter(
      (item) => (item.transfers ?? 0) > 0 || (item.return_transfers ?? 0) > 0
    );
  }

  return prices;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const mode = searchParams.get("mode");
  const tripMode = searchParams.get("tripMode");
  const exactDate = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");
  const connectionPreference = searchParams.get("connectionPreference");
  const currency = searchParams.get("currency")?.toLowerCase() ?? "eur";
  const locale = searchParams.get("locale")?.toLowerCase() ?? "en";
  const directOnly = connectionPreference === "nonstop-only";

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "origin and destination are required" },
      { status: 400 }
    );
  }

  try {
    let prices: GroupedPrice[] = [];
    let fallbackUsed = false;

    if (tripMode === "roundtrip") {
      if (mode === "exact" && exactDate && returnDate) {
        prices = await fetchGroupedPrice(origin, destination, exactDate, {
          returnAt: returnDate,
          direct: directOnly,
          currency,
          locale
        });

        if (prices.length === 0) {
          const exactDepartureMonth = exactDate.slice(0, 7);
          const exactReturnMonth = returnDate.slice(0, 7);
          const targetDuration = Math.max(
            1,
            getTripDurationDays(exactDate, returnDate) ?? 3
          );

          prices = await fetchGroupedPrice(origin, destination, exactDepartureMonth, {
            returnAt: exactReturnMonth,
            minTripDuration: String(Math.max(1, targetDuration - 1)),
            maxTripDuration: String(targetDuration + 1),
            direct: directOnly,
            currency,
            locale
          });
          fallbackUsed = prices.length > 0;
        }
      } else {
        const monthlyResults = await Promise.all(
          Array.from({ length: 6 }, (_, index) =>
            fetchGroupedPrice(origin, destination, monthOffset(index), {
              returnAt: monthOffset(index + 1),
              minTripDuration: "3",
              maxTripDuration: "7",
              direct: directOnly,
              currency,
              locale
            })
          )
        );
        prices = monthlyResults.flat();
      }
    } else if (mode === "exact" && exactDate) {
      prices = await fetchGroupedPrice(origin, destination, exactDate, {
        direct: directOnly,
        currency,
        locale
      });
      if (prices.length === 0) {
        prices = await fetchGroupedPrice(origin, destination, exactDate.slice(0, 7), {
          direct: directOnly,
          currency,
          locale
        });
        fallbackUsed = prices.length > 0;
      }
    } else {
      const monthlyResults = await Promise.all(
        Array.from({ length: 6 }, (_, index) =>
          fetchGroupedPrice(origin, destination, monthOffset(index), {
            direct: directOnly,
            currency,
            locale
          })
        )
      );
      prices = monthlyResults.flat();
    }

    const valid = filterPricesByConnection(
      prices.filter((item) => item.link && item.departure_at && Number.isFinite(item.price)),
      connectionPreference
    );

    const best = rankPrices(valid, {
      targetDepartureAt: exactDate,
      targetReturnAt: returnDate
    })[0];

    if (!best) {
      return NextResponse.json(
        { error: "No live fares found for this route" },
        { status: 404 }
      );
    }

    const url = buildAffiliateUrl(best.link, { currency, locale });

    return NextResponse.json({
      price: best.price,
      currency,
      departureAt: best.departure_at,
      returnAt: best.return_at ?? null,
      url,
      fallbackUsed
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
