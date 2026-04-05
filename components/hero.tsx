"use client";

import Link from "next/link";
import { BadgeCheck, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SearchCard } from "@/components/search-card";

const features = [
  { icon: BrainCircuit, label: "AI trip engine" },
  { icon: ShieldCheck, label: "Visa-aware planning" },
  { icon: BadgeCheck, label: "Flight + stay logic" }
];

export function Hero() {
  const { language } = useLanguage();
  const copy =
    language === "ru"
      ? {
          badge: "Планировщик путешествий нового поколения",
          titleTop: "Планируйте путешествие.",
          titleBottom: "Умнее.",
          description:
            "cheaplygo анализирует ваш бюджет, визовый статус, стиль поездки, перелёты и проживание, чтобы за секунды собрать лучшие варианты отпуска.",
          primaryCta: "Спланировать поездку",
          secondaryCta: "Или изучить варианты вручную",
          steps: [
            "Расскажите о своих правилах поездки",
            "Мы ранжируем маршруты и проживание",
            "Получите лучший план поездки"
          ],
          features: ["AI-планировщик", "Планирование с учетом визы", "Логика перелёта и проживания"]
        }
      : {
          badge: "Next-generation vacation planner",
          titleTop: "Plan your next trip.",
          titleBottom: "Smarter.",
          description:
            "cheaplygo analyzes your budget, visa status, travel style, flights, and stays to build best-fit trip options in seconds.",
          primaryCta: "Plan My Trip",
          secondaryCta: "Or explore trips manually",
          steps: [
            "Tell us your travel rules",
            "We rank routes + stays",
            "Get your best-fit plan"
          ],
          features: ["AI trip engine", "Visa-aware planning", "Flight + stay logic"]
        };

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2.25rem] bg-slateBlue bg-hero-noise px-7 py-8 text-white shadow-card sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-16">
        <div className="relative z-10 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-semibold text-white/88 backdrop-blur">
              <Sparkles className="h-4 w-4 text-chartreuse" />
              {copy.badge}
            </div>

            <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.2rem]">
              {copy.titleTop}
              <span className="relative mt-2 block w-fit">
                {copy.titleBottom}
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
              {copy.description}
            </p>

            <div className="mt-6 flex flex-col items-start gap-3">
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-lg bg-chartreuse px-6 py-3 text-base font-semibold text-black transition duration-200 hover:scale-[1.02] hover:brightness-95"
              >
                {copy.primaryCta}
              </Link>
              <a
                href="#smart-trips"
                className="text-sm font-medium text-white/72 transition hover:text-white"
              >
                {copy.secondaryCta}
              </a>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {copy.steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chartreuse/90">
                    0{index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/88">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-5">
              {features.map(({ icon: Icon }, index) => (
                <div key={copy.features[index]} className="flex items-center gap-3 text-sm font-semibold text-white/90">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chartreuse text-ink">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  {copy.features[index]}
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
