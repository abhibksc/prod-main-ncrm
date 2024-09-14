import { IntlProvider } from "react-intl";
import enMessages from "./locales/en/translation.json";
import ruMessages from "./locales/ru/translation.json";

const messages = {
  en: enMessages,
  ru: ruMessages,
};

export default function I18nProvider({ children, locale }) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}
