import type { Migration } from '@strapi/database';

type Knex = Parameters<Migration['up']>[0];

export const addIndexesToAuditLogs: Migration = {
  name: 'audit-logs::1.0.0-add-indexes-to-audit-logs',
  async up(trx: Knex) {
    const hasTable = await trx.schema.hasTable('audit_logs');
    if (!hasTable) {
      // Table might not exist yet (content-types are created later). Nothing to do.
      return;
    }

    await trx.schema.alterTable('audit_logs', (table) => {
      try {
        table.index(['contentType'], 'audit_logs_content_type_idx');
        table.index(['userId'], 'audit_logs_user_id_idx');
        table.index(['createdAt'], 'audit_logs_created_at_idx');
      } catch (e) {
        // ignore index creation errors
      }
    });
  },
  async down() {
    throw new Error('Not implemented');
  },
};

export default addIndexesToAuditLogs;
