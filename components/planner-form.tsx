"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Briefcase,
  CalendarRange,
  Check,
  ChevronDown,
  Euro,
  Gauge,
  Globe2,
  MapPinned,
  Search,
  ShieldCheck,
  Ticket,
  Wallet
} from "lucide-react";
import {
  useLanguage,
  type Currency,
  type Language
} from "@/components/language-provider";

type TravelType = "Domestic" | "International" | "Both";
type TripMode = "One way" | "Round trip";
type VisaStatus = "No visa" | "E-visa" | "Schengen visa" | "Other visa";
type DateFlexibility = "Exact dates" | "Flexible dates";
type FlightPreference = "Cabin bag only" | "Checked baggage";
type AccommodationPreference =
  | "Just sleep (budget)"
  | "Breakfast included"
  | "Better experience"
  | "I'll choose my own hotel";

type PlaceOption = {
  id: string;
  type: "city" | "airport";
  code: string;
  name: string;
  cityName?: string | null;
  country: string;
};

type PlannerState = {
  departures: PlaceOption[];
  destination: PlaceOption | null;
  tripMode: TripMode;
  travelType: TravelType;
  citizenship: string;
  visaStatus: VisaStatus;
  budget: number;
  dateFlexibility: DateFlexibility;
  exactDepartureDate: string;
  exactReturnDate: string;
  flightPreference: FlightPreference;
  accommodationPreference: AccommodationPreference;
};

type Recommendation = {
  city: string;
  country: string;
  destinationCode: string;
  estimatedCost: number;
  flightDuration: string;
  visaRequirement: "visa-free" | "e-visa required" | "visa required";
  experienceMatch: string;
  badge: "Smart Deal" | "Best Match" | "Trending";
  matchScore: number;
  notes: string;
};

type LiveFareMap = Record<
  string,
  {
    price?: number;
    currency?: string;
    departureAt?: string;
    returnAt?: string | null;
    fallbackUsed?: boolean;
    error?: string;
  }
>;

