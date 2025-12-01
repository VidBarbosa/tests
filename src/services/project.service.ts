import { AppDataSource } from "../db/data-source";
import { Project } from "../entities/Project";
import { PaginatedResult, PaginationParams } from "../utils/pagination";

export const projectRepository = AppDataSource.getRepository(Project);

export async function createProject(
  name: string,
  description?: string
): Promise<Project> {
  const project = projectRepository.create({ name, description });
  return projectRepository.save(project);
}

export async function getProjectById(id: number): Promise<Project | null> {
  return projectRepository.findOne({ where: { id } });
}

export type ProjectSortBy = "id" | "name" | "createdAt";
export type SortDir = "ASC" | "DESC";

export async function listProjects(
  pagination: PaginationParams,
  sort?: { sortBy?: ProjectSortBy; sortDir?: SortDir }
): Promise<PaginatedResult<Project>> {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const sortBy = sort?.sortBy || "createdAt";
  const sortDir = sort?.sortDir || "DESC";

  const order: any = {};
  order[sortBy] = sortDir;

  const [projects, total] = await projectRepository.findAndCount({
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
