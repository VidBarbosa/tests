"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
exports.default = (0, fastify_plugin_1.default)(async function swaggerPlugin(fastify) {
    await fastify.register(swagger_1.default, {
        openapi: {
            info: {
                title: "Projects & Tasks API",
                description: "API for managing users, projects, user-project rates and tasks. It exposes endpoints to create entities and retrieve a user's tasks including project and rate information.",
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
                    description: "Task management and reporting (tasks linked to users and projects)"
                }
            ]
        }
    });
    await fastify.register(swagger_ui_1.default, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true
        }
    });
});
