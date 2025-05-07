const CommentRepository = require('../../Domains/threads/CommentRepository');
const CreatedComment = require('../../Domains/threads/entities/CreatedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const { DetailComment } = require('../../Domains/threads/entities/DetailThread');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, owner, content) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, thread_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async validateCommentOwnership(commentId, credentialId) {
    const result = await this._pool.query({
      text: 'SELECT owner FROM comments c WHERE c.id = $1',
      values: [commentId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    if (result.rows[0].owner !== credentialId) {
      throw new AuthorizationError('comment tidak dapat dihapus');
    }
  }

  async markAsDeleted(commentId) {
    await this._pool.query({
      text: 'UPDATE comments c SET is_deleted = TRUE WHERE c.id = $1',
      values: [commentId],
    });
  }

  async validateCommentExist(threadId, commentId) {
    const result = await this._pool.query({
      text: 'SELECT thread_id, c.id FROM comments c WHERE c.is_deleted = FALSE AND c.thread_id = $1 AND c.id = $2',
      values: [threadId, commentId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getComments(threadId) {
    const commentsResult = await this._pool.query({
      text:
      `select c.id, u.username, created_date as date, content, is_deleted from comments c 
      left join users u on c.owner = u.id where c.thread_id = $1 order by created_date ASC`,
      values: [threadId],
    });

    return commentsResult.rows.map((x) => new DetailComment(x, []));
  }
}

module.exports = CommentRepositoryPostgres;
