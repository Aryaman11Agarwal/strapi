export default [
  {
    method: 'GET',
    path: '/',
    handler: 'audit-logs.find',
    config: {
      policies: [
        { name: 'admin::hasPermissions', config: { actions: ['plugin::audit-logs.read'] } },
      ],
    },
  },
];
