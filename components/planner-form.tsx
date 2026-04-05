"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Briefcase,
  CalendarRange,
  Check,
  ChevronDown,
  Euro,
  Gauge,
  Globe2,
  MapPinned,
  Search,
  ShieldCheck,
  Ticket,
  Wallet
} from "lucide-react";

type TravelType = "Domestic" | "International" | "Both";
type VisaStatus = "No visa" | "Schengen visa" | "Other visa";
type DateFlexibility = "Exact dates" | "Flexible dates";
type FlightPreference = "Cabin bag only" | "Checked baggage";
type AccommodationPreference =
  | "Just sleep (budget)"
  | "Breakfast included"
  | "Better experience"
  | "I'll choose my own hotel";

type PlannerState = {
  departures: string[];
  travelType: TravelType;
  citizenship: string;
  visaStatus: VisaStatus;
  budget: number;
  dateFlexibility: DateFlexibility;
  exactDepartureDate: string;
  exactReturnDate: string;
  flightPreference: FlightPreference;
  accommodationPreference: AccommodationPreference;
};

type Recommendation = {
  city: string;
  country: string;
  destinationCode: string;
  estimatedCost: number;
  flightDuration: string;
  visaRequirement: "visa-free" | "visa required";
  experienceMatch: string;
  badge: "Smart Deal" | "Best Match" | "Trending";
  matchScore: number;
  notes: string;
};

type DepartureOption = {
  label: string;
  code: string;
  country: string;
};

const departureOptions: DepartureOption[] = [
  { label: "Istanbul", code: "IST", country: "Turkey" },
  { label: "Sabiha Gokcen", code: "SAW", country: "Turkey" },
  { label: "Ankara", code: "ANK", country: "Turkey" },
  { label: "Izmir", code: "IZM", country: "Turkey" },
  { label: "Antalya", code: "AYT", country: "Turkey" },
  { label: "Bodrum", code: "BJV", country: "Turkey" },
  { label: "Adana", code: "ADA", country: "Turkey" },
  { label: "Trabzon", code: "TZX", country: "Turkey" },
  { label: "Kayseri", code: "ASR", country: "Turkey" },
  { label: "Dalaman", code: "DLM", country: "Turkey" },
  { label: "Tbilisi", code: "TBS", country: "Georgia" },
  { label: "Baku", code: "GYD", country: "Azerbaijan" },
  { label: "Belgrade", code: "BEG", country: "Serbia" },
  { label: "Budapest", code: "BUD", country: "Hungary" },
  { label: "Vienna", code: "VIE", country: "Austria" },
  { label: "Prague", code: "PRG", country: "Czech Republic" },
  { label: "Rome", code: "ROM", country: "Italy" },
  { label: "Milan", code: "MIL", country: "Italy" },
  { label: "Paris", code: "PAR", country: "France" },
  { label: "Barcelona", code: "BCN", country: "Spain" },
  { label: "Madrid", code: "MAD", country: "Spain" },
  { label: "Lisbon", code: "LIS", country: "Portugal" },
  { label: "Amsterdam", code: "AMS", country: "Netherlands" },
  { label: "Brussels", code: "BRU", country: "Belgium" },
  { label: "Berlin", code: "BER", country: "Germany" },
  { label: "Munich", code: "MUC", country: "Germany" },
  { label: "Frankfurt", code: "FRA", country: "Germany" },
  { label: "London", code: "LON", country: "United Kingdom" },
  { label: "Manchester", code: "MAN", country: "United Kingdom" },
  { label: "Dublin", code: "DUB", country: "Ireland" },
  { label: "Athens", code: "ATH", country: "Greece" },
  { label: "Sofia", code: "SOF", country: "Bulgaria" },
  { label: "Bucharest", code: "BUH", country: "Romania" },
  { label: "Warsaw", code: "WAW", country: "Poland" },
  { label: "Zurich", code: "ZRH", country: "Switzerland" },
  { label: "Geneva", code: "GVA", country: "Switzerland" },
  { label: "Dubai", code: "DXB", country: "United Arab Emirates" },
  { label: "Abu Dhabi", code: "AUH", country: "United Arab Emirates" },
  { label: "Doha", code: "DOH", country: "Qatar" },
  { label: "Cairo", code: "CAI", country: "Egypt" },
  { label: "Casablanca", code: "CAS", country: "Morocco" },
  { label: "New York", code: "NYC", country: "United States" },
  { label: "Los Angeles", code: "LAX", country: "United States" },
  { label: "Chicago", code: "CHI", country: "United States" },
  { label: "Toronto", code: "YTO", country: "Canada" },
  { label: "Mexico City", code: "MEX", country: "Mexico" },
  { label: "Sao Paulo", code: "SAO", country: "Brazil" },
  { label: "Buenos Aires", code: "BUE", country: "Argentina" },
  { label: "Bangkok", code: "BKK", country: "Thailand" },
  { label: "Singapore", code: "SIN", country: "Singapore" },
  { label: "Kuala Lumpur", code: "KUL", country: "Malaysia" },
  { label: "Bali", code: "DPS", country: "Indonesia" },
  { label: "Tokyo", code: "TYO", country: "Japan" },
  { label: "Seoul", code: "SEL", country: "South Korea" },
  { label: "Hong Kong", code: "HKG", country: "Hong Kong" },
  { label: "Delhi", code: "DEL", country: "India" },
  { label: "Sydney", code: "SYD", country: "Australia" }
];

