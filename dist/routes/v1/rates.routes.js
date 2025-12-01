"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratesRoutes = ratesRoutes;
const rate_controller_1 = require("../../controllers/rate.controller");
async function ratesRoutes(fastify) {
    fastify.post("/", {
        schema: {
            tags: ["rates"],
            summary: "Set or update a user-project hourly rate",
            description: "Creates or updates the hourly rate for a specific user in a specific project.",
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
    }, rate_controller_1.rateController.setRate.bind(rate_controller_1.rateController));
}
