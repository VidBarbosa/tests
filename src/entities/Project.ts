import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from "typeorm";
import { Task } from "./Task";
import { UserProjectRate } from "./UserProjectRate";

@Entity({ name: "projects" })
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];

  @OneToMany(() => UserProjectRate, (rate) => rate.project)
  userRates!: UserProjectRate[];
}
