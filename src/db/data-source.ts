import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../config/env";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { UserProjectRate } from "../entities/UserProjectRate";
import { Task } from "../entities/Task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [User, Project, UserProjectRate, Task],
  synchronize: env.db.synchronize,
  logging: env.db.logging,
  ssl: env.db.ssl
    ? {
        rejectUnauthorized: false 
      }
    : false
});
