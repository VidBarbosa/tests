import { AppDataSource } from "../db/data-source";
import { UserProjectRate } from "../entities/UserProjectRate";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { BadRequestError } from "../utils/error";

export const rateRepository = AppDataSource.getRepository(UserProjectRate);

export async function setUserProjectRate(
  userId: number,
  projectId: number,
  hourlyRate: string,
  currency: string
): Promise<UserProjectRate> {
  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);

  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) throw new BadRequestError("User not found");

  const project = await projectRepo.findOne({ where: { id: projectId } });
  if (!project) throw new BadRequestError("Project not found");

  let rate = await rateRepository.findOne({
    where: { user: { id: userId }, project: { id: projectId } },
    relations: ["user", "project"]
  });

  if (!rate) {
    rate = rateRepository.create({ user, project, hourlyRate, currency });
  } else {
    rate.hourlyRate = hourlyRate;
    rate.currency = currency;
  }

  return rateRepository.save(rate);
}
