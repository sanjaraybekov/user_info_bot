import { Bot } from "grammy";
import { TOKEN } from "../../config";
import { MyContext } from "../types/MyContext";
const bot = new Bot<MyContext>(TOKEN);

export default bot;
