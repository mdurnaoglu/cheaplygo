import { Flame, MoveRight } from "lucide-react";
import { DealCard } from "@/components/deal-card";
import { Features } from "@/components/features";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";

const deals = [
  {
    city: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    badge: "Smart Deal",
    duration: "2h 15m",
    price: "€39",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "Budapest",
    country: "Hungary",
    flag: "🇭🇺",
    badge: "Hot",
    duration: "2h 10m",
    price: "€49",
    image:
      "https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    badge: "Weekend Deal",
    duration: "3h 20m",
    price: "€59",
    image:
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=900&q=80"
  },
  {
    city: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    badge: "Trending",
    duration: "5h 15m",
    price: "€129",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80"
  }
];

export default function Home() {
  return (
    <main className="pb-10">
      <Header />
      <Hero />

      <section id="deals" className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4eb] text-[#ff6a00]">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Top picks
                </p>
                <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-ink sm:text-4xl">
                  Top Cheap Deals from Istanbul
                </h2>
              </div>
            </div>

            <a
              href="#discover"
              className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm transition hover:border-chartreuse hover:text-slateBlue"
            >
              View all deals
              <MoveRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {deals.map((deal) => (
              <DealCard key={deal.city} {...deal} />
            ))}
          </div>
        </div>
      </section>

      <Features />
    </main>
  );
}
