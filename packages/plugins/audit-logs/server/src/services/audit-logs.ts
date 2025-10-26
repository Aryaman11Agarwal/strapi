import type { Core } from '@strapi/types';

const createAuditLogsService = ({ strapi }: { strapi: Core.Strapi }) => {
  return {
    async saveEvent(event: {
      action: string;
      date?: string;
      payload?: any;
      userId?: string | number;
      contentType?: string;
      recordId?: string | number;
      diff?: any;
      meta?: any;
    }) {
      try {
        await strapi.db.query('plugin::audit-logs.audit-log').create({
          data: {
            contentType: event.contentType,
            recordId: event.recordId ? String(event.recordId) : null,
            action: event.action,
            payload: event.payload || null,
            diff: event.diff || null,
            userId: event.userId ? String(event.userId) : null,
            meta: event.meta || null,
            createdAt: event.date || new Date().toISOString(),
          },
        });
      } catch (error) {
        strapi.log.error('Failed to save audit log event', error instanceof Error ? error.message : error);
      }
    },

    async find(params: any) {
      const { filters = {}, sort = { createdAt: 'desc' }, page = 1, pageSize = 25 } = params;

      const where: any = {};
      if (filters.contentType) where.contentType = filters.contentType;
      if (filters.userId) where.userId = String(filters.userId);
      if (filters.action) where.action = filters.action;
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) where.createdAt.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) where.createdAt.$lte = new Date(filters.dateTo);
      }

      const limit = Number(pageSize) || 25;
      const offset = (Number(page) - 1) * limit;

      const results = await strapi.db.query('plugin::audit-logs.audit-log').findMany({
        where,
        limit,
        offset,
        orderBy: sort,
      });

      const count = await strapi.db.query('plugin::audit-logs.audit-log').count({ where });

      return {
        results,
        pagination: {
          page: Number(page),
          pageSize: limit,
          total: count,
        },
      };
    },

    async deleteExpiredEvents(date: Date) {
      try {
        await strapi.db.query('plugin::audit-logs.audit-log').deleteMany({
          where: {
            createdAt: { $lt: date },
          },
        });
      } catch (err) {
        strapi.log.error('Failed to delete expired audit logs', err instanceof Error ? err.message : err);
      }
    },
  };
};

export default createAuditLogsService;
