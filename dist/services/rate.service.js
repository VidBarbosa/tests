"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateRepository = void 0;
exports.setUserProjectRate = setUserProjectRate;
const data_source_1 = require("../db/data-source");
const UserProjectRate_1 = require("../entities/UserProjectRate");
const User_1 = require("../entities/User");
const Project_1 = require("../entities/Project");
const error_1 = require("../utils/error");
exports.rateRepository = data_source_1.AppDataSource.getRepository(UserProjectRate_1.UserProjectRate);
async function setUserProjectRate(userId, projectId, hourlyRate, currency) {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const projectRepo = data_source_1.AppDataSource.getRepository(Project_1.Project);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user)
        throw new error_1.BadRequestError("User not found");
    const project = await projectRepo.findOne({ where: { id: projectId } });
    if (!project)
        throw new error_1.BadRequestError("Project not found");
    let rate = await exports.rateRepository.findOne({
        where: { user: { id: userId }, project: { id: projectId } },
        relations: ["user", "project"]
    });
    if (!rate) {
        rate = exports.rateRepository.create({ user, project, hourlyRate, currency });
    }
    else {
        rate.hourlyRate = hourlyRate;
        rate.currency = currency;
    }
    return exports.rateRepository.save(rate);
}
