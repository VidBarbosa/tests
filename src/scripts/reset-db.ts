import "reflect-metadata";
import { AppDataSource } from "../db/data-source";

async function resetDb() {
  try {
    console.log("Initializing data source...");
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    console.log("Dropping database schema via TypeORM...");
    await AppDataSource.dropDatabase();

    console.log("Synchronizing schema again...");
    await AppDataSource.synchronize();

    console.log("Database reset completed.");
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error("Database reset failed:", err);
    process.exit(1);
  }
}

resetDb();
