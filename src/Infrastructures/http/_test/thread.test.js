const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint ', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('threads resoucers', () => {
    it('create thread and get', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const token = JSON.parse(loginResponse.payload).data.accessToken;

      const threadPayload = {
        title: 'title',
        body: 'body',
      };
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = JSON.parse(addThreadResponse.payload);
      expect(responseJson.status).toEqual('success');

      const getThreadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${responseJson.data.addedThread.id}`,
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(getThreadResponse.payload).status).toEqual('success');
    });
  });
});
