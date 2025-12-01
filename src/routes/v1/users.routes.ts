import { FastifyInstance } from "fastify";
import { userController } from "../../controllers/user.controller";

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["users"],
        summary: "Create a new user",
        body: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", minLength: 1 },
            email: { type: "string", format: "email" }
          }
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string", format: "date-time" }
            }
          }
        }
      }
    },
    userController.createUser.bind(userController)
  );

  fastify.get(
    "/",
    {
      schema: {
        tags: ["users"],
        summary: "List users (paginated, sortable)",
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
              enum: ["id", "name", "email", "createdAt"],
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
                    email: { type: "string" },
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
    userController.listUsers.bind(userController)
  );

  fastify.get(
    "/:id/tasks",
    {
      schema: {
        tags: ["tasks"],
        summary: "Get paginated tasks for a specific user",
        description:
          "Returns paginated tasks associated with the given user, including project and rate information. Supports filtering and sorting.",
        params: {
          type: "object",
          properties: {
            id: { type: "integer", minimum: 1 }
          },
          required: ["id"]
        },
        querystring: {
          type: "object",
          properties: {
            from: { type: "string", format: "date" },
            to: { type: "string", format: "date" },
            projectId: { type: "integer", minimum: 1 },
            page: { type: "integer", minimum: 1, default: 1 },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10
            },
            sortBy: {
              type: "string",
              enum: ["id", "startedAt", "endedAt"],
              default: "startedAt"
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
                    taskId: { type: "number" },
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    startedAt: { type: "string", format: "date-time" },
                    endedAt: { type: "string", format: "date-time" },
                    project: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        name: { type: "string" }
                      }
                    },
                    rate: {
                      type: "object",
                      properties: {
                        hourlyRate: { type: "string" },
                        currency: { type: "string" }
                      }
                    },
                    calculatedValue: { type: "string" }
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
    userController.getUserTasks.bind(userController)
  );
}
