import { FastifyRequest, FastifyReply } from "fastify";
import {
  createProject,
  listProjects,
  ProjectSortBy,
  SortDir as ProjectSortDir
} from "../services/project.service";
import { normalizePagination } from "../utils/pagination";

export class ProjectController {
  async createProject(request: FastifyRequest, reply: FastifyReply) {
    const { name, description } = request.body as any;
    const project = await createProject(name, description);
    return reply.code(201).send(project);
  }

  async listProjects(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const { page, limit } = normalizePagination(query.page, query.limit);

    const sortBy: ProjectSortBy =
      query.sortBy &&
      ["id", "name", "createdAt"].includes(query.sortBy)
        ? query.sortBy
        : "createdAt";

    const sortDir: ProjectSortDir =
      query.sortDir && String(query.sortDir).toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";

    const result = await listProjects(
      { page, limit },
      { sortBy, sortDir }
    );

    return reply.send(result);
  }
}

export const projectController = new ProjectController();
