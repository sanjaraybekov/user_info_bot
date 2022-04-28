import { User } from "../../db/User";
const XLSX = require("xlsx");

const convertJsonToExcel = async () => {
  const usersData = await User.find();

  const workSheet = XLSX.utils.json_to_sheet(usersData);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "users");

  XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workBook, "users.xlsx");
};

export default convertJsonToExcel;
