import type { Metadata } from "next";
import { Header } from "@/components/header";
import { IdEntryHubContent } from "@/components/discover-hub-content";

export const metadata: Metadata = {
  title: "Kimlikle Gidilen Ülkeler",
  description:
    "Türk vatandaşları için kimlikle gidilebilen ülkeler ve hızlı planlama rehberleri."
};

export default function IdEntryCountriesPage() {
  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />
      <IdEntryHubContent />
    </main>
  );
}
