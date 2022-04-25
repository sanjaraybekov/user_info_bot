import { Context as BaseContext, SessionFlavor } from "grammy";
import { I18nContextFlavor } from "@grammyjs/i18n";
import { Session } from "./Session";

export type MyContext = BaseContext &
	I18nContextFlavor &
	SessionFlavor<Session>;
