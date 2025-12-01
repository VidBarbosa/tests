import { FastifyInstance } from "fastify";
import { usersRoutes } from "./users.routes";
import { projectsRoutes } from "./projects.routes";
import { ratesRoutes } from "./rates.routes";
import { tasksRoutes } from "./tasks.routes";

export async function v1Routes(fastify: FastifyInstance) {
  await fastify.register(usersRoutes, { prefix: "/users" });
  await fastify.register(projectsRoutes, { prefix: "/projects" });
  await fastify.register(ratesRoutes, { prefix: "/rates" });
  await fastify.register(tasksRoutes, { prefix: "/tasks" });
}
