import { Router } from "@grammyjs/router";
import { MyContext } from "../types/MyContext";
import { texts } from "../constants/texts";
import { t } from "../i18";
import { Keyboard, NextFunction } from "grammy";
import { getStdPost } from "../helpers/getStdPost";

const userInfo = new Router<MyContext>((ctx) => ctx.session.route);

userInfo.route(texts.user_info, async (ctx) => {
  ctx.session.route = texts.user_infos.add_address;
  return ctx
    .editMessageText(t(ctx, texts.user_infos.add_address), {
      reply_markup: { inline_keyboard: [] },
      parse_mode: "HTML",
    })
    .then((v: any) => (ctx.session.msg_id_to_delete = v.message_id));
});

async function addAddress(ctx: MyContext) {
  ctx.session.user.address = ctx.message?.text || "";

  const sendLocation = new Keyboard()
    .requestLocation(t(ctx, texts.user_infos.add_location_req_btn))
    .row()
    .text(t(ctx, texts.go_back));

  ctx.session.route = texts.user_infos.add_location;
  ctx.deleteMessage();
  ctx.api.deleteMessage(ctx.from?.id || "", ctx.session.msg_id_to_delete);
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

userInfo.route(texts.user_infos.add_address, addAddress);
userInfo.route(
  texts.user_infos.add_location,
  backMiddleware(texts.user_infos.add_address, addAddress),
  async (ctx) => {
    const location = ctx.msg?.location;
    ctx.deleteMessage();
    if (location) {
      ctx.api.deleteMessage(ctx.chat?.id || "", ctx.session.msg_id_to_delete);
      ctx.session.user.longitude =
        ctx.message?.location?.longitude.toString() || "";
      ctx.session.user.latitude =
        ctx.message?.location?.latitude.toString() || "";

      ctx.session.route = texts.user_infos.add_phone;
      ctx.api.deleteMessage(ctx.from?.id || "", ctx.session.msg_id_to_delete);
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
userInfo.route(texts.user_infos.add_phone, (ctx) => {
  ctx.deleteMessage();
  const regex = /\+?(998)? ?(\d{2} ?\d{3} ?\d{2} ?\d{2})$/gi;
  if (regex.test(ctx.msg?.text || "") || ctx.msg?.contact) {
    ctx.session.user.phones = [
      ctx.msg?.contact?.phone_number || ctx.msg?.text || "",
    ];
    ctx.session.route = texts.user_infos.add_extra_phone;
    const sendPhone = new Keyboard()
      .requestContact(t(ctx, texts.user_infos.add_phone_req_btn))
      .row()
      .text(t(ctx, texts.skip_btn));

    return ctx
      .reply(t(ctx, texts.user_infos.add_extra_phone), {
        reply_markup: { ...sendPhone, resize_keyboard: true },
      })
      .then((v) => (ctx.session.msg_id_to_delete = v.message_id));
  } else {
    return ctx.reply(texts.user_infos.add_phone_err);
  }
});
userInfo.route(texts.user_infos.add_extra_phone, (ctx) => {
  ctx.deleteMessage();
  const regex = /\+?(998)? ?(\d{2} ?\d{3} ?\d{2} ?\d{2})$/gi;
  if (regex.test(ctx.msg?.text || "") || ctx.msg?.contact) {
    ctx.session.user.phones = [
      ...ctx.session.user.phones,
      ctx.msg?.contact?.phone_number || ctx.msg?.text || "",
    ];
    ctx.session.route = texts.user_infos.add_extra_phone;
    const sendPhone = new Keyboard()
      .requestContact(t(ctx, texts.user_infos.add_phone_req_btn))
      .row()
      .text(t(ctx, texts.skip_btn));

    return ctx.reply(t(ctx, texts.user_infos.add_extra_phone), {
      reply_markup: { ...sendPhone, resize_keyboard: true },
    });
  } else if (ctx.message?.text === t(ctx, texts.skip_btn)) {
    ctx.session.route = texts.user_infos.add_description;
    ctx.api.deleteMessage(ctx.from?.id || "", ctx.session.msg_id_to_delete);
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
    return ctx.reply(t(ctx, texts.user_infos.add_extra_phone_err));
  }
});

userInfo.route(texts.user_infos.add_description, (ctx) => {
  ctx.deleteMessage();
  if (!ctx.msg?.text) {
    return ctx.reply(t(ctx, texts.user_infos.add_description_err));
  }
  ctx.api.deleteMessage(ctx.chat?.id || "", ctx.session.msg_id_to_delete);
  if (ctx.msg?.text !== t(ctx, texts.skip_btn)) {
    ctx.session.user.description = ctx.msg?.text || "";
  }
  return getStdPost(ctx, ctx.session.user, "adding");
});

export { userInfo };
