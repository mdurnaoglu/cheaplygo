import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { StayDealsGrid } from "@/components/stay-deals-grid";
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
      title: "Fırsat Konaklamalar | CheaplyGo"
    };
  }

  const item = DEAL_MARKETS[market];

  return {
    title: `${item.displayName.tr} Fırsat Konaklamalar | CheaplyGo`,
    description: `${item.displayName.tr} çıkışlı seyahatlerde fiyat-performans odaklı konaklama sayfası.`
  };
}

export default function MarketStayDealsPage({ params }: MarketPageProps) {
  const market = getMarketBySlug(params.market);

  if (!market) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <StayDealsGrid market={market} />
    </main>
  );
}
