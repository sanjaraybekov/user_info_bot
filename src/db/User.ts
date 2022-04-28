import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: "bigint",
  })
  user_id: number;
  @Column({
    nullable: true,
  })
  tg_username: string;
  @Column()
  fullName: string;
  @Column({
    nullable: true,
  })
  birthday: string;
  @Column({
    nullable: true,
  })
  phoneNumbers: string;
  @Column()
  address: string;
  @Column({
    nullable: true,
  })
  latitude: number;
  @Column({
    nullable: true,
  })
  longitude: number;
}
