import { BadgeCheck, CircleDollarSign, ShieldCheck } from "lucide-react";
import { SearchCard } from "@/components/search-card";

const features = [
  { icon: CircleDollarSign, label: "Real-time prices" },
  { icon: ShieldCheck, label: "All airlines" },
  { icon: BadgeCheck, label: "Best deals found" }
];

export function Hero() {
  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2.25rem] bg-slateBlue bg-hero-noise px-7 py-8 text-white shadow-card sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
        <div className="relative z-10 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-balance text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.4rem]">
              Find the cheapest flights.
              <span className="relative mt-2 block w-fit">
                Anywhere.
                <svg
                  viewBox="0 0 290 24"
                  className="absolute -bottom-4 left-0 h-5 w-[17rem] text-chartreuse sm:w-[19rem]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 19.5C49 14 94 18 139 10C170 4.5 207 6.5 286 16"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25 20C66 12 126 12 170 16"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-8 text-white/76 sm:text-xl">
              Discover hidden flight deals from your city and travel more for
              less.
            </p>

            <div className="mt-9 flex flex-wrap gap-5">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chartreuse text-ink">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-[28rem]">
          <div className="absolute right-[-8%] top-[-4%] h-48 w-48 rounded-[32%_68%_64%_36%/42%_34%_66%_58%] bg-chartreuse blur-[1px]" />
          <div className="absolute bottom-[-18%] left-[12%] h-52 w-52 rounded-full bg-chartreuse/95 blur-[1px]" />
          <div className="absolute right-3 top-7 h-[24rem] w-[18rem] overflow-hidden rounded-[2rem] border border-white/20">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
              alt="Airplane wing above the clouds"
              className="h-full w-full object-cover"
            />
          </div>
          <svg
            viewBox="0 0 280 180"
            className="pointer-events-none absolute bottom-[-10px] left-[-5px] h-[12rem] w-[15rem] text-white/35"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 160C40 120 80 104 118 86C146 72 181 52 202 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
          </svg>
          <div className="relative flex h-full items-center justify-center lg:justify-start">
            <SearchCard />
          </div>
        </div>
      </div>
    </section>
  );
}
