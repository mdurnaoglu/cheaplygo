import type { Metadata } from "next";
import { FlightDealsCountryGrid } from "@/components/flight-deals-country-grid";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Fırsat Uçuşlar | CheaplyGo",
  description:
    "Türkiye, Rusya ve Almanya çıkışlı fırsat uçak biletlerini ülkeye özel SEO sayfalarında keşfedin."
};

export default function FlightDealsHubPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <FlightDealsCountryGrid />
    </main>
  );
}
