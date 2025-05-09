const ThreadContstructor = require('../../Domains/threads/ThreadsConstructor');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getComments(threadId);

    if (comments.length !== 0) {
      const commentIds = comments.map((x) => x.id);
      const replies = await this._replyRepository.getReplies(commentIds);
      return ThreadContstructor.build(thread, comments, replies);
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
