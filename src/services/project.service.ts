import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";
import { PaginatedResult, PaginationParams } from "../utils/pagination";

export const userRepository = AppDataSource.getRepository(User);

export async function createUser(name: string, email: string): Promise<User> {
  const user = userRepository.create({ name, email });
  return userRepository.save(user);
}

export async function getUserById(id: number): Promise<User | null> {
  return userRepository.findOne({ where: { id } });
}

export type UserSortBy = "id" | "name" | "email" | "createdAt";
export type SortDir = "ASC" | "DESC";

export async function listUsers(
  pagination: PaginationParams,
  sort?: { sortBy?: UserSortBy; sortDir?: SortDir }
): Promise<PaginatedResult<User>> {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const sortBy = sort?.sortBy || "id";
  const sortDir = sort?.sortDir || "DESC";

  const order: any = {};
  order[sortBy] = sortDir;

  const [users, total] = await userRepository.findAndCount({
    skip,
    take: limit,
    order
  });

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
