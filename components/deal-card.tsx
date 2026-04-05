import { ArrowUpRight } from "lucide-react";

type DealCardProps = {
  city: string;
  country: string;
  flag: string;
  badge: string;
  duration: string;
  price: string;
  image: string;
};

export function DealCard({
  city,
  country,
  flag,
  badge,
  duration,
  price,
  image
}: DealCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-transparent bg-white shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-chartreuse/80 hover:shadow-[0_28px_60px_rgba(50,98,115,0.16)]">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`${city}, ${country}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-chartreuse px-3 py-1 text-xs font-extrabold text-black">
          {badge}
        </span>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold tracking-[-0.04em] text-ink">
              {city} <span className="text-lg">{flag}</span>
            </h3>
            <p className="mt-1 text-sm text-slate-500">{country}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slateBlue/45 transition group-hover:text-slateBlue" />
        </div>

        <p className="text-sm font-medium text-slate-500">Direct • {duration}</p>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-black tracking-[-0.05em] text-[#9CCE00]">
              {price}
            </div>
            <p className="mt-1 text-sm text-slate-400">one-way</p>
          </div>
        </div>
      </div>
    </article>
  );
}
