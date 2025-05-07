const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

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

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');

    await replyRepo.addReply(commentId, 'test', '1');

    const replies = await replyRepo.getReplies([commentId]);
    const reply = replies.get(commentId);

    expect(reply[0].id).toEqual('reply-abc');
    expect(reply[0].username).toEqual('dicoding');
    expect(reply[0].content).toEqual('test');
  });

  it('should delete reply sucessfully', async () => {
    await UsersTableTestHelper.addUser({ id: '1', username: 'dicoding' });
    const threadRepo = new ThreadRepositoryPostgres(pool, () => '321');
    const commentRepo = new CommentRepositoryPostgres(pool, () => '123');
    const replyRepo = new ReplyRepositoryPostgres(pool, () => 'abc');

    const { id: threadId } = await threadRepo.addThread({ title: 'what', body: 'where' }, '1');
    const { id: commentId } = await commentRepo.addComment(threadId, '1', 'content');
    const { id: replyId } = await replyRepo.addReply(commentId, 'test', '1');

    await replyRepo.deleteReply(commentId, replyId, '1');

    const replies = await replyRepo.getReplies([commentId]);
    const reply = replies.get(commentId);

    expect(reply[0].id).toEqual('reply-abc');
    expect(reply[0].username).toEqual('dicoding');
    expect(reply[0].content).toEqual('**balasan telah dihapus**');
  });
});
