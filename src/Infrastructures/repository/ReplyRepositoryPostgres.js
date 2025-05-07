const ReplyRepository = require('../../Domains/threads/ReplyRepository');
const AddedReply = require('../../Domains/threads/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(commentId, content, owner) {
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies(id,  comment_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, content, owner],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(commentId, replyId, credentialId) {
    const selectResult = await this._pool.query({
      text: 'SELECT owner FROM replies r WHERE r.comment_id = $1 AND r.id = $2',
      values: [commentId, replyId],
    });

    if (!selectResult.rowCount) {
      throw new NotFoundError('reply not found.');
    }

    if (selectResult.rows[0].owner !== credentialId) {
      throw new AuthorizationError('tidak bisa menghapus reply');
    }

    await this._pool.query({
      text: 'UPDATE replies r SET is_deleted = TRUE WHERE r.id = $1',
      values: [replyId],
    });
  }
}

module.exports = ReplyRepositoryPostgres;
