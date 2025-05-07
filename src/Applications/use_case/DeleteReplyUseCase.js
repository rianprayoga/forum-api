class DeleteReplyUseCase {
  constructor(replyRepo) {
    this._replyRepo = replyRepo;
  }

  async execute(commentId, replyId, credentialId) {
    await this._replyRepo.deleteReply(commentId, replyId, credentialId);
  }
}

module.exports = DeleteReplyUseCase;
