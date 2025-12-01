"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const env_1 = require("../config/env");
const User_1 = require("../entities/User");
const Project_1 = require("../entities/Project");
const UserProjectRate_1 = require("../entities/UserProjectRate");
const Task_1 = require("../entities/Task");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    username: env_1.env.db.username,
    password: env_1.env.db.password,
    database: env_1.env.db.database,
    entities: [User_1.User, Project_1.Project, UserProjectRate_1.UserProjectRate, Task_1.Task],
    synchronize: env_1.env.db.synchronize,
    logging: env_1.env.db.logging,
    ssl: env_1.env.db.ssl
        ? {
            rejectUnauthorized: false
        }
        : false
});
