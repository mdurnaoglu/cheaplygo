import {
  CalendarDays,
  ChevronDown,
  Globe2,
  MapPinned,
  Plane,
  Search,
  UsersRound
} from "lucide-react";

const fieldRows = [
  {
    icon: MapPinned,
    label: "From",
    value: "Istanbul (IST)"
  },
  {
    icon: CalendarDays,
    label: "Departure",
    value: "Flexible dates"
  },
  {
    icon: UsersRound,
    label: "Travelers",
    value: "1 Traveler, Economy"
  }
];

export function SearchCard() {
  return (
    <div
      id="search"
      className="relative z-20 w-full max-w-[24rem] rounded-[2rem] bg-white p-4 shadow-floating sm:p-5"
    >
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1 text-sm font-semibold text-ink/70">
        <button className="flex items-center justify-center gap-2 rounded-full bg-slateBlue px-4 py-3 text-white">
          <Plane className="h-4 w-4" />
          Flights
        </button>
        <button className="flex items-center justify-center gap-2 rounded-full px-4 py-3">
          <Globe2 className="h-4 w-4" />
          Explore Map
        </button>
      </div>

      <div className="space-y-3">
        {fieldRows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <Icon className="h-5 w-5 text-slateBlue" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {label}
                </p>
                <p className="text-sm font-semibold text-ink">{value}</p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </div>
        ))}
      </div>

      <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-chartreuse px-5 py-4 text-base font-extrabold text-black transition hover:brightness-95">
        <Search className="h-5 w-5" />
        Find Cheapest Flights
      </button>
    </div>
  );
}
