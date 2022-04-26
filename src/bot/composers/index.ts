import { Composer } from "grammy";
import { texts } from "../constants/texts";
import { t } from "../i18";
import { main_menu } from "../markups/markups";
import { MyContext } from "../types/MyContext";

const composer = new Composer<MyContext>();

composer.callbackQuery(texts.starting, (ctx) => {
  ctx.session.route = texts.user_infos.user_name_surname;
  return ctx.reply(t(ctx, texts.user_infos.user_name_surname));
});
// composer.callbackQuery(texts.location, async (ctx) => {
//   ctx.session.route = "get_location";
// });
composer.callbackQuery(texts.main_menu, (ctx) => {
  ctx.session.route = "";
  ctx.deleteMessage();
  return main_menu(ctx);
});

export { composer };
