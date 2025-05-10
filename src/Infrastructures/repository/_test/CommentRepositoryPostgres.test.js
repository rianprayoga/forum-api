const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('CommentRepository postgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should addComment sucessfully', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');

    const result = await commentRepo.addComment(threadId, '1', 'content');

    const actualComments = await CommentTableTestHelper.getComment(result.id);

    expect(actualComments.id).toEqual(result.id);
    expect(actualComments.owner).toEqual('1');
    expect(actualComments.content).toEqual('content');
    expect(actualComments.created_date).not.toBeUndefined();

    expect(result.id).toEqual('comment-123');
    expect(result.content).toEqual('content');
    expect(result.owner).toEqual('1');
  });

  it('validateCommentOwnership should throw error when thread-id not found', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    await threadRepo.addThread({ title: 'what', body: 'where' }, '1');

    await commentRepo.addComment('thread-321', '1', 'content');

    await expect(commentRepo.validateCommentOwnership('comment-121', '1')).rejects.toThrow(NotFoundError);
  });

  it('validateCommentOwnership should throw error when credential-id mismatch', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    await threadRepo.addThread({ title: 'what', body: 'where' }, '1');

    await commentRepo.addComment('thread-321', '1', 'content');

    await expect(commentRepo.validateCommentOwnership('comment-123', '2')).rejects.toThrow(AuthorizationError);
  });

  it('validateCommentOwnership should not throw ', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    await threadRepo.addThread({ title: 'what', body: 'where' }, '1');

    await commentRepo.addComment('thread-321', '1', 'content');

    await expect(commentRepo.validateCommentOwnership('comment-123', '1')).resolves.not.toThrowError(NotFoundError);
    await expect(commentRepo.validateCommentOwnership('comment-123', '1')).resolves.not.toThrowError(AuthorizationError);
  });

  it('should markAsDeleted sucessfully', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    await threadRepo.addThread({ title: 'what', body: 'where' }, '1');

    await commentRepo.addComment('thread-321', '1', 'content');

    await commentRepo.markAsDeleted('comment-123');

    expect(CommentTableTestHelper.getIsDeletedStatus('comment-123')).resolves.toEqual(true);
  });

  it('validateCommentExist should throw error when comment not found', async () => {
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    await expect(commentRepo.validateCommentExist('comment-121', '1')).rejects.toThrow(NotFoundError);
  });

  it('validateCommentExist should  throw error ', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');

    await expect(commentRepo.validateCommentExist(threadId, commentId))
      .resolves.not.toThrow(NotFoundError);
  });

  it('should getCommets sucessfully', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');

    await commentRepo.addComment('thread-321', '1', 'content');

    const result = await commentRepo.getComments(threadId);
    const {
      id: commentId, username, content, replies,
    } = result[0];

    expect(commentId).toEqual('comment-123');
    expect(username).toEqual('dicoding');
    expect(content).toEqual('content');
    expect(replies).toEqual([]);
  });
});
