const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepository Postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();

    await pool.end();
  });

  it('should add thread to database', async () => {
    const fakeIdGenerator = () => '123'; // stub!
    const owner = 'user-123';
    const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
    const payload = { title: 'title', body: 'body' };

    const result = await repo.addThread(payload, owner);
    await repo.validateThreadExist(result.id);

    expect(result.id).toBe('thread-123');
    expect(result.title).toBe(payload.title);
    expect(result.owner).toBe(owner);
  });

  it('should throw when thread not found', async () => {
    const repo = new ThreadRepositoryPostgres(pool, () => '123');

    await expect(repo.validateThreadExist('payload')).rejects.toThrow(NotFoundError);
  });

  it('should get thread sucessfully', async () => {
    const fakeIdGenerator = () => '123'; // stub!
    const owner = 'user-123';
    const repo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
    const payload = { title: 'title', body: 'body' };

    await repo.addThread(payload, owner);

    const result = await repo.getThread('thread-123');

    expect(result.id).toEqual('thread-123');
    expect(result.title).toEqual(payload.title);
    expect(result.body).toEqual(payload.body);
    expect(result.username).toEqual('dicoding');
    expect(result.comments).toEqual([]);
  });
});
