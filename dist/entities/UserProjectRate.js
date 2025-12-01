"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProjectRate = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Project_1 = require("./Project");
let UserProjectRate = class UserProjectRate {
};
exports.UserProjectRate = UserProjectRate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserProjectRate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.projectRates, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], UserProjectRate.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.userRates, {
        onDelete: "CASCADE"
    }),
    (0, typeorm_1.JoinColumn)({ name: "project_id" }),
    __metadata("design:type", Project_1.Project)
], UserProjectRate.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "hourly_rate", type: "numeric", precision: 10, scale: 2 }),
    __metadata("design:type", String)
], UserProjectRate.prototype, "hourlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "char", length: 3, default: "USD" }),
    __metadata("design:type", String)
], UserProjectRate.prototype, "currency", void 0);
exports.UserProjectRate = UserProjectRate = __decorate([
    (0, typeorm_1.Entity)({ name: "user_project_rates" }),
    (0, typeorm_1.Unique)(["user", "project"])
], UserProjectRate);
