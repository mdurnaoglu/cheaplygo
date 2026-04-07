import type { Metadata } from "next";
import { Header } from "@/components/header";
import { StayDealsCountryGrid } from "@/components/stay-deals-country-grid";

export const metadata: Metadata = {
  title: "Fırsat Konaklamalar",
  description:
    "Türkiye, Rusya ve Almanya çıkışlı fırsat konaklama fikirlerini ülkeye göre açın."
};

export default function StayDealsHubPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <StayDealsCountryGrid />
    </main>
  );
}
