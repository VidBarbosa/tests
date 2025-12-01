"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const pino_1 = __importDefault(require("pino"));
exports.default = (0, fastify_plugin_1.default)(async function loggerPlugin(fastify) {
    const logger = (0, pino_1.default)({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transport: process.env.NODE_ENV === "production"
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
        request.log.info({
            statusCode: reply.statusCode
        }, "Request completed");
    });
});
