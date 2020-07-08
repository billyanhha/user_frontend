import i18n from "i18next";
import en from "./trans.en";
import vi from "./trans.vi";

import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector)
  .init({
    // Using simple hardcoded resources for simple example
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
    fallbackLng: "en",
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true
    }
  });

export default i18n;
