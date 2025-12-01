"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksRoutes = tasksRoutes;
const task_controller_1 = require("../../controllers/task.controller");
async function tasksRoutes(fastify) {
    fastify.post("/", {
        schema: {
            tags: ["tasks"],
            summary: "Create a new task",
            body: {
                type: "object",
                required: [
                    "userId",
                    "projectId",
                    "title",
                    "startedAt",
                    "endedAt"
                ],
                properties: {
                    userId: { type: "integer", minimum: 1 },
                    projectId: { type: "integer", minimum: 1 },
                    title: { type: "string", minLength: 1 },
                    description: { type: "string" },
                    startedAt: { type: "string", format: "date-time" },
                    endedAt: { type: "string", format: "date-time" }
                }
            },
            response: {
                201: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        title: { type: "string" },
                        description: { type: "string", nullable: true },
                        startedAt: { type: "string", format: "date-time" },
                        endedAt: { type: "string", format: "date-time" }
                    }
                }
            }
        }
    }, task_controller_1.taskController.createTask.bind(task_controller_1.taskController));
    fastify.get("/", {
        schema: {
            tags: ["tasks"],
            summary: "List tasks (global, paginated, sortable)",
            description: "Returns a paginated list of tasks across all users and projects. Supports filtering by date range and project, plus sorting by id, startedAt or endedAt.",
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
                                    startedAt: { type: "string", format: "date-time" },
                                    endedAt: { type: "string", format: "date-time" },
                                    userId: { type: "number" },
                                    userName: { type: "string" },
                                    project: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number" },
                                            name: { type: "string" }
                                        }
                                    }
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
    }, task_controller_1.taskController.listTasks.bind(task_controller_1.taskController));
}
