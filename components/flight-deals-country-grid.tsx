import Link from "next/link";
import { ArrowRight, PlaneTakeoff } from "lucide-react";
import { DEAL_MARKETS, DEAL_MARKET_ORDER } from "@/lib/flight-deals";

const countryImages: Record<string, string> = {
  turkey:
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80",
  russia:
    "https://images.unsplash.com/photo-1556610961-2fecc5927173?auto=format&fit=crop&w=1200&q=80",
  germany:
    "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80"
};

export function FlightDealsCountryGrid() {
  return (
    <section className="px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Fırsat Uçuşlar
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
            Ülkeye göre fırsat uçak biletleri
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Kalkış ülkeni seç, cache&apos;lenmiş canlı fiyatlarla en güçlü yurtdışı
            rotalarını tek sayfada gör. Her ülke için ayrı SEO sayfası açıldı.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {DEAL_MARKET_ORDER.map((market) => {
            const item = DEAL_MARKETS[market];

            return (
              <Link
                key={market}
                href={`/firsat-ucuslar/${item.slug}`}
                className="group flex h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-chartreuse/70 hover:shadow-[0_30px_70px_rgba(50,98,115,0.14)]"
              >
                <div className="flex min-h-full w-full flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={countryImages[market]}
                      alt={item.displayName.tr}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.48)_100%)]" />
                    <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-chartreuse text-black">
                      <PlaneTakeoff className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.originCity} kalkışlı
                    </p>
                    <h2 className="mt-3 min-h-[4.75rem] text-3xl font-extrabold tracking-[-0.05em] text-ink">
                      {item.displayName.tr} fırsat uçak biletleri
                    </h2>
                    <p className="mt-4 min-h-[4.5rem] text-sm leading-6 text-slate-500">
                      {item.summary.tr}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 rounded-full bg-chartreuse px-4 py-3 text-sm font-bold text-black transition group-hover:brightness-95">
                      Sayfayı aç
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
