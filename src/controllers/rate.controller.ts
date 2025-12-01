import { FastifyRequest, FastifyReply } from "fastify";
import { setUserProjectRate } from "../services/rate.service";

export class RateController {
  async setRate(request: FastifyRequest, reply: FastifyReply) {
    const { userId, projectId, hourlyRate, currency = "USD" } =
      request.body as any;

    const rate = await setUserProjectRate(
      Number(userId),
      Number(projectId),
      hourlyRate,
      currency
    );

    return reply.code(201).send({
      id: rate.id,
      hourlyRate: rate.hourlyRate,
      currency: rate.currency
    });
  }
}

export const rateController = new RateController();
