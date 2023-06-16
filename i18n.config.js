import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import * as list from "./locales";

const resources = Object.keys(list).reduce((p, n) => {
  p[n] = {
    translation: list[n],
  };
  return p;
}, {});

i18n.use(initReactI18next).init({
  lng: getLocales()[0].languageCode,
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
