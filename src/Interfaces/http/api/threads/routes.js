const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'client_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request, h) => handler.getThreadHandler(request, h),
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
      auth: 'client_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request, h) => handler.deleteCommentHandler(request, h),
    options: {
      auth: 'client_jwt'
    }
  },
]);

module.exports = routes;
