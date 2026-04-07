import { ExternalLink } from "lucide-react";
import type { MarketKey } from "@/lib/flight-deals";
import { DEAL_MARKETS } from "@/lib/flight-deals";
import { buildStaySearchLink, getStayDealsForMarket } from "@/lib/explore";

export function StayDealsGrid({ market }: { market: MarketKey }) {
  const item = DEAL_MARKETS[market];
  const stays = getStayDealsForMarket(market);

  return (
    <section className="px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Fırsat Konaklamalar
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
            {item.displayName.tr} çıkışlı fırsat konaklamalar
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            {item.originCity} çıkışlı seyahatlerde konaklama maliyeti dengeli şehirleri
            seçtik. Her kart dış arama linkiyle otel araştırmasını hızlandırır.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {stays.map((stay) => (
            <a
              key={stay.city}
              href={buildStaySearchLink({ city: stay.city, country: stay.country })}
              target="_blank"
              rel="noreferrer"
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-chartreuse/70 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={stay.image}
                  alt={`${stay.city}, ${stay.country}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slateBlue">
                  Gecelik {stay.nightlyFrom}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-ink">
                  {stay.city}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{stay.country}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{stay.highlight}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slateBlue">
                  Konaklamayı aç
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
