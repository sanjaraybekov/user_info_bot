import { texts } from "../constants/texts";
import { t } from "../i18";
import { MyContext } from "../types/MyContext";
import { UserType } from "../types/User";

export const getStdPost = (ctx: MyContext, data: UserType, type?: string) => {
  if (type) {
    return ctx.reply(
      `${t(ctx, texts.user_address) + data.address}\n${
        t(ctx, texts.telephone) +
        data.phones.map((phone) => {
          return " " + phone;
        })
      }\n${t(ctx, texts.extra_info) + data.description}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: t(ctx, texts.location),
                callback_data: `location_lat=${Number(
                  data.latitude
                )}_lon=${Number(data.longitude)}`,
              },
              {
                text: t(ctx, texts.share),
                switch_inline_query: `${
                  t(ctx, texts.orientr) + data.address
                }\n${
                  t(ctx, texts.telephone) +
                  data.phones.map((phone) => {
                    return " " + phone;
                  })
                }`,
              },
            ],
            [
              {
                text: t(ctx, texts.confirm),
                callback_data: texts.confirm,
              },
              { text: t(ctx, texts.cancel), callback_data: texts.cancel },
            ],
          ],
        },
      }
    );
  } else {
    return ctx.reply(
      `${t(ctx, texts.orientr) + data.address}\n${
        t(ctx, texts.telephone) +
        data.phones.map((phone) => {
          return " " + phone;
        })
      }`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: t(ctx, texts.confirm),
                callback_data: texts.confirm,
              },
              { text: t(ctx, texts.cancel), callback_data: texts.cancel },
            ],
          ],
        },
      }
    );
  }
};
