"use client";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

import { defaultLocale, defaultLocaleData, localeList } from "@/consts";

const LocaleContext = createContext(defaultLocaleData);

type Props = {
  children: React.ReactNode;
};

const LocaleProvider = ({ children }: Props) => {
  const [locale, setLocale] = useState(defaultLocaleData);

  useEffect(() => {
    let cookie = Cookies.get("locale") || defaultLocale;
    if (!localeList.includes(cookie)) {
      cookie = defaultLocale;
    }
    const data = fetch(`locales/${cookie}.json`);
    data
      .then((res) => res.json())
      .then((res) => setLocale({ locale: cookie, ...res }));
  }, []);

  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
};

export default LocaleProvider;

export const useLocale = () => useContext(LocaleContext);
