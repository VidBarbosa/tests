"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = exports.ProjectController = void 0;
const project_service_1 = require("../services/project.service");
const pagination_1 = require("../utils/pagination");
class ProjectController {
    async createProject(request, reply) {
        const { name, description } = request.body;
        const project = await (0, project_service_1.createProject)(name, description);
        return reply.code(201).send(project);
    }
    async listProjects(request, reply) {
        const query = request.query;
        const { page, limit } = (0, pagination_1.normalizePagination)(query.page, query.limit);
        const sortBy = query.sortBy &&
            ["id", "name", "createdAt"].includes(query.sortBy)
            ? query.sortBy
            : "createdAt";
        const sortDir = query.sortDir && String(query.sortDir).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";
        const result = await (0, project_service_1.listProjects)({ page, limit }, { sortBy, sortDir });
        return reply.send(result);
    }
}
exports.ProjectController = ProjectController;
exports.projectController = new ProjectController();
