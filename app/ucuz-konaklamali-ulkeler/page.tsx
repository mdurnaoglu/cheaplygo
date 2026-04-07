import type { Metadata } from "next";
import { Header } from "@/components/header";
import { InfoCardGrid } from "@/components/info-card-grid";
import { affordableStayCountries } from "@/lib/explore";

export const metadata: Metadata = {
  title: "Ucuz Konaklamalı Ülkeler",
  description:
    "Konaklama maliyeti açısından daha verimli ülkeler ve hızlı seyahat planlama sayfaları."
};

export default function AffordableStayCountriesPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <InfoCardGrid
        eyebrow="Keşfet"
        title="Ucuz konaklamalı ülkeler"
        description="Toplam seyahat maliyetinde otel tarafını daha kontrollü tutmak isteyenler için uygun konaklama odaklı rota kümeleri."
        items={affordableStayCountries}
      />
    </main>
  );
}
