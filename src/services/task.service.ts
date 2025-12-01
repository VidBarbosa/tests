import { AppDataSource } from "../db/data-source";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { UserProjectRate } from "../entities/UserProjectRate";
import { BadRequestError } from "../utils/error";
import {
  PaginatedResult,
  PaginationParams
} from "../utils/pagination";

export const taskRepository = AppDataSource.getRepository(Task);

export interface TaskFilters {
  from?: Date;
  to?: Date;
  projectId?: number;
}

export type SortDir = "ASC" | "DESC";
export type UserTaskSortBy = "id" | "startedAt" | "endedAt";
export type GlobalTaskSortBy = "id" | "startedAt" | "endedAt";

export interface UserTaskView {
  taskId: number;
  title: string;
  description?: string;
  startedAt: Date;
  endedAt: Date;
  project: { id: number; name: string };
  rate: { hourlyRate: string; currency: string };
  calculatedValue: string;
}

export interface GlobalTaskView {
  taskId: number;
  userId: number;
  userName: string;
  title: string;
  startedAt: Date;
  endedAt: Date;
  project: { id: number; name: string };
}

export async function createTask(
  params: {
    userId: number;
    projectId: number;
    title: string;
    description?: string;
    startedAt: Date;
    endedAt: Date;
  }
): Promise<Task> {
  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);

  const user = await userRepo.findOne({ where: { id: params.userId } });
  if (!user) throw new BadRequestError("User not found");

  const project = await projectRepo.findOne({
    where: { id: params.projectId }
  });
  if (!project) throw new BadRequestError("Project not found");

  const task = taskRepository.create({
    user,
    project,
    title: params.title,
    description: params.description,
    startedAt: params.startedAt,
    endedAt: params.endedAt
  });

  return taskRepository.save(task);
}

/**
 * Paginated tasks for a given user, including project and rate, plus value.
 */
export async function getTasksForUser(
  userId: number,
  filters: TaskFilters,
  pagination: PaginationParams,
  sort?: { sortBy?: UserTaskSortBy; sortDir?: SortDir }
): Promise<PaginatedResult<UserTaskView>> {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const sortBy: UserTaskSortBy = sort?.sortBy ?? "startedAt";
  const sortDir: SortDir = sort?.sortDir ?? "DESC";

  const sortColumn =
    sortBy === "endedAt"
      ? "t.ended_at"
      : sortBy === "id"
      ? "t.id"
      : "t.started_at";

  const qb = taskRepository
    .createQueryBuilder("t")
    .innerJoin("t.user", "u")
    .innerJoin("t.project", "p")
    .innerJoin(
      UserProjectRate,
      "upr",
      "upr.user_id = u.id AND upr.project_id = p.id"
    )
    .where("t.user_id = :userId", { userId });

  if (filters.projectId) {
    qb.andWhere("t.project_id = :projectId", {
      projectId: filters.projectId
    });
  }

  if (filters.from) {
    qb.andWhere("t.started_at >= :from", { from: filters.from });
  }

  if (filters.to) {
    qb.andWhere("t.ended_at <= :to", { to: filters.to });
  }

  const total = await qb.getCount();

  const rows = await qb
    .select([
      "t.id AS task_id",
      "t.title AS task_title",
      "t.description AS task_description",
      "t.started_at AS task_started_at",
      "t.ended_at AS task_ended_at",
      "p.id AS project_id",
      "p.name AS project_name",
      "upr.hourly_rate AS hourly_rate",
      "upr.currency AS currency"
    ])
    .orderBy(sortColumn, sortDir)
    .skip(offset)
    .take(limit)
    .getRawMany();

  const data: UserTaskView[] = rows.map((row: any) => {
    const startedAt = new Date(row.task_started_at);
    const endedAt = new Date(row.task_ended_at);

    const hours =
      (endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60);
    const hourlyRate = parseFloat(row.hourly_rate);
    const value = hours * hourlyRate;

    return {
      taskId: Number(row.task_id),
      title: row.task_title,
      description: row.task_description,
      startedAt,
      endedAt,
      project: {
        id: Number(row.project_id),
        name: row.project_name
      },
      rate: {
        hourlyRate: row.hourly_rate,
        currency: row.currency
      },
      calculatedValue: value.toFixed(2)
    };
  });

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Global paginated list of tasks (e.g. for admin / reports).
 */
export async function listTasks(
  filters: TaskFilters,
  pagination: PaginationParams,
  sort?: { sortBy?: GlobalTaskSortBy; sortDir?: SortDir }
): Promise<PaginatedResult<GlobalTaskView>> {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const sortBy: GlobalTaskSortBy = sort?.sortBy ?? "startedAt";
  const sortDir: SortDir = sort?.sortDir ?? "DESC";

  const sortColumn =
    sortBy === "endedAt"
      ? "t.ended_at"
      : sortBy === "id"
      ? "t.id"
      : "t.started_at";

  const qb = taskRepository
    .createQueryBuilder("t")
    .innerJoin("t.user", "u")
    .innerJoin("t.project", "p");

  if (filters.projectId) {
    qb.andWhere("t.project_id = :projectId", {
      projectId: filters.projectId
    });
  }

  if (filters.from) {
    qb.andWhere("t.started_at >= :from", { from: filters.from });
  }

  if (filters.to) {
    qb.andWhere("t.ended_at <= :to", { to: filters.to });
  }

  const total = await qb.getCount();

  const rows = await qb
    .select([
      "t.id AS task_id",
      "t.title AS task_title",
      "t.started_at AS task_started_at",
      "t.ended_at AS task_ended_at",
      "u.id AS user_id",
      "u.name AS user_name",
      "p.id AS project_id",
      "p.name AS project_name"
    ])
    .orderBy(sortColumn, sortDir)
    .skip(offset)
    .take(limit)
    .getRawMany();

  const data: GlobalTaskView[] = rows.map((row: any) => ({
    taskId: Number(row.task_id),
    title: row.task_title,
    startedAt: new Date(row.task_started_at),
    endedAt: new Date(row.task_ended_at),
    userId: Number(row.user_id),
    userName: row.user_name,
    project: {
      id: Number(row.project_id),
      name: row.project_name
    }
  }));

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
