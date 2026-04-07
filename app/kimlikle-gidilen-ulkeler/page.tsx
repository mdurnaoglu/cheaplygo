import type { Metadata } from "next";
import { Header } from "@/components/header";
import { InfoCardGrid } from "@/components/info-card-grid";
import { idEntryCountries } from "@/lib/explore";

export const metadata: Metadata = {
  title: "Kimlikle Gidilen Ülkeler",
  description:
    "Türk vatandaşları için kimlikle gidilebilen ülkeler ve hızlı planlama rehberleri."
};

export default function IdEntryCountriesPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <InfoCardGrid
        eyebrow="Keşfet"
        title="Kimlikle gidilen ülkeler"
        description="Türk vatandaşları için kimlikle giriş kolaylığıyla öne çıkan rotaları ve ilgili rehber sayfaları burada topladık."
        items={idEntryCountries}
      />
    </main>
  );
}
