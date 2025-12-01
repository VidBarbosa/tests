"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
exports.createUser = createUser;
exports.getUserById = getUserById;
exports.listUsers = listUsers;
const data_source_1 = require("../db/data-source");
const User_1 = require("../entities/User");
exports.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
async function createUser(name, email) {
    const user = exports.userRepository.create({ name, email });
    return exports.userRepository.save(user);
}
async function getUserById(id) {
    return exports.userRepository.findOne({ where: { id } });
}
async function listUsers(pagination, sort) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const sortBy = sort?.sortBy || "id";
    const sortDir = sort?.sortDir || "DESC";
    const order = {};
    order[sortBy] = sortDir;
    const [users, total] = await exports.userRepository.findAndCount({
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