const citizenshipOptions = [
  "Turkey",
  "Germany",
  "United Kingdom",
  "Netherlands",
  "France",
  "United States"
];

const stepMeta = [
  {
    title: "Trip basics",
    caption:
      "Start with departure cities, trip scope, citizenship, and visa access.",
    icon: MapPinned
  },
  {
    title: "Flight preferences",
    caption:
      "Shape the recommendation engine with budget, date flexibility, and baggage style.",
    icon: Ticket
  },
  {
    title: "Stay style",
    caption:
      "Tell us how much accommodation should influence the recommendation.",
    icon: BedDouble
  }
] as const;

const initialState: PlannerState = {
  departures: ["Istanbul"],
  travelType: "International",
  citizenship: "Turkey",
  visaStatus: "No visa",
  budget: 350,
  dateFlexibility: "Flexible dates",
  exactDepartureDate: "",
  exactReturnDate: "",
  flightPreference: "Cabin bag only",
  accommodationPreference: "Breakfast included"
};

function OptionPill({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-chartreuse bg-chartreuse text-black shadow-[0_12px_30px_rgba(201,255,5,0.22)]"
          : "border-slate-200 bg-white text-slate-600 hover:border-slateBlue/30 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function PlannerForm() {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [openingDestination, setOpeningDestination] = useState<string | null>(null);
  const [form, setForm] = useState<PlannerState>(initialState);

  const current = stepMeta[step];
  const progress = ((step + 1) / stepMeta.length) * 100;

  const filteredDepartures = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return departureOptions
      .filter((item) =>
        `${item.label} ${item.code} ${item.country}`
          .toLowerCase()
          .includes(normalized)
      )
      .slice(0, 10);
  }, [search]);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return form.departures.length > 0;
    }
    if (step === 1 && form.dateFlexibility === "Exact dates") {
      return Boolean(form.exactDepartureDate);
    }
    return true;
  }, [form.dateFlexibility, form.departures.length, form.exactDepartureDate, step]);

  const recommendations = useMemo<Recommendation[]>(() => {
    const base: Recommendation[] = [
      {
        city: "Tbilisi",
        country: "Georgia",
        destinationCode: "TBS",
        estimatedCost: 290,
        flightDuration: "2h 15m",
        visaRequirement: "visa-free",
        experienceMatch: "Best value",
        badge: "Best Match",
        matchScore: 94,
        notes:
          "We recommend Tbilisi because it's visa-free, within your budget, and works exceptionally well for flexible city breaks."
      },
      {
        city: "Baku",
        country: "Azerbaijan",
        destinationCode: "GYD",
        estimatedCost: 340,
        flightDuration: "2h 50m",
        visaRequirement: "visa-free",
        experienceMatch: "Best value",
        badge: "Smart Deal",
        matchScore: 89,
        notes:
          "We recommend Baku because it balances easy access, low total cost, and short-haul convenience from Turkey."
      },
      {
        city: "Belgrade",
        country: "Serbia",
        destinationCode: "BEG",
        estimatedCost: 390,
        flightDuration: "1h 50m",
        visaRequirement: "visa-free",
        experienceMatch: "Best value",
        badge: "Trending",
        matchScore: 87,
        notes:
          "We recommend Belgrade because it's visa-free, within your budget, and offers better value than many European alternatives."
      },
      {
        city: "Budapest",
        country: "Hungary",
        destinationCode: "BUD",
        estimatedCost: 420,
        flightDuration: "2h 05m",
        visaRequirement:
          form.visaStatus === "Schengen visa" ? "visa-free" : "visa required",
        experienceMatch: "Premium experience",
        badge: "Trending",
        matchScore: 82,
        notes:
          "We recommend Budapest when you want a stronger accommodation and food scene with a still-manageable total budget."
      }
    ];

    return base
      .map((item) => {
        let score = item.matchScore;

        if (form.travelType === "Domestic") {
          score -= 22;
        }

        if (form.travelType === "Both") {
          score += 2;
        }

        if (
          form.visaStatus === "No visa" &&
          item.visaRequirement === "visa required"
        ) {
          score -= 28;
        }

        if (form.budget < item.estimatedCost) {
          score -= 18;
        } else if (form.budget >= item.estimatedCost + 150) {
          score += 4;
        }

        if (
          form.accommodationPreference === "Better experience" &&
          item.experienceMatch === "Premium experience"
        ) {
          score += 10;
        }

        if (
          form.accommodationPreference === "Just sleep (budget)" &&
          item.experienceMatch === "Best value"
        ) {
          score += 10;
        }

        if (form.accommodationPreference === "I'll choose my own hotel") {
          score += 4;
        }

        if (
          form.dateFlexibility === "Flexible dates" &&
          item.badge !== "Trending"
        ) {
          score += 5;
        }

        return { ...item, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [form]);

  const toggleDeparture = (value: string) => {
    setForm((prev) => {
      const exists = prev.departures.includes(value);
      return {
        ...prev,
        departures: exists
          ? prev.departures.filter((item) => item !== value)
          : [...prev.departures, value]
      };
    });
  };

  const getDepartureCode = () => {
    const selected = departureOptions.find(
      (item) => item.label === form.departures[0]
    );
    return selected?.code ?? "IST";
  };

  const getSearchDateLabel = () => {
    if (form.dateFlexibility === "Exact dates" && form.exactDepartureDate) {
      return form.exactReturnDate
        ? `${form.exactDepartureDate} to ${form.exactReturnDate}`
        : form.exactDepartureDate;
    }
    return "Flexible dates mapped to next best live window";
  };

  const openLiveFlights = async (destinationCode: string) => {
    try {
      setOpeningDestination(destinationCode);
      const params = new URLSearchParams({
        origin: getDepartureCode(),
        destination: destinationCode,
        mode: form.dateFlexibility === "Exact dates" ? "exact" : "flexible"
      });

      if (form.dateFlexibility === "Exact dates" && form.exactDepartureDate) {
        params.set("date", form.exactDepartureDate);
      }

      const response = await fetch(`/api/aviasales-link?${params.toString()}`);
      const payload = (await response.json()) as
        | { url: string }
        | { error: string };

      if (!response.ok || !("url" in payload)) {
        throw new Error("Could not create live Aviasales link");
      }

      window.open(payload.url, "_blank", "noopener,noreferrer");
    } catch {
      window.alert("Live Aviasales results could not be loaded for this route.");
    } finally {
      setOpeningDestination(null);
    }
  };

  function updateForm<K extends keyof PlannerState>(
    key: K,
    value: PlannerState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const startResultsFlow = () => {
    setIsLoadingResults(true);
    window.setTimeout(() => {
      setIsLoadingResults(false);
      setShowResults(true);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-[fadeUp_.35s_ease-out]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slateBlue shadow-sm transition hover:border-chartreuse"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-slateBlue px-4 py-2 text-sm font-semibold text-white">
            <Gauge className="h-4 w-4 text-chartreuse" />
            Recommendation engine
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-slateBlue px-8 py-10 text-white shadow-card sm:px-10 sm:py-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-chartreuse/90">
                Decision Engine
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
                Plan Your Trip
              </h1>
              <p className="mt-4 text-lg leading-8 text-white/76">
                This is not a raw flight search. We use your documents, budget,
                and travel style to recommend better-fit trips.
              </p>
            </div>

            <div className="min-w-[16rem] rounded-[1.75rem] bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white/70">
                Step {step + 1} of {stepMeta.length}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-chartreuse transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-white/70">
                {current.caption}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] bg-white p-5 shadow-card sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Planner steps
            </p>
            <div className="mt-4 space-y-3">
              {stepMeta.map(({ title, icon: Icon }, index) => {
                const active = index === step;
                const completed = index < step;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => {
                      setShowResults(false);
                      setIsLoadingResults(false);
                      setStep(index);
                    }}
                    className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${
                      active
                        ? "bg-slateBlue text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        active
                          ? "bg-chartreuse text-black"
                          : completed
                            ? "bg-chartreuse/20 text-slateBlue"
                            : "bg-white text-slate-400"
                      }`}
                    >
                      {completed ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                        Step {index + 1}
                      </p>
                      <p className="text-sm font-semibold">{title}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slateBlue">
                <Briefcase className="h-4 w-4 text-chartreuse" />
                Planner snapshot
              </div>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-ink">Departure locations</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.departures.length > 0 ? (
                      form.departures.map((item) => (
                        <span
                          key={item}
                          className="inline-flex rounded-full bg-chartreuse/80 px-3 py-1 text-xs font-semibold text-black"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Select at least one city</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-ink">Trip type:</span> {form.travelType}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Citizenship:</span> {form.citizenship}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Visa:</span> {form.visaStatus}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Budget:</span> €{form.budget}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Dates:</span> {form.dateFlexibility}
                    {form.dateFlexibility === "Exact dates" && form.exactDepartureDate ? (
                      <span> · {getSearchDateLabel()}</span>
                    ) : null}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">Baggage:</span> {form.flightPreference}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-ink">Stay:</span> {form.accommodationPreference}
                  </div>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-slate-500">
                  Flight recommendations currently align with your Aviasales flight integration.
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
            {!showResults ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chartreuse text-ink">
                    <current.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Step {step + 1}
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                      {current.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                      {current.caption}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  {isLoadingResults ? (
                    <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-[1.75rem] bg-slate-50 px-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chartreuse/80 text-ink shadow-[0_18px_40px_rgba(201,255,5,0.2)]">
                        <Globe2 className="h-7 w-7 animate-pulse" />
                      </div>
                      <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.04em] text-ink">
                        Finding the best trips for you...
                      </h3>
                      <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                        We are matching your budget, visa status, flexibility, and
                        travel style into stronger trip recommendations.
                      </p>
                    </div>
                  ) : null}

                  {!isLoadingResults && step === 0 ? (
                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-semibold text-slate-500">
                          Departure locations
                        </label>
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Type a city or airport"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                          />
                        </div>
                        {form.departures.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {form.departures.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleDeparture(item)}
                                className="inline-flex items-center gap-2 rounded-full bg-chartreuse px-4 py-2 text-sm font-semibold text-black"
                              >
                                {item}
                                <span className="text-base leading-none">×</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                        {search.trim() ? (
                          <div className="mt-3 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white p-2">
                          {filteredDepartures.length > 0 ? (
                            filteredDepartures.map((item) => {
                              const active = form.departures.includes(item.label);
                              return (
                                <button
                                  key={item.code}
                                  type="button"
                                  onClick={() => {
                                    toggleDeparture(item.label);
                                    setSearch("");
                                  }}
                                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                                    active
                                      ? "bg-chartreuse text-black"
                                      : "text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>
                                    {item.label}
                                    <span className="ml-2 text-xs font-medium text-slate-400">
                                      {item.code} · {item.country}
                                    </span>
                                  </span>
                                  {active ? <Check className="h-4 w-4" /> : null}
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-4 py-3 text-sm text-slate-400">
                              No matching city found.
                            </div>
                          )}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-400">
                            Start typing to search departure cities worldwide.
                          </p>
                        )}
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-1">
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            Travel type
                          </p>
                          <div className="grid gap-3">
                            {(["Domestic", "International", "Both"] as TravelType[]).map((item) => (
                              <OptionPill
                                key={item}
                                active={form.travelType === item}
                                onClick={() => updateForm("travelType", item)}
                              >
                                {item}
                              </OptionPill>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-1">
                          <label className="mb-3 block text-sm font-semibold text-slate-500">
                            Citizenship
                          </label>
                          <div className="relative">
                            <select
                              value={form.citizenship}
                              onChange={(event) =>
                                updateForm("citizenship", event.target.value)
                              }
                              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                            >
                              {citizenshipOptions.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        <div className="md:col-span-1">
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            Visa status
                          </p>
                          <div className="grid gap-3">
                            {(["No visa", "Schengen visa", "Other visa"] as VisaStatus[]).map(
                              (item) => (
                                <OptionPill
                                  key={item}
                                  active={form.visaStatus === item}
                                  onClick={() => updateForm("visaStatus", item)}
                                >
                                  {item}
                                </OptionPill>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {!isLoadingResults && step === 1 ? (
                    <div className="space-y-8">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                              Total flight budget
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-4xl font-black tracking-[-0.05em] text-slateBlue">
                              <Euro className="h-8 w-8 text-chartreuse" />
                              {form.budget}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                            Aviasales-powered flight logic
                          </div>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={1000}
                          step={25}
                          value={form.budget}
                          onChange={(event) =>
                            updateForm("budget", Number(event.target.value))
                          }
                          className="mt-6 h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-chartreuse"
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            Date flexibility
                          </p>
                          <div className="grid gap-3">
                            {(["Exact dates", "Flexible dates"] as DateFlexibility[]).map(
                              (item) => (
                                <OptionPill
                                  key={item}
                                  active={form.dateFlexibility === item}
                                  onClick={() => updateForm("dateFlexibility", item)}
                                >
                                  {item}
                                </OptionPill>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            Flight preferences
                          </p>
                          <div className="grid gap-3">
                            {(["Cabin bag only", "Checked baggage"] as FlightPreference[]).map(
                              (item) => (
                                <OptionPill
                                  key={item}
                                  active={form.flightPreference === item}
                                  onClick={() => updateForm("flightPreference", item)}
                                >
                                  {item}
                                </OptionPill>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {form.dateFlexibility === "Exact dates" ? (
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-500">
                              Departure date
                            </label>
                            <input
                              type="date"
                              value={form.exactDepartureDate}
                              onChange={(event) =>
                                updateForm("exactDepartureDate", event.target.value)
                              }
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-500">
                              Return date
                            </label>
                            <input
                              type="date"
                              value={form.exactReturnDate}
                              onChange={(event) =>
                                updateForm("exactReturnDate", event.target.value)
                              }
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {!isLoadingResults && step === 2 ? (
                    <div className="space-y-6">
                      <div>
                        <p className="mb-3 text-sm font-semibold text-slate-500">
                          Accommodation preference
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(
                            [
                              "Just sleep (budget)",
                              "Breakfast included",
                              "Better experience",
                              "I'll choose my own hotel"
                            ] as AccommodationPreference[]
                          ).map((item) => (
                            <OptionPill
                              key={item}
                              active={form.accommodationPreference === item}
                              onClick={() =>
                                updateForm("accommodationPreference", item)
                              }
                            >
                              {item}
                            </OptionPill>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                        {form.accommodationPreference === "I'll choose my own hotel"
                          ? "We will optimize around flights and trip fit first, then let you handle the stay separately."
                          : "We will weigh the total trip experience using both flight cost and accommodation style."}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Recommendations
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                      Best destinations for your trip
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                      These are ranked by overall fit for your documents, budget,
                      flexibility, and travel style, not just by the lowest fare.
                    </p>
                    <p className="mt-4 max-w-3xl rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                      We analyzed your preferences and found the best destinations for
                      your budget, visa status, and travel style.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResults(false)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slateBlue/30 hover:text-ink"
                  >
                    Edit answers
                  </button>
                </div>

                <div className="mt-8 grid gap-4">
                  {recommendations.map((item) => (
                    <article
                      key={item.city}
                      className="rounded-[1.75rem] border border-slate-200 bg-white p-5 transition hover:border-chartreuse/80 hover:shadow-card sm:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex rounded-full bg-chartreuse px-3 py-1 text-xs font-extrabold text-black">
                              {item.badge}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                item.visaRequirement === "visa-free"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.visaRequirement}
                            </span>
                          </div>
                          <h3 className="mt-4 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                            {item.city}
                          </h3>
                          <p className="mt-1 text-base text-slate-500">{item.country}</p>
                        </div>

                        <div className="rounded-[1.5rem] bg-slateBlue px-5 py-4 text-white">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                            Estimated total cost
                          </p>
                          <p className="mt-2 text-4xl font-black tracking-[-0.05em] text-chartreuse">
                            €{item.estimatedCost}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Flight duration
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{item.flightDuration}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Experience match
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{item.experienceMatch}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Best match score
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{item.matchScore}/100</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 sm:col-span-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Live flight search window
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{getSearchDateLabel()}</p>
                        </div>
                      </div>

                      <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
                        {item.notes}
                      </p>
                      <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                        We recommend {item.city} because it&apos;s{" "}
                        {item.visaRequirement === "visa-free"
                          ? "visa-free"
                          : "compatible with your current visa setup"}
                        , fits your budget profile, and offers a stronger overall
                        trip fit than lower-ranked alternatives.
                      </p>

                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={() => void openLiveFlights(item.destinationCode)}
                          className="inline-flex items-center gap-2 rounded-xl bg-chartreuse px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:brightness-95"
                        >
                          {openingDestination === item.destinationCode
                            ? "Loading live flights..."
                            : "See live flights"}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  if (showResults) {
                    setShowResults(false);
                    setStep(stepMeta.length - 1);
                    return;
                  }
                  if (isLoadingResults) {
                    setIsLoadingResults(false);
                    return;
                  }
                  setStep((prev) => Math.max(prev - 1, 0));
                }}
                disabled={step === 0 && !showResults && !isLoadingResults}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition hover:border-slateBlue/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                {showResults ? "Back to form" : isLoadingResults ? "Stop" : "Previous"}
              </button>

              {!showResults && !isLoadingResults && step < stepMeta.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(prev + 1, stepMeta.length - 1))}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-2 rounded-xl bg-chartreuse px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : !showResults && !isLoadingResults ? (
                <button
                  type="button"
                  onClick={startResultsFlow}
                  className="inline-flex items-center gap-2 rounded-xl bg-chartreuse px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:brightness-95"
                >
                  See my trip options
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : isLoadingResults ? (
                <div className="rounded-xl bg-slateBlue px-5 py-3 text-sm font-semibold text-white">
                  Building recommendations...
                </div>
              ) : (
                <div className="rounded-xl bg-slateBlue px-5 py-3 text-sm font-semibold text-white">
                  Results sorted by best match
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
