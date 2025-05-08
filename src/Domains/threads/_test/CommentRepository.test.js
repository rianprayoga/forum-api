const CommentRepository = require('../CommentRepository');

describe('CommentRepository', () => {
  it('should throw error', async () => {
    const repo = new CommentRepository();

    expect(repo.addComment(''))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(repo.validateCommentOwnership(''))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(repo.markAsDeleted(''))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(repo.validateCommentExist(''))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(repo.getComments(''))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
