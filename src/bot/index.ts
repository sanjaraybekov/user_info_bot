import { session } from "grammy";
import { DEVELOPER_ID } from "../config";
import bot from "./core/bot";
import { main_menu } from "./markups/markups";
import i18n, { t } from "./i18";
import { composer } from "./composers";
import { userInfo } from "./routes/filterUserInfo";
import { texts } from "./constants/texts";

export const loadBot = () => {
  bot.use(
    session({
      initial: () => ({
        user: {},
        route: "",
        msg_id_to_delete: 0,
      }),
    })
  );
  bot.use(i18n.middleware());
  bot.command("start", (ctx) => main_menu(ctx));
  bot.command("boshlash", (ctx) => {
    ctx.session.route = texts.user_infos.user_name_surname;
    return ctx.reply(t(ctx, texts.user_infos.user_name_surname));
  });
  bot.use(composer);
  bot.use(userInfo);
  bot.start();

  bot.api.sendMessage(DEVELOPER_ID, "bot started /start");
};
