export type BlogLocale = "en" | "tr" | "ru";

export type LocalizedBlogFields = {
  title: string;
  description: string;
  excerpt: string;
  imageAlt: string;
  readTime: string;
  html: string;
};

export type BlogPost = {
  slug: string;
  image: string;
  publishedAt: string;
  featured: boolean;
  locales: Record<BlogLocale, LocalizedBlogFields>;
};

const posts: BlogPost[] = [
  {
    slug: "istanbul-cikisli-hafta-sonu-rotalari",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2026-04-07",
    featured: true,
    locales: {
      tr: {
        title: "İstanbul çıkışlı hafta sonu rotaları için pratik planlama rehberi",
        description:
          "İstanbul çıkışlı kısa kaçamaklarda uçuş, konaklama ve tempo dengesini daha net kurmak için temel karar çerçevesi.",
        excerpt:
          "Sadece ucuz bilete bakmak yerine toplam seyahat mantığını kurduğunda hafta sonu kaçamakları çok daha verimli hale gelir.",
        imageAlt: "Sırt çantalı gezginin dar bir Avrupa sokağında yürüdüğü sahne",
        readTime: "4 dk okuma",
        html: `<h2>Neden hafta sonu rotası planlamak ayrı bir yaklaşım ister?</h2>
<p>Hafta sonu seyahatlerinde hata payı düşüktür. Geç saatli gidiş, uzak havalimanı, pahalı merkez oteli veya kötü dönüş saati tüm deneyimi zayıflatabilir. Bu yüzden sadece bilet fiyatına değil, toplam zaman verimine bakmak gerekir.</p>
<p>İyi rota; kısa uçuş, kolay şehir içi ulaşım, mantıklı geceleme sayısı ve düşük sürtünme ile gelir. Planner mantığı tam olarak bu dengeyi hızlandırır.</p>
<h2>İlk bakılması gereken filtreler neler?</h2>
<p>Önce uçuş süresini ve varış saatini kontrol et. Cuma akşamı geç inilen ya da pazar gecesi çok geç dönen rotalar kağıt üzerinde ucuz görünse de gerçek verimi düşürür.</p>
<p>İkinci olarak merkezi konaklama maliyetine bak. Ucuz biletin yanında pahalı konaklama varsa toplam bütçe hızla şişer. Kısa kaçamaklarda şehir merkezi çoğu zaman daha verimlidir.</p>
<h2>Toplam maliyet nasıl düşünülmeli?</h2>
<p>Uçak bileti, otel, havalimanı transferi ve günlük harcama birlikte düşünülmelidir. Özellikle iki ya da üç gecelik seyahatlerde şehir içi tempo ve ulaşım masrafı toplam maliyetin önemli kısmını oluşturur.</p>
<p>Bu yüzden iyi rota her zaman en ucuz bilet değildir. Bazen biraz daha pahalı uçuş, daha ucuz otel ve daha kolay şehir planı sayesinde daha iyi toplam sonuç verir.</p>
<h2>Planner hangi noktada zaman kazandırır?</h2>
<p>Planner; vize durumu, bütçe seviyesi, seyahat tipi ve tarih esnekliğini aynı anda düşünür. Böylece onlarca sekme açmadan kısa liste oluşturabilirsin.</p>
<p>Özellikle İstanbul çıkışlı hafta sonu kaçamaklarında Tiflis, Belgrad, Roma veya Budapeşte gibi rotalarda bu yaklaşım daha hızlı karar aldırır.</p>`
      },
      en: {
        title: "A practical guide to weekend trips departing from Istanbul",
        description:
          "A clearer decision framework for balancing flights, stays, and travel pace on short breaks from Istanbul.",
        excerpt:
          "Weekend trips work better when you optimize the whole travel setup, not just the cheapest ticket.",
        imageAlt: "Backpacker walking through a narrow European street",
        readTime: "4 min read",
        html: `<h2>Why weekend trips need a different planning mindset</h2>
<p>Short breaks leave very little room for friction. A late arrival, a remote airport, an overpriced hotel, or a weak return schedule can ruin the value of the whole trip. That is why the decision should start with total trip efficiency, not just airfare.</p>
<p>The best weekend destination usually combines a short flight, easy airport transfer, manageable hotel costs, and a city layout that works well in two or three days.</p>
<h2>The first filters worth checking</h2>
<p>Start with flight time and arrival timing. A route can look cheap on paper, but if it burns half a day in transfers or lands too late, it becomes a weak option for a short trip.</p>
<p>Then compare hotel reality, not just flight price. Many routes look attractive until you price central accommodation. For quick city breaks, location often matters more than chasing the absolute cheapest room.</p>
<h2>Think in total cost, not isolated prices</h2>
<p>A smart weekend decision combines airfare, accommodation, airport transfers, and likely day-to-day spending. On short itineraries, transport friction and urban layout matter almost as much as the ticket itself.</p>
<p>That means the cheapest flight is not always the best trip. A slightly higher fare with a cheaper stay and smoother city access can produce a better overall result.</p>
<h2>Where the planner actually saves time</h2>
<p>The planner weighs visa access, budget level, trip style, and date flexibility together. Instead of opening dozens of tabs, you get a tighter shortlist built around fit.</p>
<p>For weekend trips from Istanbul, this is especially useful when comparing destinations such as Tbilisi, Belgrade, Rome, or Budapest.</p>`
      },
      ru: {
        title: "Практический гид по маршрутам выходного дня из Стамбула",
        description:
          "Как быстрее собрать короткую поездку из Стамбула, если важно удержать баланс между перелётом, проживанием и темпом маршрута.",
        excerpt:
          "Поездка на выходные становится лучше, когда вы оцениваете не только цену билета, а всю конструкцию путешествия целиком.",
        imageAlt: "Путешественница с рюкзаком идёт по узкой европейской улице",
        readTime: "4 мин чтения",
        html: `<h2>Почему поездки на выходные требуют отдельной логики</h2>
<p>В коротких поездках почти нет запаса на ошибки. Поздний прилёт, неудобный аэропорт, дорогой отель или слабое время обратного рейса быстро снижают общую ценность маршрута. Поэтому решение лучше принимать по общей эффективности поездки, а не только по цене перелёта.</p>
<p>Хороший маршрут выходного дня обычно сочетает короткий перелёт, простой трансфер, разумную стоимость проживания и удобный городской ритм на два или три дня.</p>
<h2>Какие фильтры стоит проверить в первую очередь</h2>
<p>Сначала смотрите на длительность перелёта и время прибытия. Некоторые варианты выглядят дешёвыми, но съедают слишком много времени и превращаются в плохой выбор для короткого отдыха.</p>
<p>Далее сравните не только билет, но и реальную стоимость проживания. Для коротких city break поездок центральная локация часто важнее, чем самый дешёвый номер на окраине.</p>
<h2>Общая стоимость важнее отдельной цены</h2>
<p>Нужно считать вместе перелёт, проживание, трансфер из аэропорта и ежедневные расходы. В коротких поездках лишняя логистика очень заметно влияет на итоговый бюджет.</p>
<p>Поэтому самый дешёвый билет не всегда означает лучший маршрут. Иногда немного более дорогой перелёт даёт лучший общий результат за счёт более дешёвого отеля и более удобного города.</p>
<h2>Где planner реально экономит время</h2>
<p>Planner одновременно учитывает визовый доступ, бюджет, стиль поездки и гибкость дат. Вместо десятков вкладок вы получаете короткий список вариантов с более понятным fit.</p>
<p>Для поездок выходного дня из Стамбула это особенно полезно при сравнении Тбилиси, Белграда, Рима или Будапешта.</p>`
      }
    }
  },
  {
    slug: "butceye-gore-tatil-planlama",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    publishedAt: "2026-04-08",
    featured: false,
    locales: {
      tr: {
        title: "Bütçeye göre tatil planlama: en mantıklı rota nasıl seçilir?",
        description:
          "Tatil bütçesini uçuş, konaklama ve günlük harcama dengesiyle yönetmek için pratik karar çerçevesi.",
        excerpt:
          "En iyi tatil çoğu zaman en ucuz seçenek değildir. Doğru olan, toplam maliyet ile deneyim arasındaki dengeyi kurmaktır.",
        imageAlt: "Deniz kenarında seyahat planı yapan bir gezgin",
        readTime: "5 dk okuma",
        html: `<h2>Bütçe planlaması neden sadece bilet fiyatı değildir?</h2>
<p>Bir seyahatin gerçek maliyeti uçak biletinden ibaret değildir. Konaklama, şehir içi ulaşım, yeme içme ve zaman verimi toplam deneyimin parçasıdır.</p>
<p>Bu nedenle bütçeye göre rota seçmek, sadece en ucuz uçuşu bulmak değil; toplam harcamayı doğru mimariyle kurmaktır.</p>
<h2>Uçuş ve otel dengesi nasıl kurulur?</h2>
<p>Bazen ucuz uçuşla gidilen şehirde oteller pahalıdır. Bazen de biraz daha pahalı uçuş, çok daha verimli bir konaklama dengesi sunar. Bu yüzden karar tek bir satıra bakılarak verilmemelidir.</p>
<p>Kısa seyahatlerde merkezi otel ve düşük transfer maliyeti çoğu zaman toplam verimi yükseltir.</p>
<h2>Günlük harcama neden önemli bir sinyaldir?</h2>
<p>İki şehir benzer uçuş fiyatına sahip olabilir ama günlük yaşam maliyeti tamamen farklı olabilir. Özellikle yiyecek, yerel ulaşım ve müze-kafe harcamaları kısa sürede toplam bütçeyi değiştirir.</p>
<p>Bu yüzden planner içinde günlük harcama öngörüsü görmek, destinasyon karşılaştırmasını daha gerçekçi hale getirir.</p>
<h2>En mantıklı rota nasıl bulunur?</h2>
<p>İlk adım net bir bütçe bandı belirlemektir. Sonra vize erişimi, uçuş süresi, konaklama seviyesi ve günlük harcama birlikte değerlendirilmelidir.</p>
<p>Esnek tarihler varsa daha iyi fiyat pencereleri açılır. Esneklik yoksa rota seçimi daha çok toplam maliyet verimliliğine kayar.</p>
<h2>Sonuç</h2>
<p>İyi tatil planı en ucuz olan değil, en dengeli olan plandır. Uçuş, otel ve gündelik harcamayı birlikte düşünmek daha doğru karar verir.</p>`
      },
      en: {
        title: "Planning a trip around your budget: how to choose the smartest route",
        description:
          "A practical way to balance flights, accommodation, and daily spending before you commit to a destination.",
        excerpt:
          "The best trip is rarely just the cheapest one. The stronger choice is the route that balances total cost and experience.",
        imageAlt: "Traveler planning a trip near the coast",
        readTime: "5 min read",
        html: `<h2>Budget planning is not just about airfare</h2>
<p>The real cost of a trip is built from more than a ticket. Accommodation, local transport, food, and time efficiency all affect the final value of the route.</p>
<p>That is why budget-led planning should focus on the full trip structure, not a single flight price.</p>
<h2>How to balance flights and hotels</h2>
<p>Some cities have cheap flights but expensive accommodation. Others ask for a slightly higher airfare and reward you with much lower stay costs. Looking at one line item in isolation leads to weak decisions.</p>
<p>On short trips, central accommodation and lower transfer friction often create better total value.</p>
<h2>Why daily spending matters</h2>
<p>Two destinations can have similar flight prices while offering completely different day-to-day costs. Food, local transport, and casual spending can shift the budget quickly.</p>
<p>That is why showing a daily spending forecast inside the planner makes destination comparisons much more realistic.</p>
<h2>How to pick the smartest route</h2>
<p>Start with a clear budget band. Then compare visa access, flight duration, accommodation quality, and likely daily spend together.</p>
<p>If your dates are flexible, better fare windows open up. If your dates are fixed, total cost efficiency becomes even more important.</p>
<h2>Conclusion</h2>
<p>The best holiday is not always the cheapest one. The better route is the one that keeps cost and experience in balance.</p>`
      },
      ru: {
        title: "Планирование поездки по бюджету: как выбрать самый разумный маршрут",
        description:
          "Практический подход к выбору направления, если нужно сбалансировать перелёт, проживание и ежедневные расходы.",
        excerpt:
          "Лучшая поездка не всегда самая дешёвая. Более сильный выбор строится на балансе между общей стоимостью и качеством опыта.",
        imageAlt: "Путешественник планирует маршрут у моря",
        readTime: "5 мин чтения",
        html: `<h2>Планирование по бюджету — это не только билет</h2>
<p>Реальная стоимость поездки складывается не только из перелёта. Проживание, местный транспорт, еда и потеря времени тоже влияют на итоговую ценность маршрута.</p>
<p>Поэтому при выборе направления по бюджету важно оценивать всю поездку целиком, а не отдельную цену билета.</p>
<h2>Как найти баланс между перелётом и проживанием</h2>
<p>В одном городе могут быть дешёвые билеты, но дорогие отели. В другом перелёт стоит немного дороже, зато проживание значительно выгоднее. Решение по одной цифре почти всегда искажает картину.</p>
<p>Для коротких поездок центральный отель и простой трансфер часто дают лучший общий результат.</p>
<h2>Почему прогноз ежедневных расходов важен</h2>
<p>Два направления могут иметь похожую цену перелёта, но совершенно разный повседневный бюджет. Еда, транспорт и обычные городские траты быстро меняют общую стоимость поездки.</p>
<p>Именно поэтому блок ежедневных расходов в planner помогает сравнивать направления гораздо реалистичнее.</p>
<h2>Как выбрать самый разумный маршрут</h2>
<p>Сначала задайте чёткий бюджетный диапазон. Затем сравните визовый доступ, длительность перелёта, стоимость проживания и ежедневные траты как единую систему.</p>
<p>Если даты гибкие, открываются более выгодные тарифные окна. Если даты фиксированные, ещё важнее становится общая эффективность маршрута.</p>
<h2>Вывод</h2>
<p>Лучшая поездка — не всегда самая дешёвая. Лучшее направление — то, где стоимость и качество опыта находятся в хорошем балансе.</p>`
      }
    }
  }
];

export async function getAllBlogPosts() {
  return posts;
}

export async function getFeaturedBlogPost() {
  return posts.find((post) => post.featured) ?? posts[0];
}

export async function getBlogPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug) ?? null;
}
