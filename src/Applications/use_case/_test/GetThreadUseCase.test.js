const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/threads/CommentRepository');
const ReplyRepository = require('../../../Domains/threads/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const { DetailReply } = require('../../../Domains/threads/entities/DetailThread');

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

    const replyRepo = new ReplyRepository();
    replyRepo.getReplies = jest.fn(() => Promise.resolve([{
      commentid: commentId, content: 'reply', date: 'date', id: 'id', username: 'username',
    }]));

    const usecase = new GetThreadUseCase({
      threadRepository: threadRepo,
      commentRepository: commentRepo,
      replyRepository: replyRepo,
    });

    const result = await usecase.execute(threadId);

    expect(result).toStrictEqual({
      id: 'threadId',
      comments: [{
        id: 'commentId',
        replies: [new DetailReply({
          content: 'reply',
          date: 'date',
          id: 'id',
          username: 'username',
        })],
      }],
    });

    expect(threadRepo.getThread).toBeCalledWith(threadId);
    expect(commentRepo.getComments).toBeCalledWith(threadId);
    expect(replyRepo.getReplies).toBeCalledWith([commentId]);
  });

  it('should execute with no comments sucessfully', async () => {
    const threadId = 'threadId';

    const threadRepo = new ThreadRepository();
    threadRepo.getThread = jest.fn(() => Promise.resolve({
      comments: [],
      id: threadId,
    }));

    const commentRepo = new CommentRepository();
    commentRepo.getComments = jest.fn(() => Promise.resolve([]));

    const usecase = new GetThreadUseCase({
      threadRepository: threadRepo,
      commentRepository: commentRepo,
      replyRepository: new ReplyRepository(),
    });

    const result = await usecase.execute(threadId);

    expect(result).toStrictEqual({
      id: 'threadId',
      comments: [],
    });

    expect(threadRepo.getThread).toBeCalledWith(threadId);
    expect(commentRepo.getComments).toBeCalledWith(threadId);
  });
});
