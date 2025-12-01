import "reflect-metadata";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { UserProjectRate } from "../entities/UserProjectRate";
import { Task } from "../entities/Task";

async function seed() {
  console.log("Initializing data source...");
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);
  const rateRepo = AppDataSource.getRepository(UserProjectRate);
  const taskRepo = AppDataSource.getRepository(Task);

  console.log("Clearing existing data with TRUNCATE CASCADE...");
  await AppDataSource.query(
    'TRUNCATE TABLE "tasks", "user_project_rates", "users", "projects" RESTART IDENTITY CASCADE'
  );

  console.log("Seeding users (20)...");
  const users: User[] = [];
  for (let i = 1; i <= 20; i++) {
    const user = userRepo.create({
      name: `User ${i}`,
      email: `user${i}@example.com`
    });
    users.push(user);
  }
  await userRepo.save(users);

  console.log("Seeding projects (50)...");
  const projects: Project[] = [];
  for (let i = 1; i <= 50; i++) {
    const project = projectRepo.create({
      name: `Project ${i}`,
      description: `Auto-generated project #${i} for testing.`
    });
    projects.push(project);
  }
  await projectRepo.save(projects);

  console.log("Seeding user-project rates...");
  // Each user gets rates for the first 10 projects
  const rates: UserProjectRate[] = [];
  for (let uIndex = 0; uIndex < users.length; uIndex++) {
    const user = users[uIndex];
    for (let pIndex = 0; pIndex < 10; pIndex++) {
      const project = projects[pIndex];
      const baseRate = 40 + uIndex * 1.5 + (pIndex % 5); // just some variation
      const rate = rateRepo.create({
        user,
        project,
        hourlyRate: baseRate.toFixed(2),
        currency: "USD"
      });
      rates.push(rate);
    }
  }
  await rateRepo.save(rates);

  console.log("Seeding tasks (300)...");
  const tasks: Task[] = [];
  const baseDate = new Date("2025-01-01T09:00:00.000Z");

  for (let i = 0; i < 300; i++) {
    const user = users[i % users.length];
    // Ensure we only pick projects where we know a rate exists (first 10)
    const project = projects[i % 10];

    const start = new Date(baseDate.getTime() + i * 2 * 60 * 60 * 1000); // +2h per task
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // each task: 2h

    const task = taskRepo.create({
      user,
      project,
      title: `Task #${i + 1} for ${user.name}`,
      description: `Auto-generated task #${i + 1} for user ${user.name} on project ${project.name}.`,
      startedAt: start,
      endedAt: end
    });

    tasks.push(task);
  }

  await taskRepo.save(tasks);

  console.log("Seeding completed successfully with:");
  console.log(`- Users: ${users.length}`);
  console.log(`- Projects: ${projects.length}`);
  console.log(`- Rates: ${rates.length}`);
  console.log(`- Tasks: ${tasks.length}`);

  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
