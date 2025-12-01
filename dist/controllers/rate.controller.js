"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateController = exports.RateController = void 0;
const rate_service_1 = require("../services/rate.service");
class RateController {
    async setRate(request, reply) {
        const { userId, projectId, hourlyRate, currency = "USD" } = request.body;
        const rate = await (0, rate_service_1.setUserProjectRate)(Number(userId), Number(projectId), hourlyRate, currency);
        return reply.code(201).send({
            id: rate.id,
            hourlyRate: rate.hourlyRate,
            currency: rate.currency
        });
    }
}
exports.RateController = RateController;
exports.rateController = new RateController();
