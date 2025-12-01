"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const data_source_1 = require("../db/data-source");
exports.default = (0, fastify_plugin_1.default)(async function dbPlugin(fastify) {
    if (!data_source_1.AppDataSource.isInitialized) {
        await data_source_1.AppDataSource.initialize();
        fastify.log.info("Database connection initialized");
    }
    fastify.decorate("db", data_source_1.AppDataSource);
});
