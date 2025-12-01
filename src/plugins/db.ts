import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { AppDataSource } from "../db/data-source";

declare module "fastify" {
  interface FastifyInstance {
    db: typeof AppDataSource;
  }
}

export default fp(async function dbPlugin(fastify: FastifyInstance) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    fastify.log.info("Database connection initialized");
  }

  fastify.decorate("db", AppDataSource);
});
