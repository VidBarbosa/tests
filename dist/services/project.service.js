"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepository = void 0;
exports.createProject = createProject;
exports.getProjectById = getProjectById;
exports.listProjects = listProjects;
const data_source_1 = require("../db/data-source");
const Project_1 = require("../entities/Project");
exports.projectRepository = data_source_1.AppDataSource.getRepository(Project_1.Project);
async function createProject(name, description) {
    const project = exports.projectRepository.create({ name, description });
    return exports.projectRepository.save(project);
}
async function getProjectById(id) {
    return exports.projectRepository.findOne({ where: { id } });
}
async function listProjects(pagination, sort) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const sortBy = sort?.sortBy || "createdAt";
    const sortDir = sort?.sortDir || "DESC";
    const order = {};
    order[sortBy] = sortDir;
    const [projects, total] = await exports.projectRepository.findAndCount({
        skip,
        take: limit,
        order
    });
    return {
        data: projects,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}
