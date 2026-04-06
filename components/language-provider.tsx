"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type Language = "en" | "ru" | "tr";
export type Currency = "USD" | "RUB" | "TRY";

const defaultCurrencyByLanguage: Record<Language, Currency> = {
  en: "USD",
  ru: "RUB",
  tr: "TRY"
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>("en");
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryLanguage = searchParams.get("lang");
    if (queryLanguage === "en" || queryLanguage === "ru" || queryLanguage === "tr") {
      setLanguageState(queryLanguage);
      setCurrencyState(defaultCurrencyByLanguage[queryLanguage]);
      window.localStorage.setItem("cheaplygo-language", queryLanguage);
      window.localStorage.setItem(
        "cheaplygo-currency",
        defaultCurrencyByLanguage[queryLanguage]
      );
      return;
    }

    const storedLanguage = window.localStorage.getItem("cheaplygo-language");
    const storedCurrency = window.localStorage.getItem("cheaplygo-currency");
    if (storedLanguage === "en" || storedLanguage === "ru" || storedLanguage === "tr") {
      setLanguageState(storedLanguage);
      if (storedCurrency === "USD" || storedCurrency === "RUB" || storedCurrency === "TRY") {
        setCurrencyState(storedCurrency);
      } else {
        setCurrencyState(defaultCurrencyByLanguage[storedLanguage]);
      }
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("lang", storedLanguage);
      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
      return;
    }

    window.localStorage.setItem("cheaplygo-language", "en");
    window.localStorage.setItem("cheaplygo-currency", "USD");
  }, [pathname, router]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        const nextCurrency = defaultCurrencyByLanguage[nextLanguage];
        setCurrencyState(nextCurrency);
        window.localStorage.setItem("cheaplygo-language", nextLanguage);
        window.localStorage.setItem("cheaplygo-currency", nextCurrency);
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.set("lang", nextLanguage);
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
      },
      currency,
      setCurrency: (nextCurrency) => {
        setCurrencyState(nextCurrency);
        window.localStorage.setItem("cheaplygo-currency", nextCurrency);
      }
    }),
    [currency, language, pathname, router]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
