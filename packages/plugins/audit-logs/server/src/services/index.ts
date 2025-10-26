import auditLogsServiceFactory from './audit-logs';

export default ({ strapi }: any) => ({
  'audit-logs': auditLogsServiceFactory({ strapi }),
});
