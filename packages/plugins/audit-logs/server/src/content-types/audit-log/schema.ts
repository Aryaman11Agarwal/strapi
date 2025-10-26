export default {
  collectionName: 'audit_logs',
  info: {
    singularName: 'audit-log',
    pluralName: 'audit-logs',
    displayName: 'Audit Log',
    description: 'Stores audit logs for content changes',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    contentType: {
      type: 'string',
      required: true,
    },
    recordId: {
      type: 'string',
    },
    action: {
      type: 'string',
      required: true,
    },
    payload: {
      type: 'json',
    },
    diff: {
      type: 'json',
    },
    userId: {
      type: 'string',
    },
    meta: {
      type: 'json',
    },
  },
};
export default {
  collectionName: 'audit_logs',
  info: {
    singularName: 'audit-log',
    pluralName: 'audit-logs',
    displayName: 'Audit Log',
    description: 'Stores audit logs for content API changes',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    },
  },
  attributes: {
    contentType: {
      type: 'string',
      required: true,
    },
    recordId: {
      type: 'string',
    },
    action: {
      type: 'string',
    },
    payload: {
      type: 'json',
    },
    diff: {
      type: 'json',
    },
    userId: {
      type: 'string',
    },
    meta: {
      type: 'json',
    },
  },
};
