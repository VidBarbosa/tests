"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Routes = v1Routes;
const users_routes_1 = require("./users.routes");
const projects_routes_1 = require("./projects.routes");
const rates_routes_1 = require("./rates.routes");
const tasks_routes_1 = require("./tasks.routes");
async function v1Routes(fastify) {
    await fastify.register(users_routes_1.usersRoutes, { prefix: "/users" });
    await fastify.register(projects_routes_1.projectsRoutes, { prefix: "/projects" });
    await fastify.register(rates_routes_1.ratesRoutes, { prefix: "/rates" });
    await fastify.register(tasks_routes_1.tasksRoutes, { prefix: "/tasks" });
}
