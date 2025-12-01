"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = "BadRequestError";
    }
}
exports.BadRequestError = BadRequestError;
