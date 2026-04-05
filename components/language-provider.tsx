"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { usePathname, useRouter } from "next/navigation";

export type Language = "en" | "ru";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryLanguage = searchParams.get("lang");
    if (queryLanguage === "en" || queryLanguage === "ru") {
      setLanguageState(queryLanguage);
      window.localStorage.setItem("cheaplygo-language", queryLanguage);
      return;
    }

    const storedLanguage = window.localStorage.getItem("cheaplygo-language");
    if (storedLanguage === "en" || storedLanguage === "ru") {
      setLanguageState(storedLanguage);
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("lang", storedLanguage);
      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    }
  }, [pathname, router]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem("cheaplygo-language", nextLanguage);
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.set("lang", nextLanguage);
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
      }
    }),
    [language, pathname, router]
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
