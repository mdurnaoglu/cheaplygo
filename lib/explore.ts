import { DEAL_MARKETS, type MarketKey } from "@/lib/flight-deals";

export type AppLanguage = "en" | "ru" | "tr";
export type AppCurrency = "USD" | "RUB" | "TRY";

type PopularRoute = {
  city: string;
  destinationIata: string;
};

type StayDeal = {
  city: string;
  country: string;
  nightlyFrom: string;
  highlight: string;
  image: string;
};

type VisaCountry = {
  name: string;
  access: string;
  why: string;
  stayHint: string;
};

export type VisaGuidePage = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  intro: string;
  note: string;
  countries: VisaCountry[];
};

export type CountryCard = {
  title: string;
  description: string;
  image: string;
  href: string;
};

const marker = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER;

function isoDateFromToday(offsetDays: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function getPreferredMarket(language: AppLanguage): MarketKey {
  if (language === "tr") {
    return "turkey";
  }

  if (language === "ru") {
    return "russia";
  }

  return "germany";
}

export function buildAviasalesSearchLink(options: {
  originIata: string;
  destinationIata: string;
  language: AppLanguage;
  currency: AppCurrency;
}) {
  const url = new URL("https://search.aviasales.com/flights/");
  url.searchParams.set("origin_iata", options.originIata);
  url.searchParams.set("destination_iata", options.destinationIata);
  url.searchParams.set("depart_date", isoDateFromToday(45));
  url.searchParams.set("return_date", isoDateFromToday(52));
  url.searchParams.set("adults", "1");
  url.searchParams.set("children", "0");
  url.searchParams.set("infants", "0");
  url.searchParams.set("trip_class", "0");
  url.searchParams.set("locale", options.language);
  url.searchParams.set("currency", options.currency);
  url.searchParams.set("oneway", "false");

  if (marker) {
    url.searchParams.set("marker", marker);
  }

  return url.toString();
}

export function buildStaySearchLink(options: { city: string; country: string }) {
  if (options.country.toLowerCase() === "russia") {
    return "https://manteratravel.ru/hotels";
  }

  const url = new URL("https://www.klook.com/search/result/");
  url.searchParams.set("query", `${options.city} ${options.country} hotel`);
  return url.toString();
}

export const popularRoutes: Record<
  MarketKey,
  {
    domestic: PopularRoute[];
    international: PopularRoute[];
  }
> = {
  turkey: {
    domestic: [
      { city: "Antalya", destinationIata: "AYT" },
      { city: "Izmir", destinationIata: "IZM" },
      { city: "Ankara", destinationIata: "ANK" },
      { city: "Bodrum", destinationIata: "BJV" },
      { city: "Trabzon", destinationIata: "TZX" }
    ],
    international: [
      { city: "Viyana", destinationIata: "VIE" },
      { city: "Münih", destinationIata: "MUC" },
      { city: "Dubai", destinationIata: "DXB" },
      { city: "Prag", destinationIata: "PRG" },
      { city: "Atina", destinationIata: "ATH" },
      { city: "Zürih", destinationIata: "ZRH" }
    ]
  },
  russia: {
    domestic: [
      { city: "Soçi", destinationIata: "AER" },
      { city: "St. Petersburg", destinationIata: "LED" },
      { city: "Kazan", destinationIata: "KZN" },
      { city: "Kaliningrad", destinationIata: "KGD" },
      { city: "Yekaterinburg", destinationIata: "SVX" }
    ],
    international: [
      { city: "Istanbul", destinationIata: "IST" },
      { city: "Dubai", destinationIata: "DXB" },
      { city: "Tiflis", destinationIata: "TBS" },
      { city: "Bakü", destinationIata: "BAK" },
      { city: "Belgrad", destinationIata: "BEG" },
      { city: "Erivan", destinationIata: "EVN" }
    ]
  },
  germany: {
    domestic: [
      { city: "Münih", destinationIata: "MUC" },
      { city: "Hamburg", destinationIata: "HAM" },
      { city: "Köln", destinationIata: "CGN" },
      { city: "Stuttgart", destinationIata: "STR" },
      { city: "Frankfurt", destinationIata: "FRA" }
    ],
    international: [
      { city: "Viyana", destinationIata: "VIE" },
      { city: "Istanbul", destinationIata: "IST" },
      { city: "Dubai", destinationIata: "DXB" },
      { city: "Prag", destinationIata: "PRG" },
      { city: "Atina", destinationIata: "ATH" },
      { city: "Zürih", destinationIata: "ZRH" }
    ]
  }
};

export const stayDealsByMarket: Record<MarketKey, StayDeal[]> = {
  turkey: [
    {
      city: "Tiflis",
      country: "Georgia",
      nightlyFrom: "€34",
      highlight: "Merkezde uygun butik oteller ve kısa hafta sonu kaçamağı dengesi güçlü.",
      image:
        "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80"
    },
    {
      city: "Belgrad",
      country: "Serbia",
      nightlyFrom: "€41",
      highlight: "Vizesiz rota içinde fiyat-performans konaklama tarafı istikrarlı.",
      image:
        "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?auto=format&fit=crop&w=1200&q=80"
    },
    {
      city: "Bakü",
      country: "Azerbaijan",
      nightlyFrom: "€46",
      highlight: "Kısa uçuşla erişilen şehir otelleri ve yeni tesis seçenekleri güçlü.",
      image:
        "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  russia: [
    {
      city: "Istanbul",
      country: "Turkey",
      nightlyFrom: "€49",
      highlight: "Rusya çıkışlı en kolay açılan şehirlerden biri ve çok geniş otel stoğu var.",
      image:
        "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80"
    },
    {
      city: "Tiflis",
      country: "Georgia",
      nightlyFrom: "€35",
      highlight: "Şehir merkezi odaklı, kompakt ve bütçe dostu konaklama dengesi sunuyor.",
      image:
        "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80"
    },
    {
      city: "Erivan",
      country: "Armenia",
      nightlyFrom: "€33",
      highlight: "Kısa şehir tatili için düşük giriş maliyeti ve merkezi oteller öne çıkıyor.",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  germany: [
    {
      city: "Budapeşte",
      country: "Hungary",
      nightlyFrom: "€52",
      highlight: "Almanya çıkışlı kısa şehir kaçamaklarında konaklama verimliliği çok güçlü.",
      image:
        "https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1200&q=80"
    },
    {
      city: "Prag",
      country: "Czechia",
      nightlyFrom: "€57",
      highlight: "Eski şehir çevresinde yoğun seçenek ve kısa uçuş avantajı sunuyor.",
      image:
        "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80"
    },
    {
      city: "Lisbon",
      country: "Portugal",
      nightlyFrom: "€61",
      highlight: "Daha uzun şehir tatilleri için güçlü hostel ve butik otel dengesi var.",
      image:
        "https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=1200&q=80"
    }
  ]
};

export const visaGuidePages: VisaGuidePage[] = [
  {
    slug: "turkiye-vizesiz-ulkeler",
    title: "Türkiye Vizesiz Ülkeler Rehberi",
    description:
      "Türkiye pasaportuyla sık aranan vizesiz ülkeleri, kısa rota mantığını ve konaklama ipuçlarını tek sayfada inceleyin.",
    heroImage:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Bu sayfa, Türkiye çıkışlı planlamada sık açılan vizesiz rotaları hızlı karar vermek için öne çıkarır. Resmi kural değişiklikleri olabileceğinden biletlemeden önce ilgili ülkenin güncel şartlarını ayrıca kontrol edin.",
    note:
      "İçerik yapısı Pegasus Vize Rehberi yaklaşımından ilham alır; nihai karar öncesi resmi konsolosluk ve sınır polisi duyuruları esas alınmalıdır.",
    countries: [
      { name: "Sırbistan", access: "Vizesiz", why: "Kısa uçuş, hafta sonu şehir kaçamağı ve düşük toplam maliyet dengesi.", stayHint: "Belgrad merkez otelleri erken dönemde iyi değer sunar." },
      { name: "Gürcistan", access: "Vizesiz", why: "Tiflis ve Batum kısa bütçeli planlarda en erişilebilir rotalardan biri.", stayHint: "Merkez dışı butik oteller fiyat avantajı verir." },
      { name: "Karadağ", access: "Vizesiz", why: "Yaz sezonunda kıyı rotası ve doğa odaklı seyahat için popülerdir.", stayHint: "Kotor çevresinde erken rezervasyon önemli fark yaratır." },
      { name: "Bosna Hersek", access: "Vizesiz", why: "Saraybosna şehir turizmi ve uygun yeme içme giderleri ile öne çıkar.", stayHint: "Eski şehir çevresi yürünebilir konaklama avantajı sağlar." },
      { name: "Kuzey Makedonya", access: "Vizesiz", why: "Üsküp odaklı kısa seyahatlerde giriş bariyeri düşüktür.", stayHint: "Merkez otelleri çoğu Avrupa başkentine göre daha hesaplıdır." },
      { name: "Arnavutluk", access: "Vizesiz", why: "Yaz döneminde sahil ve şehir kombinasyonu yapmak kolaydır.", stayHint: "Tiran çıkışlı kalıp kıyıya geçmek maliyeti düşürür." }
    ]
  },
  {
    slug: "turkiye-e-vizeli-ulkeler",
    title: "Türkiye E Vizeli Ülkeler Rehberi",
    description:
      "Türkiye pasaportuyla e-vize veya online izinle gidilebilen öne çıkan ülkeleri, uçuş ve konaklama mantığıyla birlikte görün.",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Türkiye çıkışlı bazı rotalarda fiziksel vize yerine dijital başvuru süreci bulunur. Bu sayfa sık aranan e-vizeli örnekleri pratik seyahat planlaması için özetler.",
    note:
      "E-vize süreçleri başvuru süresi ve ücret bakımından değişebilir; resmi başvuru portallarını ayrıca doğrulayın.",
    countries: [
      { name: "Azerbaycan", access: "E-vize", why: "Kısa uçuş ve kolay erişim sayesinde en pratik yakın rota seçeneklerinden biri.", stayHint: "Bakü merkezinde yeni otel stoğu güçlü." },
      { name: "Mısır", access: "E-vize", why: "Şehir tatili ile deniz tatilini birleştirmek isteyenler için yüksek talep görür.", stayHint: "Kahire ile tatil bölgeleri arasında bütçe farkı yüksektir." },
      { name: "Bahreyn", access: "E-vize", why: "Kısa körfez kaçamakları için kompakt bir seçenek sunar.", stayHint: "Manama merkez dışı oteller daha verimlidir." },
      { name: "Suudi Arabistan", access: "E-vize", why: "Şehir, etkinlik ve kısa dönem ziyaretleri için sık araştırılan rotalardan biridir.", stayHint: "Riyad ve Cidde fiyatları sezona göre hızla değişir." },
      { name: "Umman", access: "E-vize", why: "Daha sakin körfez rotası arayanlar için alternatif oluşturur.", stayHint: "Muscat sahil şeridi yerine merkez çevresi daha dengelidir." }
    ]
  },
  {
    slug: "almanya-vizesiz-ulkeler",
    title: "Almanya Vizesiz Ülkeler Rehberi",
    description:
      "Almanya çıkışlı yolcular için vizesiz ya da düşük giriş bariyerli popüler ülkeleri seyahat mantığıyla birlikte görün.",
    heroImage:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Almanya çıkışlı seyahatlerde Schengen dışına çıkmak isteyenler için vizesiz rotalar hâlâ güçlü arama niyetine sahip. Bu sayfa en pratik örnekleri listeler.",
    note:
      "Vatandaşlığa ve oturum durumuna göre kurallar değişebilir; güncel resmi kaynak kontrolü gereklidir.",
    countries: [
      { name: "Türkiye", access: "Vizesiz", why: "Kısa ve orta süreli tatiller için Almanya çıkışlı en güçlü hacim rotalarından biri.", stayHint: "Istanbul ve Antalya farklı bütçelere hitap eder." },
      { name: "Sırbistan", access: "Vizesiz", why: "Belgrad kısa şehir kaçamakları için düşük sürtünmeli seçenektir.", stayHint: "Merkezi bölgelerde bile fiyat-performans güçlüdür." },
      { name: "Karadağ", access: "Vizesiz", why: "Yaz döneminde deniz ve doğa odaklı planlarda öne çıkar.", stayHint: "Kıyı yerine Podgorica konaklaması maliyeti düşürebilir." },
      { name: "Gürcistan", access: "Vizesiz", why: "Farklı kültür ve yemek deneyimi arayanlar için öne çıkar.", stayHint: "Tiflis merkez otelleri uzun hafta sonları için uygundur." },
      { name: "Arnavutluk", access: "Vizesiz", why: "Yaz sezonunda fiyat avantajı nedeniyle yoğun ilgi görür.", stayHint: "Tiran bazlı konaklamak daha esnek olabilir." }
    ]
  },
  {
    slug: "almanya-e-vizeli-ulkeler",
    title: "Almanya E Vizeli Ülkeler Rehberi",
    description:
      "Almanya çıkışlı yolcular için e-vize ile planlanabilen popüler ülkeleri ve kısa seyahat notlarını inceleyin.",
    heroImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Almanya çıkışlı aramalarda e-vize ile erişilen rotalar özellikle kış güneşi ve kısa şehir tatilleri için güçlü talep üretir.",
    note:
      "Başvuru koşulları milliyet ve seyahat sebebine göre değişebilir; resmi platformlar kontrol edilmelidir.",
    countries: [
      { name: "Azerbaycan", access: "E-vize", why: "Bakü şehir kaçamağı ve kısa uçuş kombinasyonuyla öne çıkar.", stayHint: "Yeni şehir aksında çok sayıda modern otel bulunur." },
      { name: "Mısır", access: "E-vize", why: "Deniz tatili ve kültür odaklı çift planlamalarda sık tercih edilir.", stayHint: "Kahire yerine kıyı tesisleri daha yüksek bütçe ister." },
      { name: "Suudi Arabistan", access: "E-vize", why: "Etkinlik, iş ve şehir turizmi tarafında hızlı yükselen taleplere sahiptir.", stayHint: "Riyad hafta içi fiyatlarında dalgalanma yüksektir." },
      { name: "Umman", access: "E-vize", why: "Sakin ve premium hisli rota arayanlar için uygundur.", stayHint: "Muscat merkez çevresi daha dengeli maliyet sunar." }
    ]
  },
  {
    slug: "rusya-vizesiz-ulkeler",
    title: "Rusya Vizesiz Ülkeler Rehberi",
    description:
      "Rusya çıkışlı yolcular için vizesiz popüler ülkeleri, hızlı açılan rotaları ve konaklama dengesini tek sayfada görün.",
    heroImage:
      "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Rusya çıkışlı seyahatlerde vizesiz ülkeler özellikle kısa planlarda karar süresini ciddi biçimde kısaltır. Bu sayfa sık aranan örnek rotaları özetler.",
    note:
      "Kurallar pasaport türü ve kalış süresine göre değişebilir; bilet öncesi resmi kaynak kontrolü önerilir.",
    countries: [
      { name: "Türkiye", access: "Vizesiz", why: "Istanbul ve Antalya kombinasyonu Rusya çıkışlı en güçlü talep rotalarındandır.", stayHint: "Şehir ve sahil otelleri arasında büyük fiyat farkı olur." },
      { name: "Gürcistan", access: "Vizesiz", why: "Tiflis kısa ve düşük sürtünmeli şehir seyahatinde öne çıkar.", stayHint: "Merkez çevresi yürünebilir ve fiyat dengesi yüksektir." },
      { name: "Ermenistan", access: "Vizesiz", why: "Kısa kültür rotası arayanlar için kompakt bir seçenektir.", stayHint: "Yerevan merkez otelleri erken rezervasyonda uygundur." },
      { name: "Sırbistan", access: "Vizesiz", why: "Belgrad özellikle kısa şehir tatilinde yüksek dönüşüm üretir.", stayHint: "Merkezi konumlarda fiyat performans iyi seviyededir." },
      { name: "BAE", access: "Vizesiz", why: "Dubai hem alışveriş hem sıcak hava aramalarında güçlüdür.", stayHint: "Merkezden uzak konaklama toplam maliyeti azaltır." }
    ]
  },
  {
    slug: "rusya-e-vizeli-ulkeler",
    title: "Rusya E Vizeli Ülkeler Rehberi",
    description:
      "Rusya çıkışlı kullanıcılar için e-vize ile açılabilen öne çıkan ülkeleri pratik seyahat planı mantığıyla inceleyin.",
    heroImage:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Vizesiz olmayan ama dijital başvuruyla erişilebilen ülkeler, Rusya çıkışlı orta sürtünmeli planların önemli bölümünü oluşturur.",
    note:
      "E-vize koşulları hızlı değişebilir; resmi kaynaklar üzerinden güncel gereksinimleri doğrulayın.",
    countries: [
      { name: "Azerbaycan", access: "E-vize", why: "Bakü yakın mesafe ve yüksek erişilebilirlik sebebiyle öne çıkar.", stayHint: "Şehir merkezi dışında fiyatlar daha dengelidir." },
      { name: "Hindistan", access: "E-vize", why: "Daha uzun süreli ve deneyim odaklı seyahatlerde sık araştırılır.", stayHint: "Şehir seçimine göre fiyat skalası çok geniştir." },
      { name: "Sri Lanka", access: "E-vize", why: "Sıcak iklim ve ada tatili arayanlar için güçlü talep görür.", stayHint: "Sahil şeridinden iç kesimlere geçmek bütçeyi düşürür." },
      { name: "Umman", access: "E-vize", why: "Körfez bölgesinde daha sakin ve premium rota isteyenlere hitap eder.", stayHint: "Muscat dışında fiyatlar daha erişilebilirdir." }
    ]
  },
  {
    slug: "azerbaycan-vizesiz-ulkeler",
    title: "Azerbaycan Vizesiz Ülkeler Rehberi",
    description:
      "Azerbaycan çıkışlı vizesiz ülkeler için öne çıkan destinasyonları, kısa uçuş mantığını ve konaklama ipuçlarını görün.",
    heroImage:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Azerbaycan çıkışlı seyahatlerde vizesiz rotalar hızlı karar vermek isteyen kullanıcılar için en sık aranan kümelerden biridir.",
    note:
      "Bu sayfa popüler örnekleri öne çıkarır; güncel giriş şartları resmi kaynaklardan doğrulanmalıdır.",
    countries: [
      { name: "Türkiye", access: "Vizesiz", why: "Kısa uçuş ve yoğun sefer sayesinde ilk bakılan rotalardan biri.", stayHint: "Istanbul şehir, Antalya tatil dengesi sunar." },
      { name: "Gürcistan", access: "Vizesiz", why: "Kısa mesafe ve hızlı planlama avantajı sağlar.", stayHint: "Tiflis merkez otelleri kompakt şehir tatiline uygundur." },
      { name: "Rusya", access: "Vizesiz", why: "Büyük şehir erişimi ve farklı rota çeşitliliği sunar.", stayHint: "Moskova ve Petersburg maliyetleri belirgin ayrışır." },
      { name: "Sırbistan", access: "Vizesiz", why: "Şehir kaçamağı tarafında iyi bir maliyet dengesi verir.", stayHint: "Belgrad merkez dışı konaklama daha verimlidir." },
      { name: "Karadağ", access: "Vizesiz", why: "Sezonsal sahil talebinde güçlü bir seçenektir.", stayHint: "Kotor yerine Podgorica daha ekonomik olabilir." }
    ]
  },
  {
    slug: "azerbaycan-e-vizeli-ulkeler",
    title: "Azerbaycan E Vizeli Ülkeler Rehberi",
    description:
      "Azerbaycan çıkışlı yolcular için e-vize ile açılabilen popüler ülkeleri ve seyahat planı notlarını görün.",
    heroImage:
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60b?auto=format&fit=crop&w=1400&q=80",
    intro:
      "Azerbaycan çıkışlı planlamada dijital vize süreçleri özellikle orta mesafe rotalarda etkili olur. Bu sayfa en çok araştırılan örnekleri toparlar.",
    note:
      "Başvuru süreçleri ülkeye göre değiştiği için resmi sitelerin güncel açıklamaları esas alınmalıdır.",
    countries: [
      { name: "Mısır", access: "E-vize", why: "Deniz tatili ve şehir turizmi kombinasyonu ile öne çıkar.", stayHint: "Kahire yerine resort bölgeleri daha yüksek bütçelidir." },
      { name: "Suudi Arabistan", access: "E-vize", why: "Kısa şehir ve etkinlik seyahatlerinde sık araştırılır.", stayHint: "Büyük şehir otelleri haftaya göre değişken fiyatlanır." },
      { name: "Umman", access: "E-vize", why: "Sakin körfez rotası arayanlar için alternatif sunar.", stayHint: "Muscat merkez dışı konaklama daha avantajlıdır." },
      { name: "Bahreyn", access: "E-vize", why: "Yakın körfez hattında kompakt bir şehir tatili seçeneğidir.", stayHint: "Manama çevresi kısa konaklamalar için uygundur." }
    ]
  }
];

export const visaGuideCards: CountryCard[] = visaGuidePages.map((page) => ({
  title: page.title,
  description: page.description,
  image: page.heroImage,
  href: `/vize-rehberi/${page.slug}`
}));

export const idEntryCountries: CountryCard[] = [
  {
    title: "Türk vatandaşları için Gürcistan",
    description: "Kimlikle giriş planlarında en hızlı açılan şehir kaçamağı rotalarından biri.",
    image:
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80",
    href: "/vize-rehberi/turkiye-vizesiz-ulkeler"
  },
  {
    title: "Türk vatandaşları için Azerbaycan",
    description: "Yakın rota, kısa uçuş ve şehir oteli avantajı ile öne çıkar.",
    image:
      "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1200&q=80",
    href: "/vize-rehberi/turkiye-e-vizeli-ulkeler"
  },
  {
    title: "Türk vatandaşları için Kuzey Kıbrıs",
    description: "Kısa tatil ve deniz odaklı planlarda sürtünmesi düşük bir seçenektir.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    href: "/firsat-konaklamalar/turkiye"
  }
];

export const affordableStayCountries: CountryCard[] = [
  {
    title: "Gürcistan uygun konaklama rehberi",
    description: "Tiflis ve Batum tarafında otel maliyeti toplam seyahat bütçesini kontrollü tutar.",
    image:
      "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80",
    href: "/firsat-konaklamalar/turkiye"
  },
  {
    title: "Sırbistan uygun konaklama rehberi",
    description: "Belgrad, kısa şehir tatillerinde güçlü fiyat performans sunar.",
    image:
      "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?auto=format&fit=crop&w=1200&q=80",
    href: "/firsat-konaklamalar/turkiye"
  },
  {
    title: "Ermenistan uygun konaklama rehberi",
    description: "Yerevan merkezli kısa konaklamalarda giriş maliyeti görece düşüktür.",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    href: "/firsat-konaklamalar/rusya"
  }
];

export function getVisaGuideBySlug(slug: string) {
  return visaGuidePages.find((page) => page.slug === slug) ?? null;
}

export function getStayDealsForMarket(market: MarketKey) {
  return stayDealsByMarket[market];
}

export function getPopularRouteLinks(language: AppLanguage, currency: AppCurrency) {
  const market = getPreferredMarket(language);
  const origin = DEAL_MARKETS[market];
  const buildRoute = (route: PopularRoute) => ({
    label: `${route.city} Uçak Bileti`,
    href: buildAviasalesSearchLink({
      originIata: origin.originCode,
      destinationIata: route.destinationIata,
      language,
      currency
    })
  });

  return {
    market,
    originCity: origin.originCity,
    domestic: popularRoutes[market].domestic.map(buildRoute),
    international: popularRoutes[market].international.map(buildRoute)
  };
}
