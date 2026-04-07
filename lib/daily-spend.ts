export type DailySpendTier = {
  backpacker: number;
  balanced: number;
  luxury: number;
};

type DailySpendProfile = {
  city: string;
  country: string;
  tiers: DailySpendTier;
};

const cityProfiles: DailySpendProfile[] = [
  { city: "Tbilisi", country: "Georgia", tiers: { backpacker: 13, balanced: 35, luxury: 101 } },
  { city: "Batumi", country: "Georgia", tiers: { backpacker: 14, balanced: 38, luxury: 111 } },
  { city: "Belgrade", country: "Serbia", tiers: { backpacker: 23, balanced: 57, luxury: 145 } },
  { city: "Novi Sad", country: "Serbia", tiers: { backpacker: 25, balanced: 61, luxury: 150 } },
  { city: "Barcelona", country: "Spain", tiers: { backpacker: 82, balanced: 211, luxury: 554 } },
  { city: "Madrid", country: "Spain", tiers: { backpacker: 86, balanced: 218, luxury: 554 } },
  { city: "Paris", country: "France", tiers: { backpacker: 117, balanced: 313, luxury: 889 } },
  { city: "Nice", country: "France", tiers: { backpacker: 110, balanced: 285, luxury: 760 } },
  { city: "New York City", country: "United States", tiers: { backpacker: 131, balanced: 363, luxury: 1101 } },
  { city: "Miami", country: "United States", tiers: { backpacker: 110, balanced: 280, luxury: 700 } },
  { city: "Rome", country: "Italy", tiers: { backpacker: 94, balanced: 245, luxury: 663 } },
  { city: "Milan", country: "Italy", tiers: { backpacker: 105, balanced: 260, luxury: 700 } },
  { city: "Moscow", country: "Russia", tiers: { backpacker: 36, balanced: 86, luxury: 195 } },
  { city: "Saint Petersburg", country: "Russia", tiers: { backpacker: 34, balanced: 82, luxury: 180 } }
];

const countryFallbacks: Record<string, DailySpendTier> = {
  georgia: { backpacker: 14, balanced: 38, luxury: 111 },
  serbia: { backpacker: 20, balanced: 54, luxury: 137 },
  spain: { backpacker: 86, balanced: 218, luxury: 554 },
  france: { backpacker: 114, balanced: 309, luxury: 820 },
  "united states": { backpacker: 120, balanced: 325, luxury: 850 },
  usa: { backpacker: 120, balanced: 325, luxury: 850 },
  italy: { backpacker: 93, balanced: 235, luxury: 610 },
  russia: { backpacker: 36, balanced: 84, luxury: 190 }
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function getDailySpendForecast(city: string, country: string) {
  const normalizedCity = normalize(city);
  const normalizedCountry = normalize(country);

  const byCity = cityProfiles.find(
    (item) =>
      normalize(item.city) === normalizedCity &&
      normalize(item.country) === normalizedCountry
  );

  if (byCity) {
    return byCity;
  }

  const fallback = countryFallbacks[normalizedCountry];

  if (!fallback) {
    return null;
  }

  return {
    city,
    country,
    tiers: fallback
  };
}
