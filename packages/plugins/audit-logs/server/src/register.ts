import type { Core } from '@strapi/types';
import addIndexesToAuditLogs from './migrations/database/1.0.0-add-indexes-to-audit-logs';

const RBAC_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'Read audit logs',
    uid: 'read',
    pluginName: 'audit-logs',
  },
];

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  // Register RBAC actions (idempotent)
  await strapi.service('admin::permission').actionProvider.registerMany(RBAC_ACTIONS);

  // Register migrations so indexes are added when appropriate
  if (strapi.db?.migrations?.providers?.internal) {
    strapi.db.migrations.providers.internal.register(addIndexesToAuditLogs);
  }
};
