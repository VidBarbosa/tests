import { FastifyRequest, FastifyReply } from "fastify";
import {
  createTask,
  listTasks,
  GlobalTaskSortBy,
  SortDir as TaskSortDir
} from "../services/task.service";
import { BadRequestError } from "../utils/error";
import { normalizePagination } from "../utils/pagination";

export class TaskController {
  async createTask(request: FastifyRequest, reply: FastifyReply) {
    const { userId, projectId, title, description, startedAt, endedAt } =
      request.body as any;

    const startDate = new Date(startedAt);
    const endDate = new Date(endedAt);

    if (endDate <= startDate) {
      throw new BadRequestError("endedAt must be greater than startedAt");
    }

    const task = await createTask({
      userId: Number(userId),
      projectId: Number(projectId),
      title,
      description,
      startedAt: startDate,
      endedAt: endDate
    });

    return reply.code(201).send(task);
  }

  async listTasks(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const filters: any = {};
    if (query.from) filters.from = new Date(query.from);
    if (query.to) filters.to = new Date(query.to);
    if (query.projectId) filters.projectId = Number(query.projectId);

    const { page, limit } = normalizePagination(query.page, query.limit);

    const sortBy: GlobalTaskSortBy =
      query.sortBy &&
      ["id", "startedAt", "endedAt"].includes(query.sortBy)
        ? query.sortBy
        : "startedAt";

    const sortDir: TaskSortDir =
      query.sortDir && String(query.sortDir).toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";

    const result = await listTasks(
      filters,
      { page, limit },
      { sortBy, sortDir }
    );

    return reply.send(result);
  }
}

export const taskController = new TaskController();
