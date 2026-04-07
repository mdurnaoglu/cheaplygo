import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CountryCard } from "@/lib/explore";

type InfoCardGridProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: CountryCard[];
};

export function InfoCardGrid({
  eyebrow,
  title,
  description,
  items
}: InfoCardGridProps) {
  return (
    <section className="px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-chartreuse/70 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.5)_100%)]" />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-ink">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slateBlue">
                  Sayfayı aç
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
