import type { Context } from 'koa';

const createController = ({ strapi }: any) => ({
  async find(ctx: Context) {
    // Parse query params for filtering/pagination
    const {
      contentType,
      userId,
      action,
      dateFrom,
      dateTo,
      page = '1',
      pageSize = '25',
      sortBy = 'createdAt:desc',
    } = ctx.query as any;

    const sortParts = (sortBy || 'createdAt:desc').split(':');
    const sort = { [sortParts[0]]: sortParts[1] || 'desc' };

    const filters: any = {};
    if (contentType) filters.contentType = contentType;
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;

    const result = await strapi.plugin('audit-logs').service('audit-logs').find({
      filters,
      sort,
      page: Number(page),
      pageSize: Number(pageSize),
    });

    ctx.body = result;
  },
});

export default createController;
