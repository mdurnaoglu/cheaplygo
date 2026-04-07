import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { DEAL_MARKETS, DEAL_MARKET_ORDER } from "@/lib/flight-deals";

const countryImages: Record<string, string> = {
  turkey:
    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
  russia:
    "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=80",
  germany:
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80"
};

export function StayDealsCountryGrid() {
  return (
    <section className="px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Fırsat Konaklamalar
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
            Ülkeye göre fırsat konaklama sayfaları
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Kalkış pazarına göre seçilmiş şehirleri görün, uygun konaklama fikirlerini açın
            ve dış linklerle otel aramasına geçin.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {DEAL_MARKET_ORDER.map((market) => {
            const item = DEAL_MARKETS[market];

            return (
              <Link
                key={market}
                href={`/firsat-konaklamalar/${item.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-chartreuse/70 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={countryImages[market]}
                    alt={item.displayName.tr}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.48)_100%)]" />
                  <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-chartreuse text-black">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {item.originCity} çıkışlı
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                    {item.displayName.tr} fırsat konaklamalar
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {item.displayName.tr} çıkışlı kısa ve orta menzilli rotalarda konaklama
                    açısından güçlü şehirleri açın.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-chartreuse px-4 py-3 text-sm font-bold text-black">
                    Sayfayı aç
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
