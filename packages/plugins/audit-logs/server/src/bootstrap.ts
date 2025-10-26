import type { Core } from '@strapi/types';

const RBAC_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'Read audit logs',
    uid: 'read',
    pluginName: 'audit-logs',
  },
];

const defaultConfig = {
  auditLog: {
    enabled: true,
    excludeContentTypes: [],
  },
};

import deepDiff from './utils/deep-diff';

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  // Register RBAC actions
  await strapi.service('admin::permission').actionProvider.registerMany(RBAC_ACTIONS);

  // Ensure plugin store default config
  const pluginStore = strapi.store!({ environment: '', type: 'plugin', name: 'audit-logs' });
  const config = await pluginStore.get({ key: 'config' });
  if (!config) {
    await pluginStore.set({ key: 'config', value: defaultConfig });
  }

  // Document service middleware to capture create/update/delete from content API
  strapi.documents.use(async (context, next) => {
    const action = context.action as string;

    if (!['create', 'update', 'delete'].includes(action)) {
      return next();
    }

    // Only capture content API requests
    const url = strapi.requestContext.get()?.request?.url || '';
    if (!url.startsWith('/api')) {
      return next();
    }

    const pluginConfig = (await pluginStore.get({ key: 'config' })) || defaultConfig;
    if (!pluginConfig?.auditLog?.enabled) {
      return next();
    }

    const uid = context.contentType?.uid as string;
    if (!uid) return next();

    if (pluginConfig.auditLog.excludeContentTypes?.includes(uid)) {
      return next();
    }

    // Determine documentId for non-create actions
    const documentId = context.action === 'create' ? undefined : context.params?.documentId;

    // For update/delete we need the previous state
    let before: any = null;
    if (action === 'update' || action === 'delete') {
      try {
        before = await strapi.db.query(uid).findOne({ where: { id: documentId } });
      } catch (err) {
        // ignore
      }
    }

    const result = (await next()) as any;

    // For create and update get the after state
    let after: any = null;
    try {
      const id = context.action === 'create' ? result?.documentId || result?.id : documentId;
      if (id) {
        after = await strapi.db.query(uid).findOne({ where: { id } });
      }
    } catch (err) {
      // ignore
    }

  const diff = action === 'update' ? deepDiff(before, after) : null;

    const requestState = strapi.requestContext.get()?.state;
    const user = requestState?.user;

    // Save audit log asynchronously
    strapi.plugin('audit-logs').service('audit-logs').saveEvent({
      action: `entry.${action}`,
      date: new Date().toISOString(),
      payload: action === 'delete' ? before : after || result,
      diff,
      userId: user?.id,
      contentType: uid,
      recordId: (after?.id || documentId || result?.documentId || result?.id) ?? null,
      meta: { url },
    });

    return result;
  });
};
