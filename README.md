# Projects & Tasks API

A small but production-grade backend service built with **Fastify**, **TypeScript**, **TypeORM** and **PostgreSQL**.

It manages:

- Users
- Projects
- User-project hourly rates
- Tasks linked to users and projects

The main business use case is to retrieve the list of tasks for a given user, including project information and the hourly rate applied to compute the task value.

---

## Architecture Overview

### Tech stack

- **Runtime**: Node.js (TypeScript)
- **HTTP framework**: Fastify
- **ORM**: TypeORM (DataSource API)
- **Database**: PostgreSQL
- **Validation & documentation**: Fastify JSON Schemas + OpenAPI (Swagger)
- **Logging**: Pino (structured logs, request-scoped)

### Domain model

- `User`
  - `id`, `name`, `email`, `createdAt`
- `Project`
  - `id`, `name`, `description`, `createdAt`
- `UserProjectRate`
  - Relation **N:N** between `User` and `Project`
  - Attributes: `hourlyRate`, `currency`
- `Task`
  - Belongs to a `User` and a `Project`
  - Interval `[startedAt, endedAt]`
  - Check constraint ensures `endedAt > startedAt`

The **user-project rate** is stored separately instead of being duplicated in each task, allowing:

- A single source of truth per user/project pair.
- Future evolution (e.g. roles, different rate types).
- Easier reporting and consistency.

---

## API Versioning

All business endpoints are exposed under `/api/v1`.

Examples:

- `POST /api/v1/users`
- `POST /api/v1/projects`
- `POST /api/v1/rates`
- `POST /api/v1/tasks`
- `GET  /api/v1/users/:id/tasks`

Health endpoints are **not versioned**:

- `GET /health`
- `GET /db-health`

---

## Validation & Documentation

Each route defines:

- **Request body** schema (`body`)
- **Path params** schema (`params`)
- **Query params** schema (`querystring`)
- **Response** schema (`response`)

These JSON Schemas are:

- Used by Fastify for runtime validation.
- Exposed via OpenAPI using `@fastify/swagger`.
- Visible in Swagger UI at `/docs`.

This ensures the documentation stays in sync with the actual behavior.

---

## Logging & Monitoring

The service uses **Pino** via a custom Fastify plugin:

- Request-level logger with a `reqId`.
- `onRequest` and `onResponse` hooks to trace incoming requests and responses.
- Error handler that logs structured error information.

This makes it easy to:

- Correlate logs across different services.
- Monitor latencies and error rates.
- Feed logs into centralized platforms (e.g. Loki, ELK, DataDog).

---

## Quick Start

### 1. Prerequisites

- Node.js >= 18
- PostgreSQL running locally or accessible from your machine

### 2. Clone & install

```bash
git clone <your-repo-url> backend
cd backend
npm install
