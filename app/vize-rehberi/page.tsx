import type { Metadata } from "next";
import { Header } from "@/components/header";
import { InfoCardGrid } from "@/components/info-card-grid";
import { visaGuideCards } from "@/lib/explore";

export const metadata: Metadata = {
  title: "Vize Rehberi | CheaplyGo",
  description:
    "Türkiye, Almanya, Rusya ve Azerbaycan çıkışlı vizesiz ve e-vizeli ülkeler için SEO odaklı rehber sayfaları."
};

export default function VisaGuideHubPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <InfoCardGrid
        eyebrow="Vize Rehberi"
        title="Vizesiz ve e-vizeli ülkeler için rehber merkezi"
        description="Ülkeye göre ayrılmış SEO sayfalarından vizesiz ve e-vizeli rota kümelerini açın. İçerikler hızlı karar vermek için pratik seyahat mantığıyla yazıldı."
        items={visaGuideCards}
      />
    </main>
  );
}
