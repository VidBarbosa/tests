import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from "typeorm";
import { Task } from "./Task";
import { UserProjectRate } from "./UserProjectRate";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];

  @OneToMany(() => UserProjectRate, (rate) => rate.user)
  projectRates!: UserProjectRate[];
}
