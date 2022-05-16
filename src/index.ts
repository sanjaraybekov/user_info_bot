import { createConnection } from "typeorm";
import { loadBot } from "./bot";
import { User } from "./db/User";

const main = async () => {
  try {
    await createConnection({
      type: "postgres",
      database: "user_info_two",
      username: "postgres",
      port: 5432,
      password: "123123",
      host: "localhost",
      entities: [User],
      synchronize: true,
    });
    console.log("Connected to DB");
    loadBot();
  } catch (err) {
    console.log("Unable to connect DB, Eror: ", err);
  }
};

main();
