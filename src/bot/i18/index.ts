import { I18n, pluralize } from "@grammyjs/i18n";
import path from "path";
import { MyContext } from "../types/MyContext";

const i18n = new I18n({
  defaultLanguageOnMissing: true,
  defaultLanguage: "uz",
  sessionName: "session",
  directory: path.resolve(__dirname, "locales"),
  useSession: true,
  templateData: {
    pluralize,
    uppercase: (value: string) => value.toUpperCase(),
  },
});
export const t = (ctx: MyContext, key: string): string => ctx.i18n.t(key);
export default i18n;
