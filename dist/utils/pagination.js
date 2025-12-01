"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePagination = normalizePagination;
function normalizePagination(queryPage, queryLimit) {
    const page = Math.max(1, Number(queryPage) || 1);
    const limit = Math.min(100, Math.max(1, Number(queryLimit) || 10));
    return { page, limit };
}
