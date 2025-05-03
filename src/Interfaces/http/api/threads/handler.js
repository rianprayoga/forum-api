// const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const response = h.response({
      status: 'success',
      data: {
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;