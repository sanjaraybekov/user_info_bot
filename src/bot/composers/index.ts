import { Composer, InputFile } from "grammy";
import { User } from "../../db/User";
import { texts } from "../constants/texts";
import converterFolder from "../converterFolder";
import bot from "../core/bot";
import { t } from "../i18";
import { main_menu } from "../markups/markups";
import { MyContext } from "../types/MyContext";

const composer = new Composer<MyContext>();

composer.callbackQuery(texts.starting, (ctx) => {
  ctx.session.user.user_id = ctx.chat?.id || 0;
  ctx.session.route = texts.user_infos.user_name_surname;
  return ctx.reply(t(ctx, texts.user_infos.user_name_surname));
});

composer.callbackQuery(/^confirm~(\w+)/, async (ctx) => {
  const UserInfos = ctx.callbackQuery.data.split("~").slice(1);
  const userId = Number(ctx.callbackQuery.data.split("~").slice(1)[0]);

  const newUser = await User.create({
    user_id: Number(UserInfos[0]) || 0,
    fullName: UserInfos[1],
    birthday: UserInfos[2],
    address: UserInfos[3],
    phoneNumbers: UserInfos[4],
    tg_username: UserInfos[5],
  });
  await newUser.save();
  await converterFolder();
  await ctx.editMessageText("✅ Foydalanuvchi ro'yxatga olindi");
  await bot.api.sendDocument(-1001718670724, new InputFile("./users.xlsx"), {
    caption: "users.xlsx",
  });
  return await bot.api.sendMessage(
    userId,
    t(ctx, texts.confirmed) + `\nYana yangi ma'lumot kiritishni hohlaysizmi?`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: t(ctx, texts.add_new_info),
              callback_data: texts.starting,
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

composer.callbackQuery(/^cancle~(\d)/, async (ctx) => {
  const UserId = await Number(ctx.callbackQuery.data.split("~")[1]);
  ctx.deleteMessage();
  ctx.reply("❌ Foydalanuvchi tasdiqlanmadi");
  return await bot.api.sendMessage(
    UserId,
    t(ctx, texts.not_confirmed) +
      `\nIltimos barcha shartlarni bajarganligingiz haqida ishonch hosil qiling.\nQayta boshlash uchun /boshlash 👈 buyrug'uni bosing`
  );
});
composer.callbackQuery(texts.not_new_info, (ctx) => {
  ctx.deleteMessage();
  return ctx.reply(
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
