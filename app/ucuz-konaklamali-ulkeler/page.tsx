import type { Metadata } from "next";
import { Header } from "@/components/header";
import { AffordableStayHubContent } from "@/components/discover-hub-content";

export const metadata: Metadata = {
  title: "Ucuz Konaklamalı Ülkeler",
  description:
    "Konaklama maliyeti açısından daha verimli ülkeler ve hızlı seyahat planlama sayfaları."
};

export default function AffordableStayCountriesPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <AffordableStayHubContent />
    </main>
  );
}
