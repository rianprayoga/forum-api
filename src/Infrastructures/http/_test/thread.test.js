const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint ', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
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

  describe('comments resoucers', () => {
    it('add comments', async () => {
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
      const threadId = responseJson.data.addedThread.id;
      expect(responseJson.status).toEqual('success');

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comments',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(addCommentResponse.payload).status).toEqual('success');
    });

    it('delete comments', async () => {
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
      const threadId = responseJson.data.addedThread.id;
      expect(responseJson.status).toEqual('success');

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comments',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(addCommentResponse.payload).status).toEqual('success');
      const commentId = JSON.parse(addCommentResponse.payload).data.addedComment.id;

      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(deleteCommentResponse.payload).status).toEqual('success');
    });
  });

  describe('reply resoucers', () => {
    it('add reply', async () => {
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
      const threadId = responseJson.data.addedThread.id;
      expect(responseJson.status).toEqual('success');

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comments',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(addCommentResponse.payload).status).toEqual('success');
      const commentId = JSON.parse(addCommentResponse.payload).data.addedComment.id;

      const addReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'reply',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(JSON.parse(addReplyResponse.payload).status).toEqual('success');
    });

    it('delete reply', async () => {
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
      const threadId = responseJson.data.addedThread.id;
      expect(responseJson.status).toEqual('success');

      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comments',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(addCommentResponse.payload).status).toEqual('success');
      const commentId = JSON.parse(addCommentResponse.payload).data.addedComment.id;

      const addReplyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'reply',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(addReplyResponse.payload).status).toEqual('success');
      const replyId = JSON.parse(addReplyResponse.payload).data.addedReply.id;

      const deleteReplyResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(JSON.parse(deleteReplyResponse.payload).status).toEqual('success');
    });
  });
});
