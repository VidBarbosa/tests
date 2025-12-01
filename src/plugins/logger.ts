import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import pino from "pino";

export default fp(async function loggerPlugin(fastify: FastifyInstance) {
  const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport:
      process.env.NODE_ENV === "production"
        ? undefined
        : {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname"
            }
          }
  });

  fastify.log = logger;

  fastify.addHook("onRequest", async (request, reply) => {
    request.log = logger.child({
      reqId: request.id,
      method: request.method,
      url: request.url
    });
    request.log.info("Incoming request");
  });

  fastify.addHook("onResponse", async (request, reply) => {
    request.log.info(
      {
        statusCode: reply.statusCode
      },
      "Request completed"
    );
  });
});
