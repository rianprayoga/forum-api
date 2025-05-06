const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentuseCae = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const { id: credentialId } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute(request.payload, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentUseCase.execute(threadId, credentialId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentuseCae.name);

    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute(threadId, commentId, credentialId);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadHandler(request, h) {
    const usecase = this._container.getInstance(GetThreadUseCase.name);
    const { threadId } = request.params;

    const thread = await usecase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
