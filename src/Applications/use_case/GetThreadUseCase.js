const { DetailReply } = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getComments(threadId);

    const commentIds = comments.map((x) => x.id);

    if (commentIds.length !== 0) {
      const replies = await this._replyRepository.getReplies(commentIds);

      const map = new Map();
      replies.forEach((element) => {
        const commentId = element.commentid;
        if (map.has(commentId)) {
          const tmp = map.get(commentId);
          tmp.push(new DetailReply(element));
          map.set(commentId, tmp);
        } else {
          map.set(commentId, [new DetailReply(element)]);
        }
      });

      const adjustedComments = comments.map((element) => {
        const tmp = element;
        tmp.replies = map.has(element.id) ? map.get(element.id) : [];
        return tmp;
      });

      thread.comments = adjustedComments;
      return thread;
    }

    return thread;
  }
}

module.exports = GetThreadUseCase;
