// import { createConnection } from "typeorm";
import { loadBot } from "./bot";

const main = async () => {
  try {
    // await createConnection({
    //   type: "postgres",
    //   database: "ob_havo",
    //   username: "postgres",
    //   port: 5432,
    //   synchronize: true,
    // });
    console.log("Connected to DB");
    loadBot();
  } catch (err) {
    console.log("Unable to connect DB, Eror: ", err);
  }
};
main();
