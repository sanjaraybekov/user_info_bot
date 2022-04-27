import { texts } from "../constants/texts";
import { t } from "../i18";
import { MyContext } from "../types/MyContext";
import { UserType } from "../types/User";

export const getUserPost = (ctx: MyContext, data: UserType) => {
  return `Foydalanuvchi haqida ma'lumot\n\n${
    t(ctx, texts.namesername) + data.username_surname
  }\n${t(ctx, texts.birthday) + data.birthday}\n${
    t(ctx, texts.useraddress) + data.address
  }\n${
    t(ctx, texts.telephone) +
    data.phones.map((phone) => {
      return " " + phone;
    })
  }\n${
    t(ctx, texts.extra_info) +
    (data.description === undefined ? "Izoh qoldirilmadi" : data.description)
  }\n\nID: ${data.user_id}`;
};
