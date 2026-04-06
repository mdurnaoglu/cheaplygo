"use client";

import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  MapPinned,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

const fieldRows = [
  {
    icon: MapPinned,
    label: "From",
    value: "Istanbul (IST)"
  },
  {
    icon: CalendarDays,
    label: "Travel mode",
    value: "Flexible, visa-aware"
  },
  {
    icon: UsersRound,
    label: "Output",
    value: "3 best-fit trip options"
  }
];

export function SearchCard() {
  const { language } = useLanguage();
  const copy =
    language === "ru"
      ? {
          preview: "AI-превью планировщика",
          title: "Ваше следующее путешествие уже narrowed down.",
          description:
            "Мы объединяем перелёты, стиль проживания, тайминг и правила поездки ещё до перехода к партнёру.",
          fields: ["Откуда", "Режим поездки", "Результат"],
          values: ["Стамбул (IST)", "Гибко, с учетом визы", "3 лучших варианта поездки"],
          bullets: ["Маршруты под бюджет", "Фильтрация по визе", "Разделение перелёта и отеля"],
          cta: "Построить план поездки"
        }
      : language === "tr"
        ? {
            preview: "AI planner önizlemesi",
            title: "Sıradaki tripin, daraltılmış halde.",
            description:
              "Partner sayfasına geçmeden önce uçuşu, konaklama stilini, zamanlamayı ve seyahat kurallarını birlikte değerlendiriyoruz.",
            fields: ["Nereden", "Seyahat modu", "Çıktı"],
            values: ["İstanbul (IST)", "Esnek, vize duyarlı", "En uygun 3 trip seçeneği"],
            bullets: ["Bütçeye uygun rotalar", "Vize duyarlı filtreleme", "Uçuş + otel ayrımı"],
            cta: "Trip Planımı Oluştur"
          }
      : {
          preview: "AI planner preview",
          title: "Your next trip, narrowed down.",
          description:
            "We combine flights, stay style, timing, and travel rules before you click out.",
          fields: ["From", "Travel mode", "Output"],
          values: ["Istanbul (IST)", "Flexible, visa-aware", "3 best-fit trip options"],
          bullets: ["Budget-fit routes", "Visa-aware filtering", "Flight + hotel split"],
          cta: "Build My Trip Plan"
        };

  return (
    <div
      id="search"
      className="relative z-20 w-full max-w-[24rem] rounded-[2rem] bg-white p-4 shadow-floating sm:p-5"
    >
      <div className="mb-4 rounded-[1.5rem] bg-slateBlue px-4 py-4 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold text-chartreuse">
          <Sparkles className="h-4 w-4" />
          {copy.preview}
        </div>
        <h3 className="mt-3 text-xl font-extrabold tracking-[-0.04em]">
          {copy.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/72">
          {copy.description}
        </p>
      </div>

      <div className="space-y-3">
        {fieldRows.map(({ icon: Icon }, index) => (
          <div
            key={copy.fields[index]}
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <Icon className="h-5 w-5 text-slateBlue" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                  {copy.fields[index]}
                </p>
                <p className="text-sm font-semibold text-ink">{copy.values[index]}</p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
        {[CheckCircle2, ShieldCheck, BadgeCheck].map((Icon, index) => (
          <div key={copy.bullets[index]} className="flex items-center gap-3 text-sm font-semibold text-slateBlue">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chartreuse/70 text-black">
              <Icon className="h-4 w-4" />
            </div>
            {copy.bullets[index]}
          </div>
        ))}
      </div>

      <Link
        href="/planner"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-chartreuse px-5 py-4 text-base font-extrabold text-black transition hover:brightness-95"
      >
        {copy.cta}
      </Link>
    </div>
  );
}
