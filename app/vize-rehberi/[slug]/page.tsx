import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { getVisaGuideBySlug, visaGuidePages } from "@/lib/explore";

type GuidePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return visaGuidePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getVisaGuideBySlug(params.slug);

  if (!guide) {
    return { title: "Vize Rehberi" };
  }

  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: [guide.heroImage]
    }
  };
}

export default function VisaGuidePage({ params }: GuidePageProps) {
  const guide = getVisaGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-page">
      <Header theme="light" activeNav="discover" />

      <section className="px-4 pb-10 pt-36 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Vize Rehberi
            </p>
            <h1 className="mt-3 max-w-[14ch] text-4xl font-extrabold tracking-[-0.05em] text-ink sm:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              {guide.description}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
              {guide.intro}
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card">
            <img
              src={guide.heroImage}
              alt={guide.title}
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {guide.countries.map((country) => (
              <article
                key={country.name}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {country.access}
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-ink">
                  {country.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{country.why}</p>
                <p className="mt-4 text-sm leading-7 text-slate-500">{country.stayHint}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-chartreuse/40 bg-chartreuse/10 p-5 text-sm leading-7 text-slate-700">
            {guide.note}
          </div>
        </div>
      </section>
    </main>
  );
}
