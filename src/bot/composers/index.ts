import { Composer } from "grammy";
import { texts } from "../constants/texts";
import { t } from "../i18";
import { main_menu } from "../markups/markups";
import { MyContext } from "../types/MyContext";

const composer = new Composer<MyContext>();
composer.use((ctx, next) => {
  ctx.session.route = texts.user_info;
  next();
});
composer.callbackQuery(texts.main_menu, (ctx) => {
  ctx.session.route = "";
  ctx.deleteMessage();
  return main_menu(ctx);
});

export { composer };
