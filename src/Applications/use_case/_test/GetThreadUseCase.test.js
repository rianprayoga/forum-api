const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/threads/CommentRepository');
const ReplyRepository = require('../../../Domains/threads/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should execute sucessfully', async () => {
    const threadId = 'threadId';
    const commentId = 'commentId';

    const threadRepo = new ThreadRepository();
    threadRepo.getThread = jest.fn(() => Promise.resolve({
      comments: [],
      id: threadId,
    }));

    const commentRepo = new CommentRepository();
    commentRepo.getComments = jest.fn(() => Promise.resolve([{
      id: commentId,
      replies: [],
    }]));

    const map = new Map();
    map.set(commentId, { content: 'reply' });
    const replyRepo = new ReplyRepository();
    replyRepo.getReplies = jest.fn(() => Promise.resolve(map));

    const usecase = new GetThreadUseCase({
      threadRepository: threadRepo,
      commentRepository: commentRepo,
      replyRepository: replyRepo,
    });

    await usecase.execute(threadId);

    expect(threadRepo.getThread).toBeCalledWith(threadId);
    expect(commentRepo.getComments).toBeCalledWith(threadId);
    expect(replyRepo.getReplies).toBeCalledWith([commentId]);
  });
});
