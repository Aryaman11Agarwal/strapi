# Audit Logs plugin

This plugin records automated audit logs for content changes performed through Strapi's Content API.

## Overview

What it does
- Intercepts document service operations (create, update, delete) originating from the Content API (`/api/*`).
- Stores audit entries in the `audit_logs` collection with metadata: contentType, recordId, action, timestamp, userId, payload and a shallow diff.
- Exposes an admin REST endpoint protected by RBAC to retrieve/filter/paginate logs.

Why this approach
- The document service (`strapi.documents.use`) is the canonical interception point used by Strapi core plugins (history, i18n). Using it ensures we capture the canonical create/update/delete events for documents across providers.

## Data model

- collectionName: `audit_logs`
- Fields: `contentType` (string), `recordId` (string), `action` (string), `payload` (json), `diff` (json), `userId` (string), `meta` (json), `createdAt`.

Indexes
- A migration registers indexes on `contentType`, `userId` and `createdAt` to speed up queries.

## Configuration

Configuration is stored in the plugin store under key `config`. Default value set at bootstrap:

```
{
  auditLog: {
    enabled: true,
    excludeContentTypes: []
  }
}
```

- `auditLog.enabled` — enable/disable logging globally.
- `auditLog.excludeContentTypes` — array of content type UIDs to exclude from logging.

You can update the store programmatically via `strapi.store({ type: 'plugin', name: 'audit-logs' }).set({ key: 'config', value })`.

## API

- GET (admin route) `/` — list audit logs (admin authenticated + `plugin::audit-logs.read` permission required)

Query params supported:
- `contentType`, `userId`, `action`, `dateFrom`, `dateTo`, `page`, `pageSize`, `sortBy` (e.g. `createdAt:desc`).

Example response:

```
{
  results: [ { /* audit entries */ } ],
  pagination: { page: 1, pageSize: 25, total: 123 }
}
```

## Notes & next steps

- Diffing: currently a shallow diff (per-field comparison using JSON.stringify). For nested components or large payloads you may want a deep-diff algorithm and/or field exclusion list.
- Indexes: migration creates indexes using Knex; verify on your target DB that the indexes are created as expected.
- Admin UI: you can add an admin panel component to surface the logs in the Strapi admin.
- Tests: consider adding unit/integration tests for the service and middleware.

## Files added

- `server/src/content-types/audit-log/schema.ts` — content-type schema
- `server/src/services/audit-logs.ts` — service to save and query logs
- `server/src/controllers/audit-logs.ts` — controller exposing listing API
- `server/src/routes/index.ts` — routes (RBAC protected)
- `server/src/bootstrap.ts` — plugin bootstrap and document middleware
- `server/src/register.ts` — registers RBAC and migration
- `server/src/migrations/database/1.0.0-add-indexes-to-audit-logs.ts` — migration to add indexes
