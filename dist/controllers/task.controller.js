"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
const error_1 = require("../utils/error");
const pagination_1 = require("../utils/pagination");
class TaskController {
    async createTask(request, reply) {
        const { userId, projectId, title, description, startedAt, endedAt } = request.body;
        const startDate = new Date(startedAt);
        const endDate = new Date(endedAt);
        if (endDate <= startDate) {
            throw new error_1.BadRequestError("endedAt must be greater than startedAt");
        }
        const task = await (0, task_service_1.createTask)({
            userId: Number(userId),
            projectId: Number(projectId),
            title,
            description,
            startedAt: startDate,
            endedAt: endDate
        });
        return reply.code(201).send(task);
    }
    async listTasks(request, reply) {
        const query = request.query;
        const filters = {};
        if (query.from)
            filters.from = new Date(query.from);
        if (query.to)
            filters.to = new Date(query.to);
        if (query.projectId)
            filters.projectId = Number(query.projectId);
        const { page, limit } = (0, pagination_1.normalizePagination)(query.page, query.limit);
        const sortBy = query.sortBy &&
            ["id", "startedAt", "endedAt"].includes(query.sortBy)
            ? query.sortBy
            : "startedAt";
        const sortDir = query.sortDir && String(query.sortDir).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";
        const result = await (0, task_service_1.listTasks)(filters, { page, limit }, { sortBy, sortDir });
        return reply.send(result);
    }
}
exports.TaskController = TaskController;
exports.taskController = new TaskController();
