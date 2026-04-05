import { BellRing, Map, Route, Search } from "lucide-react";

const items = [
  {
    icon: Route,
    title: "We scan hundreds of routes",
    description: "Real-time prices from full-service and low-cost airlines."
  },
  {
    icon: Map,
    title: "Find hidden deals",
    description: "Spot cheaper destinations from Istanbul before everyone else."
  },
  {
    icon: BellRing,
    title: "Get alerted & book",
    description: "Track price shifts and jump on the right fare at the right time."
  }
];

export function Features() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-card sm:grid-cols-3 sm:p-8">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chartreuse text-ink">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="max-w-[16ch] text-2xl font-extrabold tracking-[-0.04em] text-ink">
                  {title}
                </h3>
                <p className="mt-2 max-w-[28ch] text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] bg-slateBlue p-8 text-white shadow-card">
          <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full border border-chartreuse/30" />
          <div className="absolute right-8 top-10 h-14 w-14 rounded-full border-2 border-dashed border-chartreuse/60" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-chartreuse/90">
              CheaplyGo
            </p>
            <h3 className="mt-4 max-w-[12ch] text-3xl font-extrabold tracking-[-0.05em]">
              Start exploring cheap flights now
            </h3>
            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-chartreuse px-5 py-3 font-extrabold text-black transition hover:brightness-95">
              <Search className="h-4 w-4" />
              Search Deals
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
