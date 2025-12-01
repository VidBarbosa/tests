"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("../db/data-source");
async function resetDb() {
    try {
        console.log("Initializing data source...");
        if (!data_source_1.AppDataSource.isInitialized) {
            await data_source_1.AppDataSource.initialize();
        }
        console.log("Dropping database schema via TypeORM...");
        await data_source_1.AppDataSource.dropDatabase();
        console.log("Synchronizing schema again...");
        await data_source_1.AppDataSource.synchronize();
        console.log("Database reset completed.");
        await data_source_1.AppDataSource.destroy();
        process.exit(0);
    }
    catch (err) {
        console.error("Database reset failed:", err);
        process.exit(1);
    }
}
resetDb();
