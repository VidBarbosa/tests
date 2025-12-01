"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const task_service_1 = require("../services/task.service");
const error_1 = require("../utils/error");
const pagination_1 = require("../utils/pagination");
class UserController {
    async createUser(request, reply) {
        const { name, email } = request.body;
        const user = await (0, user_service_1.createUser)(name, email);
        return reply.code(201).send(user);
    }
    async listUsers(request, reply) {
        const query = request.query;
        const { page, limit } = (0, pagination_1.normalizePagination)(query.page, query.limit);
        const sortBy = query.sortBy &&
            ["id", "name", "email", "createdAt"].includes(query.sortBy)
            ? query.sortBy
            : "createdAt";
        const sortDir = query.sortDir && String(query.sortDir).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";
        const result = await (0, user_service_1.listUsers)({ page, limit }, { sortBy, sortDir });
        return reply.send(result);
    }
    async getUserTasks(request, reply) {
        const params = request.params;
        const query = request.query;
        const userId = Number(params.id);
        const user = await (0, user_service_1.getUserById)(userId);
        if (!user) {
            throw new error_1.NotFoundError("User not found");
        }
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
        const result = await (0, task_service_1.getTasksForUser)(userId, filters, { page, limit }, { sortBy, sortDir });
        return reply.send(result);
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
