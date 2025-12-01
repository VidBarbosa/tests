import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

export default fp(async function swaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Projects & Tasks API",
        description:
          "API for managing users, projects, user-project rates and tasks. It exposes endpoints to create entities and retrieve a user's tasks including project and rate information.",
        version: "1.0.0"
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local development server"
        }
      ],
      tags: [
        { name: "health", description: "Health check endpoints" },
        { name: "users", description: "User management" },
        { name: "projects", description: "Project management" },
        {
          name: "rates",
          description: "User-project rate configuration (hourly rates)"
        },
        {
          name: "tasks",
          description:
            "Task management and reporting (tasks linked to users and projects)"
        }
      ]
    }
  });

  await fastify.register(fastifySwaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true
    }
  });
});
