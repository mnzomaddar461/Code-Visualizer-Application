import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LANG = {
  bn: "bn",
  en: "en",
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem("cv_lang") || LANG.bn
  );

  const toggleLang = () => {
    const next = lang === LANG.bn ? LANG.en : LANG.bn;
    localStorage.setItem("cv_lang", next);
    setLang(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, isBn: lang === LANG.bn }}>
      {children}
    </LanguageContext.Provider>
  );
}

// যেকোনো component এ ব্যবহার করো:
// const { lang, isBn } = useLang();
// isBn ? "বাংলা text" : "English text"
export function useLang() {
  return useContext(LanguageContext);
}