function formatMoney(value: number, currency: Currency) {
  const locale =
    currency === "TRY" ? "tr-TR" : currency === "RUB" ? "ru-RU" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

function getStayNights(options: {
  tripMode: TripMode;
  exactDepartureDate: string;
  exactReturnDate: string;
  fareDepartureAt?: string;
  fareReturnAt?: string | null;
}) {
  if (options.tripMode === "One way") {
    return 1;
  }

  const departureSource = options.fareDepartureAt ?? options.exactDepartureDate;
  const returnSource = options.fareReturnAt ?? options.exactReturnDate;

  if (!departureSource || !returnSource) {
    return 3;
  }

  const departure = new Date(departureSource);
  const returning = new Date(returnSource);
  const diffDays = Math.round(
    (returning.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (!Number.isFinite(diffDays) || diffDays <= 0) {
    return 3;
  }

  return diffDays;
}

function isRussiaDestination(city: string, country: string) {
  const normalizedCity = city.toLowerCase();
  const normalizedCountry = country.toLowerCase();

  return (
    normalizedCountry.includes("russia") ||
    normalizedCountry.includes("russian federation") ||
    ["moscow", "saint petersburg", "st petersburg", "sochi", "kazan", "adler"].some(
      (item) => normalizedCity.includes(item)
    )
  );
}

function getNightlyHotelBase(
  preference: AccommodationPreference,
  city: string,
  country: string
) {
  const cityPremium: Record<string, number> = {
    Barcelona: 72,
    Paris: 95,
    Rome: 78,
    Budapest: 52,
    Tbilisi: 34,
    Baku: 39,
    Belgrade: 42
  };

  let base = cityPremium[city] ?? 48;

  if (isRussiaDestination(city, country)) {
    base = Math.round(base * 0.85);
  }

  switch (preference) {
    case "Just sleep (budget)":
      return Math.round(base * 0.75);
    case "Breakfast included":
      return Math.round(base);
    case "Better experience":
      return Math.round(base * 1.45);
    case "I'll choose my own hotel":
      return Math.round(base * 0.9);
    default:
      return base;
  }
}

function buildKlookHotelUrl(options: {
  city: string;
  country: string;
  checkIn?: string;
  checkOut?: string | null;
}) {
  const queryParts = [options.city, options.country, "hotel"];

  if (options.checkIn) {
    queryParts.push(options.checkIn);
  }

  if (options.checkOut) {
    queryParts.push(options.checkOut);
  }

  const url = new URL("https://www.klook.com/search/result/");
  url.searchParams.set("query", queryParts.join(" "));
  return url.toString();
}

function buildHotelUrl(options: {
  city: string;
  country: string;
  checkIn?: string;
  checkOut?: string | null;
}) {
  if (isRussiaDestination(options.city, options.country)) {
    return "https://manteratravel.ru/hotels";
  }

  return buildKlookHotelUrl(options);
}

const citizenshipOptions = [
  "Turkey",
  "Russia",
  "Germany",
  "United Kingdom",
  "Netherlands",
  "France",
  "United States"
];

const stepMeta = [
  {
    key: "basics",
    icon: MapPinned
  },
  {
    key: "flightPreferences",
    icon: Ticket
  },
  {
    key: "stayStyle",
    icon: BedDouble
  }
] as const;

const defaultDeparture: PlaceOption = {
  id: "default-istanbul",
  type: "city",
  code: "IST",
  name: "Istanbul",
  cityName: "Istanbul",
  country: "Turkiye"
};

const initialState: PlannerState = {
  departures: [defaultDeparture],
  destination: null,
  tripMode: "Round trip",
  travelType: "International",
  citizenship: "Turkey",
  visaStatus: "No visa",
  budget: 350,
  dateFlexibility: "Flexible dates",
  exactDepartureDate: "",
  exactReturnDate: "",
  flightPreference: "Cabin bag only",
  accommodationPreference: "Breakfast included"
};

function OptionPill({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-chartreuse bg-chartreuse text-black shadow-[0_12px_30px_rgba(201,255,5,0.22)]"
          : "border-slate-200 bg-white text-slate-600 hover:border-slateBlue/30 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function formatPlaceLabel(place: PlaceOption) {
  if (place.type === "airport") {
    return `${place.cityName ?? place.name} (${place.code})`;
  }

  return place.name;
}

function labelTripMode(value: TripMode, language: Language) {
  if (language === "ru") {
    return value === "One way" ? "В одну сторону" : "Туда-обратно";
  }
  if (language === "tr") {
    return value === "One way" ? "Tek yön" : "Gidiş-dönüş";
  }
  return value;
}

function labelTravelType(value: TravelType, language: Language) {
  if (language === "ru") {
    if (value === "Domestic") return "Внутри страны";
    if (value === "International") return "Международные";
    return "Оба";
  }
  if (language === "tr") {
    if (value === "Domestic") return "Yurt içi";
    if (value === "International") return "Yurt dışı";
    return "İkisi de";
  }
  return value;
}

function labelVisaStatus(value: VisaStatus, language: Language) {
  if (language === "ru") {
    if (value === "No visa") return "Без визы";
    if (value === "E-visa") return "Электронная виза";
    if (value === "Schengen visa") return "Шенген";
    return "Другая виза";
  }
  if (language === "tr") {
    if (value === "No visa") return "Vizesiz";
    if (value === "E-visa") return "E-vize";
    if (value === "Schengen visa") return "Schengen vizesi";
    return "Diğer vize";
  }
  return value;
}

function labelVisaRequirement(
  value: Recommendation["visaRequirement"],
  language: Language
) {
  if (language === "ru") {
    if (value === "visa-free") return "без визы";
    if (value === "e-visa required") return "нужна e-виза";
    return "нужна виза";
  }
  if (language === "tr") {
    if (value === "visa-free") return "vizesiz";
    if (value === "e-visa required") return "e-vize gerekli";
    return "vize gerekli";
  }

  return value;
}

function labelDateFlexibility(value: DateFlexibility, language: Language) {
  if (language === "ru") {
    return value === "Exact dates" ? "Точные даты" : "Гибкие даты";
  }
  if (language === "tr") {
    return value === "Exact dates" ? "Net tarihler" : "Esnek tarihler";
  }
  return value;
}

function labelFlightPreference(value: FlightPreference, language: Language) {
  if (language === "ru") {
    return value === "Cabin bag only" ? "Только ручная кладь" : "С багажом";
  }
  if (language === "tr") {
    return value === "Cabin bag only" ? "Sadece kabin bagajı" : "Check-in bagajı";
  }
  return value;
}

function labelAccommodationPreference(
  value: AccommodationPreference,
  language: Language
) {
  if (language === "ru") {
    if (value === "Just sleep (budget)") return "Только переночевать";
    if (value === "Breakfast included") return "С завтраком";
    if (value === "Better experience") return "Лучший опыт";
    return "Отель выберу сам";
  }
  if (language === "tr") {
    if (value === "Just sleep (budget)") return "Sadece uyu (ekonomik)";
    if (value === "Breakfast included") return "Kahvaltı dahil";
    if (value === "Better experience") return "Daha iyi deneyim";
    return "Oteli kendim seçeceğim";
  }
  return value;
}

export function PlannerForm() {
  const { language, currency } = useLanguage();
  const copy =
    language === "ru"
      ? {
          backHome: "Назад на главную",
          engine: "Система рекомендаций",
          decisionEngine: "Decision Engine",
          heroTitle: "Спланируйте поездку",
          heroDescription:
            "Это не обычный поиск билетов. Мы используем ваши документы, бюджет и стиль поездки, чтобы рекомендовать более подходящие варианты.",
          plannerSteps: "Шаги планировщика",
          snapshot: "Снимок плана",
          departures: "Города вылета",
          selectCity: "Выберите хотя бы один город",
          tripMode: "Формат поездки",
          destination: "Направление",
          everywhere: "Куда угодно",
          tripType: "Тип поездки",
          citizenship: "Гражданство",
          visa: "Виза",
          budget: "Бюджет",
          dates: "Даты",
          baggage: "Багаж",
          stay: "Проживание",
          aviasalesAligned: "Рекомендации по перелётам синхронизированы с интеграцией Aviasales.",
          loadingTitle: "Подбираем лучшие поездки для вас...",
          loadingDescription:
            "Мы сопоставляем бюджет, визовый статус, гибкость и стиль поездки, чтобы собрать более сильные рекомендации.",
          departurePlaceholder: "Введите город или аэропорт",
          destinationPlaceholder: "Куда угодно или введите город",
          searchingPlaces: "Ищем города и аэропорты...",
          noCityFound: "Ничего не найдено по городу или аэропорту.",
          noDestinationFound: "Подходящее направление не найдено.",
          searchWorldwide: "Начните вводить, чтобы искать города и аэропорты Aviasales по всему миру.",
          searchDestinationHint: "Оставьте 'Куда угодно' или выберите конкретный город.",
          travelType: "Тип путешествия",
          visaStatus: "Визовый статус",
          totalFlightBudget: "Общий бюджет на перелёт",
          aviasalesLogic: "Логика перелётов на базе Aviasales",
          dateFlexibility: "Гибкость дат",
          flightPreferences: "Предпочтения по перелёту",
          departureDate: "Дата вылета",
          returnDate: "Дата возврата",
          accommodationPreference: "Предпочтение по проживанию",
          stayCopyOwn: "Сначала мы оптимизируем перелёт и fit поездки, а проживание вы выберете сами.",
          stayCopyMixed: "Мы учитываем общий опыт поездки, совмещая стоимость перелёта и стиль проживания.",
          recommendations: "Рекомендации",
          resultsTitle: "Лучшие направления для вашей поездки",
          resultsDescription:
            "Они ранжируются по общему соответствию вашим документам, бюджету, гибкости и стилю поездки, а не только по самой низкой цене.",
          analyzed:
            "Мы проанализировали ваши предпочтения и нашли лучшие направления под ваш бюджет, визовый статус и стиль путешествия.",
          editAnswers: "Изменить ответы",
          liveFlightPrice: "Живая цена перелёта",
          unavailable: "Недоступно",
          hotelStartsFrom: "Отель от",
          youChoose: "Вы выбираете",
          ecoNight: "Eco-оценка отеля за ночь",
          hotelNight: "Оценка стартовой цены отеля за ночь",
          flightDuration: "Длительность перелёта",
          liveFareDate: "Дата живого тарифа",
          noFareFound: "Живой тариф не найден",
          experienceMatch: "Соответствие ожиданиям",
          matchScore: "Индекс соответствия",
          stayNights: "Ночей",
          liveWindow: "Окно живого поиска перелёта",
          totalTrip: "Общая оценка поездки",
          flight: "Перелёт",
          hotel: "Отель",
          hotelNotIncluded: "не включён",
          fallbackNotice:
            "Точный живой тариф недоступен, поэтому мы подобрали ближайшее доступное окно дат.",
          recommendationLead: "Мы рекомендуем",
          visaFree: "без визы",
          eVisaRequired: "нужна e-виза",
          visaCompatible: "совместимо с вашей текущей визовой ситуацией",
          recommendationTail:
            "соответствует вашему бюджету и даёт лучший общий fit поездки, чем альтернативы с более низким рейтингом.",
          loadingFlights: "Загружаем перелёты...",
          seeFlights: "Смотреть перелёты",
          seeHotels: "Смотреть отели",
          previous: "Назад",
          stop: "Стоп",
          continue: "Продолжить",
          seeTripOptions: "Показать варианты поездки",
          building: "Собираем рекомендации...",
          sorted: "Результаты отсортированы по лучшему соответствию",
          backToForm: "Вернуться к форме",
          stepOf: "Шаг",
          basicsTitle: "Основы поездки",
          basicsCaption:
            "Начните с городов вылета, формата поездки, гражданства и визового доступа.",
          flightPreferencesTitle: "Предпочтения по перелёту",
          flightPreferencesCaption:
            "Настройте движок рекомендаций через бюджет, гибкость дат и тип багажа.",
          stayStyleTitle: "Стиль проживания",
          stayStyleCaption:
            "Подскажите, насколько проживание должно влиять на рекомендацию.",
          loadingShort: "Загрузка...",
          nightSingle: "ночь",
          nightPlural: "ночей",
          fromTotal: "от {amount} всего"
        }
      : language === "tr"
        ? {
            backHome: "Anasayfaya dön",
            engine: "Öneri motoru",
            decisionEngine: "Decision Engine",
            heroTitle: "Trip’ini Planla",
            heroDescription:
              "Bu normal bir uçuş araması değil. Belgelerini, bütçeni ve seyahat stilini kullanarak daha iyi uyan trip’ler öneriyoruz.",
            plannerSteps: "Planner adımları",
            snapshot: "Planner özeti",
            departures: "Kalkış noktaları",
            selectCity: "En az bir şehir seç",
            tripMode: "Trip modu",
            destination: "Varış noktası",
            everywhere: "Her yer",
            tripType: "Trip tipi",
            citizenship: "Vatandaşlık",
            visa: "Vize",
            budget: "Bütçe",
            dates: "Tarihler",
            baggage: "Bagaj",
            stay: "Konaklama",
            aviasalesAligned: "Uçuş önerileri şu an Aviasales entegrasyonunla uyumlu çalışıyor.",
            loadingTitle: "Senin için en iyi tripleri buluyoruz...",
            loadingDescription:
              "Bütçeni, vize durumunu, esnekliğini ve seyahat stilini daha güçlü trip önerilerine dönüştürüyoruz.",
            departurePlaceholder: "Bir şehir veya havalimanı yaz",
            destinationPlaceholder: "Her yer veya bir şehir yaz",
            searchingPlaces: "Şehirler ve havalimanları aranıyor...",
            noCityFound: "Eşleşen şehir veya havalimanı bulunamadı.",
            noDestinationFound: "Eşleşen varış noktası bulunamadı.",
            searchWorldwide: "Dünya genelinde Aviasales şehir ve havalimanlarını aramak için yazmaya başla.",
            searchDestinationHint: "Her yer olarak bırakabilir ya da spesifik bir destinasyon seçebilirsin.",
            travelType: "Seyahat tipi",
            visaStatus: "Vize durumu",
            totalFlightBudget: "Toplam uçuş bütçesi",
            aviasalesLogic: "Aviasales destekli uçuş mantığı",
            dateFlexibility: "Tarih esnekliği",
            flightPreferences: "Uçuş tercihleri",
            departureDate: "Gidiş tarihi",
            returnDate: "Dönüş tarihi",
            accommodationPreference: "Konaklama tercihi",
            stayCopyOwn: "Önce uçuşu ve trip uyumunu optimize ederiz, konaklamayı sen ayrıca seçersin.",
            stayCopyMixed: "Uçuş maliyeti ve konaklama stilini birlikte tartarak toplam trip deneyimini değerlendiririz.",
            recommendations: "Öneriler",
            resultsTitle: "Trip’in için en iyi destinasyonlar",
            resultsDescription:
              "Bunlar sadece en ucuz bilete göre değil; belgelerin, bütçen, esnekliğin ve seyahat stiline göre sıralanır.",
            analyzed:
              "Tercihlerini analiz ettik ve bütçene, vize durumuna ve seyahat stiline uygun en iyi destinasyonları bulduk.",
            editAnswers: "Cevapları düzenle",
            liveFlightPrice: "Canlı uçuş fiyatı",
            unavailable: "Yok",
            hotelStartsFrom: "Otel fiyatı şu seviyeden başlar",
            youChoose: "Sen seçersin",
            ecoNight: "Gece başı eco otel tahmini",
            hotelNight: "Gece başı tahmini otel başlangıç fiyatı",
            flightDuration: "Uçuş süresi",
            liveFareDate: "Canlı fiyat tarihi",
            noFareFound: "Canlı fiyat bulunamadı",
            experienceMatch: "Deneyim uyumu",
            matchScore: "Uyum skoru",
            stayNights: "Konaklama gecesi",
            liveWindow: "Canlı uçuş arama penceresi",
            totalTrip: "Toplam tahmini trip",
            flight: "Uçuş",
            hotel: "Otel",
            hotelNotIncluded: "dahil değil",
            fallbackNotice:
              "Tam canlı fiyat yoktu, bu yüzden en yakın canlı tarih penceresini eşleştirdik.",
            recommendationLead: "Şunu öneriyoruz:",
            visaFree: "vizesiz",
            eVisaRequired: "e-vize gerekli",
            visaCompatible: "mevcut vize durumunla uyumlu",
            recommendationTail:
              "bütçene uyuyor ve daha alt sıralı alternatiflere göre daha güçlü bir genel trip uyumu sunuyor.",
            loadingFlights: "Canlı uçuşlar yükleniyor...",
            seeFlights: "Canlı uçuşları gör",
            seeHotels: "Otelleri gör",
            previous: "Geri",
            stop: "Dur",
            continue: "Devam et",
            seeTripOptions: "Trip seçeneklerimi gör",
            building: "Öneriler hazırlanıyor...",
            sorted: "Sonuçlar en iyi uyuma göre sıralandı",
            backToForm: "Forma dön",
            stepOf: "Adım",
            basicsTitle: "Trip temelleri",
            basicsCaption:
              "Kalkış şehirleri, trip kapsamı, vatandaşlık ve vize erişimiyle başla.",
            flightPreferencesTitle: "Uçuş tercihleri",
            flightPreferencesCaption:
              "Bütçe, tarih esnekliği ve bagaj stiliyle recommendation engine’i şekillendir.",
            stayStyleTitle: "Konaklama stili",
            stayStyleCaption:
              "Konaklamanın öneriyi ne kadar etkilemesi gerektiğini bize söyle.",
            loadingShort: "Yükleniyor...",
            nightSingle: "gece",
            nightPlural: "gece",
            fromTotal: "toplam {amount} seviyesinden"
          }
      : {
          backHome: "Back to home",
          engine: "Recommendation engine",
          decisionEngine: "Decision Engine",
          heroTitle: "Plan Your Trip",
          heroDescription:
            "This is not a raw flight search. We use your documents, budget, and travel style to recommend better-fit trips.",
          plannerSteps: "Planner steps",
          snapshot: "Planner snapshot",
          departures: "Departure locations",
          selectCity: "Select at least one city",
          tripMode: "Trip mode",
          destination: "Destination",
          everywhere: "Everywhere",
          tripType: "Trip type",
          citizenship: "Citizenship",
          visa: "Visa",
          budget: "Budget",
          dates: "Dates",
          baggage: "Baggage",
          stay: "Stay",
          aviasalesAligned: "Flight recommendations currently align with your Aviasales flight integration.",
          loadingTitle: "Finding the best trips for you...",
          loadingDescription:
            "We are matching your budget, visa status, flexibility, and travel style into stronger trip recommendations.",
          departurePlaceholder: "Type a city or airport",
          destinationPlaceholder: "Everywhere or type a city",
          searchingPlaces: "Searching cities and airports...",
          noCityFound: "No matching city or airport found.",
          noDestinationFound: "No matching destination found.",
          searchWorldwide: "Start typing to search Aviasales cities and airports worldwide.",
          searchDestinationHint: "Leave it as Everywhere or search a specific destination.",
          travelType: "Travel type",
          visaStatus: "Visa status",
          totalFlightBudget: "Total flight budget",
          aviasalesLogic: "Aviasales-powered flight logic",
          dateFlexibility: "Date flexibility",
          flightPreferences: "Flight preferences",
          departureDate: "Departure date",
          returnDate: "Return date",
          accommodationPreference: "Accommodation preference",
          stayCopyOwn: "We will optimize around flights and trip fit first, then let you handle the stay separately.",
          stayCopyMixed: "We will weigh the total trip experience using both flight cost and accommodation style.",
          recommendations: "Recommendations",
          resultsTitle: "Best destinations for your trip",
          resultsDescription:
            "These are ranked by overall fit for your documents, budget, flexibility, and travel style, not just by the lowest fare.",
          analyzed:
            "We analyzed your preferences and found the best destinations for your budget, visa status, and travel style.",
          editAnswers: "Edit answers",
          liveFlightPrice: "Live flight price",
          unavailable: "Unavailable",
          hotelStartsFrom: "Hotel price starts from",
          youChoose: "You choose",
          ecoNight: "Eco mode hotel estimate per night",
          hotelNight: "Estimated hotel starting price per night",
          flightDuration: "Flight duration",
          liveFareDate: "Live fare date",
          noFareFound: "No live fare found",
          experienceMatch: "Experience match",
          matchScore: "Best match score",
          stayNights: "Stay nights",
          liveWindow: "Live flight search window",
          totalTrip: "Total estimated trip",
          flight: "Flight",
          hotel: "Hotel",
          hotelNotIncluded: "not included",
          fallbackNotice:
            "Exact live fare was unavailable, so we matched the closest live date window instead.",
          recommendationLead: "We recommend",
          visaFree: "visa-free",
          eVisaRequired: "e-visa required",
          visaCompatible: "compatible with your current visa setup",
          recommendationTail:
            "fits your budget profile, and offers a stronger overall trip fit than lower-ranked alternatives.",
          loadingFlights: "Loading live flights...",
          seeFlights: "See live flights",
          seeHotels: "See hotels",
          previous: "Previous",
          stop: "Stop",
          continue: "Continue",
          seeTripOptions: "See my trip options",
          building: "Building recommendations...",
          sorted: "Results sorted by best match",
          backToForm: "Back to form",
          stepOf: "Step",
          basicsTitle: "Trip basics",
          basicsCaption:
            "Start with departure cities, trip scope, citizenship, and visa access.",
          flightPreferencesTitle: "Flight preferences",
          flightPreferencesCaption:
            "Shape the recommendation engine with budget, date flexibility, and baggage style.",
          stayStyleTitle: "Stay style",
          stayStyleCaption:
            "Tell us how much accommodation should influence the recommendation.",
          loadingShort: "Loading...",
          nightSingle: "night",
          nightPlural: "nights",
          fromTotal: "from {amount} total"
        };
  const [step, setStep] = useState(0);
  const [departureSearch, setDepartureSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [departureResults, setDepartureResults] = useState<PlaceOption[]>([]);
  const [destinationResults, setDestinationResults] = useState<PlaceOption[]>([]);
  const [isLoadingDepartureResults, setIsLoadingDepartureResults] = useState(false);
  const [isLoadingDestinationResults, setIsLoadingDestinationResults] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [openingDestination, setOpeningDestination] = useState<string | null>(null);
  const [liveFares, setLiveFares] = useState<LiveFareMap>({});
  const [form, setForm] = useState<PlannerState>(initialState);

  const localizedStepMeta = useMemo(
    () =>
      stepMeta.map((item) => ({
        ...item,
        title:
          item.key === "basics"
            ? copy.basicsTitle
            : item.key === "flightPreferences"
              ? copy.flightPreferencesTitle
              : copy.stayStyleTitle,
        caption:
          item.key === "basics"
            ? copy.basicsCaption
            : item.key === "flightPreferences"
              ? copy.flightPreferencesCaption
              : copy.stayStyleCaption
      })),
    [copy]
  );

  const current = localizedStepMeta[step];
  const progress = ((step + 1) / stepMeta.length) * 100;

  const canContinue = useMemo(() => {
    if (step === 0) {
      return form.departures.length > 0;
    }
    if (step === 1 && form.dateFlexibility === "Exact dates") {
      return form.tripMode === "Round trip"
        ? Boolean(form.exactDepartureDate && form.exactReturnDate)
        : Boolean(form.exactDepartureDate);
    }
    return true;
  }, [
    form.dateFlexibility,
    form.departures.length,
    form.exactDepartureDate,
    form.exactReturnDate,
    form.tripMode,
    step
  ]);

  const recommendations = useMemo<Recommendation[]>(() => {
    const base: Recommendation[] = [
      {
        city: "Tbilisi",
        country: "Georgia",
        destinationCode: "TBS",
        estimatedCost: 290,
        flightDuration: "2h 15m",
        visaRequirement: "visa-free",
        experienceMatch: "Best value",
        badge: "Best Match",
        matchScore: 94,
        notes:
          language === "ru"
            ? "Мы рекомендуем Тбилиси, потому что это безвизовое направление, оно укладывается в ваш бюджет и отлично подходит для гибких city-break поездок."
            : language === "tr"
              ? "Tiflis’i öneriyoruz çünkü vizesiz, bütçene uyuyor ve esnek city break planları için çok güçlü bir seçenek."
              : "We recommend Tbilisi because it's visa-free, within your budget, and works exceptionally well for flexible city breaks."
      },
      {
        city: "Baku",
        country: "Azerbaijan",
        destinationCode: "GYD",
        estimatedCost: 340,
        flightDuration: "2h 50m",
        visaRequirement: "e-visa required",
        experienceMatch: "Best value",
        badge: "Smart Deal",
        matchScore: 89,
        notes:
          language === "ru"
            ? "Мы рекомендуем Баку, потому что он сочетает простой доступ, низкую общую стоимость и удобство короткого перелёта, если вам подходит быстрый маршрут с e-визой."
            : language === "tr"
              ? "Bakü’yü öneriyoruz çünkü kolay erişim, düşük toplam maliyet ve kısa uçuş rahatlığını bir araya getiriyor; özellikle hızlı e-vize rotalarına açıksan."
              : "We recommend Baku because it balances easy access, low total cost, and short-haul convenience if you're open to quick e-visa routes."
      },
      {
        city: "Belgrade",
        country: "Serbia",
        destinationCode: "BEG",
        estimatedCost: 390,
        flightDuration: "1h 50m",
        visaRequirement: "visa-free",
        experienceMatch: "Best value",
        badge: "Trending",
        matchScore: 87,
        notes:
          language === "ru"
            ? "Мы рекомендуем Белград, потому что это безвизовое направление, оно укладывается в ваш бюджет и предлагает более сильную ценность, чем многие европейские альтернативы."
            : language === "tr"
              ? "Belgrad’ı öneriyoruz çünkü vizesiz, bütçene uyuyor ve birçok Avrupa alternatifine göre daha iyi değer sunuyor."
              : "We recommend Belgrade because it's visa-free, within your budget, and offers better value than many European alternatives."
      },
      {
        city: "Budapest",
        country: "Hungary",
        destinationCode: "BUD",
        estimatedCost: 420,
        flightDuration: "2h 05m",
        visaRequirement:
          form.visaStatus === "Schengen visa" ? "visa-free" : "visa required",
        experienceMatch: "Premium experience",
        badge: "Trending",
        matchScore: 82,
        notes:
          language === "ru"
            ? "Мы рекомендуем Будапешт, если вы хотите более сильный опыт по проживанию и гастрономии, сохраняя при этом управляемый общий бюджет."
            : language === "tr"
              ? "Budapeşte’yi, konaklama ve yeme-içme tarafında daha güçlü bir deneyim isterken toplam bütçeyi hâlâ yönetilebilir tutmak istediğinde öneriyoruz."
              : "We recommend Budapest when you want a stronger accommodation and food scene with a still-manageable total budget."
      }
    ];

    const filteredBase =
      form.destination === null
        ? base
        : base.filter(
            (item) =>
              item.city === (form.destination?.cityName ?? form.destination?.name)
          );

    const fallbackRecommendation: Recommendation | null =
      form.destination === null || filteredBase.length > 0
        ? null
        : {
            city: form.destination.cityName ?? form.destination.name,
            country: form.destination.country,
            destinationCode: form.destination.code,
            estimatedCost:
              form.travelType === "Domestic"
                ? Math.max(120, Math.round(form.budget * 0.7))
                : Math.max(180, Math.round(form.budget * 0.9)),
            flightDuration:
              form.travelType === "Domestic" ? "1h 30m" : "3h 10m",
            visaRequirement:
              form.travelType === "Domestic"
                ? "visa-free"
                : form.visaStatus === "No visa"
                  ? "e-visa required"
                  : "visa-free",
            experienceMatch:
              form.accommodationPreference === "Better experience"
                ? "Premium experience"
                : "Best value",
            badge: "Best Match",
            matchScore: 88,
            notes:
              language === "ru"
                ? `${form.destination.cityName ?? form.destination.name} добавлен, потому что вы выбрали его как целевое направление напрямую.`
                : language === "tr"
                  ? `${form.destination.cityName ?? form.destination.name} destinasyonunu doğrudan seçtiğin için onu da önerilere dahil ettik.`
                  : `We included ${form.destination.cityName ?? form.destination.name} because you selected it directly as your target destination.`
          };

    const effectiveBase =
      filteredBase.length > 0 || form.destination === null
        ? filteredBase
        : fallbackRecommendation
          ? [fallbackRecommendation]
          : [];

    return effectiveBase
      .map((item) => {
        let score = item.matchScore;

        if (form.travelType === "Domestic") {
          score -= 22;
        }

        if (form.travelType === "Both") {
          score += 2;
        }

        if (
          form.visaStatus === "No visa" &&
          item.visaRequirement !== "visa-free"
        ) {
          score -= 28;
        }

        if (
          form.visaStatus === "E-visa" &&
          item.visaRequirement === "visa required"
        ) {
          score -= 18;
        }

        if (
          form.visaStatus === "Schengen visa" &&
          item.visaRequirement === "e-visa required"
        ) {
          score -= 4;
        }

        if (form.budget < item.estimatedCost) {
          score -= 18;
        } else if (form.budget >= item.estimatedCost + 150) {
          score += 4;
        }

        if (
          form.accommodationPreference === "Better experience" &&
          item.experienceMatch === "Premium experience"
        ) {
          score += 10;
        }

        if (
          form.accommodationPreference === "Just sleep (budget)" &&
          item.experienceMatch === "Best value"
        ) {
          score += 10;
        }

        if (form.accommodationPreference === "I'll choose my own hotel") {
          score += 4;
        }

        if (
          form.dateFlexibility === "Flexible dates" &&
          item.badge !== "Trending"
        ) {
          score += 5;
        }

        return { ...item, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [form, language]);

  const toggleDeparture = (value: PlaceOption) => {
    setForm((prev) => {
      const exists = prev.departures.some((item) => item.id === value.id);
      return {
        ...prev,
        departures: exists
          ? prev.departures.filter((item) => item.id !== value.id)
          : [...prev.departures, value]
      };
    });
  };

  const departureCode = useMemo(() => {
    return form.departures[0]?.code ?? "IST";
  }, [form.departures]);

  useEffect(() => {
    const term = departureSearch.trim();
    if (term.length < 2) {
      setDepartureResults([]);
      setIsLoadingDepartureResults(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingDepartureResults(true);
        const response = await fetch(
          `/api/places-search?term=${encodeURIComponent(term)}`,
          { signal: controller.signal }
        );
        const payload = (await response.json()) as
          | { results: PlaceOption[] }
          | { error: string };

        if (!response.ok || !("results" in payload)) {
          throw new Error("Autocomplete request failed");
        }

        setDepartureResults(payload.results);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setDepartureResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingDepartureResults(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [departureSearch]);

  useEffect(() => {
    const term = destinationSearch.trim();
    if (term.length < 2) {
      setDestinationResults([]);
      setIsLoadingDestinationResults(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingDestinationResults(true);
        const response = await fetch(
          `/api/places-search?term=${encodeURIComponent(term)}`,
          { signal: controller.signal }
        );
        const payload = (await response.json()) as
          | { results: PlaceOption[] }
          | { error: string };

        if (!response.ok || !("results" in payload)) {
          throw new Error("Autocomplete request failed");
        }

        setDestinationResults(payload.results);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setDestinationResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingDestinationResults(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [destinationSearch]);

  const getSearchDateLabel = () => {
    if (form.dateFlexibility === "Exact dates" && form.exactDepartureDate) {
      if (form.tripMode === "One way") {
        return form.exactDepartureDate;
      }
      return form.exactReturnDate
        ? `${form.exactDepartureDate} to ${form.exactReturnDate}`
        : form.exactDepartureDate;
    }
    return form.tripMode === "One way"
      ? "Flexible one-way date mapped to next best live fare"
      : "Flexible round-trip dates mapped to next best live window";
  };

  const openLiveFlights = async (destinationCode: string) => {
    let popup: Window | null = null;

    try {
      popup = window.open("about:blank", "_blank");
      setOpeningDestination(destinationCode);
      const params = new URLSearchParams({
        origin: departureCode,
        destination: destinationCode,
        mode: form.dateFlexibility === "Exact dates" ? "exact" : "flexible",
        tripMode: form.tripMode === "One way" ? "oneway" : "roundtrip",
        currency: currency.toLowerCase(),
        locale: language
      });

      if (form.dateFlexibility === "Exact dates" && form.exactDepartureDate) {
        params.set("date", form.exactDepartureDate);
        if (form.tripMode === "Round trip" && form.exactReturnDate) {
          params.set("returnDate", form.exactReturnDate);
        }
      }

      const response = await fetch(`/api/aviasales-link?${params.toString()}`);
      const payload = (await response.json()) as
        | { url: string }
        | { error: string };

      if (!response.ok || !("url" in payload)) {
        throw new Error("Could not create live Aviasales link");
      }

      if (popup && !popup.closed) {
        popup.opener = null;
        popup.location.replace(payload.url);
      } else {
        window.location.assign(payload.url);
      }
    } catch {
      if (popup && !popup.closed) {
        popup.close();
      }
      window.alert("Live Aviasales results could not be loaded for this route.");
    } finally {
      setOpeningDestination(null);
    }
  };

  const openHotels = (city: string, country: string, fare?: LiveFareMap[string]) => {
    const hotelUrl = buildHotelUrl({
      city,
      country,
      checkIn: fare?.departureAt?.slice(0, 10),
      checkOut: fare?.returnAt?.slice(0, 10) ?? null
    });

    const popup = window.open(hotelUrl, "_blank");
    if (!popup) {
      window.location.assign(hotelUrl);
    }
  };

  useEffect(() => {
    if (!showResults) {
      return;
    }

    let cancelled = false;

    const fetchFares = async () => {
      const entries = await Promise.all(
        recommendations.map(async (item) => {
          try {
            const params = new URLSearchParams({
              origin: departureCode,
              destination: item.destinationCode,
              mode: form.dateFlexibility === "Exact dates" ? "exact" : "flexible",
              tripMode: form.tripMode === "One way" ? "oneway" : "roundtrip",
              currency: currency.toLowerCase(),
              locale: language
            });

            if (form.dateFlexibility === "Exact dates" && form.exactDepartureDate) {
              params.set("date", form.exactDepartureDate);
              if (form.tripMode === "Round trip" && form.exactReturnDate) {
                params.set("returnDate", form.exactReturnDate);
              }
            }

            const response = await fetch(`/api/aviasales-link?${params.toString()}`);
            const payload = (await response.json()) as
              | {
                  price: number;
                  currency?: string;
                  departureAt: string;
                  returnAt?: string | null;
                  fallbackUsed?: boolean;
                }
              | { error: string };

            if (!response.ok || !("price" in payload)) {
              return [
                item.destinationCode,
                { error: "Live fare unavailable for this route right now." }
              ] as const;
            }

            return [
              item.destinationCode,
              {
                price: payload.price,
                currency: payload.currency,
                departureAt: payload.departureAt,
                returnAt: payload.returnAt ?? null,
                fallbackUsed: payload.fallbackUsed ?? false
              }
            ] as const;
          } catch {
            return [
              item.destinationCode,
              { error: "Live fare unavailable for this route right now." }
            ] as const;
          }
        })
      );

      if (cancelled) {
        return;
      }

      const nextState: LiveFareMap = {};
      for (const [code, value] of entries) {
        if (value) {
          nextState[code] = value;
        }
      }
      setLiveFares(nextState);
    };

    void fetchFares();

    return () => {
      cancelled = true;
    };
  }, [
    form.dateFlexibility,
    form.exactDepartureDate,
    form.exactReturnDate,
    form.tripMode,
    departureCode,
    currency,
    language,
    recommendations,
    showResults
  ]);

  function updateForm<K extends keyof PlannerState>(
    key: K,
    value: PlannerState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const startResultsFlow = () => {
    setIsLoadingResults(true);
    window.setTimeout(() => {
      setIsLoadingResults(false);
      setShowResults(true);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-[fadeUp_.35s_ease-out]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slateBlue shadow-sm transition hover:border-chartreuse"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.backHome}
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-slateBlue px-4 py-2 text-sm font-semibold text-white">
            <Gauge className="h-4 w-4 text-chartreuse" />
            {copy.engine}
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-slateBlue px-8 py-10 text-white shadow-card sm:px-10 sm:py-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-chartreuse/90">
                {copy.decisionEngine}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-4 text-lg leading-8 text-white/76">
                {copy.heroDescription}
              </p>
            </div>

            <div className="min-w-[16rem] rounded-[1.75rem] bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white/70">
                {copy.stepOf} {step + 1} / {stepMeta.length}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-chartreuse transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-white/70">
                {current.caption}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] bg-white p-5 shadow-card sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.plannerSteps}
            </p>
            <div className="mt-4 space-y-3">
              {localizedStepMeta.map(({ title, icon: Icon }, index) => {
                const active = index === step;
                const completed = index < step;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => {
                      setShowResults(false);
                      setIsLoadingResults(false);
                      setStep(index);
                    }}
                    className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${
                      active
                        ? "bg-slateBlue text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        active
                          ? "bg-chartreuse text-black"
                          : completed
                            ? "bg-chartreuse/20 text-slateBlue"
                            : "bg-white text-slate-400"
                      }`}
                    >
                      {completed ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                        {copy.stepOf} {index + 1}
                      </p>
                      <p className="text-sm font-semibold">{title}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slateBlue">
                <Briefcase className="h-4 w-4 text-chartreuse" />
                {copy.snapshot}
              </div>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-ink">{copy.departures}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.departures.length > 0 ? (
                      form.departures.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex rounded-full bg-chartreuse/80 px-3 py-1 text-xs font-semibold text-black"
                        >
                          {formatPlaceLabel(item)}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">{copy.selectCity}</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-ink">{copy.tripMode}:</span> {labelTripMode(form.tripMode, language)}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">{copy.destination}:</span>{" "}
                    {form.destination ? formatPlaceLabel(form.destination) : copy.everywhere}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">{copy.tripType}:</span> {labelTravelType(form.travelType, language)}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">{copy.citizenship}:</span> {form.citizenship}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">{copy.visa}:</span> {labelVisaStatus(form.visaStatus, language)}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">{copy.budget}:</span> €{form.budget}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">{copy.dates}:</span> {labelDateFlexibility(form.dateFlexibility, language)}
                    {form.dateFlexibility === "Exact dates" && form.exactDepartureDate ? (
                      <span> · {getSearchDateLabel()}</span>
                    ) : null}
                  </div>
                  <div>
                    <span className="font-semibold text-ink">{copy.baggage}:</span> {labelFlightPreference(form.flightPreference, language)}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-ink">{copy.stay}:</span> {labelAccommodationPreference(form.accommodationPreference, language)}
                  </div>
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-slate-500">
                  {copy.aviasalesAligned}
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
            {!showResults ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chartreuse text-ink">
                    <current.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {copy.stepOf} {step + 1}
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                      {current.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                      {current.caption}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  {isLoadingResults ? (
                    <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-[1.75rem] bg-slate-50 px-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chartreuse/80 text-ink shadow-[0_18px_40px_rgba(201,255,5,0.2)]">
                        <Globe2 className="h-7 w-7 animate-pulse" />
                      </div>
                      <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.04em] text-ink">
                        {copy.loadingTitle}
                      </h3>
                      <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                        {copy.loadingDescription}
                      </p>
                    </div>
                  ) : null}

                  {!isLoadingResults && step === 0 ? (
                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-semibold text-slate-500">
                          {copy.departures}
                        </label>
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input
                            value={departureSearch}
                            onChange={(event) => setDepartureSearch(event.target.value)}
                            placeholder={copy.departurePlaceholder}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                          />
                        </div>
                        {form.departures.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {form.departures.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleDeparture(item)}
                                className="inline-flex items-center gap-2 rounded-full bg-chartreuse px-4 py-2 text-sm font-semibold text-black"
                              >
                                {formatPlaceLabel(item)}
                                <span className="text-base leading-none">×</span>
                              </button>
                            ))}
                          </div>
                        ) : null}
                        {departureSearch.trim() ? (
                          <div className="mt-3 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white p-2">
                          {isLoadingDepartureResults ? (
                            <div className="px-4 py-3 text-sm text-slate-400">
                              {copy.searchingPlaces}
                            </div>
                          ) : departureResults.length > 0 ? (
                            departureResults.map((item) => {
                              const active = form.departures.some(
                                (selected) => selected.id === item.id
                              );
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    toggleDeparture(item);
                                    setDepartureSearch("");
                                  }}
                                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                                    active
                                      ? "bg-chartreuse text-black"
                                      : "text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>
                                    {formatPlaceLabel(item)}
                                    <span className="ml-2 text-xs font-medium text-slate-400">
                                      {item.code} · {item.country} · {item.type}
                                    </span>
                                  </span>
                                  {active ? <Check className="h-4 w-4" /> : null}
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-4 py-3 text-sm text-slate-400">
                              {copy.noCityFound}
                            </div>
                          )}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-400">
                            {copy.searchWorldwide}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-semibold text-slate-500">
                          {copy.destination}
                        </label>
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          <input
                            value={destinationSearch}
                            onChange={(event) => setDestinationSearch(event.target.value)}
                            placeholder={copy.destinationPlaceholder}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              updateForm("destination", null);
                              setDestinationSearch("");
                            }}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                              form.destination === null
                                ? "bg-chartreuse text-black"
                                : "border border-slate-200 bg-white text-slate-600"
                            }`}
                          >
                            {copy.everywhere}
                          </button>
                          {form.destination ? (
                            <button
                              type="button"
                              onClick={() => updateForm("destination", null)}
                              className="inline-flex items-center gap-2 rounded-full bg-chartreuse px-4 py-2 text-sm font-semibold text-black"
                            >
                              {formatPlaceLabel(form.destination)}
                              <span className="text-base leading-none">×</span>
                            </button>
                          ) : null}
                        </div>
                        {destinationSearch.trim() ? (
                          <div className="mt-3 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white p-2">
                            {isLoadingDestinationResults ? (
                              <div className="px-4 py-3 text-sm text-slate-400">
                                {copy.searchingPlaces}
                              </div>
                            ) : destinationResults.length > 0 ? (
                              destinationResults.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    updateForm("destination", item);
                                    setDestinationSearch("");
                                  }}
                                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                                    form.destination?.id === item.id
                                      ? "bg-chartreuse text-black"
                                      : "text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  <span>
                                    {formatPlaceLabel(item)}
                                    <span className="ml-2 text-xs font-medium text-slate-400">
                                      {item.code} · {item.country} · {item.type}
                                    </span>
                                  </span>
                                  {form.destination?.id === item.id ? (
                                    <Check className="h-4 w-4" />
                                  ) : null}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-slate-400">
                                {copy.noDestinationFound}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-slate-400">
                            {copy.searchDestinationHint}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-1">
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            {copy.tripMode}
                          </p>
                          <div className="grid gap-3">
                            {(["One way", "Round trip"] as TripMode[]).map((item) => (
                                <OptionPill
                                  key={item}
                                  active={form.tripMode === item}
                                  onClick={() => updateForm("tripMode", item)}
                                >
                                {labelTripMode(item, language)}
                                </OptionPill>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-1">
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            {copy.travelType}
                          </p>
                          <div className="grid gap-3">
                            {(["Domestic", "International", "Both"] as TravelType[]).map((item) => (
                                <OptionPill
                                  key={item}
                                  active={form.travelType === item}
                                  onClick={() => updateForm("travelType", item)}
                                >
                                {labelTravelType(item, language)}
                                </OptionPill>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-1">
                          <label className="mb-3 block text-sm font-semibold text-slate-500">
                            {copy.citizenship}
                          </label>
                          <div className="relative">
                            <select
                              value={form.citizenship}
                              onChange={(event) =>
                                updateForm("citizenship", event.target.value)
                              }
                              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                            >
                              {citizenshipOptions.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        <div className="md:col-span-1">
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            {copy.visaStatus}
                          </p>
                          <div className="grid gap-3">
                            {(["No visa", "E-visa", "Schengen visa", "Other visa"] as VisaStatus[]).map(
                              (item) => (
                                <OptionPill
                                  key={item}
                                  active={form.visaStatus === item}
                                  onClick={() => updateForm("visaStatus", item)}
                                >
                                  {labelVisaStatus(item, language)}
                                </OptionPill>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {!isLoadingResults && step === 1 ? (
                    <div className="space-y-8">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                              {copy.totalFlightBudget}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-4xl font-black tracking-[-0.05em] text-slateBlue">
                              <Euro className="h-8 w-8 text-chartreuse" />
                              {form.budget}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                            {copy.aviasalesLogic}
                          </div>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={1000}
                          step={25}
                          value={form.budget}
                          onChange={(event) =>
                            updateForm("budget", Number(event.target.value))
                          }
                          className="mt-6 h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-chartreuse"
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            {copy.dateFlexibility}
                          </p>
                          <div className="grid gap-3">
                            {(["Exact dates", "Flexible dates"] as DateFlexibility[]).map(
                              (item) => (
                                <OptionPill
                                  key={item}
                                  active={form.dateFlexibility === item}
                                  onClick={() => updateForm("dateFlexibility", item)}
                                >
                                  {labelDateFlexibility(item, language)}
                                </OptionPill>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="mb-3 text-sm font-semibold text-slate-500">
                            {copy.flightPreferences}
                          </p>
                          <div className="grid gap-3">
                            {(["Cabin bag only", "Checked baggage"] as FlightPreference[]).map(
                              (item) => (
                                <OptionPill
                                  key={item}
                                  active={form.flightPreference === item}
                                  onClick={() => updateForm("flightPreference", item)}
                                >
                                  {labelFlightPreference(item, language)}
                                </OptionPill>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {form.dateFlexibility === "Exact dates" ? (
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-500">
                              {copy.departureDate}
                            </label>
                            <input
                              type="date"
                              value={form.exactDepartureDate}
                              onChange={(event) =>
                                updateForm("exactDepartureDate", event.target.value)
                              }
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                            />
                          </div>
                          {form.tripMode === "Round trip" ? (
                            <div>
                              <label className="mb-3 block text-sm font-semibold text-slate-500">
                                {copy.returnDate}
                              </label>
                              <input
                                type="date"
                                value={form.exactReturnDate}
                                onChange={(event) =>
                                  updateForm("exactReturnDate", event.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-ink outline-none transition focus:border-chartreuse focus:bg-white"
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {!isLoadingResults && step === 2 ? (
                    <div className="space-y-6">
                      <div>
                        <p className="mb-3 text-sm font-semibold text-slate-500">
                          {copy.accommodationPreference}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(
                            [
                              "Just sleep (budget)",
                              "Breakfast included",
                              "Better experience",
                              "I'll choose my own hotel"
                            ] as AccommodationPreference[]
                          ).map((item) => (
                            <OptionPill
                              key={item}
                              active={form.accommodationPreference === item}
                              onClick={() =>
                                updateForm("accommodationPreference", item)
                              }
                            >
                              {labelAccommodationPreference(item, language)}
                            </OptionPill>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                        {form.accommodationPreference === "I'll choose my own hotel"
                          ? copy.stayCopyOwn
                          : copy.stayCopyMixed}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {copy.recommendations}
                    </p>
                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                      {copy.resultsTitle}
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                      {copy.resultsDescription}
                    </p>
                    <p className="mt-4 max-w-3xl rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                      {copy.analyzed}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResults(false)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slateBlue/30 hover:text-ink"
                  >
                    {copy.editAnswers}
                  </button>
                </div>

                <div className="mt-8 grid gap-4">
                  {recommendations.map((item) => (
                    (() => {
                      const fare = liveFares[item.destinationCode];
                      const stayNights = getStayNights({
                        tripMode: form.tripMode,
                        exactDepartureDate: form.exactDepartureDate,
                        exactReturnDate: form.exactReturnDate,
                        fareDepartureAt: fare?.departureAt,
                        fareReturnAt: fare?.returnAt
                      });
                      const hotelStartsFrom = getNightlyHotelBase(
                        form.accommodationPreference,
                        item.city,
                        item.country
                      );
                      const hotelEstimateTotal =
                        form.accommodationPreference === "I'll choose my own hotel"
                          ? 0
                          : hotelStartsFrom * stayNights;
                      const totalTripEstimate =
                        (fare?.price ?? item.estimatedCost) + hotelEstimateTotal;

                      return (
                    <article
                      key={item.city}
                      className="rounded-[1.75rem] border border-slate-200 bg-white p-5 transition hover:border-chartreuse/80 hover:shadow-card sm:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex rounded-full bg-chartreuse px-3 py-1 text-xs font-extrabold text-black">
                              {item.badge}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                item.visaRequirement === "visa-free"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : item.visaRequirement === "e-visa required"
                                    ? "bg-sky-100 text-sky-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {labelVisaRequirement(item.visaRequirement, language)}
                            </span>
                          </div>
                          <h3 className="mt-4 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                            {item.city}
                          </h3>
                          <p className="mt-1 text-base text-slate-500">{item.country}</p>
                        </div>

                        <div className="grid w-full gap-3 sm:max-w-[26rem] sm:grid-cols-2">
                          <div className="rounded-[1.5rem] bg-slateBlue px-5 py-4 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                              {copy.liveFlightPrice}
                            </p>
                            <p className="mt-2 text-4xl font-black tracking-[-0.05em] text-chartreuse">
                              {fare?.price
                                ? formatMoney(fare.price, currency)
                                : fare?.error
                                  ? copy.unavailable
                                  : copy.loadingShort}
                            </p>
                          </div>
                          <div className="rounded-[1.5rem] border border-chartreuse/40 bg-chartreuse/10 px-5 py-4 text-ink">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              {copy.hotelStartsFrom}
                            </p>
                            <p className="mt-2 text-4xl font-black tracking-[-0.05em] text-slateBlue">
                              {form.accommodationPreference === "I'll choose my own hotel"
                                ? copy.youChoose
                                : formatMoney(hotelStartsFrom, currency)}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {form.accommodationPreference === "Just sleep (budget)"
                                ? copy.ecoNight
                                : copy.hotelNight}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {copy.flightDuration}
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{item.flightDuration}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {copy.liveFareDate}
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">
                            {fare?.departureAt
                              ? fare.returnAt
                                ? `${fare.departureAt.slice(0, 10)} to ${fare.returnAt.slice(0, 10)}`
                                : fare.departureAt.slice(0, 10)
                              : fare?.error
                                ? copy.noFareFound
                                : copy.loadingShort}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {copy.experienceMatch}
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{item.experienceMatch}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {copy.matchScore}
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{item.matchScore}/100</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {copy.stayNights}
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">
                            {form.tripMode === "One way"
                              ? `1 ${copy.nightSingle}`
                              : `${stayNights} ${copy.nightPlural}`}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 sm:col-span-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {copy.liveWindow}
                          </p>
                          <p className="mt-2 text-lg font-bold text-ink">{getSearchDateLabel()}</p>
                        </div>
                        <div className="rounded-2xl border border-chartreuse/40 bg-chartreuse/10 px-4 py-3 sm:col-span-2 lg:col-span-5">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                {copy.totalTrip}
                              </p>
                              <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-slateBlue">
                                {formatMoney(totalTripEstimate, currency)}
                              </p>
                            </div>
                            <div className="text-sm leading-6 text-slate-600">
                              <div>
                                {copy.flight}:{" "}
                                {fare?.price
                                  ? formatMoney(fare.price, currency)
                                  : `~${formatMoney(item.estimatedCost, currency)}`}
                              </div>
                              <div>
                                {copy.hotel}:{" "}
                                {form.accommodationPreference === "I'll choose my own hotel"
                                  ? copy.hotelNotIncluded
                                  : copy.fromTotal.replace(
                                      "{amount}",
                                      formatMoney(hotelEstimateTotal, currency)
                                    )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500">
                        {item.notes}
                      </p>
                      {fare?.fallbackUsed ? (
                        <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-700">
                          {copy.fallbackNotice}
                        </p>
                      ) : null}
                      {fare?.error ? (
                        <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-500">
                          {fare.error}
                        </p>
                      ) : null}
                      <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                        {copy.recommendationLead} {item.city}{" "}
                        {item.visaRequirement === "visa-free"
                          ? copy.visaFree
                          : item.visaRequirement === "e-visa required"
                            ? copy.eVisaRequired
                          : copy.visaCompatible}
                        , {copy.recommendationTail}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => void openLiveFlights(item.destinationCode)}
                          disabled={Boolean(fare?.error)}
                          className="inline-flex items-center gap-2 rounded-xl bg-chartreuse px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:brightness-95"
                        >
                          {openingDestination === item.destinationCode
                            ? copy.loadingFlights
                            : copy.seeFlights}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openHotels(item.city, item.country, fare)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slateBlue/15 bg-white px-5 py-3 text-sm font-semibold text-slateBlue transition hover:border-chartreuse hover:text-ink"
                        >
                          {copy.seeHotels}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                      );
                    })()
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  if (showResults) {
                    setShowResults(false);
                    setStep(stepMeta.length - 1);
                    return;
                  }
                  if (isLoadingResults) {
                    setIsLoadingResults(false);
                    return;
                  }
                  setStep((prev) => Math.max(prev - 1, 0));
                }}
                disabled={step === 0 && !showResults && !isLoadingResults}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-500 transition hover:border-slateBlue/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                {showResults ? copy.backToForm : isLoadingResults ? copy.stop : copy.previous}
              </button>

              {!showResults && !isLoadingResults && step < stepMeta.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(prev + 1, stepMeta.length - 1))}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-2 rounded-xl bg-chartreuse px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copy.continue}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : !showResults && !isLoadingResults ? (
                <button
                  type="button"
                  onClick={startResultsFlow}
                  className="inline-flex items-center gap-2 rounded-xl bg-chartreuse px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:brightness-95"
                >
                  {copy.seeTripOptions}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : isLoadingResults ? (
                <div className="rounded-xl bg-slateBlue px-5 py-3 text-sm font-semibold text-white">
                  {copy.building}
                </div>
              ) : (
                <div className="rounded-xl bg-slateBlue px-5 py-3 text-sm font-semibold text-white">
                  {copy.sorted}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
