const CommentRepository = require('../../../Domains/threads/CommentRepository');
const ReplyRepository = require('../../../Domains/threads/ReplyRepository');
const ReplyCommentUseCase = require('../ReplyCommentUseCase');
const AddedReply = require('../../../Domains/threads/entities/AddedReply');

describe('ReplyCommentUseCase', () => {
  it('should throw error when comment not is empty', async () => {
    const usecase = new ReplyCommentUseCase({});
    expect(usecase.execute('threadId', 'commentId', '', 'owner'))
      .rejects
      .toThrowError('REPLY_USE_CASE.MISSING_CONTENT');
  });

  it('should throw error when data type is not string', async () => {
    const usecase = new ReplyCommentUseCase({});
    expect(usecase.execute('threadId', 'commentId', true, 'owner'))
      .rejects
      .toThrow('REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should add reply sucessfully', async () => {
    const commentRepo = new CommentRepository();
    commentRepo.validateCommentExist = jest.fn(() => Promise.resolve());

    const replyRepo = new ReplyRepository();
    replyRepo.addReply = jest.fn(() => Promise.resolve(new AddedReply({ id: 'id', content: 'content', owner: 'owner' })));

    const usecase = new ReplyCommentUseCase({ commentRepo, replyRepo });
    const result = await usecase.execute('threadId', 'commentId', 'content', 'owner');

    expect(result).toStrictEqual(new AddedReply({ id: 'id', content: 'content', owner: 'owner' }));

    expect(commentRepo.validateCommentExist).toBeCalledWith('threadId', 'commentId');
    expect(replyRepo.addReply).toBeCalledWith('commentId', 'content', 'owner');
  });
});
