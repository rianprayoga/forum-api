const ThreadUserCase = require('../../../../Applications/use_case/ThreadUserCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUserCase.name);
    
    const { id: credentialId } = request.auth.credentials;
    
    const addedThread = await threadUseCase.execute(request.payload, credentialId)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;