import { texts } from "../constants/texts";
import { t } from "../i18";
import { MyContext } from "../types/MyContext";

export const main_menu = async (ctx: MyContext) => {
  return ctx.reply(
    `Assalomu Aleykum ${ctx.from?.first_name}! ` + t(ctx, texts.main_text),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: t(ctx, texts.starting),
              callback_data: texts.starting,
            },
          ],
        ],
      },
      parse_mode: "HTML",
    }
  );
};
