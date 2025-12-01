import { FastifyInstance } from "fastify";
import { projectController } from "../../controllers/project.controller";

export async function projectsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["projects"],
        summary: "Create a new project",
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1 },
            description: { type: "string" }
          }
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              description: { type: "string", nullable: true },
              createdAt: { type: "string", format: "date-time" }
            }
          }
        }
      }
    },
    projectController.createProject.bind(projectController)
  );

  fastify.get(
    "/",
    {
      schema: {
        tags: ["projects"],
        summary: "List projects (paginated, sortable)",
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1 },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10
            },
            sortBy: {
              type: "string",
              enum: ["id", "name", "createdAt"],
              default: "createdAt"
            },
            sortDir: {
              type: "string",
              enum: ["ASC", "DESC"],
              default: "DESC"
            }
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    description: { type: "string", nullable: true },
                    createdAt: { type: "string", format: "date-time" }
                  }
                }
              },
              meta: {
                type: "object",
                properties: {
                  page: { type: "integer" },
                  limit: { type: "integer" },
                  total: { type: "integer" },
                  totalPages: { type: "integer" }
                }
              }
            }
          }
        }
      }
    },
    projectController.listProjects.bind(projectController)
  );
}
