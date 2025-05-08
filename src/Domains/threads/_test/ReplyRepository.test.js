const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const repository = new ReplyRepository();

    await expect(repository.addReply({}))
      .rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
  it('should throw error when invoke abstract behavior', async () => {
    const repository = new ReplyRepository();

    await expect(repository.deleteReply({}))
      .rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
  it('should throw error when invoke abstract behavior', async () => {
    const repository = new ReplyRepository();

    await expect(repository.getReplies({}))
      .rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
  it('should throw error when invoke abstract behavior', async () => {
    const repository = new ReplyRepository();

    await expect(repository.validateOwnership({}))
      .rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
