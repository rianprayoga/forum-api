class DeleteReplyUseCase {
  constructor(replyRepo) {
    this._replyRepo = replyRepo;
  }

  async execute(commentId, replyId, credentialId) {
    await this._replyRepo.validateOwnership(commentId, replyId, credentialId);
    await this._replyRepo.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
