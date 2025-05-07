class ReplyCommentUseCase {
  constructor({ commentRepo, replyRepo }) {
    this._commentRepo = commentRepo;
    this._replyRepo = replyRepo;
  }

  async execute(threadId, commentId, content, owner) {
    this._verifyPayload(content);

    await this._commentRepo.validateCommentExist(threadId, commentId);
    return this._replyRepo.addReply(commentId, content, owner);
  }

  _verifyPayload(content) {
    if (!content) {
      throw new Error('REPLY_USE_CASE.MISSING_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyCommentUseCase;
