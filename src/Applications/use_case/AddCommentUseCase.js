class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, owner, payload) {
    this._validatePayload(payload);

    await this._threadRepository.validateThreadExist(threadId);
    return await this._commentRepository.addComment(threadId, owner, payload.content);
  }

  _validatePayload(payload) {
    const { content } = payload;
    if (!content) {
      throw new Error('ADD_COMMENT_USE_CASE.MISSING_ATTRIBUTE');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.MISMATCH_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;
