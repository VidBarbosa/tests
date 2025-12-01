import Fastify from "fastify";
import { env } from "./config/env";
import swaggerPlugin from "./plugins/swagger";
import dbPlugin from "./plugins/db";
import { healthRoutes } from "./routes/health.routes";
import { v1Routes } from "./routes/v1/index";
import { BadRequestError, NotFoundError } from "./utils/error";

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: env.nodeEnv === "production" ? "info" : "debug",
      transport:
        env.nodeEnv === "production"
          ? undefined
          : {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname"
              }
            }
    },
    requestIdHeader: "x-request-id",
    genReqId: () => crypto.randomUUID()
  });

  await fastify.register(dbPlugin);
  await fastify.register(swaggerPlugin);

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "Unhandled error");

    const status =
      (error as any).statusCode ||
      (error instanceof BadRequestError
        ? 400
        : error instanceof NotFoundError
        ? 404
        : 500);

    const message =
      error instanceof BadRequestError || error instanceof NotFoundError
        ? error.message
        : "Internal server error";

    reply.status(status).send({
      error: error.name || "Error",
      message
    });
  });

  // Unversioned health endpoints
  await fastify.register(healthRoutes);

  // Versioned API
  await fastify.register(v1Routes, { prefix: "/api/v1" });

  return fastify;
}
