const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/threads/CommentRepository');
const ReplyRepository = require('../../../Domains/threads/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const { DetailReply, DetailThread, DetailComment } = require('../../../Domains/threads/entities/DetailThread');

describe('GetThreadUseCase', () => {
  it('should execute successfully', async () => {
    const threadId = 'threadId';
    const commentId = 'commentId';
    const secondCommentId = 'commentI2';

    const expectedReplies = [
      new DetailReply({
        commentid: commentId, content: 'reply', date: 'date', id: 'id', username: 'username',
      }),
      new DetailReply({
        commentid: commentId, content: 'reply', date: 'date', id: 'id2', username: 'username',
      }),
    ];

    const expectedComments = [
      new DetailComment(
        {
          id: commentId,
          content: 'content',
          date: 'date',
          username: 'username',
        },
        expectedReplies,
      ),
      new DetailComment({
        id: secondCommentId,
        content: 'content',
        date: 'date',
        username: 'username',
      }),
    ];

    const expectedThread = new DetailThread(
      {
        id: threadId,
        title: 'title',
        body: 'body',
        date: 'date',
        username: 'username',
      },
      expectedComments,
    );

    const threadRepo = new ThreadRepository();
    threadRepo.getThread = jest.fn(() => Promise.resolve(
      new DetailThread({
        comments: [],
        id: threadId,
        title: 'title',
        body: 'body',
        date: 'date',
        username: 'username',
      }),
    ));

    const commentRepo = new CommentRepository();
    commentRepo.getComments = jest.fn(() => Promise.resolve([
      new DetailComment({
        id: commentId,
        content: 'content',
        date: 'date',
        username: 'username',
        replies: [],
      }),
      new DetailComment({
        id: secondCommentId,
        content: 'content',
        date: 'date',
        username: 'username',
        replies: [],
      }),
    ]));

    const replyRepo = new ReplyRepository();
    replyRepo.getReplies = jest.fn(() => Promise.resolve([{
      commentid: commentId, content: 'reply', date: 'date', id: 'id', username: 'username', is_deleted: false,
    },
    {
      commentid: commentId, content: 'reply', date: 'date', id: 'id2', username: 'username', is_deleted: false,
    },
    ]));

    const usecase = new GetThreadUseCase({
      threadRepository: threadRepo,
      commentRepository: commentRepo,
      replyRepository: replyRepo,
    });

    const result = await usecase.execute(threadId);

    expect(result).toStrictEqual(expectedThread);

    expect(threadRepo.getThread).toBeCalledWith(threadId);
    expect(commentRepo.getComments).toBeCalledWith(threadId);
    expect(replyRepo.getReplies).toBeCalledWith([commentId, secondCommentId]);
  });

  it('should execute with no comments successfully', async () => {
    const threadId = 'threadId';

    const threadRepo = new ThreadRepository();
    threadRepo.getThread = jest.fn(() => Promise.resolve(
      new DetailComment({
        comments: [],
        id: threadId,
        title: 'title',
        body: 'body',
        date: 'date',
        username: 'username',
      }),
    ));

    const commentRepo = new CommentRepository();
    commentRepo.getComments = jest.fn(() => Promise.resolve([]));

    const usecase = new GetThreadUseCase({
      threadRepository: threadRepo,
      commentRepository: commentRepo,
      replyRepository: new ReplyRepository(),
    });

    const result = await usecase.execute(threadId);

    expect(result).toStrictEqual(new DetailComment({
      comments: [],
      id: threadId,
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'username',
    }));

    expect(threadRepo.getThread).toBeCalledWith(threadId);
    expect(commentRepo.getComments).toBeCalledWith(threadId);
  });
});
