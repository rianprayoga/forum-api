const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/threads/CommentRepository');

describe('AddCommentUseCase', () => {
  it('should throw error when contens is missing', async () => {
    const payload = {};

    const usecase = new AddCommentUseCase({});

    expect(usecase.execute('threadId', 'owner', payload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.MISSING_ATTRIBUTE');
  });

  it('should throw error when contens is not string', async () => {
    const payload = { content: true };

    const usecase = new AddCommentUseCase({});

    expect(usecase.execute('threadId', 'owner', payload))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.MISMATCH_DATA_TYPE_SPECIFICATION');
  });

  it('should execute sucessfully', async () => {
    const payload = { content: 'what' };
    const threadId = 'threadId';
    const owner = 'owner';

    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.validateThreadExist = jest.fn(() => Promise.resolve());

    const commentRepo = new CommentRepository();
    commentRepo.addComment = jest.fn(() => Promise.resolve());

    const usecase = new AddCommentUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: commentRepo,
    });

    await usecase.execute(threadId, owner, payload);

    expect(mockThreadRepo.validateThreadExist)
      .toBeCalledWith(threadId);

    expect(commentRepo.addComment)
      .toBeCalledWith(threadId, owner, payload.content);
  });
});
