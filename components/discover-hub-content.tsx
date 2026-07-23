"use client";

import { InfoCardGrid } from "@/components/info-card-grid";
import { useLanguage } from "@/components/language-provider";
import {
  affordableStayCountries,
  idEntryCountries,
  visaGuideCards,
  type CountryCard
} from "@/lib/explore";

const localizedIdEntryItems: Record<"en" | "ru" | "tr", CountryCard[]> = {
  tr: idEntryCountries,
  en: [
    {
      title: "Georgia for Turkish citizens",
      description: "One of the fastest-opening city break routes for ID-entry travel plans.",
      image: idEntryCountries[0].image,
      href: idEntryCountries[0].href
    },
    {
      title: "Azerbaijan for Turkish citizens",
      description: "Stands out with a short flight, nearby access, and strong city-hotel convenience.",
      image: idEntryCountries[1].image,
      href: idEntryCountries[1].href
    },
    {
      title: "Northern Cyprus for Turkish citizens",
      description: "A low-friction option for short holidays and sea-focused plans.",
      image: idEntryCountries[2].image,
      href: idEntryCountries[2].href
    }
  ],
  ru: [
    {
      title: "Грузия для граждан Турции",
      description: "Один из самых быстрых вариантов для city-break поездки с въездом по ID.",
      image: idEntryCountries[0].image,
      href: idEntryCountries[0].href
    },
    {
      title: "Азербайджан для граждан Турции",
      description: "Выделяется коротким перелётом, близостью и удобством городских отелей.",
      image: idEntryCountries[1].image,
      href: idEntryCountries[1].href
    },
    {
      title: "Северный Кипр для граждан Турции",
      description: "Низкопороговый вариант для коротких отпусков и морских планов.",
      image: idEntryCountries[2].image,
      href: idEntryCountries[2].href
    }
  ]
};

const localizedAffordableItems: Record<"en" | "ru" | "tr", CountryCard[]> = {
  tr: affordableStayCountries,
  en: [
    {
      title: "Georgia affordable stay guide",
      description: "Hotel costs around Tbilisi and Batumi keep the total trip budget under better control.",
      image: affordableStayCountries[0].image,
      href: affordableStayCountries[0].href
    },
    {
      title: "Serbia affordable stay guide",
      description: "Belgrade offers strong value for short city breaks.",
      image: affordableStayCountries[1].image,
      href: affordableStayCountries[1].href
    },
    {
      title: "Armenia affordable stay guide",
      description: "Short stays centered on Yerevan usually come with a lower entry cost.",
      image: affordableStayCountries[2].image,
      href: affordableStayCountries[2].href
    }
  ],
  ru: [
    {
      title: "Гид по недорогому проживанию в Грузии",
      description: "Отели в Тбилиси и Батуми помогают держать общий бюджет поездки под контролем.",
      image: affordableStayCountries[0].image,
      href: affordableStayCountries[0].href
    },
    {
      title: "Гид по недорогому проживанию в Сербии",
      description: "Белград даёт сильный баланс цены и качества для коротких city-break поездок.",
      image: affordableStayCountries[1].image,
      href: affordableStayCountries[1].href
    },
    {
      title: "Гид по недорогому проживанию в Армении",
      description: "Короткие поездки с базой в Ереване обычно требуют более низкого входного бюджета.",
      image: affordableStayCountries[2].image,
      href: affordableStayCountries[2].href
    }
  ]
};

export function VisaGuideHubContent() {
  const { language } = useLanguage();
  const copy =
    language === "ru"
      ? {
          eyebrow: "Визовый гид",
          title: "Центр гидов по безвизовым и e-визовым маршрутам",
          description:
            "Открывайте SEO-страницы по странам и быстро сравнивайте безвизовые и e-визовые направления."
        }
      : language === "tr"
        ? {
            eyebrow: "Vize Rehberi",
            title: "Vizesiz ve e-vizeli ülkeler için rehber merkezi",
            description:
              "Ülkeye göre ayrılmış SEO sayfalarından vizesiz ve e-vizeli rota kümelerini açın. İçerikler hızlı karar vermek için pratik seyahat mantığıyla yazıldı."
          }
        : {
            eyebrow: "Visa Guide",
            title: "Guide hub for visa-free and e-visa destinations",
            description:
              "Open country-specific guide pages and compare visa-free and e-visa route clusters more quickly."
          };

  return (
    <InfoCardGrid
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      items={visaGuideCards}
    />
  );
}

export function IdEntryHubContent() {
  const { language } = useLanguage();
  const copy =
    language === "ru"
      ? {
          eyebrow: "Исследовать",
          title: "Страны с въездом по ID",
          description:
            "Здесь собраны маршруты, которые выделяются более простым въездом по удостоверению личности для граждан Турции."
        }
      : language === "tr"
        ? {
            eyebrow: "Keşfet",
            title: "Kimlikle gidilen ülkeler",
            description:
              "Türk vatandaşları için kimlikle giriş kolaylığıyla öne çıkan rotaları ve ilgili rehber sayfaları burada topladık."
          }
        : {
            eyebrow: "Discover",
            title: "ID entry countries",
            description:
              "We grouped routes that stand out for easier ID-based entry for Turkish citizens."
          };

  return (
    <InfoCardGrid
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      items={localizedIdEntryItems[language]}
    />
  );
}

export function AffordableStayHubContent() {
  const { language } = useLanguage();
  const copy =
    language === "ru"
      ? {
          eyebrow: "Исследовать",
          title: "Страны с более доступным проживанием",
          description:
            "Подборка направлений, где слой отелей обычно позволяет удерживать общую стоимость поездки разумнее."
        }
      : language === "tr"
        ? {
            eyebrow: "Keşfet",
            title: "Ucuz konaklamalı ülkeler",
            description:
              "Toplam seyahat maliyetinde otel tarafını daha kontrollü tutmak isteyenler için uygun konaklama odaklı rota kümeleri."
          }
        : {
            eyebrow: "Discover",
            title: "Affordable stay countries",
            description:
              "A set of routes where the hotel layer usually helps keep total trip cost more manageable."
          };

  return (
    <InfoCardGrid
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      items={localizedAffordableItems[language]}
    />
  );
}
