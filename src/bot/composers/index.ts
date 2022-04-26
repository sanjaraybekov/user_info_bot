import { Bot, Composer } from "grammy";
import { texts } from "../constants/texts";
import bot from "../core/bot";
import { t } from "../i18";
import { main_menu } from "../markups/markups";
import { MyContext } from "../types/MyContext";

const composer = new Composer<MyContext>();

composer.callbackQuery(texts.starting, (ctx) => {
  ctx.session.route = texts.user_infos.user_name_surname;
  return ctx.reply(t(ctx, texts.user_infos.user_name_surname));
});

composer.callbackQuery(texts.confirm, (ctx) => {
  ctx.session.route = texts.confirm;
  return bot.api.sendMessage(
    788109879,
    t(ctx, texts.confirmed) + `\nYana yangi ma'lumot kiritishni hohlaysizmi?`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: t(ctx, texts.add_new_info),
              callback_data: texts.user_infos.user_name_surname,
            },
            {
              text: t(ctx, texts.not_new_info),
              callback_data: texts.not_new_info,
            },
          ],
        ],
      },
    }
  );
});
composer.callbackQuery(texts.cancel, (ctx) => {
  ctx.deleteMessage();
  return bot.api.sendMessage(
    788109879,
    t(ctx, texts.not_confirmed) +
      `\nIltimos barcha shartlarni bajarganligingiz haqida ishonch hosil qiling.\nQayta boshlash uchun /boshlash 👈 buyrug'uni bosing`
  );
});
composer.callbackQuery(texts.not_new_info, (ctx) => {
  return ctx.editMessageText(
    "Bizga ishonch bildirganingiz uchun raxmat!\n\nYangi ma'lumotlarni kiritishni istasangiz /boshlash 👈 buyrug'ini bosing."
  );
});
composer.callbackQuery(/^location_lat=(\w+)/, (ctx) => {
  var regex = /[\d|,|.|e|E|\+]+/g;
  const location = ctx.callbackQuery.data.match(regex);
  return ctx.replyWithLocation(
    Number(location ? location[0] : 0),
    Number(location ? location[1] : 0)
  );
});

composer.callbackQuery(texts.main_menu, (ctx) => {
  ctx.session.route = "";
  ctx.deleteMessage();
  return main_menu(ctx);
});

export { composer };
