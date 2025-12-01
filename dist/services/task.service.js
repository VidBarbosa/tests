"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRepository = void 0;
exports.createTask = createTask;
exports.getTasksForUser = getTasksForUser;
exports.listTasks = listTasks;
const data_source_1 = require("../db/data-source");
const Task_1 = require("../entities/Task");
const User_1 = require("../entities/User");
const Project_1 = require("../entities/Project");
const UserProjectRate_1 = require("../entities/UserProjectRate");
const error_1 = require("../utils/error");
exports.taskRepository = data_source_1.AppDataSource.getRepository(Task_1.Task);
async function createTask(params) {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const projectRepo = data_source_1.AppDataSource.getRepository(Project_1.Project);
    const user = await userRepo.findOne({ where: { id: params.userId } });
    if (!user)
        throw new error_1.BadRequestError("User not found");
    const project = await projectRepo.findOne({
        where: { id: params.projectId }
    });
    if (!project)
        throw new error_1.BadRequestError("Project not found");
    const task = exports.taskRepository.create({
        user,
        project,
        title: params.title,
        description: params.description,
        startedAt: params.startedAt,
        endedAt: params.endedAt
    });
    return exports.taskRepository.save(task);
}
/**
 * Paginated tasks for a given user, including project and rate, plus value.
 */
async function getTasksForUser(userId, filters, pagination, sort) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    const sortBy = sort?.sortBy ?? "startedAt";
    const sortDir = sort?.sortDir ?? "DESC";
    const sortColumn = sortBy === "endedAt"
        ? "t.ended_at"
        : sortBy === "id"
            ? "t.id"
            : "t.started_at";
    const qb = exports.taskRepository
        .createQueryBuilder("t")
        .innerJoin("t.user", "u")
        .innerJoin("t.project", "p")
        .innerJoin(UserProjectRate_1.UserProjectRate, "upr", "upr.user_id = u.id AND upr.project_id = p.id")
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
    const data = rows.map((row) => {
        const startedAt = new Date(row.task_started_at);
        const endedAt = new Date(row.task_ended_at);
        const hours = (endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60);
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
async function listTasks(filters, pagination, sort) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    const sortBy = sort?.sortBy ?? "startedAt";
    const sortDir = sort?.sortDir ?? "DESC";
    const sortColumn = sortBy === "endedAt"
        ? "t.ended_at"
        : sortBy === "id"
            ? "t.id"
            : "t.started_at";
    const qb = exports.taskRepository
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
    const data = rows.map((row) => ({
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
