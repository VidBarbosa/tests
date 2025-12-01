"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
async function start() {
    const app = await (0, app_1.buildApp)();
    try {
        await app.listen({ port: env_1.env.port, host: "0.0.0.0" });
        app.log.info(`Server listening on port ${env_1.env.port}`);
        app.log.info(`Swagger UI available at http://localhost:${env_1.env.port}/docs`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();
