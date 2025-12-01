import { buildApp } from "./app";
import { env } from "./config/env";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.port, host: "0.0.0.0" });
    app.log.info(`Server listening on port ${env.port}`);
    app.log.info(`Swagger UI available at http://localhost:${env.port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
