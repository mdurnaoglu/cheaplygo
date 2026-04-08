import type { Metadata } from "next";
import { Header } from "@/components/header";
import { VisaGuideHubContent } from "@/components/discover-hub-content";

export const metadata: Metadata = {
  title: "Vize Rehberi",
  description:
    "Türkiye, Almanya, Rusya ve Azerbaycan çıkışlı vizesiz ve e-vizeli ülkeler için SEO odaklı rehber sayfaları."
};

export default function VisaGuideHubPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <VisaGuideHubContent />
    </main>
  );
}
