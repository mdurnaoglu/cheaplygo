import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlightDealsStrip } from "@/components/flight-deals-strip";
import { Header } from "@/components/header";
import { DEAL_MARKETS, DEAL_MARKET_ORDER, getMarketBySlug } from "@/lib/flight-deals";

type MarketPageProps = {
  params: {
    market: string;
  };
};

export async function generateStaticParams() {
  return DEAL_MARKET_ORDER.map((market) => ({
    market: DEAL_MARKETS[market].slug
  }));
}

export async function generateMetadata({
  params
}: MarketPageProps): Promise<Metadata> {
  const market = getMarketBySlug(params.market);

  if (!market) {
    return {
      title: "Fırsat Uçuşlar | CheaplyGo"
    };
  }

  const item = DEAL_MARKETS[market];

  return {
    title: `${item.displayName.tr} Fırsat Uçak Biletleri | CheaplyGo`,
    description: item.summary.tr
  };
}

export default async function MarketFlightDealsPage({ params }: MarketPageProps) {
  const market = getMarketBySlug(params.market);

  if (!market) {
    notFound();
  }

  const item = DEAL_MARKETS[market];

  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />

      <section className="px-4 pb-16 pt-36 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Fırsat Uçuşlar
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
              {item.displayName.tr} Fırsat Uçak Biletleri
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              {item.summary.tr}
            </p>
          </div>

          <div className="mt-10">
            <FlightDealsStrip
              initialMarket={market}
              syncMarketWithLanguage={false}
              headingMode="market"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
