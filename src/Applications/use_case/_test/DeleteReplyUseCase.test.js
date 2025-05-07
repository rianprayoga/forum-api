const ReplyRepository = require('../../../Domains/threads/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should delete sucessfully', async () => {
    const replyRepo = new ReplyRepository();
    replyRepo.deleteReply = jest.fn(() => Promise.resolve());

    const usecase = new DeleteReplyUseCase(replyRepo);
    await usecase.execute('1', '2', '3');

    expect(replyRepo.deleteReply).toBeCalledWith('1', '2', '3');
  });
});
