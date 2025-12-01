"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const env_1 = require("./config/env");
const swagger_1 = __importDefault(require("./plugins/swagger"));
const db_1 = __importDefault(require("./plugins/db"));
const health_routes_1 = require("./routes/health.routes");
const index_1 = require("./routes/v1/index");
const error_1 = require("./utils/error");
async function buildApp() {
    const fastify = (0, fastify_1.default)({
        logger: {
            level: env_1.env.nodeEnv === "production" ? "info" : "debug",
            transport: env_1.env.nodeEnv === "production"
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
    await fastify.register(db_1.default);
    await fastify.register(swagger_1.default);
    // Global error handler
    fastify.setErrorHandler((error, request, reply) => {
        request.log.error({ err: error }, "Unhandled error");
        const status = error.statusCode ||
            (error instanceof error_1.BadRequestError
                ? 400
                : error instanceof error_1.NotFoundError
                    ? 404
                    : 500);
        const message = error instanceof error_1.BadRequestError || error instanceof error_1.NotFoundError
            ? error.message
            : "Internal server error";
        reply.status(status).send({
            error: error.name || "Error",
            message
        });
    });
    // Unversioned health endpoints
    await fastify.register(health_routes_1.healthRoutes);
    // Versioned API
    await fastify.register(index_1.v1Routes, { prefix: "/api/v1" });
    return fastify;
}
