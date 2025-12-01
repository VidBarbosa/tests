"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
async function healthRoutes(fastify) {
    fastify.get("/health", {
        schema: {
            tags: ["health"],
            summary: "Basic liveness check",
            description: "Returns a simple payload to confirm the API is up.",
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        uptime: { type: "number" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return reply.send({ status: "ok", uptime: process.uptime() });
    });
    fastify.get("/db-health", {
        schema: {
            tags: ["health"],
            summary: "Database connectivity check",
            description: "Performs a simple query to ensure the API is able to reach the database.",
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        db: { type: "string" }
                    }
                },
                500: {
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        error: { type: "string" }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            await fastify.db.query("SELECT 1");
            return reply.send({ status: "ok", db: "connected" });
        }
        catch (err) {
            request.log.error({ err }, "Database health check failed");
            return reply.status(500).send({
                status: "error",
                error: "Database connection failed"
            });
        }
    });
}
