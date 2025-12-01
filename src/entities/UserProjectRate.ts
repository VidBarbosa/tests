import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

@Entity({ name: "user_project_rates" })
@Unique(["user", "project"])
export class UserProjectRate {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.projectRates, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Project, (project) => project.userRates, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ name: "hourly_rate", type: "numeric", precision: 10, scale: 2 })
  hourlyRate!: string;

  @Column({ type: "char", length: 3, default: "USD" })
  currency!: string;
}
