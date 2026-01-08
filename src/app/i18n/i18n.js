import { createContext, useContext, useEffect, useMemo, useState } from "react";
import labels from "./labels.json";

const I18nContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);

const formatTemplate = (template, variables = {}) =>
  template.replace(/\{(\w+)\}/g, (_, key) =>
    variables[key] !== undefined ? variables[key] : `{${key}}`
  );

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }
    return window.localStorage.getItem("app-language") || "en";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("app-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  const t = useMemo(() => {
    return (key, variables) => {
      const fromLang = getNestedValue(labels[language], key);
      const fromDefault = getNestedValue(labels.en, key);
      const value = fromLang ?? fromDefault ?? key;
      return typeof value === "string" ? formatTemplate(value, variables) : key;
    };
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
