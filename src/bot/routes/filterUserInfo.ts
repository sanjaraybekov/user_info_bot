import { Router } from "@grammyjs/router";
import { MyContext } from "../types/MyContext";
import { texts } from "../constants/texts";
import { t } from "../i18";
import { Keyboard, NextFunction } from "grammy";
import { getUserPost } from "../helpers/getUserPost";
import bot from "../core/bot";

const userInfo = new Router<MyContext>((ctx) => ctx.session.route);

userInfo.route(texts.user_infos.user_name_surname, async (ctx) => {
  ctx.session.user.tg_username = ctx.from?.username || "";
  ctx.session.user.username_surname = ctx.message?.text || "";
  ctx.session.route = texts.user_infos.birthday;

  return ctx
    .reply(t(ctx, texts.user_infos.add_birthday))
    .then((v: any) => (ctx.session.msg_id_to_delete = v.message_id));
});

userInfo.route(texts.user_infos.birthday, async (ctx) => {
  ctx.session.user.birthday = ctx.message?.text || "";
  ctx.session.route = texts.user_infos.add_address;
  return ctx
    .reply(t(ctx, texts.user_infos.add_address), {
      parse_mode: "HTML",
    })
    .then((v: any) => (ctx.session.msg_id_to_delete = v.message_id));
});

userInfo.route(texts.user_infos.add_address, addAddress);

async function addAddress(ctx: MyContext) {
  ctx.session.user.address = ctx.message?.text || "";

  const sendLocation = new Keyboard()
    .requestLocation(t(ctx, texts.user_infos.add_location_req_btn))
    .row();

  ctx.session.route = texts.user_infos.add_location;
  return ctx
    .reply(t(ctx, texts.user_infos.add_location), {
      reply_markup: { ...sendLocation, resize_keyboard: true },
      parse_mode: "HTML",
    })
    .then((v) => (ctx.session.msg_id_to_delete = v.message_id));
}

function backMiddleware(prevRoute: string, prevRouteMiddleware: Function) {
  return (ctx: MyContext, next: NextFunction) => {
    if (ctx.message?.text === t(ctx, texts.go_back)) {
      ctx.session.route = prevRoute;
      return prevRouteMiddleware(ctx);
    }
    return next();
  };
}

userInfo.route(
  texts.user_infos.add_location,
  backMiddleware(texts.user_infos.add_address, addAddress),
  async (ctx) => {
    const location = ctx.msg?.location;
    // ctx.deleteMessage();
    if (location) {
      ctx.api.deleteMessage(ctx.chat?.id || "", ctx.session.msg_id_to_delete);
      ctx.session.user.longitude =
        ctx.message?.location?.longitude.toString() || "";
      ctx.session.user.latitude =
        ctx.message?.location?.latitude.toString() || "";

      ctx.session.route = texts.user_infos.add_phone;
      // ctx.api.deleteMessage(ctx.from?.id || "", ctx.session.msg_id_to_delete);
      const sendPhone = new Keyboard().requestContact(
        t(ctx, texts.user_infos.add_phone_req_btn)
      );
      return ctx
        .reply(t(ctx, texts.user_infos.add_phone), {
          reply_markup: { ...sendPhone, resize_keyboard: true },
          parse_mode: "HTML",
        })
        .then((v) => (ctx.session.msg_id_to_delete = v.message_id));
    } else return ctx.reply(t(ctx, texts.user_infos.add_location_err));
  }
);
userInfo.route(texts.user_infos.add_phone, async (ctx) => {
  // ctx.deleteMessage();
  const regex = /\+?(998)? ?(\d{2} ?\d{3} ?\d{2} ?\d{2})$/gi;
  if (regex.test(ctx.msg?.text || "") || ctx.msg?.contact) {
    (ctx.session.user.phones = ctx.msg?.contact?.phone_number || ""),
      (ctx.session.route = texts.user_infos.add_description);
    return ctx
      .reply(t(ctx, texts.user_infos.add_description), {
        reply_markup: {
          keyboard: [[{ text: t(ctx, texts.skip_btn) }]],
          resize_keyboard: true,
        },
        parse_mode: "HTML",
      })
      .then((v) => (ctx.session.msg_id_to_delete = v.message_id));
  } else {
    return ctx.reply(t(ctx, texts.user_infos.add_phone_err));
  }
});

userInfo.route(texts.user_infos.add_description, async (ctx) => {
  // ctx.deleteMessage();
  if (!ctx.msg?.text) {
    return ctx.reply(t(ctx, texts.user_infos.add_description_err));
  }

  ctx.api.deleteMessage(ctx.chat?.id || "", ctx.session.msg_id_to_delete);
  ctx
    .reply("Ma'lumotlarni tasdiqlash jarayoni amalga oshirilmoqda...")
    .then((v) => (ctx.session.msg_id_to_delete = v.message_id));
  if (ctx.msg?.text !== t(ctx, texts.skip_btn)) {
    ctx.session.user.description = ctx.msg?.text || "";
  }

  return await bot.api.sendMessage(
    -1001718670724,
    getUserPost(ctx, ctx.session.user),
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: t(ctx, texts.location),
              callback_data: `location_lat=${Number(
                ctx.session.user.latitude
              )}_lon=${Number(ctx.session.user.longitude)}`,
            },
            {
              text: t(ctx, texts.share),
              switch_inline_query: `${
                t(ctx, texts.orientr) + ctx.session.user.address
              }\n${t(ctx, texts.telephone) + ctx.session.user.phones}`,
            },
          ],
          [
            {
              text: t(ctx, texts.confirm),
              callback_data: `confirm~${ctx.session.user.user_id}~${ctx.session.user.username_surname}~${ctx.session.user.birthday}~${ctx.session.user.address}~${ctx.session.user.phones}~@${ctx.session.user.tg_username}`,
            },
            {
              text: t(ctx, texts.cancel),
              callback_data: `cancle~${ctx.session.user.user_id}`,
            },
          ],
        ],
      },
    }
  );
});

export { userInfo };
