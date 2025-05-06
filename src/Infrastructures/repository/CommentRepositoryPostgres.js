const CommentRepository = require('../../Domains/threads/CommentRepository');
const CreatedComment = require('../../Domains/threads/entities/CreatedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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
}

module.exports = CommentRepositoryPostgres;
