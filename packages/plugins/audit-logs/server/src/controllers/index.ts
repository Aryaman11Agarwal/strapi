import auditLogsControllerFactory from './audit-logs';

export default ({ strapi }: any) => ({
  'audit-logs': auditLogsControllerFactory({ strapi }),
});
