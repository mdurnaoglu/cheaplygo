import { NextRequest, NextResponse } from "next/server";

type TravelpayoutsPlace = {
  id: string;
  type: "city" | "airport";
  code: string;
  name: string;
  city_name?: string | null;
  country_name: string;
};

type PlaceResult = {
  id: string;
  type: "city" | "airport";
  code: string;
  name: string;
  cityName?: string | null;
  country: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term")?.trim();
  const locale = searchParams.get("locale")?.trim() || "en";

  if (!term || term.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    term,
    locale
  });
  params.append("types[]", "city");
  params.append("types[]", "airport");

  try {
    const response = await fetch(
      `https://autocomplete.travelpayouts.com/places2?${params.toString()}`,
      {
        next: { revalidate: 86400 }
      }
    );

    if (!response.ok) {
      throw new Error(`Autocomplete API failed with ${response.status}`);
    }

    const payload = (await response.json()) as TravelpayoutsPlace[];
    const results: PlaceResult[] = payload
      .filter((item) => item.type === "city" || item.type === "airport")
      .slice(0, 10)
      .map((item) => ({
        id: item.id,
        type: item.type,
        code: item.code,
        name: item.name,
        cityName: item.city_name ?? null,
        country: item.country_name
      }));

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Autocomplete lookup failed"
      },
      { status: 500 }
    );
  }
}
