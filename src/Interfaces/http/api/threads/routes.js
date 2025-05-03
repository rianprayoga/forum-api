const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'client_jwt'
    }
  },
]);

module.exports = routes;
