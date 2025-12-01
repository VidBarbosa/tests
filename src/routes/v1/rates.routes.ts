
import { FastifyInstance } from "fastify";
import { rateController } from "../../controllers/rate.controller";

export async function ratesRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["rates"],
        summary: "Set or update a user-project hourly rate",
        description:
          "Creates or updates the hourly rate for a specific user in a specific project.",
        body: {
          type: "object",
          required: ["userId", "projectId", "hourlyRate"],
          properties: {
            userId: { type: "integer", minimum: 1 },
            projectId: { type: "integer", minimum: 1 },
            hourlyRate: { type: "string", pattern: "^[0-9]+(\\.[0-9]{1,2})?$" },
            currency: {
              type: "string",
              minLength: 3,
              maxLength: 3,
              default: "USD"
            }
          }
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              hourlyRate: { type: "string" },
              currency: { type: "string" }
            }
          }
        }
      }
    },
    rateController.setRate.bind(rateController)
  );
}
