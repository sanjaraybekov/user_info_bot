import { UserType } from "./User";

export interface Session {
  route: string;
  user: UserType;
  msg_id_to_delete: number;
}
