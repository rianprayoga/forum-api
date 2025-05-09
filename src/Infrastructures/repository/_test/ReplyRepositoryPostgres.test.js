const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepository postgres', () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should addReply sucessfully', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');
    const replyRepo = new ReplyRepositoryPostgres(pool, () => 'abc');
    const replyRepoSecond = new ReplyRepositoryPostgres(pool, () => 'abcd');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');

    const firstResult = await replyRepo.addReply(commentId, 'test', '1');
    const secondResult = await replyRepoSecond.addReply(commentId, 'test 2', '1');

    const replies = await replyRepo.getReplies([commentId]);

    expect(firstResult.id).toEqual('reply-abc');
    expect(firstResult.content).toEqual('test');
    expect(firstResult.owner).toEqual('1');
    expect(secondResult.id).toEqual('reply-abcd');
    expect(secondResult.content).toEqual('test 2');
    expect(secondResult.owner).toEqual('1');

    expect(replies[0].id).toEqual('reply-abc');
    expect(replies[0].username).toEqual('dicoding');
    expect(replies[0].content).toEqual('test');
  });

  it('should delete reply sucessfully', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');
    const replyRepo = new ReplyRepositoryPostgres(pool, () => 'abc');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');
    const { id: replyId } = await replyRepo.addReply(commentId, 'test', '1');

    await replyRepo.deleteReply(replyId);

    expect(ReplyTableTestHelper.getIsDeletedStatus(replyId)).resolves.toEqual(true);
  });

  it('validateOwnership should throw error when reply not found', async () => {
    const replyRepo = new ReplyRepositoryPostgres(pool, () => 'abc');

    await expect(replyRepo.validateOwnership('commentId', 'replyId', '1'))
      .rejects
      .toThrow(NotFoundError);
  });

  it('validateOwnership should throw error when mismatch owner', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');
    const replyRepo = new ReplyRepositoryPostgres(pool, () => 'abc');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');
    const { id: replyId } = await replyRepo.addReply(commentId, 'test', '1');

    await expect(replyRepo.validateOwnership(commentId, replyId, '2'))
      .rejects
      .toThrow(AuthorizationError);
  });

  it('validateOwnership should not throw error ', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');
    const replyRepo = new ReplyRepositoryPostgres(pool, () => 'abc');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');
    const { id: replyId } = await replyRepo.addReply(commentId, 'test', '1');

    await expect(replyRepo.validateOwnership(commentId, replyId, '1'))
      .resolves.not.toThrow(NotFoundError);
    await expect(replyRepo.validateOwnership(commentId, replyId, '1'))
      .resolves.not.toThrow(AuthorizationError);
  });

  it('should getReplies sucessfully', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');
    const replyRepo = new ReplyRepositoryPostgres(pool, () => 'abc');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');

    const firstResult = await replyRepo.addReply(commentId, 'test', '1');

    const replies = await replyRepo.getReplies([commentId]);

    expect(firstResult.id).toEqual('reply-abc');
    expect(firstResult.content).toEqual('test');
    expect(firstResult.owner).toEqual('1');

    expect(replies[0].id).toEqual('reply-abc');
    expect(replies[0].username).toEqual('dicoding');
    expect(replies[0].content).toEqual('test');
    expect(replies[0].commentid).toEqual(commentId);
    expect(replies[0].is_deleted).toEqual(false);
    expect(replies[0].date).not.toBeUndefined();
  });
});
