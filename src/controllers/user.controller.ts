import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUser,
  getUserById,
  listUsers,
  UserSortBy,
  SortDir as UserSortDir
} from "../services/user.service";
import {
  getTasksForUser,
  UserTaskSortBy,
  SortDir as TaskSortDir
} from "../services/task.service";
import { NotFoundError } from "../utils/error";
import { normalizePagination } from "../utils/pagination";

export class UserController {
  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const { name, email } = request.body as any;
    const user = await createUser(name, email);
    return reply.code(201).send(user);
  }

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const { page, limit } = normalizePagination(query.page, query.limit);

    const sortBy: UserSortBy =
      query.sortBy &&
      ["id", "name", "email", "createdAt"].includes(query.sortBy)
        ? query.sortBy
        : "createdAt";

    const sortDir: UserSortDir =
      query.sortDir && String(query.sortDir).toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";

    const result = await listUsers(
      { page, limit },
      { sortBy, sortDir }
    );
    return reply.send(result);
  }

  async getUserTasks(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as any;
    const query = request.query as any;

    const userId = Number(params.id);
    const user = await getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const filters: any = {};
    if (query.from) filters.from = new Date(query.from);
    if (query.to) filters.to = new Date(query.to);
    if (query.projectId) filters.projectId = Number(query.projectId);

    const { page, limit } = normalizePagination(query.page, query.limit);

    const sortBy: UserTaskSortBy =
      query.sortBy &&
      ["id", "startedAt", "endedAt"].includes(query.sortBy)
        ? query.sortBy
        : "startedAt";

    const sortDir: TaskSortDir =
      query.sortDir && String(query.sortDir).toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";

    const result = await getTasksForUser(
      userId,
      filters,
      { page, limit },
      { sortBy, sortDir }
    );

    return reply.send(result);
  }
}

export const userController = new UserController();
