"use client";

import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function BlogBackLink() {
  const { language } = useLanguage();

  const label =
    language === "ru"
      ? "Вернуться к списку блога"
      : language === "tr"
        ? "Blog listesine dön"
        : "Back to blog list";

  return (
    <a
      href="/blog"
      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-ink"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </a>
  );
}
