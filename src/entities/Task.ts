import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Check
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

@Entity({ name: "tasks" })
@Check(`"ended_at" > "started_at"`)
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "started_at", type: "timestamp" })
  startedAt!: Date;

  @Column({ name: "ended_at", type: "timestamp" })
  endedAt!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
